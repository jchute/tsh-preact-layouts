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
    content = format.replace("{value}", () => content);
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
