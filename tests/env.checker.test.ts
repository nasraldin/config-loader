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

  it('should correctly identify development environment', () => {
    process.env.NODE_ENV = 'development';
    // Re-import to get fresh values
    jest.isolateModules(() => {
      const { IS_DEV } = require('../lib/env.checker');
      expect(IS_DEV).toBe(true);
    });
  });

  it('should correctly identify production environment', () => {
    process.env.NODE_ENV = 'production';
    jest.isolateModules(() => {
      const { IS_PROD } = require('../lib/env.checker');
      expect(IS_PROD).toBe(true);
    });
  });

  it('should correctly identify test environment', () => {
    process.env.NODE_ENV = 'test';
    jest.isolateModules(() => {
      const { IS_TEST } = require('../lib/env.checker');
      expect(IS_TEST).toBe(true);
    });
  });

  it('should correctly identify staging environment', () => {
    process.env.NODE_ENV = 'staging';
    jest.isolateModules(() => {
      const { IS_STAGE } = require('../lib/env.checker');
      expect(IS_STAGE).toBe(true);
    });
  });

  it('should correctly identify UAT environment', () => {
    process.env.NODE_ENV = 'uat';
    jest.isolateModules(() => {
      const { IS_UAT } = require('../lib/env.checker');
      expect(IS_UAT).toBe(true);
    });
  });
});

describe('Server/Browser Environment Detection', () => {
  describe('IS_SERVER and IS_BROWSER', () => {
    beforeEach(() => {
      // Reset modules before each test to get fresh values
      jest.resetModules();
    });

    it('should correctly identify server environment', () => {
      // @ts-expect-error - Ensure global.window are undefined
      delete global.window;
      // @ts-expect-error - Ensure global.document are undefined
      delete global.document;

      jest.isolateModules(() => {
        const { IS_SERVER, IS_BROWSER } = require('../lib/env.checker');
        expect(IS_SERVER).toBe(true);
        expect(IS_BROWSER).toBe(false);
      });
    });

    it('should correctly identify browser environment', () => {
      // @ts-expect-error - Ensure global.window are objects
      global.window = {};
      // @ts-expect-error - Ensure global.document are objects
      global.document = {};

      jest.isolateModules(() => {
        const { IS_SERVER, IS_BROWSER } = require('../lib/env.checker');
        expect(IS_SERVER).toBe(false);
        expect(IS_BROWSER).toBe(true);
      });

      // Clean up
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
    // Mock window object
    // @ts-expect-error - Ensure global.window are object
    global.window = {};
    expect(isCSR()).toBe(true);
    // Clean up
    // @ts-expect-error - Ensure global.window are deleted
    delete global.window;
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
