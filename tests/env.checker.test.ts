/* eslint-disable @typescript-eslint/no-require-imports */
import { ENV, isCSR, isEnvVarDefined, isSSR } from '../lib/env.checker';

describe('Environment Constants', () => {
  it('should have correct environment values', () => {
    expect(ENV.Development).toBe('development');
    expect(ENV.Production).toBe('production');
    expect(ENV.Test).toBe('test');
    expect(ENV.Staging).toBe('staging');
    expect(ENV.UAT).toBe('uat');
  });
});

describe('Environment Checks', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should detect development environment', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    const { isDev } = require('../lib/env.checker');
    expect(isDev).toBe(true);
  });

  it('should detect production environment', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    const { isProd } = require('../lib/env.checker');
    expect(isProd).toBe(true);
  });

  it('should detect test environment', () => {
    process.env.NODE_ENV = 'test';
    jest.resetModules();
    const { isTest } = require('../lib/env.checker');
    expect(isTest).toBe(true);
  });

  it('should detect staging environment', () => {
    process.env.NODE_ENV = 'staging';
    jest.resetModules();
    const { isStage } = require('../lib/env.checker');
    expect(isStage).toBe(true);
  });

  it('should detect uat environment', () => {
    process.env.NODE_ENV = 'uat';
    jest.resetModules();
    const { isUat } = require('../lib/env.checker');
    expect(isUat).toBe(true);
  });
});

describe('Server and Browser Detection', () => {
  describe('when window is not defined', () => {
    beforeEach(() => {
      // @ts-expect-error - Ensure global.window are deleted
      delete global.window;
      // @ts-expect-error - Ensure global.document are deleted
      delete global.document;
      jest.resetModules();
    });

    it('should detect server environment', () => {
      const { isServer, isBrowser } = require('../lib/env.checker');
      expect(isServer).toBe(true);
      expect(isBrowser).toBe(false);
    });
  });

  describe('when window is defined', () => {
    beforeEach(() => {
      // @ts-expect-error - Mock window for testing
      global.window = {};
      // @ts-expect-error - Mock document for testing
      global.document = {};
      jest.resetModules();
    });

    it('should detect browser environment', () => {
      const { isServer, isBrowser } = require('../lib/env.checker');
      expect(isServer).toBe(false);
      expect(isBrowser).toBe(true);
    });

    // Clean up
    afterEach(() => {
      // @ts-expect-error - Ensure global.window are deleted
      delete global.window;
      // @ts-expect-error - Ensure global.document are deleted
      delete global.document;
    });
  });
});

describe('SSR/CSR Detection', () => {
  beforeEach(() => {
    // Reset modules before each test
    jest.resetModules();
  });

  it('should correctly identify SSR environment', () => {
    // Ensure window is undefined
    // @ts-expect-error - Ensure global.window are deleted
    delete global.window;
    expect(isSSR()).toBe(true);
  });

  it('should correctly identify CSR environment', () => {
    // Mock window and document objects
    // @ts-expect-error - Mock window for testing
    global.window = {};
    // @ts-expect-error - Mock document for testing
    global.document = {};

    expect(isCSR()).toBe(true);

    // Clean up
    // @ts-expect-error - Clean up window mock
    delete global.window;
    // @ts-expect-error - Clean up document mock
    delete global.document;
  });
});

describe('Environment Variable Check', () => {
  it('should return true for defined environment variables', () => {
    process.env.TEST_VAR = 'test';
    expect(isEnvVarDefined('TEST_VAR')).toBe(true);
  });

  it('should return false for undefined environment variables', () => {
    delete process.env.TEST_VAR;
    expect(isEnvVarDefined('TEST_VAR')).toBe(false);
  });

  it('should return false for empty environment variables', () => {
    process.env.TEST_VAR = '';
    expect(isEnvVarDefined('TEST_VAR')).toBe(false);
  });
});
