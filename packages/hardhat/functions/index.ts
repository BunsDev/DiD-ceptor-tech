import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import crypto from "node:crypto";
import type { Address } from "hardhat-deploy/dist/types";

const FUNCTIONS_FOLDER = __dirname;
const FUNCTIONS_PATTERN = /(\d+)_(\w+)(\.[jt]s)/;
const MAP_NAME = "link_functions_map.json";

type SourceCode = string;
type ScriptName = string;
type ChainId = string | number;
export type ScriptsMap = Record<ScriptName, Script>;
export type ChainMap = Record<ChainId, ScriptsMap>;
export interface Script {
  name: ScriptName;
  path: string;
  source: SourceCode;
  checksum: string;
  subscriptionId?: number;
  secret?: { reference: string; validUntil: number };
  consumerAddress?: Address;
}

let _scripts: Array<Script>;
let _map: ChainMap;

async function loadMap(chainId?: ChainId): Promise<ChainMap | ScriptsMap> {
  if (_map) {
    if (!chainId) return _map;
    if (chainId in _map) return _map[chainId];
    return (_map[chainId] = {} as ScriptsMap);
  }

  try {
    const path = join(FUNCTIONS_FOLDER, MAP_NAME);
    const map = await readFile(path, "utf-8");
    _map = JSON.parse(map);

    return loadMap(chainId);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log("No map found. Creating a new one...");
      _map = {} as ChainMap;
      if (chainId) _map[chainId] = {} as ScriptsMap;

      return loadMap(chainId);
    }
    throw error;
  }
}

async function writeMap(map: ScriptsMap, chainId: ChainId) {
  const path = join(FUNCTIONS_FOLDER, MAP_NAME);

  _map[chainId] = map;
  const data = JSON.stringify(_map, null, 2);

  return writeFile(path, data, "utf-8");
}

function generateChecksum(source: SourceCode) {
  return crypto.createHash("sha256").update(source).digest("hex");
}

export async function loadScript(name: ScriptName) {
  const path = join(FUNCTIONS_FOLDER, name);
  const source = await readFile(path, "utf-8");

  // TODO: make path relative to git root

  // ---
  // If a `.ts` use https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

  // to reduce size and optimize calls. https://github.com/mishoo/UglifyJS
  // const uglified = minify({ [name]: source });
  // if (uglified.error) throw uglified.error;

  // TODO: Replace name with the script name not the file name
  return {
    name,
    path,
    source,
    checksum: generateChecksum(source),
  } as Script;
}

async function getScripts(isLocal?: boolean) {
  if (_scripts) return _scripts;

  console.log("Loading scripts...");
  const files = await readdir(FUNCTIONS_FOLDER);
  const functions = files.filter(file => file.match(FUNCTIONS_PATTERN));
  _scripts = await Promise.all(functions.map(loadScript));

  if (isLocal) _scripts.forEach((script, i) => (script.subscriptionId = i + 1));
  return _scripts;
}

async function scriptsToDeploy(chainId: ChainId, consumerAddress: Address, isLocal?: boolean): Promise<Array<Script>> {
  const map = await loadMap(chainId);
  const scripts = await getScripts(isLocal);
  const changed = scripts.filter(
    ({ name, checksum }) =>
      !(name in map) || map[name].checksum !== checksum || map[name].consumerAddress !== consumerAddress,
  );

  // TODO: if a script is removed, remove it from the map and remove the subscription from the DON
  //  create a separate array with the scripts to be removed.

  return changed.map(script => Object.assign({}, map[script.name], script));
}

async function upsertScripts(scripts: Array<Script>, chainId: ChainId) {
  const map = (await loadMap(chainId)) as ScriptsMap;

  scripts.forEach(script => (map[script.name] = script));
  await writeMap(map, chainId);

  return map;
}

export { scriptsToDeploy, upsertScripts, loadMap };
