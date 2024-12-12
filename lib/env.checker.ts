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
 * if (isDev) {
 *   console.log('Running in development mode');
 * }
 *
 * // Check if running on server
 * if (isServer) {
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
export const ENV = {
  /** Where developers do their daily work */
  Development: 'development',
  /** The live environment where the application serves real users */
  Production: 'production',
  /** Used for automated tests and QA activities */
  Test: 'test',
  /** Mirrors production as closely as possible */
  Staging: 'staging',
  /** Where clients/stakeholders test new features */
  UAT: 'uat',
} as const;

/**
 * Check if code is running in a browser environment.
 * @returns {boolean} true if browser, otherwise false.
 */
export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Check if code is running on the server.
 * @returns {boolean} true if server, otherwise false.
 */
export const isServer = !isBrowser;

/**
 * Check current environment is development.
 *
 * @returns {boolean}: true if development, else false.
 */
export const isDev =
  (typeof process !== 'undefined' && process.env?.NODE_ENV === ENV.Development) ||
  (isBrowser && window.location?.hostname === 'localhost');

/**
 * Check current environment is production.
 *
 * @returns {boolean}: true if production, else false.
 */
export const isProd = process.env.NODE_ENV === ENV.Production;

/**
 * Check current environment is test.
 *
 * @returns {boolean}: true if test, else false.
 */
export const isTest = process.env.NODE_ENV === ENV.Test;

/**
 * Check current environment is staging.
 *
 * @returns {boolean}: true if staging, else false.
 */
export const isStage = process.env.NODE_ENV === ENV.Staging;

/**
 * Check current environment is uat (User Acceptance Testing).
 *
 * @returns {boolean}: true if uat, else false.
 */
export const isUat = process.env.NODE_ENV === ENV.UAT;

/**
 * Check if the current execution is happening on the server during SSR.
 *
 * @returns {boolean}: true if server-side rendering, else false.
 */
export const isSSR = (): boolean => {
  return typeof window === 'undefined' || typeof document === 'undefined';
};

/**
 * Check if the current execution is happening on the client during CSR.
 *
 * @returns {boolean}: true if client-side rendering, else false.
 */
export const isCSR = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * Check if a specific environment variable is defined.
 *
 * @example
 * isEnvVarDefined('API_URL');
 *
 * @param {string} key The environment variable name.
 * @returns {boolean}: true if the environment variable is defined, else false.
 */
export const isEnvVarDefined = (key: string): boolean => {
  if (!key) return false;
  return (
    typeof process !== 'undefined' &&
    typeof process.env[key] !== 'undefined' &&
    process.env[key] !== ''
  );
};
