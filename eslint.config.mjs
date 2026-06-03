import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".tools/**",
      ".tmp/**",
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "out/**",
      "vietnamese to china travel/**",
      "cloudflare-serverless-site/worker-configuration.d.ts"
    ]
  }
];

export default eslintConfig;
