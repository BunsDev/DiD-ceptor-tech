import { join } from "node:path";
import { readdir } from "node:fs/promises";
import { DONSecret } from "@/interfaces";

const SECRETS_FOLDER = __dirname;
const SECRETS_PATTERN = /(\d+)_\w+(\.[jt]s)/;

export type SecretFile = DONSecret & {
  path: string;
  name: string;
  slotId: number;
};
let FILES: Array<string>;

async function getSecrets() {
  if (FILES) return FILES;

  FILES = await readdir(SECRETS_FOLDER);

  return FILES.filter(f => f.match(SECRETS_PATTERN));
}

async function loadSecret(path: string): Promise<DONSecret> {
  const { default: Secret } = await import(path);
  const { secrets, ttl } = Secret;

  if (!secrets) throw new Error(`Secrets NOT FOUND in ${path}`);
  if (!ttl) throw new Error(`TTL NOT FOUND in ${path}`);

  return Secret;
}

async function getSecretByName(secretFile: string): Promise<SecretFile> {
  const secrets = await getSecrets();

  const secret = secrets.find(f => f === secretFile);
  if (!secret) throw new Error(`Secret file "${secretFile}" NOT FOUND`);

  // Extract number from secret file name
  const slotId = Number(SECRETS_PATTERN.exec(secret)?.[1]);
  if (Number.isNaN(slotId)) throw new Error(`Can't find the slotId in ${secret} | ${slotId}`);

  const path = join(SECRETS_FOLDER, secret);
  const Secret = await loadSecret(path);

  return { ...Secret, slotId: slotId + 1, path, name: secret };
}

async function getSecretBySlotId(slotId: number): Promise<SecretFile> {
  const secrets = await getSecrets();

  const secret = secrets.find(f => SECRETS_PATTERN.exec(f)?.[1] === slotId.toString());
  if (!secret) throw new Error(`Secret file for slot #${slotId} NOT FOUND`);

  const path = join(SECRETS_FOLDER, secret);
  const Secret = await loadSecret(path);

  return { ...Secret, slotId: Number(slotId) + 1, path, name: secret };
}

async function getSecret(secretFile?: string, slotId?: number): Promise<SecretFile> {
  if (secretFile) return getSecretByName(secretFile);
  if (slotId) return getSecretBySlotId(slotId);

  throw new Error("You must provide either a secret file or a slot id");
}

export { getSecret, getSecretByName, getSecretBySlotId };
