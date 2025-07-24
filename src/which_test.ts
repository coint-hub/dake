import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import { which } from "./which.ts";

Deno.test("which - finds executable in PATH", async () => {
  const shPath = await which("sh");
  assertEquals(shPath?.startsWith("/"), true);
});

Deno.test("which - returns null for non-existent command", async () => {
  const result = await which("this-command-definitely-does-not-exist-12345");
  assertEquals(result, null);
});

Deno.test("which - finds common commands", async () => {
  const commands = ["ls", "cat", "echo"];
  
  for (const cmd of commands) {
    const path = await which(cmd);
    if (path !== null) {
      assertEquals(path.includes(`/${cmd}`), true);
      assertEquals(path.startsWith("/"), true);
      return;
    }
  }
  
  throw new Error("No common commands found in PATH");
});

Deno.test("which - handles empty PATH", async () => {
  const envStub = stub(Deno.env, "get", (key: string) => {
    if (key === "PATH") return "";
    return undefined;
  });
  
  try {
    const result = await which("ls");
    assertEquals(result, null);
  } finally {
    envStub.restore();
  }
});

Deno.test("which - handles PATH with non-existent directories", async () => {
  const envStub = stub(Deno.env, "get", (key: string) => {
    if (key === "PATH") return "/non-existent-dir-123:/another-fake-dir-456";
    return undefined;
  });
  
  try {
    const result = await which("ls");
    assertEquals(result, null);
  } finally {
    envStub.restore();
  }
});

Deno.test("which - handles custom PATH", async () => {
  const envStub = stub(Deno.env, "get", (key: string) => {
    if (key === "PATH") return "/bin:/usr/bin";
    return undefined;
  });
  
  try {
    const result = await which("sh");
    assertEquals(
      result === "/bin/sh" || result === "/usr/bin/sh",
      true,
      `Expected /bin/sh or /usr/bin/sh, got ${result}`
    );
  } finally {
    envStub.restore();
  }
});

Deno.test("which - handles undefined PATH", async () => {
  const envStub = stub(Deno.env, "get", () => undefined);
  
  try {
    const result = await which("ls");
    assertEquals(result, null);
  } finally {
    envStub.restore();
  }
});