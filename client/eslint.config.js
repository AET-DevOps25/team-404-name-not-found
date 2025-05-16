import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                browser: true,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "react-x": reactX,
            "react-dom": reactDom,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            ...reactX.configs["recommended-typescript"].rules,
            ...reactDom.configs.recommended.rules,
        },
    },
    prettier // disable ESLint formatting rules so Prettier can take over
);
