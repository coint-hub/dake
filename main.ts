#!/usr/bin/env -S deno run

function main() {
  console.log("Hello, deno!");
}

if (import.meta.main) {
  main();
}
