import denoJson from "../deno.json" with { type: "json" };

class Config {
  readonly version: string;
  constructor() {
    this.version = denoJson["version"];
  }
}

export const config = new Config();
