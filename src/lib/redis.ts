import { Redis } from '@upstash/redis';

export const redis = new Redis({
  token: process.env.BLINK_KV_REST_API_TOKEN,
  url: process.env.BLINK_KV_REST_API_URL,
});
