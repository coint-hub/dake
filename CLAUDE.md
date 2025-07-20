# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`dake` aims to provide a reliable scripting system as an alternative to untyped scripts that are difficult to reuse and maintain. It's inspired by `make` and takes the good parts from this Unix legacy while enhancing them with modern improvements.

Key features:
- Written and runs with TypeScript for type safety and better IDE support
- Built on Deno for portability, easy deployment, and direct library imports
- Provides utilities for common scripting tasks (backup, file operations, configuration management)

## Development Environment

Use Nix shell for consistent development environment:
```bash
nix-shell
```

This provides Deno 2.2.12 in a reproducible environment.

## Running the Project

```bash
# Run the main script
deno run main.ts

# Or as executable
./main.ts
```

## TypeScript Configuration

The project enforces strict type safety with `noUncheckedIndexedAccess: true` in deno.jsonc. This requires explicit null checks when accessing array elements or object properties with dynamic keys.

## Project Structure

- `main.ts` - Entry point using `import.meta.main` pattern
- `shell.nix` - Nix development environment configuration
- `deno.jsonc` - Deno configuration file
- `deno.lock` - Dependency lock file

## Recent Development Focus

The codebase has been building utilities for:
- Shell/Nix context handling
- File utilities with SHA-512 hashing
- Path utilities with type safety
- Task automation functions
- Backup utilities with smart rotation and configuration management
- Database dump utilities (mysqldump wrapper)

## Architecture

dake consists of two main components, inspired by the traditional make and Makefile pattern:

### Core Components

1. dake Binary (Executable)
   The runtime that configures the execution context and launches your scripts:
   - Context Manager: Sets up the proper environment for script execution
     - Nix shell integration for managing package paths
     - Flutter version management (FVM) support
     - Environment variable handling

2. User Scripts (dake.ts)
   Your TypeScript automation scripts with built-in utilities:
   - Argument Parser: Type-safe command-line argument handling
   - Config Parser: Modern replacement for dotenv with validation
   - CLI Utilities: Type-safe wrappers for common tools (find, grep, etc.)
   - File Operations: Enhanced file system operations with safety features
   - Process Management: Better control over subprocess execution

## Key Design Principles

From the README examples:
- Configuration should be separated from code (using config files or environment variables)
- Provide both simple and production-ready versions of utilities
- Built-in error handling by default
- Two-stage deletion for safety (move to .trash before permanent deletion)
- Consistent, readable APIs that are easier than bash equivalents