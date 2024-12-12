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
import { JSONSchemaType } from 'ajv';

import { Environment } from './env.checker';

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
  [K in string]?:
    | ConfigValue
    | ConfigArray
    | {
        [K in string]?: ConfigValue | ConfigArray | ConfigObject;
      };
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
export declare enum ConfigErrorCode {
  INVALID_SCHEMA = 'INVALID_SCHEMA',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MERGE_ERROR = 'MERGE_ERROR',
}
/**
 * Custom error class for configuration-related errors
 * @class ConfigurationError
 * @extends Error
 */
export declare class ConfigurationError extends Error {
  readonly code: ConfigErrorCode;
  readonly errors?: unknown | undefined;
  /**
   * @param message - Error message
   * @param errors - Additional error details
   */
  constructor(message: string, code: ConfigErrorCode, errors?: unknown | undefined);
}
/**
 * Type-safe configuration loader
 */
export declare class ConfigLoader<T extends ConfigObject> {
  private readonly options;
  private readonly ajv;
  constructor(options: ConfigLoaderOptions<T>);
  /**
   * Loads and validates configuration
   * @returns Promise resolving to the loaded and validated configuration
   * @throws ConfigurationError if loading or validation fails
   */
  load(): Promise<Config<T>>;
  /**
   * Reads and parses a JSON configuration file
   * @param filePath - Path to the JSON file
   * @returns Promise resolving to the parsed configuration
   * @throws ConfigurationError if file reading or parsing fails
   */
  private loadFile;
  /**
   * Deep merges two configuration objects
   * @param target - Target configuration object
   * @param source - Source configuration object to merge
   * @returns Merged configuration object
   */
  private mergeConfigs;
  /**
   * Type guard for config objects
   */
  private isConfigObject;
  /**
   * Loads all JSON configuration files from a directory
   * @param dirPath - Directory path containing configuration files
   * @returns Promise resolving to merged configuration from all files
   * @throws ConfigurationError if directory reading fails
   */
  private loadConfigFiles;
  /**
   * Loads and merges configuration files
   */
  private loadAndMergeConfigs;
  /**
   * Validates configuration against schema
   */
  private validateConfig;
}
/**
 * Helper function to create a config loader with default options
 */
export declare function loadConfig<T extends ConfigObject>(
  schema: JSONSchemaType<T>,
  options?: Partial<ConfigLoaderOptions<T>>,
): ConfigLoader<T>;
/**
 * Clears the configuration cache
 */
export declare function clearConfigCache(): void;
