/**
 * Shows a value as text, with options for what to display when it is missing and how to dress it up.
 *
 * @param {object} props
 * @param {string} [props.className] Extra classes for styling.
 * @param {import("preact").ComponentChildren} [props.fallback] Shown instead when the value is empty.
 * @param {string|((value: any) => any)} [props.format] Either a template where `{value}` is replaced,
 * e.g. "Seed {value}", or a function that transforms the value.
 * @param {boolean} [props.hide] Render nothing at all when the value is empty, ignoring `fallback`.
 * @param {import("preact").ComponentChildren} [props.prefix] Placed before the value, e.g. an icon.
 * @param {import("preact").ComponentChildren} [props.suffix] Placed after the value.
 * @param {any} [props.value] What to show.
 */
export const Text = ({
  className = "",
  fallback = "",
  format,
  hide = false,
  prefix = "",
  suffix = "",
  value,
}) => {
  const empty = value == null || value === "";

  // Do nothing if we are hiding empty value and there is no value
  if (hide && empty) {
    return null;
  }

  // Define the content as the value, or a fallback if there is no value
  let content = empty ? fallback : value;

  // Support formatted strings
  if (typeof format === "string") {
    content = format.replaceAll("{value}", () => content);
  }

  // Support format functions
  else if (typeof format === "function") {
    content = format(content);
  }

  return (
    <span className={className}>
      {prefix}
      {content}
      {suffix}
    </span>
  );
};
