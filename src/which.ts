import * as stdPath from "@std/path";
import { logger } from "./logger.ts";

/**
 * Locates a command in the system PATH.
 *
 * Similar to the Unix `which` command, this function searches through all
 * directories listed in the PATH environment variable to find an executable
 * file matching the given command name.
 *
 * @param command - The name of the command to search for
 * @returns The absolute path to the executable if found, null otherwise
 *
 * @example
 * ```typescript
 * const gitPath = await which("git");
 * if (gitPath) {
 *   console.log(`Git found at: ${gitPath}`);
 * } else {
 *   console.log("Git not found in PATH");
 * }
 * ```
 */
export async function which(command: string): Promise<string | null> {
  const pathEnvironmentVariable = Deno.env.get("PATH") ?? "";

  const paths = pathEnvironmentVariable.split(":");

  for (const path of paths) {
    const absolutePath = stdPath.join(path, command);
    if (await isExecutableFile(absolutePath)) {
      return absolutePath;
    }
  }

  return null;
}

/**
 * Checks if a file at the given path exists and is executable.
 *
 * @param path - The absolute path to check
 * @returns true if the path points to an executable file, false otherwise
 * @throws {Error} If an error occurs other than file not found
 */
async function isExecutableFile(path: string): Promise<boolean> {
  try {
    const info = await Deno.stat(path);
    if (!info.isFile) {
      return false;
    }
    if (info.mode === null) {
      logger.warn("target path has null mode", { path: path });
      return false;
    }

    return (info.mode & 0o111) !== 0;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
