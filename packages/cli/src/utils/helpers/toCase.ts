import { toKebabCase } from "./toKebabCase";

export const toCase = (string: string, mode: "camel" | "kebab" = "camel") =>
  mode === "camel" ? string : toKebabCase(string);
