export interface Environments {
  development: string;
  production: string;
}

export interface EnvConfig {
  APP_ENV: Environments;
  SUPABASE_URL: Environments;
  SUPABASE_JWT_SECRET: Environments;
  SUPABASE_ANON_KEY: Environments;
  AWS_API_GATEWAY_URL: Environments;
  GOOGLE_PLACES_API_KEY: Environments;
  SENTRY_DSN: Environments;
  OPENAI_API_KEY: Environments;
}
