import { DONSecret } from "@/interfaces";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("openai auth not provided - check your environment variable OPENAI_API_KEY");
}

export const ttl = 60 * 24; // 24 hours
export const secrets = { apiKey: process.env.OPENAI_API_KEY };

export const Secret: DONSecret = { ttl, secrets };
export default Secret;
