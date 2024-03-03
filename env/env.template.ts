// Duplicate this file and rename it to env.ts
// Fill in values
// run `npx ts-node env-generate.ts` in the terminal to generate .env files

import { EnvConfig } from "./env.types";

const config: EnvConfig = {
  /**
   * asdfsdf
   */
  APP_ENV: {
    development: "development",
    production: "production",
  },
  /**
   * Supabase
   */
  SUPABASE_URL: {
    development: "http://127.0.0.1:54321",
    production: "",
  },
  SUPABASE_JWT_SECRET: {
    development: "",
    production: "",
  },
  SUPABASE_ANON_KEY: {
    development: "",
    production: "",
  },
  /**
   * AWS
   */
  AWS_API_GATEWAY_URL: {
    development: "http://127.0.0.1:3000",
    production: "",
  },
  /**
   * Other services
   */
  GOOGLE_PLACES_API_KEY: {
    development: "",
    production: "",
  },
  SENTRY_DSN: {
    development: "",
    production: "",
  },
  OPENAI_API_KEY: {
    development: "",
    production: "",
  },
  /**
   * Non-primary environment variables
   * You may not need to fill these in. They're not for the main app
   */
};

export default config;
