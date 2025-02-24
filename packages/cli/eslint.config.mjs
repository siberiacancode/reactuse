import { eslint } from "@siberiacancode/eslint";

export default eslint(
  {
    typescript: true,
  },
  {
    name: "siberiacancode/cli/rewrite",
    rules: {
      "node/prefer-global/process": "off",
      "node/prefer-global/buffer": "off",
    },
  }
);
