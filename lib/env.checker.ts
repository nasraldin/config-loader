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
 * Check current environment is development.
 *
 * @returns {boolean}: true if development, else false.
 */
export const IS_DEV = process.env.NODE_ENV === ENV.Development;

/**
 * Check current environment is production.
 *
 * @returns {boolean}: true if production, else false.
 */
export const IS_PROD = process.env.NODE_ENV === ENV.Production;

/**
 * Check current environment is test.
 *
 * @returns {boolean}: true if test, else false.
 */
export const IS_TEST = process.env.NODE_ENV === ENV.Test;

/**
 * Check current environment is staging.
 *
 * @returns {boolean}: true if staging, else false.
 */
export const IS_STAGE = process.env.NODE_ENV === ENV.Staging;

/**
 * Check current environment is uat (User Acceptance Testing).
 *
 * @returns {boolean}: true if staging, else false.
 */
export const IS_UAT = process.env.NODE_ENV === ENV.UAT;

/**
 * Check if app is running on a NodeJS server.
 * @returns {boolean} true if running on the server (NodeJS).
 */
export const IS_SERVER = typeof window === 'undefined';

/**
 * Check if app is running in the Browser.
 * @returns {boolean} true if accessible from the Browser, else false.
 */
export const IS_BROWSER =
  typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Check if the current execution is happening on the server during SSR like in Next.js etc..
 *
 * @returns {boolean}: true if server-side rendering, else false.
 */
export const isSSR = (): boolean => typeof window === 'undefined';

/**
 * Check if the current execution is happening on the client during CSR like in Next.js etc..
 *
 * @returns {boolean}: true if client-side rendering, else false.
 */
export const isCSR = (): boolean => typeof window !== 'undefined';

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
  return typeof process.env[key] !== 'undefined' && process.env[key] !== '';
};

/**
 * Check if the memory usage is above a certain threshold.
 * This uses the `performance.memory` API, which is available only in certain browsers (e.g., Chrome).
 */
export const checkMemoryUsage = () => {
  if (typeof window !== 'undefined' && window.performance) {
    // Check if memory property is available in the browser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const performanceMemory = (window.performance as any).memory;
    if (performanceMemory) {
      const { usedJSHeapSize, totalJSHeapSize } = performanceMemory;
      if (usedJSHeapSize > totalJSHeapSize * 0.8) {
        // eslint-disable-next-line no-console
        console.warn('🚨 Memory usage is high! Please monitor performance.');
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn('🚫 Memory API is not supported in this browser.');
    }
  }
};
