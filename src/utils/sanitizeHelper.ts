/**
 * Sanitization utilities for preventing XSS and other security issues
 */

/**
 * Sanitizes HTML input to prevent XSS attacks
 * @param input The HTML string to sanitize
 * @returns A sanitized HTML string
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/[^\x20-\x7E]/g, ''); // Keep only printable ASCII characters
};

/**
 * Sanitizes form field names to be safe for use in forms
 * @param str The string to sanitize
 * @returns A sanitized string safe for use as a form field name
 */
export const sanitizeFieldName = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[^a-zA-Z]/, 'field_')
    .substring(0, 50);
};

/**
 * Validates and sanitizes data attribute values
 * @param value The value to sanitize
 * @returns A sanitized value safe for use in data attributes
 */
export const sanitizeDataAttribute = (value: unknown): string => {
  if (value === null || value === undefined) return '';

  const str = String(value);
  // Data attributes should not contain quotes or control characters
  return str
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/[^\x20-\x7E]/g, ''); // Keep only printable ASCII characters
};

/**
 * Creates a safe component key from any string
 * @param str The string to convert to a safe key
 * @param prefix Optional prefix for the key
 * @returns A safe key for React components
 */
export const createSafeKey = (str: string, prefix = 'item'): string => {
  if (!str) return `${prefix}_${Date.now()}`;

  return `${prefix}_${str
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 30)}_${Date.now()}`;
};

/**
 * Removes BOM (Byte Order Mark) and other problematic Unicode characters
 * @param str The string to clean
 * @returns A cleaned string
 */
export const removeBOM = (str: string): string => {
  if (!str) return '';

  // Remove BOM and other problematic Unicode characters
  return str
    .replace(/^\uFEFF/, '') // Remove BOM
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
    .replace(/[^\x20-\x7E]/g, ''); // Keep only printable ASCII characters
};

/**
 * Validates if a string is safe for use in HTML attributes
 * @param str The string to validate
 * @returns true if the string is safe, false otherwise
 */
export const isValidAttributeValue = (str: string): boolean => {
  if (!str) return true;

  // Check for problematic characters (non-printable ASCII)
  const problemChars = /[^\x20-\x7E]/;
  return !problemChars.test(str);
};

/**
 * Sanitizes user input recursively
 * @param input The input to sanitize
 * @returns Sanitized input
 */
export const sanitizeUserInput = (input: unknown): unknown => {
  if (input === null || input === undefined) return input;

  if (typeof input === 'string') {
    return sanitizeHtml(input);
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput);
  }

  if (typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      const safeKey = sanitizeFieldName(key);
      result[safeKey] = sanitizeUserInput(value);
    }
    return result;
  }

  return input;
};

/**
 * Sanitizes element IDs to be valid HTML IDs
 * @param str The string to sanitize
 * @returns A sanitized string safe for use as an element ID
 */
export const sanitizeElementId = (str: string): string => {
  if (!str) return '';

  // Remove or replace invalid characters for HTML IDs
  // HTML IDs must start with a letter and can only contain letters, digits, hyphens, and underscores
  return str
    .replace(/[^a-zA-Z0-9\-_]/g, '_') // Replace invalid chars with underscore
    .replace(/^[^a-zA-Z]/, 'id_') // Ensure it starts with a letter
    .substring(0, 50); // Limit length
};

/**
 * Sanitizes CSS class names
 * @param str The string to sanitize
 * @returns A sanitized string safe for use as a CSS class name
 */
export const sanitizeClassName = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .replace(/^[^a-zA-Z]/, 'class_')
    .substring(0, 50);
};

/**
 * Sanitizes text content for safe display
 * @param str The string to sanitize
 * @returns A sanitized string safe for use as text content
 */
export const sanitizeTextContent = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/[^\x20-\x7E\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]/g, '') // Keep printable characters
    .substring(0, 1000); // Limit length
};

// Default export with all functions
export default {
  sanitizeHtml,
  sanitizeElementId,
  sanitizeClassName,
  sanitizeTextContent,
  sanitizeFieldName,
  sanitizeDataAttribute,
  createSafeKey,
  removeBOM,
  isValidAttributeValue,
  sanitizeUserInput
};
