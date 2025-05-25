/**
 * Shell action module for dake.
 * Handles entering a shell with the appropriate context.
 * 
 * @module action/shell
 */

import { Context } from "../dake.ts";

/**
 * Enters a new shell with the context's PATH prepended.
 * Uses the user's default shell from SHELL environment variable.
 * 
 * @param context - The context containing paths to prepend
 * @throws {Error} If SHELL environment variable is not set
 */
export async function enterShell(context: Context): Promise<void> {
    // Get user's shell from environment
    const shell = Deno.env.get("SHELL");
    if (!shell) {
        throw new Error("SHELL environment variable not set");
    }

    // Get current environment variables
    const env: Record<string, string> = {};
    for (const [key, value] of Object.entries(Deno.env.toObject())) {
        if (value !== undefined) {
            env[key] = value;
        }
    }

    // Prepare PATH with context paths prepended
    const currentPaths = env["PATH"]?.split(":") ?? [];
    const newPath = [...context.paths, ...currentPaths].join(":");
    // Override PATH with our new value
    env["PATH"] = newPath;

    // Run the shell with modified PATH
    const cmd = new Deno.Command(shell,  {
        args: ["-i"],
        env: env,
        clearEnv: true,
    });

    const child = cmd.spawn();
    await child.status;
}