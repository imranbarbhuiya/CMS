// @ts-expect-error - internal import
import { default as flattenColorPalette } from 'tailwindcss/lib/util/flattenColorPalette';
import plugin from 'tailwindcss/plugin';
import animatePlugin from 'tailwindcss-animate';

import type { Config } from 'tailwindcss';

const addVariablesForColors = plugin(({ addBase, theme }) => {
	const colors = theme('colors')!;
	const allColors = flattenColorPalette({
		rose: colors.rose,
		blue: colors.blue,
	});
	const newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

	addBase({
		// @ts-expect-error - CSS variable
		':root': newVars,
	});
});

export default {
	darkMode: ['class'],
	content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	plugins: [addVariablesForColors, animatePlugin],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
				themecolor: {
					50: 'var(--theme-color-50)',
					100: 'var(--theme-color-100)',
					200: 'var(--theme-color-200)',
					300: 'var(--theme-color-300)',
					400: 'var(--theme-color-400)',
					500: 'var(--theme-color-500)',
					600: 'var(--theme-color-600)',
					700: 'var(--theme-color-700)',
					800: 'var(--theme-color-800)',
					900: 'var(--theme-color-900)',
				},
			},
		},
	},
} satisfies Config;
