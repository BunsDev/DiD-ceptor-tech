import { DONSecret } from "@/interfaces";

if (!process.env.RABBITMQ_AUTH) {
  throw new Error("rabbitmq auth not provided - check your environment variable RABBITMQ_AUTH");
}

export const ttl = 60 * 24; // 24 hours
export const secrets = { auth: process.env.RABBITMQ_AUTH };

export const Secret: DONSecret = { ttl, secrets };
export default Secret;
