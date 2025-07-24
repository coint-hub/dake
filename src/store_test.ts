import { assert, assertEquals } from "@std/assert";
import { Store, type StoreInitializeError } from "./store.ts";
import { Directory } from "@coint/path";
import { ok, err } from "jsr:@coint/simple@0.1";

Deno.test("Store initialize - directory exists", async () => {
  const tempDir = await Deno.makeTempDir();
  try {
    const dir = Directory.build(tempDir);
    assert(dir.success);
    
    const store = new Store(dir.value);
    const result = await store.initialize();
    
    assertEquals(result, ok(undefined));
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("Store initialize - directory does not exist", async () => {
  const tempDir = await Deno.makeTempDir();
  const nonExistentPath = `${tempDir}/does/not/exist`;
  
  try {
    const dir = Directory.build(nonExistentPath);
    assert(dir.success);
    
    const store = new Store(dir.value);
    const result = await store.initialize();
    
    assertEquals(result, ok(undefined));
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("Store initialize - path is file not directory", async () => {
  const tempDir = await Deno.makeTempDir();
  const filePath = `${tempDir}/file.txt`;
  
  try {
    // Create a file at the path where we want a directory
    await Deno.writeTextFile(filePath, "test content");
    
    const dir = Directory.build(filePath);
    assert(dir.success);
    
    const store = new Store(dir.value);
    const result = await store.initialize();
    
    assertEquals(result, err<StoreInitializeError>({
      kind: "NOT_A_DIRECTORY",
      path: filePath,
    }));
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("Store initialize - multiple calls return same promise", async () => {
  const tempDir = await Deno.makeTempDir();
  
  try {
    const dir = Directory.build(tempDir);
    assert(dir.success);
    
    const store = new Store(dir.value);
    
    const promise1 = store.initialize();
    const promise2 = store.initialize();
    
    // Both calls should return the same promise instance
    assertEquals(promise1, promise2);
    
    const result1 = await promise1;
    const result2 = await promise2;
    
    assertEquals(result1, result2);
    assertEquals(result1, ok(undefined));
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("Store initialize - concurrent calls", async () => {
  const tempDir = await Deno.makeTempDir();
  
  try {
    const dir = Directory.build(tempDir);
    assert(dir.success);
    
    const store = new Store(dir.value);
    
    // Start multiple concurrent initializations
    const promises = [
      store.initialize(),
      store.initialize(),
      store.initialize(),
    ];
    
    // All should be the same promise
    assertEquals(promises[0], promises[1]);
    assertEquals(promises[1], promises[2]);
    
    const results = await Promise.all(promises);
    
    // All results should be successful
    results.forEach(result => {
      assertEquals(result, ok(undefined));
    });
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});