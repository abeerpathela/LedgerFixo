/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1e3a8a', // Deep Blue
                    light: '#2563eb',
                    dark: '#1e3a8a',
                },
                accent: {
                    DEFAULT: '#10b981', // Emerald Green
                    light: '#34d399',
                    dark: '#059669',
                },
                background: '#f8fafc', // Light gray/white
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [],
}
