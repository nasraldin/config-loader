/**
 * @fileoverview Configuration Loader
 * A robust and type-safe configuration loader for Node.js applications with
 * support for environment-specific configs, validation, and caching.
 * Compatible with both Backend and Frontend environments.
 *
 * Features:
 * - Environment-specific configuration management
 * - JSON Schema validation using Ajv
 * - Configuration caching for performance optimization
 * - Deep merging of configuration objects
 * - Async/Promise-based operations
 * - TypeScript support with strict typing
 * - Comprehensive error handling
 *
 * @module config-loader
 * @author Nasr Aldin <ns@nasraldin.com>
 * @copyright 2024 Nasr Aldin
 * @license MIT
 * @version 1.0.0
 *
 * @see {@link https://github.com/nasraldin/quickload|GitHub Repository}
 * @see {@link https://www.npmjs.com/package/quickload|NPM Package}
 */

import fs from 'fs/promises';
import path from 'path';
import Ajv, { JSONSchemaType } from 'ajv';
import ajvFormats from 'ajv-formats';

import { ENV, Environment } from './env.checker';

const defaultConfigDir = 'config';

/**
 * Base configuration interface (optional)
 */
export interface BaseConfig {
  env?: Environment;
  debug?: boolean;
  version?: string;
}

/**
 * Base type for configuration values
 */
export type ConfigValue = string | number | boolean | null | undefined;

/**
 * Type for configuration objects
 */
export type ConfigObject = {
  [key: string]: ConfigValue | ConfigObject | ConfigArray;
};

/**
 * Type for configuration arrays
 */
export type ConfigArray = Array<ConfigValue | ConfigObject>;

/**
 * Makes all properties in T optional recursively
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
    }
  : T;

/**
 * Generic configuration type that makes BaseConfig optional
 * @interface Config
 */
export type Config<T> = T & Partial<BaseConfig>;

/**
 * Configuration loader options
 * @interface ConfigLoaderOptions
 */
export interface ConfigLoaderOptions<T> {
  /** Directory containing configuration files (default: 'config') */
  configDir?: string;
  /** JSON schema for validating the configuration */
  schema: JSONSchemaType<T>;
  /** Enable configuration caching for better performance (default: false) */
  cache?: boolean;
  /** Default environment to use if not specified (default: 'development') */
  defaultEnv?: Environment;
  /** Include base configuration properties (default: false) */
  includeBaseConfig?: boolean;
}

/**
 * Configuration error codes
 */
export enum ConfigErrorCode {
  INVALID_SCHEMA = 'INVALID_SCHEMA',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MERGE_ERROR = 'MERGE_ERROR',
}

interface NodeError extends Error {
  code?: string;
}

/**
 * Custom error class for configuration-related errors
 * @class ConfigurationError
 * @extends Error
 */
class ConfigurationError extends Error {
  /**
   * @param message - Error message
   * @param errors - Additional error details
   */
  constructor(
    message: string,
    public readonly code: ConfigErrorCode,
    public readonly errors?: unknown,
  ) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/** Cache storage for configurations */
const configCache = new Map<string, Config<unknown>>();

/**
 * Type-safe configuration loader
 */
export class ConfigLoader<T extends ConfigObject> {
  private readonly options: Required<ConfigLoaderOptions<T>>;
  private readonly ajv: Ajv;

  constructor(options: ConfigLoaderOptions<T>) {
    this.options = {
      configDir: options.configDir ?? defaultConfigDir,
      schema: options.schema,
      cache: options.cache ?? false,
      defaultEnv: options.defaultEnv ?? ENV.Development,
      includeBaseConfig: options.includeBaseConfig ?? false,
    };

    // Initialize AJV with strict mode
    this.ajv = new Ajv({
      allErrors: true,
      strict: true,
      strictTypes: true,
      strictTuples: true,
    });
    ajvFormats(this.ajv);
  }

  /**
   * Loads and validates configuration
   * @returns Promise resolving to the loaded and validated configuration
   * @throws ConfigurationError if loading or validation fails
   */
  async load(): Promise<Config<T>> {
    const env = (process.env.NODE_ENV as Environment) || this.options.defaultEnv;
    const cacheKey = `${this.options.configDir}-${env}`;

    // Check cache if enabled
    if (this.options.cache && configCache.has(cacheKey)) {
      return configCache.get(cacheKey) as Config<T>;
    }

    try {
      const config = await this.loadAndMergeConfigs(env);
      const validConfig = this.validateConfig(config);

      if (this.options.cache) {
        configCache.set(cacheKey, validConfig);
      }

      return validConfig;
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      throw new ConfigurationError(
        'Failed to load configuration',
        ConfigErrorCode.PARSE_ERROR,
        error,
      );
    }
  }

  /**
   * Reads and parses a JSON configuration file
   * @param filePath - Path to the JSON file
   * @returns Promise resolving to the parsed configuration
   * @throws ConfigurationError if file reading or parsing fails
   */
  private async loadFile(filePath: string): Promise<DeepPartial<T>> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as DeepPartial<T>;
    } catch (err) {
      if (err instanceof Error) {
        throw new ConfigurationError(
          `Error reading or parsing file ${filePath}: ${err.message}`,
          ConfigErrorCode.FILE_NOT_FOUND,
          err,
        );
      }
      throw err;
    }
  }

  /**
   * Deep merges two configuration objects
   * @param target - Target configuration object
   * @param source - Source configuration object to merge
   * @returns Merged configuration object
   */
  private mergeConfigs(
    target: DeepPartial<T>,
    source: DeepPartial<T>,
  ): DeepPartial<T> {
    return Object.entries(source).reduce(
      (merged, [key, sourceValue]) => {
        const targetValue = merged[key as keyof DeepPartial<T>] as unknown;

        // If both target and source values are objects, recursively merge them
        if (this.isConfigObject(sourceValue) && this.isConfigObject(targetValue)) {
          return {
            ...merged,
            [key]: this.mergeConfigs(
              targetValue as DeepPartial<T>,
              sourceValue as DeepPartial<T>,
            ),
          } as DeepPartial<T>;
        }

        // If source value is not undefined, update or add it to the merged config
        if (sourceValue !== undefined) {
          return {
            ...merged,
            [key]: sourceValue,
          } as DeepPartial<T>;
        }

        return merged;
      },
      { ...target }, // Start with a shallow copy of the target
    );
  }

  /**
   * Type guard for config objects
   */
  private isConfigObject(value: unknown): value is ConfigObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Loads all JSON configuration files from a directory
   * @param dirPath - Directory path containing configuration files
   * @returns Promise resolving to merged configuration from all files
   * @throws ConfigurationError if directory reading fails
   */
  private async loadConfigFiles(dirPath: string): Promise<DeepPartial<T>> {
    try {
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter((file) => file.endsWith('.json'));

      const configs = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(dirPath, file);
          return this.loadFile(filePath);
        }),
      );

      return configs.reduce<DeepPartial<T>>(
        (acc, config) => this.mergeConfigs(acc, config),
        {} as DeepPartial<T>,
      );
    } catch (err) {
      if (err instanceof Error && (err as NodeError).code === 'ENOENT') {
        return {} as DeepPartial<T>;
      }
      throw err;
    }
  }

  /**
   * Loads and merges configuration files
   */
  private async loadAndMergeConfigs(env: Environment): Promise<DeepPartial<T>> {
    const [defaultConfig, envConfig] = await Promise.all([
      this.loadConfigFiles(path.join(this.options.configDir, 'default')),
      this.loadConfigFiles(path.join(this.options.configDir, env)),
    ]);

    return this.mergeConfigs(defaultConfig, envConfig);
  }

  /**
   * Validates configuration against schema
   */
  private validateConfig(config: DeepPartial<T>): Config<T> {
    const validate = this.ajv.compile(this.options.schema);

    if (!validate(config)) {
      throw new ConfigurationError(
        'Configuration validation failed',
        ConfigErrorCode.VALIDATION_ERROR,
        validate.errors,
      );
    }

    return config as Config<T>;
  }
}

/**
 * Helper function to create a config loader with default options
 */
export function loadConfig<T extends ConfigObject>(
  schema: JSONSchemaType<T>,
  options: Partial<ConfigLoaderOptions<T>> = {},
): ConfigLoader<T> {
  return new ConfigLoader<T>({
    schema,
    ...options,
  });
}

/**
 * Clears the configuration cache
 */
export function clearConfigCache(): void {
  configCache.clear();
}
