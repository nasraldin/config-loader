/**
 * Checks if a value is a boolean or a string representation of a boolean.
 *
 * This function is particularly useful for checking environment variables
 * which are often stored as strings.
 *
 * @param value - The value to check. Can be of any type.
 * @returns true if the value is boolean true or the string 'true' (case-insensitive),
 *          false for all other inputs.
 *
 * @example
 * console.log(isBoolean(true));           // Output: true
 * console.log(isBoolean('true'));         // Output: true
 * console.log(isBoolean('TRUE'));         // Output: true
 * console.log(isBoolean('True'));         // Output: true
 * console.log(isBoolean(false));          // Output: false
 * console.log(isBoolean('false'));        // Output: false
 * console.log(isBoolean(''));             // Output: false
 * console.log(isBoolean('hello'));        // Output: false
 * console.log(isBoolean(1));              // Output: false
 * console.log(isBoolean(null));           // Output: false
 * console.log(isBoolean(undefined));      // Output: false
 */
export declare const isBoolean: (value: unknown) => boolean;
/**
 * Safely converts an object to a JSON string while automatically redacting sensitive information.
 *
 * Helper function to safely stringify environment values.
 *
 * @param obj - The value to convert to a JSON string. Can be any JSON-serializable value.
 * @param redactedWord - Optional additional word to trigger redaction. Must be a non-empty string.
 * @returns A formatted JSON string with sensitive data redacted.
 * @throws {Error} If redactedWord is provided but is not a valid non-empty string.
 *
 * @example
 * // Basic usage
 * const data = {
 *   username: "nasr",
 *   PASSWORD: "secret123",
 *   API_KEY: "abc123"
 * };
 *
 * console.log(safeStringify(data));
 * // Output:
 * // {
 * //   "username": "nasr",
 * //   "PASSWORD": "[REDACTED]",
 * //   "API_KEY": "abc123"
 * // }
 *
 * // With custom redaction word
 * console.log(safeStringify(data, "KEY"));
 * // Output:
 * // {
 * //   "username": "nasr",
 * //   "PASSWORD": "[REDACTED]",
 * //   "API_KEY": "[REDACTED]"
 * // }
 *
 * @remarks
 * - Uses JSON.stringify with a replacer function to process the object
 * - Always redacts properties containing 'SECRET' or 'PASSWORD' (case-sensitive)
 * - Optionally redacts properties containing the specified redactedWord
 * - The output is formatted with 2-space indentation for readability
 * - Safe to use with circular references (will throw TypeError like standard JSON.stringify)
 */
export declare function safeStringify(obj: unknown, redactedWord?: string): string;
/**
 * Check if the memory usage is above a certain threshold.
 * This uses the `performance.memory` API, which is available only in certain browsers (e.g., Chrome).
 */
export declare const checkMemoryUsage: () => void;
