import common from 'eslint-config-mahir/common';
import edge from 'eslint-config-mahir/edge';
import module from 'eslint-config-mahir/module';
import next from 'eslint-config-mahir/next';
import node from 'eslint-config-mahir/node';
import react from 'eslint-config-mahir/react';
import typescript from 'eslint-config-mahir/typescript';
// @ts-expect-error -- tailwind plugin is not typed
import tailwind from 'eslint-plugin-tailwindcss';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
export default [
	...common,
	...node,
	...module,
	...typescript,
	...react,
	...next,
	...edge,
	...tailwind.configs['flat/recommended'],
	{
		settings: {
			tailwindcss: {
				callees: ['classNames', 'clsx', 'cn'],
			},
		},
		rules: {
			'no-console': [
				'error',
				{
					allow: ['error', 'info', 'warn'],
				},
			],
			// handled by react-compiler
			'react/jsx-no-constructed-context-values': 'off',
			'react/jsx-handler-names': 'off',
			'react/no-unstable-nested-components': 'off',
		},
	},
	{
		ignores: ['.next/'],
	},
];
