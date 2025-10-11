export const toCase = (string: string, mode: "camel" | "kebab" = "camel") => {
  if (mode === "camel") return string;

  return string.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    (match, offset) => (offset ? "-" : "") + match.toLowerCase()
  );
};
