import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';

type Config = Record<string, any>;

export interface ConfigLoaderOptions {
  configDir?: string; // Custom path for config directory (default is 'config')
  schema: object; // JSON schema to validate the config against
}

// Helper function to read and parse a JSON file
const loadFile = (filePath: string): any => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading or parsing file: ${filePath}`);
    return {};
  }
};

// Main function to load the configuration
export function loadConfig(options: ConfigLoaderOptions): Config {
  const { configDir = 'config', schema } = options; // Extract options

  const env = process.env.NODE_ENV || 'dev'; // Default to 'dev' if not set

  let config: Config = {};

  // Initialize AJV with the schema passed by the developer
  const ajv = new Ajv();
  ajvFormats(ajv); // Register formats like `uri`, `email`, etc.
  const validate = ajv.compile(schema); // Compile the schema

  // Default config folder, should be part of the project
  const defaultConfigPath = path.join(configDir, 'default');
  const defaultFiles = fs
    .readdirSync(defaultConfigPath)
    .filter((file) => file.endsWith('.json'));
  defaultFiles.forEach((file) => {
    const filePath = path.join(defaultConfigPath, file);
    config = { ...config, ...loadFile(filePath) };
  });

  // Load environment-specific config files (e.g., dev, prod)
  const envConfigPath = path.join(configDir, env);
  const envFiles = fs
    .readdirSync(envConfigPath)
    .filter((file) => file.endsWith('.json'));
  envFiles.forEach((file) => {
    const filePath = path.join(envConfigPath, file);
    config = { ...config, ...loadFile(filePath) };
  });

  // Validate the final config
  const valid = validate(config);
  if (!valid) {
    console.error('Invalid configuration:', validate.errors);
    throw new Error('Invalid configuration');
  }

  return config;
}
