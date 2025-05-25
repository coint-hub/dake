#!/usr/bin/env -S deno run --allow-read --allow-env --allow-run

import { runDake } from "./dake.ts";
import * as pathLib from "./path.ts";

async function main() {
  await runDake(pathLib.dirFromMeta(import.meta));
}

if (import.meta.main) {
  main();
}
