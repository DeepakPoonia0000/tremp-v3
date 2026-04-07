import coreWebVitals from "eslint-config-next/core-web-vitals";

const nextConfigs = Array.isArray(coreWebVitals)
  ? coreWebVitals
  : [coreWebVitals];

const eslintConfig = [
  ...nextConfigs,
  {
    ignores: [".next/**", "node_modules/**", "public/uploads/**"],
  },
];

export default eslintConfig;
