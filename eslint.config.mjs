import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".tools/**", ".tmp/**", "node_modules/**", ".next/**", "out/**"]
  }
];

export default eslintConfig;
