import { Context } from "../dake.ts";
import * as pathLib  from "../path.ts";

export async function tryNixContext(projectRoot: pathLib.Path) : Promise<Context | null> {
    const shellNixPath = await lookupShellNix(projectRoot);
    if (shellNixPath === null) {
        return null;
    }
    throw new Error("Not implemented");
}

/**
 * Recursively searches for a shell.nix file starting from the given directory and moving up
 * through parent directories.
 * 
 * This function supports monorepo project structures where a single shell.nix can be shared
 * across multiple subprojects:
 * 
 * ```
 * root/
 *   ├── shell.nix         <- Will be found from any subdirectory
 *   ├── app/
 *   │   └── package.json
 *   ├── web/
 *   │   └── package.json
 *   └── was/
 *       └── package.json
 * ```
 * 
 * The search process:
 * 1. Looks for shell.nix in the current directory
 * 2. If not found, moves up to the parent directory
 * 3. Repeats until either:
 *    - shell.nix is found (returns the path)
 *    - Root directory is reached (returns null)
 * 
 * @param path The starting directory path to begin the search
 * @returns Promise<string | null> The absolute path to the found shell.nix file, or null if not found
 */
async function lookupShellNix(path: pathLib.Path) : Promise<pathLib.Path | null> {
    const shellNixPath = pathLib.join(path, "shell.nix");
    
    // Check if shell.nix exists in current directory
    if (await pathLib.exists(shellNixPath)) {
        return shellNixPath;
    }

    // Get parent directory
    const parentDir = pathLib.dirname(path);
    
    // If we're at the root directory (dirname returns the same path)
    // stop the recursion and return null
    if (parentDir === path) {
        return null;
    }

    // Recursively check parent directory
    return lookupShellNix(parentDir);
}

