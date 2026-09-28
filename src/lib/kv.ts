import { Redis } from "@upstash/redis";

const STORAGE_KEY = "dashboard_inquilino_data_v1";

/**
 * Returns a configured Redis client if environment variables are present.
 * Works seamlessly with Vercel KV and Upstash Redis.
 */
export function getRedisClient(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

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
