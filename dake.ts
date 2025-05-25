import { enterShell } from "./action/shell.ts";
import { tryNixContext } from "./context/nix.ts";
import * as pathLib from "./path.ts";

export type Context = {};

export async function runDake(projectRoot: pathLib.Path) : Promise<void> {
    if (!await pathLib.isDirectory(projectRoot)) {
        throw new Error(`Project root is not a directory : projectRoot=${projectRoot}`);
    }

    const context = await tryNixContext(projectRoot);
    if (context === null) {
        throw new Error("No context found");
    }
    await enterShell(context);
}