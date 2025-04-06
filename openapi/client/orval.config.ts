// orval.config.ts
import type { Config } from "orval";

const config: Config = {
  petstore: {
    output: {
      mode: "single", // or 'split'
      target: "src/api-client/hooks.ts",
      schemas: "src/api-client/model",
      client: "swr",
    },
    input: {
      target: "./openapi.yaml", // NestJS swagger json
    },
  },
};

export default config;
