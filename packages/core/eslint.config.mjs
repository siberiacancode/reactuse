import { eslint } from "@siberiacancode/eslint";

export default eslint(
  {
    typescript: true,
    javascript: true,
    react: true,
    jsx: true,
    vue: true,
  },
  {
    name: "siberiacancode/core/ignores",
    ignores: ["**/bundle/**/*.js"],
  },
  {
    name: "siberiacancode/core/hooks",
    files: ["**/hooks/**/*.ts"],
    rules: {
      "jsdoc/no-defaults": "off",
      "react-hooks/rules-of-hooks": "warn",
    },
  },
  {
    name: "siberiacancode/core/demo",
    files: ["**/*.demo.tsx"],
    rules: {
      "no-alert": "off",
    },
  }
);
