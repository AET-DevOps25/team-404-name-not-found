import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import jsoncParser from "jsonc-eslint-parser";

import css from "@eslint/css";
import { tailwindSyntax } from "@eslint/css/syntax";

export default defineConfig([
    tseslint.config(
        { ignores: ["dist", "node_modules"] },

        // TypeScript + React
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
                prettier: eslintPluginPrettier,
            },
            rules: {
                ...reactHooks.configs.recommended.rules,
                "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
                ...reactX.configs["recommended-typescript"].rules,
                ...reactDom.configs.recommended.rules,
                "prettier/prettier": "error",
            },
        },

        // JavaScript
        {
            files: ["**/*.js"],
            languageOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
            plugins: {
                prettier: eslintPluginPrettier,
            },
            rules: {
                "prettier/prettier": "error",
            },
        },

        // CSS with Tailwind syntax
        {
            files: ["**/*.css"],
            plugins: {
                css,
                prettier: eslintPluginPrettier,
            },
            language: "css/css",
            languageOptions: {
                customSyntax: tailwindSyntax,
            },
            rules: {
                "prettier/prettier": "error",
                "css/no-empty-blocks": "error",
            },
        },

        // Prettier-only: json/yml
        {
            files: ["**/*.{json,yml,yaml}"],
            languageOptions: {
                parser: jsoncParser, // To support json with comments (jsonc)
            },
            plugins: {
                prettier: eslintPluginPrettier,
            },
            rules: {
                "prettier/prettier": "error",
            },
        },

        // Prettier-only: md
        {
            files: ["**/*.{md}"],
            plugins: {
                prettier: eslintPluginPrettier,
            },
            rules: {
                "prettier/prettier": "error",
            },
        }
    ),

    prettier,
]);
