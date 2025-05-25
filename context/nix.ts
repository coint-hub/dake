import { Context } from "../dake.ts";
import * as pathLib  from "../path.ts";
import * as fileLib from "../file.ts";

export async function tryNixContext(projectRoot: pathLib.Path) : Promise<Context | null> {
    const shellNixPath = await lookupShellNix(projectRoot);
    if (shellNixPath === null) {
        return null;
    }
    return buildNixContext(shellNixPath);
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

type NixContext = Readonly<{ paths: pathLib.Path[]; sha: string }>;

/**
 * Builds a nix context by running nix-shell and extracting PATH information.
 * 
 * @param shellNixPath - Path to the shell.nix file
 * @returns Promise resolving to NixContext containing PATH entries
 * @throws {Error} If nix-shell command fails or PATH cannot be extracted
 */
async function buildNixContext(shellNixPath: pathLib.Path): Promise<NixContext> {
    const shellNixDir = pathLib.dirname(shellNixPath);

    const currentPathVariable = Deno.env.get("PATH") ?? "";
    const currentPaths = new Set(currentPathVariable === "" ? [] : currentPathVariable.split(":"));

    // Calculate shell.nix hash
    const sha = await fileLib.sha512(shellNixPath);

    // Run nix-shell and capture PATH
    // TODO :: replace echo with dake itself.
    const cmd = new Deno.Command("nix-shell", {
        args: ["--run", "echo $PATH"],
        cwd: shellNixDir,
        stdin: "null",
        stdout: "piped",
    });
    const output = await cmd.output();

    if (!output.success) {
        throw new Error("Failed to run nix-shell");
    }
    const pathValue = new TextDecoder().decode(output.stdout).trim();
    
    const rawPaths = pathValue === "" ? [] : pathValue.split(":");
    const paths: pathLib.Path[] = [];
    
    for (const rawPath of rawPaths) {
        // Skip if path is in current PATH
        if (currentPaths.has(rawPath)) {
            continue;
        }
        const path = pathLib.maybeToPath(rawPath);
        if (path !== null) {
            paths.push(path);
        }
    }

    return { paths, sha };
}
