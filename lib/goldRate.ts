const TROY_OUNCE_IN_GRAMS = 31.1034768;
const DEFAULT_USD_TO_AED_RATE = 3.6725;
const DEFAULT_GOLD_API_URL = 'https://api.gold-api.com/price/XAU';
const DEFAULT_MIN_REQUEST_INTERVAL_MS = 10_000;
const DEFAULT_CACHE_TTL_MS = 5 * 60_000;

export interface GoldRateConfig {
  endpointUrl?: string;
  apiKey?: string;
  fetcher?: typeof fetch;
  usdToAedRate?: number;
  minRequestIntervalMs?: number;
  cacheTtlMs?: number;
  forceRefresh?: boolean;
  now?: () => number;
}

export interface GoldRateResult {
  aedPerGram24k: number;
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

let cachedRate: GoldRateResult | null = null;
let inFlightRequest: Promise<GoldRateResult> | null = null;
let lastAttemptAt = 0;
let lastSuccessAt = 0;

function readEnv(name: 'EXPO_PUBLIC_GOLD_RATE_URL' | 'EXPO_PUBLIC_GOLD_RATE_API_KEY'): string | undefined {
  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return processEnv?.[name];
}

function parseNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizedFromPayload(payload: GoldRatePayload): GoldRateResult | null {
  const aedPerGram24k = parseNumber(payload.aedPerGram24k);
  if (!aedPerGram24k || aedPerGram24k <= 0) {
    return null;
  }

  return {
    aedPerGram24k,
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

function spotProxyFromPayload(payload: GoldRatePayload): GoldRateResult | null {
  const xauUsd = parseNumber(payload.spot?.xauUsd ?? payload.xauUsd);
  const usdToAed = parseNumber(payload.spot?.usdToAed ?? payload.usdToAed);

  if (!xauUsd || xauUsd <= 0 || !usdToAed || usdToAed <= 0) {
    return null;
  }

  const aedPerGram24k = Math.round(((xauUsd * usdToAed) / TROY_OUNCE_IN_GRAMS) * 100) / 100;

  return {
    aedPerGram24k,
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

function goldApiFromPayload(payload: GoldRatePayload, usdToAedRate: number): GoldRateResult | null {
  const ounceUsdPrice = parseNumber(payload.price);
  const symbol = typeof payload.symbol === 'string' ? payload.symbol : '';

  if (!ounceUsdPrice || ounceUsdPrice <= 0 || symbol !== 'XAU') {
    return null;
  }

  const aedPerGram24k = Math.round(((ounceUsdPrice * usdToAedRate) / TROY_OUNCE_IN_GRAMS) * 100) / 100;

  return {
    aedPerGram24k,
    sourceLabel: 'gold-api.com',
    asOf:
      typeof payload.updatedAt === 'string' && payload.updatedAt.trim() !== ''
        ? payload.updatedAt
        : new Date().toISOString(),
  };
}

function parseGoldRatePayload(payload: unknown, usdToAedRate: number): GoldRateResult {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Gold rate payload is invalid.');
  }

  const typedPayload = payload as GoldRatePayload;

  const normalized = normalizedFromPayload(typedPayload);
  if (normalized) {
    return normalized;
  }

  const spotProxy = spotProxyFromPayload(typedPayload);
  if (spotProxy) {
    return spotProxy;
  }

  const goldApi = goldApiFromPayload(typedPayload, usdToAedRate);
  if (goldApi) {
    return goldApi;
  }

  throw new Error('Gold rate payload is missing required values.');
}

export function getGoldRateEnvConfig(): Pick<GoldRateConfig, 'endpointUrl' | 'apiKey'> {
  return {
    endpointUrl: readEnv('EXPO_PUBLIC_GOLD_RATE_URL') ?? DEFAULT_GOLD_API_URL,
    apiKey: readEnv('EXPO_PUBLIC_GOLD_RATE_API_KEY'),
  };
}

function shouldUseCachedRate(now: number, cacheTtlMs: number): boolean {
  if (!cachedRate || !lastSuccessAt) {
    return false;
  }

  return now - lastSuccessAt < cacheTtlMs;
}

export async function fetchGoldRate(config: GoldRateConfig = {}): Promise<GoldRateResult> {
  const endpointUrl = config.endpointUrl ?? readEnv('EXPO_PUBLIC_GOLD_RATE_URL') ?? DEFAULT_GOLD_API_URL;
  const apiKey = config.apiKey ?? readEnv('EXPO_PUBLIC_GOLD_RATE_API_KEY');
  const usdToAedRate = config.usdToAedRate ?? DEFAULT_USD_TO_AED_RATE;
  const minRequestIntervalMs = config.minRequestIntervalMs ?? DEFAULT_MIN_REQUEST_INTERVAL_MS;
  const cacheTtlMs = config.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  const nowFn = config.now ?? (() => Date.now());
  const now = nowFn();

  if (!config.forceRefresh && shouldUseCachedRate(now, cacheTtlMs)) {
    return cachedRate as GoldRateResult;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  if (!config.forceRefresh && lastAttemptAt > 0 && now - lastAttemptAt < minRequestIntervalMs) {
    if (cachedRate) {
      return cachedRate;
    }
    throw new Error('Gold rate request throttled. Try again shortly.');
  }

  const fetcher = config.fetcher ?? fetch;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (apiKey && apiKey.trim() !== '') {
    headers.Authorization = `Bearer ${apiKey}`;
    headers['x-api-key'] = apiKey;
  }

  lastAttemptAt = now;

  inFlightRequest = (async () => {
    const response = await fetcher(endpointUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Gold rate request failed: ${response.status}`);
    }

    const payload = await response.json();
    const result = parseGoldRatePayload(payload, usdToAedRate);

    cachedRate = result;
    lastSuccessAt = nowFn();

    return result;
  })();

  try {
    return await inFlightRequest;
  } catch (error) {
    if (cachedRate) {
      return cachedRate;
    }
    throw error;
  } finally {
    inFlightRequest = null;
  }
}

function resetCacheState() {
  cachedRate = null;
  inFlightRequest = null;
  lastAttemptAt = 0;
  lastSuccessAt = 0;
}

export const __internal = {
  parseGoldRatePayload,
  resetCacheState,
};
