const TROY_OUNCE_IN_GRAMS = 31.1034768;
const DEFAULT_USD_TO_AED_RATE = 3.6725;
const DEFAULT_USD_TO_PKR_RATE = 278.5;
export type MetalSymbol = 'XAU' | 'XAG';

const GOLD_API_BASE_URL = 'https://api.gold-api.com/price';
const DEFAULT_GOLD_API_URL = `${GOLD_API_BASE_URL}/XAU`;
const DEFAULT_MIN_REQUEST_INTERVAL_MS = 10_000;
const DEFAULT_CACHE_TTL_MS = 5 * 60_000;

export type Currency = 'AED' | 'PKR';
export type RateStatus = 'idle' | 'loading' | 'ready' | 'error';

const USD_RATES: Record<Currency, number> = {
  AED: DEFAULT_USD_TO_AED_RATE,
  PKR: DEFAULT_USD_TO_PKR_RATE,
};

export interface GoldRateConfig {
  endpointUrl?: string;
  apiKey?: string;
  fetcher?: typeof fetch;
  usdToAedRate?: number;
  usdToTargetRate?: number;
  currency?: Currency;
  minRequestIntervalMs?: number;
  cacheTtlMs?: number;
  forceRefresh?: boolean;
  now?: () => number;
}

export interface GoldRateResult {
  pricePerGram24k: number;
  currency: Currency;
  sourceLabel: string;
  asOf: string;
}

interface GoldRatePayload {
  aedPerGram24k?: unknown;
  sourceLabel?: unknown;
  asOf?: unknown;
  spot?: {
    xauUsd?: unknown;
    usdToAed?: unknown;
    sourceLabel?: unknown;
    asOf?: unknown;
  };
  xauUsd?: unknown;
  usdToAed?: unknown;
  source?: unknown;
  timestamp?: unknown;
  price?: unknown;
  symbol?: unknown;
  updatedAt?: unknown;
  name?: unknown;
}

interface CacheState {
  cachedRate: GoldRateResult | null;
  inFlightRequest: Promise<GoldRateResult> | null;
  lastAttemptAt: number;
  lastSuccessAt: number;
}

const metalCaches: Record<string, CacheState> = {};

function getCache(key: string): CacheState {
  if (!metalCaches[key]) {
    metalCaches[key] = { cachedRate: null, inFlightRequest: null, lastAttemptAt: 0, lastSuccessAt: 0 };
  }
  return metalCaches[key];
}


function readEnv(name: 'EXPO_PUBLIC_GOLD_RATE_URL' | 'EXPO_PUBLIC_GOLD_RATE_API_KEY'): string | undefined {
  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return processEnv?.[name];
}

function parseNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizedFromPayload(payload: GoldRatePayload): Omit<GoldRateResult, 'currency'> | null {
  const pricePerGram24k = parseNumber(payload.aedPerGram24k);
  if (!pricePerGram24k || pricePerGram24k <= 0) {
    return null;
  }

  return {
    pricePerGram24k,
    sourceLabel:
      typeof payload.sourceLabel === 'string' && payload.sourceLabel.trim() !== ''
        ? payload.sourceLabel
        : 'Gold rate provider',
    asOf:
      typeof payload.asOf === 'string' && payload.asOf.trim() !== ''
        ? payload.asOf
        : new Date().toISOString(),
  };
}

function spotProxyFromPayload(payload: GoldRatePayload): Omit<GoldRateResult, 'currency'> | null {
  const xauUsd = parseNumber(payload.spot?.xauUsd ?? payload.xauUsd);
  const usdToAed = parseNumber(payload.spot?.usdToAed ?? payload.usdToAed);

  if (!xauUsd || xauUsd <= 0 || !usdToAed || usdToAed <= 0) {
    return null;
  }

  const pricePerGram24k = Math.round(((xauUsd * usdToAed) / TROY_OUNCE_IN_GRAMS) * 100) / 100;

  return {
    pricePerGram24k,
    sourceLabel:
      (typeof payload.spot?.sourceLabel === 'string' && payload.spot.sourceLabel.trim() !== ''
        ? payload.spot.sourceLabel
        : null) ??
      (typeof payload.source === 'string' && payload.source.trim() !== ''
        ? payload.source
        : 'Spot proxy'),
    asOf:
      (typeof payload.spot?.asOf === 'string' && payload.spot.asOf.trim() !== ''
        ? payload.spot.asOf
        : null) ??
      (typeof payload.timestamp === 'string' && payload.timestamp.trim() !== ''
        ? payload.timestamp
        : new Date().toISOString()),
  };
}

function goldApiFromPayload(payload: GoldRatePayload, usdToTargetRate: number, expectedSymbol: MetalSymbol = 'XAU'): Omit<GoldRateResult, 'currency'> | null {
  const ounceUsdPrice = parseNumber(payload.price);
  const symbol = typeof payload.symbol === 'string' ? payload.symbol : '';

  if (!ounceUsdPrice || ounceUsdPrice <= 0 || symbol !== expectedSymbol) {
    return null;
  }

  const pricePerGram24k = Math.round(((ounceUsdPrice * usdToTargetRate) / TROY_OUNCE_IN_GRAMS) * 100) / 100;

  return {
    pricePerGram24k,
    sourceLabel: 'gold-api.com',
    asOf:
      typeof payload.updatedAt === 'string' && payload.updatedAt.trim() !== ''
        ? payload.updatedAt
        : new Date().toISOString(),
  };
}

function parseGoldRatePayload(payload: unknown, usdToTargetRate: number, currency: Currency, metal: MetalSymbol = 'XAU'): GoldRateResult {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Metal rate payload is invalid.');
  }

  const typedPayload = payload as GoldRatePayload;

  const normalized = normalizedFromPayload(typedPayload);
  if (normalized) {
    return { ...normalized, currency };
  }

  const spotProxy = spotProxyFromPayload(typedPayload);
  if (spotProxy) {
    return { ...spotProxy, currency };
  }

  const goldApi = goldApiFromPayload(typedPayload, usdToTargetRate, metal);
  if (goldApi) {
    return { ...goldApi, currency };
  }

  throw new Error('Metal rate payload is missing required values.');
}

export function getGoldRateEnvConfig(): Pick<GoldRateConfig, 'endpointUrl' | 'apiKey'> {
  return {
    endpointUrl: readEnv('EXPO_PUBLIC_GOLD_RATE_URL') ?? DEFAULT_GOLD_API_URL,
    apiKey: readEnv('EXPO_PUBLIC_GOLD_RATE_API_KEY'),
  };
}

export async function fetchGoldRate(config: GoldRateConfig = {}): Promise<GoldRateResult> {
  return fetchMetalRate('XAU', {
    ...config,
    endpointUrl: config.endpointUrl ?? readEnv('EXPO_PUBLIC_GOLD_RATE_URL') ?? DEFAULT_GOLD_API_URL,
  });
}

/**
 * Fetch rate for any supported metal (XAU or XAG) with per-metal caching.
 */
export async function fetchMetalRate(metal: MetalSymbol, config: GoldRateConfig = {}): Promise<GoldRateResult> {
  const envConfig = getGoldRateEnvConfig();
  const endpointUrl = config.endpointUrl ?? `${GOLD_API_BASE_URL}/${metal}`;
  const apiKey = config.apiKey ?? envConfig.apiKey;
  const currency = config.currency ?? 'AED';
  const usdToTargetRate = config.usdToTargetRate ?? config.usdToAedRate ?? USD_RATES[currency];
  const minRequestIntervalMs = config.minRequestIntervalMs ?? DEFAULT_MIN_REQUEST_INTERVAL_MS;
  const cacheTtlMs = config.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  const nowFn = config.now ?? (() => Date.now());
  const now = nowFn();

  const cache = getCache(`${metal}-${currency}`);

  if (!config.forceRefresh && cache.cachedRate && cache.lastSuccessAt && now - cache.lastSuccessAt < cacheTtlMs) {
    return cache.cachedRate;
  }

  if (cache.inFlightRequest) {
    return cache.inFlightRequest;
  }

  if (!config.forceRefresh && cache.lastAttemptAt > 0 && now - cache.lastAttemptAt < minRequestIntervalMs) {
    if (cache.cachedRate) {
      return cache.cachedRate;
    }
    throw new Error(`${metal} rate request throttled. Try again shortly.`);
  }

  const fetcher = config.fetcher ?? fetch;
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (apiKey && apiKey.trim() !== '') {
    headers.Authorization = `Bearer ${apiKey}`;
    headers['x-api-key'] = apiKey;
  }

  cache.lastAttemptAt = now;

  cache.inFlightRequest = (async () => {
    const response = await fetcher(endpointUrl, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`${metal} rate request failed: ${response.status}`);
    }

    const payload = await response.json();
    const result = parseGoldRatePayload(payload, usdToTargetRate, currency, metal);

    cache.cachedRate = result;
    cache.lastSuccessAt = nowFn();

    return result;
  })();

  try {
    return await cache.inFlightRequest;
  } catch (error) {
    if (cache.cachedRate) {
      return cache.cachedRate;
    }
    throw error;
  } finally {
    cache.inFlightRequest = null;
  }
}

function resetCacheState() {
  for (const key of Object.keys(metalCaches)) {
    delete metalCaches[key];
  }
}

export const __internal = {
  parseGoldRatePayload,
  resetCacheState,
};
