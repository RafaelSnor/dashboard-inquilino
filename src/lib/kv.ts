import { Redis } from "@upstash/redis";

const STORAGE_KEY = "dashboard_inquilino_data_v1";

/**
 * Searches process.env for a variable that matches the suffix,
 * handling custom database prefixes like kratos_KV_REST_API_URL.
 */
function getEnv(suffix: string): string | undefined {
  if (process.env[suffix]) return process.env[suffix];
  const found = Object.keys(process.env).find((k) =>
    k.toUpperCase().endsWith(suffix.toUpperCase())
  );
  return found ? process.env[found] : undefined;
}

/**
 * Returns a configured Redis client if environment variables are present.
 * Works seamlessly with Vercel KV, Upstash Redis, and custom prefixes.
 */
export function getRedisClient(): Redis | null {
  const url =
    getEnv("KV_REST_API_URL") ||
    getEnv("UPSTASH_REDIS_REST_URL") ||
    process.env.kratos_KV_REST_API_URL;

  const token =
    getEnv("KV_REST_API_TOKEN") ||
    getEnv("UPSTASH_REDIS_REST_TOKEN") ||
    process.env.kratos_KV_REST_API_TOKEN;

  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch {
      return null;
    }
  }
  return null;
}

export { STORAGE_KEY };
