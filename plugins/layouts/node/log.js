/**
 * Formats text to be yellow in the terminal.
 *
 * @param {string} message The text to format.
 * @returns {string} The text in yellow
 */
export const highlight = (message) => `\x1b[33m${message}\x1b[39m`;
