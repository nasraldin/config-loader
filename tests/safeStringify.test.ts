import { safeStringify } from '../lib/utils';

describe('utils/safeStringify', () => {
  it('should stringify regular objects normally', () => {
    const testObj = {
      name: 'test',
      value: 123,
      nested: { foo: 'bar' },
    };

    const result = safeStringify(testObj);
    expect(JSON.parse(result)).toEqual(testObj);
  });

  it('should redact values with SECRET in the key', () => {
    const testObj = {
      API_SECRET: 'sensitive-data',
      MY_SECRET_KEY: 'very-secret',
      normal: 'visible-data',
    };

    const result = JSON.parse(safeStringify(testObj));
    expect(result.API_SECRET).toBe('[REDACTED]');
    expect(result.MY_SECRET_KEY).toBe('[REDACTED]');
    expect(result.normal).toBe('visible-data');
  });

  it('should redact values with PASSWORD in the key', () => {
    const testObj = {
      user: 'nasr',
      PASSWORD: '12345',
      DB_PASSWORD: 'db-pass',
      nested: {
        USER_PASSWORD: 'secret-pass',
      },
    };

    const result = JSON.parse(safeStringify(testObj));
    expect(result.PASSWORD).toBe('[REDACTED]');
    expect(result.DB_PASSWORD).toBe('[REDACTED]');
    expect(result.nested.USER_PASSWORD).toBe('[REDACTED]');
    expect(result.user).toBe('nasr');
  });

  it('should handle null and undefined values', () => {
    const testObj = {
      nullValue: null,
      undefinedValue: undefined,
      API_SECRET: 'secret',
    };

    const result = JSON.parse(safeStringify(testObj));
    expect(result.nullValue).toBeNull();
    expect('undefinedValue' in result).toBeFalsy();
    expect(result.API_SECRET).toBe('[REDACTED]');
  });

  it('should redact custom word when provided', () => {
    const input = {
      username: 'nasr',
      API_KEY: 'xyz789',
    };
    const expected = {
      username: 'nasr',
      API_KEY: '[REDACTED]',
    };
    expect(JSON.parse(safeStringify(input, 'KEY'))).toEqual(expected);
  });

  it('should throw error for invalid redactedWord', () => {
    expect(() => safeStringify({}, '')).toThrow(
      'redactedWord must be a non-empty string',
    );
    expect(() => safeStringify({}, ' ')).toThrow(
      'redactedWord must be a non-empty string',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => safeStringify({}, null as any)).toThrow(
      'redactedWord must be a non-empty string',
    );
  });
});
