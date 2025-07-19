#!/usr/bin/env -S deno run --allow-env

import { logger } from "./src/logger.ts";
import { config } from "./src/config.ts";

function main() {
  logger.debug("dake", { version: config.version });
}

if (import.meta.main) {
  main();
}
