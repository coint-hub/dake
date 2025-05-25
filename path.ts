/**
 * Type-safe path handling utilities for dake.
 * This module provides a wrapper around standard path operations with additional type safety.
 * All functions in this module operate on the Path type, which prevents accidental string usage.
 * 
 * @module path
 * 
 * @example
 * Basic path operations:
 * ```typescript
 * import * as path from "./path.ts";
 * 
 * // Get current module's directory
 * const currentDir = path.dirFromMeta(import.meta);
 * 
 * // Join paths safely
 * const configPath = path.join(currentDir, "config", "default.json");
 * 
 * // Check path existence
 * if (await path.exists(configPath)) {
 *     console.log("Config file exists");
 * }
 * ```
 * 
 * Directory operations:
 * ```typescript
 * // Check if path is a directory
 * if (await path.isDirectory(somePath)) {
 *     console.log("Path is a directory");
 * }
 * 
 * // Get parent directory
 * const parentDir = path.dirname(somePath);
 * ```
 * 
 * File type checking:
 * ```typescript
 * // Check for specific file types
 * const isConfigFile = await path.exists(configPath, { isFile: true });
 * const isConfigDir = await path.exists(configPath, { isDirectory: true });
 * const isSymlink = await path.exists(configPath, { isSymlink: true });
 * ```
 */

import * as stdPath from "@std/path";
import * as stdFs from "@std/fs";

/**
 * Type-safe path representation.
 * This type ensures paths are created and handled through proper utility functions.
 */
export type Path = string & { __brand: "Path" };

/**
 * Options for checking path existence.
 * Only one option should be set to true at a time.
 * If no options are provided or all options are false/undefined, checks for basic existence.
 * 
 * @example
 * ```ts
 * // Check if path exists (any type)
 * await exists(path);
 * 
 * // Check if path is a directory
 * await exists(path, { isDirectory: true });
 * 
 * // Check if path is a regular file
 * await exists(path, { isFile: true });
 * 
 * // Check if path is a symlink
 * await exists(path, { isSymlink: true });
 * ```
 */
export type ExistsOptions = {
    /**
     * If true, only return true if the path exists and is a regular file.
     * Should not be combined with other options.
     * @default false
     */
    isFile?: boolean;

    /**
     * If true, only return true if the path exists and is a directory.
     * Should not be combined with other options.
     * @default false
     */
    isDirectory?: boolean;

    /**
     * If true, only return true if the path exists and is a symlink.
     * Should not be combined with other options.
     * @default false
     */
    isSymlink?: boolean;
};

/**
 * Converts a string to a Path type.
 * Internal utility - use with caution as it bypasses path validation.
 */
function toPath(path: string) : Path {
    return path as Path;
}

/**
 * Joins multiple path segments into a single path.
 * 
 * @param path - The base path
 * @param paths - Additional path segments to join
 * @returns A new Path combining all segments
 */
export function join(path: Path, ...paths: string[]) : Path {
    return toPath(stdPath.join(path, ...paths));
}

/**
 * Gets the directory name of a path.
 * 
 * @param path - The path to get the directory from
 * @returns The parent directory path
 */
export function dirname(path: Path) : Path {
    return toPath(stdPath.dirname(path));
}

/**
 * Checks if a path exists in the filesystem.
 * 
 * @param path - The path to check
 * @param options - Options for exists check
 * @returns Promise that resolves to true if the path exists and matches the specified options
 */
export async function exists(path: Path, options?: ExistsOptions) : Promise<boolean> {
    return await stdFs.exists(path, options);
}

/**
 * Creates a Path from an import.meta object.
 * Useful for getting the path of the current module file.
 * 
 * @param meta - The import.meta object from the module
 * @returns The file path of the module
 */
export function fileFromMeta(meta: ImportMeta) : Path {
    return toPath(stdPath.fromFileUrl(meta.url));
}

/**
 * Gets the directory path from an import.meta object.
 * Useful for getting the directory containing the current module.
 * 
 * @param meta - The import.meta object from the module
 * @returns The directory path containing the module
 */
export function dirFromMeta(meta: ImportMeta) : Path {
    return dirname(fileFromMeta(meta));
}

/**
 * Checks if a path points to a directory.
 * 
 * @param path - The path to check
 * @returns Promise that resolves to true if the path exists and is a directory
 */
export async function isDirectory(path: Path) : Promise<boolean> {
    return await exists(path, { isDirectory: true });
}