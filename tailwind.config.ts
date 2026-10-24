import type { Config } from 'tailwindcss';
export default {
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                night: '#0b1020',
                panel: '#141e34',
                cyan: '#60e8d3',
                muted: '#a5b4c9'
            }
        }
    },
    plugins: []
} satisfies Config;
