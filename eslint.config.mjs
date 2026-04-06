import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextConfig = require("eslint-config-next");

export default [
  ...nextConfig,
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/public/**",
      "**/*.stories.tsx",
      "src/e2e/**",
      "reports/**",
      "dist/**"
    ]
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "storybook/no-renderer-packages": "off",
      "no-restricted-syntax": [
        "error",
        {
          "selector": "Literal[value=/rounded-3xl/]",
          "message": "Use 'rounded-2xl' instead of 'rounded-3xl' for global style unification (20px standard)."
        }
      ]
    }
  }
];
