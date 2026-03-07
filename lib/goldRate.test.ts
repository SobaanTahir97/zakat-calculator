import { __internal, fetchGoldRate, getGoldRateEnvConfig } from './goldRate';

describe('goldRate adapter', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    __internal.resetCacheState();
  });

  it('parses normalized payload shape', async () => {
    const result = await fetchGoldRate({
      endpointUrl: 'https://example.test/rate',
      fetcher: async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({
            aedPerGram24k: 327.11,
            sourceLabel: 'Provider A',
            asOf: '2026-03-07T00:00:00.000Z',
          }),
        } as unknown as Response),
      forceRefresh: true,
    });

    expect(result).toEqual({
      aedPerGram24k: 327.11,
      sourceLabel: 'Provider A',
      asOf: '2026-03-07T00:00:00.000Z',
    });
  });

  it('parses spot proxy payload shape and converts ounce to gram', async () => {
    const result = await fetchGoldRate({
      endpointUrl: 'https://example.test/rate',
      fetcher: async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({
            spot: {
              xauUsd: 2150,
              usdToAed: 3.6725,
              sourceLabel: 'Spot feed',
              asOf: '2026-03-07T01:00:00.000Z',
            },
          }),
        } as unknown as Response),
      forceRefresh: true,
    });

    expect(result.sourceLabel).toBe('Spot feed');
    expect(result.asOf).toBe('2026-03-07T01:00:00.000Z');
    expect(result.aedPerGram24k).toBeCloseTo(253.86, 2);
  });

  it('parses gold-api payload shape using USD to AED conversion', async () => {
    const result = await fetchGoldRate({
      endpointUrl: 'https://example.test/rate',
      fetcher: async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({
            name: 'Gold',
            symbol: 'XAU',
            price: 5174,
            updatedAt: '2026-03-07T12:13:32Z',
          }),
        } as unknown as Response),
      usdToAedRate: 3.6725,
      forceRefresh: true,
    });

    expect(result.sourceLabel).toBe('gold-api.com');
    expect(result.asOf).toBe('2026-03-07T12:13:32Z');
    expect(result.aedPerGram24k).toBeCloseTo(610.91, 2);
  });

  it('works without API key and sends only Accept header', async () => {
    const fetchSpy = jest.fn(async (_url: string, options?: RequestInit) => {
      expect(options?.headers).toEqual({ Accept: 'application/json' });
      return {
        ok: true,
        status: 200,
        json: async () => ({
          aedPerGram24k: 300,
          sourceLabel: 'No key provider',
          asOf: '2026-03-07T00:00:00.000Z',
        }),
      } as unknown as Response;
    });

    const result = await fetchGoldRate({
      endpointUrl: 'https://example.test/rate',
      fetcher: fetchSpy as unknown as typeof fetch,
      forceRefresh: true,
    });

    expect(result.aedPerGram24k).toBe(300);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('sends auth headers when API key is provided', async () => {
    const fetchSpy = jest.fn(async (_url: string, options?: RequestInit) => {
      expect(options?.headers).toEqual({
        Accept: 'application/json',
        Authorization: 'Bearer secret',
        'x-api-key': 'secret',
      });
      return {
        ok: true,
        status: 200,
        json: async () => ({
          aedPerGram24k: 301,
          sourceLabel: 'Key provider',
          asOf: '2026-03-07T00:00:00.000Z',
        }),
      } as unknown as Response;
    });

    await fetchGoldRate({
      endpointUrl: 'https://example.test/rate',
      apiKey: 'secret',
      fetcher: fetchSpy as unknown as typeof fetch,
      forceRefresh: true,
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('returns cached value within ttl and avoids another request', async () => {
    let now = 1_000;
    const fetchSpy = jest.fn(async () =>
      ({
        ok: true,
        status: 200,
        json: async () => ({
          aedPerGram24k: 320,
          sourceLabel: 'Cached provider',
          asOf: '2026-03-07T00:00:00.000Z',
        }),
      } as unknown as Response)
    );

    const first = await fetchGoldRate({
      endpointUrl: 'https://example.test/rate',
      fetcher: fetchSpy as unknown as typeof fetch,
      now: () => now,
      cacheTtlMs: 60_000,
      minRequestIntervalMs: 10_000,
    });

    now = 5_000;

    const second = await fetchGoldRate({
      endpointUrl: 'https://example.test/rate',
      fetcher: fetchSpy as unknown as typeof fetch,
      now: () => now,
      cacheTtlMs: 60_000,
      minRequestIntervalMs: 10_000,
    });

    expect(first).toEqual(second);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('throttles repeated calls with no cache after a failed attempt', async () => {
    let now = 2_000;
    const fetchSpy = jest.fn(async () =>
      ({
        ok: false,
        status: 503,
        json: async () => ({}),
      } as unknown as Response)
    );

    await expect(
      fetchGoldRate({
        endpointUrl: 'https://example.test/rate',
        fetcher: fetchSpy as unknown as typeof fetch,
        now: () => now,
        minRequestIntervalMs: 10_000,
      })
    ).rejects.toThrow('Gold rate request failed: 503');

    now = 3_000;

    await expect(
      fetchGoldRate({
        endpointUrl: 'https://example.test/rate',
        fetcher: fetchSpy as unknown as typeof fetch,
        now: () => now,
        minRequestIntervalMs: 10_000,
      })
    ).rejects.toThrow('Gold rate request throttled. Try again shortly.');
  });

  it('returns default env config when no vars are set', () => {
    delete process.env.EXPO_PUBLIC_GOLD_RATE_URL;
    delete process.env.EXPO_PUBLIC_GOLD_RATE_API_KEY;

    expect(getGoldRateEnvConfig()).toEqual({
      endpointUrl: 'https://api.gold-api.com/price/XAU',
      apiKey: undefined,
    });
  });

  it('reads env config when vars are set', () => {
    process.env.EXPO_PUBLIC_GOLD_RATE_URL = 'https://example.test/rate';
    process.env.EXPO_PUBLIC_GOLD_RATE_API_KEY = 'secret';

    expect(getGoldRateEnvConfig()).toEqual({
      endpointUrl: 'https://example.test/rate',
      apiKey: 'secret',
    });
  });

  it('exposes payload parser for direct validation', () => {
    expect(() => __internal.parseGoldRatePayload({}, 3.6725)).toThrow(
      'Gold rate payload is missing required values.'
    );
  });
});

