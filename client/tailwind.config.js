/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090b', // Zinc 950
                card: '#18181b', // Zinc 900
                border: '#27272a', // Zinc 800
                primary: {
                    DEFAULT: '#f472b6', // Pink 400
                    hover: '#f9a8d4', // Pink 300
                    foreground: '#000000'
                },
                secondary: '#27272a', // Zinc 800
                muted: '#71717a', // Zinc 500
                text: '#f4f4f5', // Zinc 100
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
