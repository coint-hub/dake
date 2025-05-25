import * as stdPath from "@std/path";
import * as stdFs from "@std/fs";

export type Path = string & { __brand: "Path" };

function toPath(path: string) : Path {
    return path as Path;
}

export function join(path: Path, ...paths: string[]) : Path {
    return toPath(stdPath.join(path, ...paths));
}

export function dirname(path: Path) : Path {
    return toPath(stdPath.dirname(path));
}

export async function exists(path: Path) : Promise<boolean> {
    return await stdFs.exists(path);
}

export function fileFromMeta(meta: ImportMeta) : Path {
    return toPath(stdPath.fromFileUrl(meta.url));
}

export function dirFromMeta(meta: ImportMeta) : Path {
    return dirname(fileFromMeta(meta));
}

export async function isDirectory(path: Path) : Promise<boolean> {
    const exists = await stdFs.exists(path, {isDirectory: true});
    return exists;
}