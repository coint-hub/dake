import type { Directory } from "@coint/path";
import { logger } from "./logger.ts";
import { err, ok, type Result } from "jsr:@coint/simple@0.1";

export class Store {
  constructor(private readonly directory: Directory) {
  }

  private initialized: Promise<Result<void, StoreInitializeError>> | null =
    null;

  initialize(): Promise<Result<void, StoreInitializeError>> {
    if (this.initialized) {
      logger.debug("store already initializing");
      return this.initialized;
    }

    this.initialized = this._initialize().then((error) =>
      error === undefined ? ok(undefined) : err(error)
    );
    return this.initialized;
  }

  private async _initialize(): Promise<StoreInitializeError | undefined> {
    logger.debug("store initialize", { fullPath: this.directory.fullPath });

    const exists = await this.directory.exists();
    if (!exists.success) {
      switch (exists.error.kind) {
        case "IO_ERROR": {
          return exists.error;
        }
        case "FILE_EXISTS": {
          return {
            kind: "NOT_A_DIRECTORY",
            path: this.directory.fullPath,
          };
        }
      }
    }

    return;
  }
}

export type StoreInitializeError = { kind: "IO_ERROR"; message: string } | {
  kind: "NOT_A_DIRECTORY";
  path: string;
};
