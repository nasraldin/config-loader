import { isBoolean } from '../lib/utils';

describe('utils/isBoolean', () => {
  test('should return true for boolean true', () => {
    expect(isBoolean(true)).toBe(true);
  });

  test('should return true for boolean false', () => {
    expect(isBoolean(false)).toBe(false);
  });

  test('should return true for string "true"', () => {
    expect(isBoolean('true')).toBe(true);
    expect(isBoolean('TRUE')).toBe(true);
    expect(isBoolean('True')).toBe(true);
  });

  test('should return false for string "false"', () => {
    expect(isBoolean('false')).toBe(false);
    expect(isBoolean('FALSE')).toBe(false);
    expect(isBoolean('False')).toBe(false);
  });

  test('should return false for non-boolean values', () => {
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean('')).toBe(false);
    expect(isBoolean('random')).toBe(false);
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
  });
});
