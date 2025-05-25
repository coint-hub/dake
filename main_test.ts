import { assertEquals } from "@std/assert";
// TODO :: remove enusre, add actual tests

function ensure(): boolean {
  return true;
}

Deno.test(function ensureTest() {
  assertEquals(ensure(), true);
});
