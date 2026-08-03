import type { Config } from 'tailwindcss';

const contraColors = {
  ink: '#0A0A0B',
  paper: '#FAFAF9',
  gray: {
    50: '#FAFAF9',
    100: '#EEEEF0',
    200: '#DDDDE0',
    300: '#C0C0C6',
    400: '#9B9BA2',
    500: '#77777E',
    600: '#5A5A62',
    700: '#42424A',
    800: '#2F2F34',
    900: '#212125',
    950: '#161619',
  },
  success: '#157F4F',
  error: '#C8322B',
  warning: '#9A6700',
  info: '#315C9E',
  emerald: {
    50: '#F0F8F4',
    100: '#DCEFE5',
    200: '#B9DDC9',
    600: '#157F4F',
    700: '#157F4F',
    800: '#116640',
    900: '#0D4D31',
  },
  red: {
    50: '#FDF2F1',
    100: '#F9DEDC',
    200: '#F1BCB8',
    500: '#C8322B',
    600: '#C8322B',
    700: '#C8322B',
    800: '#A62924',
    900: '#7E201B',
  },
  amber: {
    50: '#FBF7EB',
    100: '#F3E9C9',
    200: '#E7D38E',
    600: '#9A6700',
    700: '#9A6700',
    800: '#785000',
  },
};

export default {
  content: [
    './app/**/*.{ts,tsx}',
    // ⬇️ THE KEY LINE. Tailwind does not scan node_modules by default, so the
    // component package must be listed explicitly or its classes won't generate.
    // The boss's SaaS needs the equivalent path to its own node_modules copy:
    //   './node_modules/@contra/tools-kit/src/**/*.{ts,tsx}'
    '../../packages/tools-kit/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: contraColors,
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '12px',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bangla: ['var(--font-hind-siliguri)', '"Hind Siliguri"', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
