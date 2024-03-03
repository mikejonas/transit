import * as fs from "fs";
import * as path from "path";
import config from "./env";
import type { EnvConfig } from "./env.types";

type ConfigKey = keyof EnvConfig;

interface DirectoryConfig {
  keys: ConfigKey[];
  prefix?: string;
}

const directoryConfigMap: Record<string, DirectoryConfig> = {
  "./supabase/functions/": {
    keys: ["OPENAI_API_KEY", "GOOGLE_PLACES_API_KEY"],
  },
  "./aws-services": {
    keys: [
      "OPENAI_API_KEY",
      "GOOGLE_PLACES_API_KEY",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_JWT_SECRET",
    ],
  },
  "./react-native-app": {
    keys: [], // If empty, all env variables will be used
    prefix: "EXPO_PUBLIC_", // all env variables will be prefixed with this
  },
};

const checkDirectoryExists = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`Directory does not exist: ${directoryPath}`);
  }
};

const generateEnvFilesForDirectory = (
  directoryPath: string,
  config: EnvConfig,
  directoryConfig: DirectoryConfig
) => {
  let envProductionContent = "";
  let envDevelopmentContent = "";

  // Determine the keys to iterate over: if keys array is empty, use all keys from config
  const effectiveKeys =
    directoryConfig.keys.length > 0
      ? directoryConfig.keys
      : (Object.keys(config) as ConfigKey[]);

  effectiveKeys.forEach((key) => {
    const value = config[key];
    if (value) {
      // Prepend the prefix if provided
      const prefixedKey = `${directoryConfig.prefix || ""}${key}`;
      envProductionContent += `${prefixedKey}=${value.production}\n`;
      envDevelopmentContent += `${prefixedKey}=${value.development}\n`;
    }
  });

  // Check if the directory exists before writing files
  checkDirectoryExists(directoryPath);

  fs.writeFileSync(
    path.join(directoryPath, ".env.production"),
    envProductionContent
  );
  fs.writeFileSync(
    path.join(directoryPath, ".env.development"),
    envDevelopmentContent
  );

  console.log(`Generated .env.prod and .env.local files in ${directoryPath}.`);
};

Object.entries(directoryConfigMap).forEach(([dirPath, dirConfig]) => {
  generateEnvFilesForDirectory(dirPath, config, dirConfig);
});

console.log("Completed generating environment files.");
