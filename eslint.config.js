// @ts-check
const tseslint = require("typescript-eslint");
const opiBase = require("@opi_pib/eslint-config-base");

module.exports = tseslint.config(
	{
		files: ["**/*.ts"],
		extends: [...opiBase.configs.ts],
		rules: {
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal"],
					pathGroupsExcludedImportTypes: ["builtin"],
					"newlines-between": "always",
				},
			],
			"import/no-extraneous-dependencies": [
				"error",
				{
					devDependencies: ["./e2e/**/*", "**/*.spec.ts", "./playwright.config.ts"],
				},
			],
			"@opi_pib/assertions/assertions-code": ["error", "^[a-z0-9]{8}$"],
			"@opi_pib/assertions/assertions-condition": ["error"],
		},
	},
	{
		files: ["**/*.html"],
		extends: [...opiBase.configs.html],
	}
);
