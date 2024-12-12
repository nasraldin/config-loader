/**
 * @fileoverview Environment checker utility module for detecting and validating runtime environments.
 *
 * This module provides utilities for:
 * - Checking current environment type (development, production, test, staging, UAT)
 * - Detecting server-side vs client-side execution context
 * - Validating environment variables
 * - Determining SSR (Server-Side Rendering) vs CSR (Client-Side Rendering) contexts
 *
 * The module supports various runtime environments and frameworks like Next.js, ensuring
 * proper environment detection in both server and browser contexts.
 *
 * @example
 * // Check current environment
 * if (IS_DEV) {
 *   console.log('Running in development mode');
 * }
 *
 * // Check if running on server
 * if (IS_SERVER) {
 *   console.log('Running on server');
 * }
 *
 * // Validate environment variables
 * if (isEnvVarDefined('API_KEY')) {
 *   console.log('API key is configured');
 * }
 *
 * @module env.checker
 */
/**
 * Supported environment types
 */
export type Environment = 'development' | 'production' | 'test' | 'staging' | 'uat';
/**
 * Supported environment.
 *
 * development | production | test | staging | uat
 */
export declare const ENV: {
  /** Where developers do their daily work */
  readonly Development: 'development';
  /** The live environment where the application serves real users */
  readonly Production: 'production';
  /** Used for automated tests and QA activities */
  readonly Test: 'test';
  /** Mirrors production as closely as possible */
  readonly Staging: 'staging';
  /** Where clients/stakeholders test new features */
  readonly UAT: 'uat';
};
/**
 * Check current environment is development.
 *
 * @returns {boolean}: true if development, else false.
 */
export declare const IS_DEV: boolean;
/**
 * Check current environment is production.
 *
 * @returns {boolean}: true if production, else false.
 */
export declare const IS_PROD: boolean;
/**
 * Check current environment is test.
 *
 * @returns {boolean}: true if test, else false.
 */
export declare const IS_TEST: boolean;
/**
 * Check current environment is staging.
 *
 * @returns {boolean}: true if staging, else false.
 */
export declare const IS_STAGE: boolean;
/**
 * Check current environment is uat (User Acceptance Testing).
 *
 * @returns {boolean}: true if uat, else false.
 */
export declare const IS_UAT: boolean;
/**
 * Check if app is running on a NodeJS server.
 * @returns {boolean} true if running on the server (NodeJS).
 */
export declare const IS_SERVER: boolean;
/**
 * Check if app is running in the Browser.
 * @returns {boolean} true if accessible from the Browser, else false.
 */
export declare const IS_BROWSER: boolean;
/**
 * Check if the current execution is happening on the server during SSR like in Next.js etc..
 *
 * @returns {boolean}: true if server-side rendering, else false.
 */
export declare const isSSR: () => boolean;
/**
 * Check if the current execution is happening on the client during CSR like in Next.js etc..
 *
 * @returns {boolean}: true if client-side rendering, else false.
 */
export declare const isCSR: () => boolean;
/**
 * Check if a specific environment variable is defined.
 *
 * @example
 * isEnvVarDefined('API_URL');
 *
 * @param {string} key The environment variable name.
 * @returns {boolean}: true if the environment variable is defined, else false.
 */
export declare const isEnvVarDefined: (key: string) => boolean;
