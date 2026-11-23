import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

// Cores só por tokens (Constitution II, research R-12): bloqueia hex, rgb() e hsl()
// e classes Tailwind com cor arbitrária em className/style.
const CORES_LITERAIS = String.raw`/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|-\[#/`;

const regrasDeCor = [
  {
    selector: `JSXAttribute[name.name=/^(className|style)$/] Literal[value=${CORES_LITERAIS}]`,
    message: "Use tokens semânticos de src/styles/tokens.css em vez de cores literais.",
  },
  {
    selector: `JSXAttribute[name.name=/^(className|style)$/] TemplateElement[value.raw=${CORES_LITERAIS}]`,
    message: "Use tokens semânticos de src/styles/tokens.css em vez de cores literais.",
  },
];

const regraNovaAba = {
  selector: "JSXAttribute[name.name='target'][value.value='_blank']",
  message:
    "Só o checkout (PurchaseCta) abre em nova aba (contrato de rotas §3). Links externos abrem na mesma aba.",
};

const strictRules = Object.assign({}, ...tseslint.configs.strict.map((c) => c.rules ?? {}));

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      ...strictRules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{tsx,jsx}"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "no-restricted-syntax": ["error", ...regrasDeCor, regraNovaAba],
    },
  },
  {
    files: ["src/components/product/PurchaseCta.tsx"],
    rules: {
      "no-restricted-syntax": ["error", ...regrasDeCor],
    },
  },
  globalIgnores([
    ".next/**",
    ".next-*/**",
    ".open-next/**",
    ".wrangler/**",
    ".tmp/**",
    "media-originais/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    ".specify/**",
    ".claude/**",
  ]),
]);
