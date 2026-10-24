
import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                night: '#0B1120',
                panel: '#172033',
                cyan: '#60E8D3',
                muted: '#A5B4C9',
                warning: '#FBBF24',
                danger: '#F87171',
                border: '#283A56',
            },
        },
    },
    plugins: [],
};

export default config;