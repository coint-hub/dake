# Introduction

`dake` aims to provide a reliable scripting system. It's designed as an alternative to untyped scripts that can be difficult to reuse and maintain over time.

- Written and runs with TypeScript
  - Type-safe: The compiler checks your code before it runs, and your IDE can provide helpful suggestions as you write.
  - Expressive: The syntax is more readable and maintainable compared to bash scripts or Makefiles.

- Built on top of Deno
  - Portable: Runs on many platforms with built-in security features enabled by default.
  - Deployable: Can be distributed as a single binary or compiled into a self-contained executable. Dependencies are cached and bundled automatically.
  - Reusable: You can import third-party libraries directly without additional configuration. Integrate with existing tools like git naturally.

## Why `dake`?

The name `dake` is inspired by [`make`](https://en.wikipedia.org/wiki/Make_(software)), the legendary build tool that has helped developers for decades. It takes the good parts from this Unix legacy and enhances them with modern improvements.

Pronounce it like "make", but with Deno's "d".

## Why Another Scripting Tool?

TODO :: explain kindly

# Architecture

dake consists of two main components, inspired by the traditional make and Makefile pattern:

## Core Components

### 1. dake Binary (Executable)
The runtime that configures the execution context and launches your scripts:
- Context Manager: Sets up the proper environment for script execution
  - Nix shell integration for managing package paths
  - Flutter version management (FVM) support
  - Environment variable handling

### 2. User Scripts (dake.ts)
Your TypeScript automation scripts with built-in utilities:
- Argument Parser: Type-safe command-line argument handling
- Config Parser: Modern replacement for dotenv with validation
- CLI Utilities: Type-safe wrappers for common tools (find, grep, etc.)
- File Operations: Enhanced file system operations with safety features
- Process Management: Better control over subprocess execution


## Context Manager

The context manager automatically configures your script's execution environment:

1. Discovers available environment managers
2. Builds execution context from multiple sources (environment variables, package paths)
3. Saves configurations to dake store for faster subsequent runs
4. Executes scripts within the configured context

### Nix Manager

#### Initial Setup

1. Detects shell.nix by recursively searching parent directories
2. Launches shell.nix with `nix-shell --run "dake nix-shell-config"`
3. Captures nix-shell configuration from stdout
4. Updates dake store with new configuration

#### Subsequent Runs

1. Checks dake store and validates configuration against:
   - shell.nix checksum (detects file changes)
   - Nix store paths (ensures packages haven't been garbage collected)
2. Updates configuration if changes detected
3. Executes directly with stored paths, bypassing nix-shell overhead

### Environment Variable Manager

1. Searches for dake.json to override environment variables
   - Recommended: Store sensitive configs outside git (in parent directories)
2. Validates and updates dake store similar to nix-manager
3. Merges environment variables into execution context

# Plan

1. add execute new shell feature
2. add Environment Variable Manager
3. add execute new shell with Environment Variable Manager

# TODO

* make a plan for intergration test and side effects - maby we use tmp dir
