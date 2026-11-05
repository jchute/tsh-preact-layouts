import { isEmpty } from "@Utils/isEmpty";

/**
 * Display a value as text, with options for fallback text and formatting.
 *
 * @param {object} props
 * @param {string} [props.className] Extra classes for styling.
 * @param {import("preact").ComponentChildren} [props.fallback] Shown instead when the value is empty.
 * @param {(value: any) => any} [props.format] Transforms the value, only shown when the value is not empty.
 * @param {any} [props.value] What to show.
 */
export const Text = ({ className = "", fallback = "", format, value }) => {
  const content = isEmpty(value) ? fallback : format ? format(value) : value;
  return isEmpty(content) ? null : <span className={className}>{content}</span>;
};
