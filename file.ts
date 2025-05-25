/**
 * File utilities for dake.
 * Provides functions for file operations and hashing.
 * 
 * @module file
 * 
 * @example
 * ```typescript
 * import * as fileLib from "./file.ts";
 * import * as pathLib from "./path.ts";
 * 
 * const path = pathLib.maybeToPath("./config.json");
 * if (path !== null) {
 *     const hash = await fileLib.sha512(path);
 *     console.log(`File hash: ${hash}`);
 * }
 * ```
 */

import * as pathLib from "./path.ts";
import { encodeHex } from "@std/encoding";

/**
 * Calculates the SHA-512 hash of a file.
 * 
 * @param path - Path to the file to hash
 * @returns Promise that resolves to the hex-encoded SHA-512 hash of the file
 * @throws {Error} If the file cannot be read or does not exist
 * 
 * @example
 * ```typescript
 * const expectedHash = "0xclaculated-hashes";
 * const hash = await sha512("config.json");
 * if (hash === expectedHash) {
 *     console.log("File integrity verified");
 * }
 * ```
 */
export async function sha512(path: pathLib.Path): Promise<string> {
    const fileContent = await Deno.readFile(path);
    const hashBuffer = await crypto.subtle.digest("SHA-512", fileContent);
    return encodeHex(hashBuffer);
}