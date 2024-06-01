import { join } from "node:path";

const SECRETS_FOLDER = __dirname;

function getSecretPath(secretFile: string): string {
  const path = join(SECRETS_FOLDER, secretFile);
  return path;
}

export { getSecretPath };
