/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds (mapping bg-primary to the dark background, NOT brand color)
                primary: 'var(--bg-primary)',
                surface: 'var(--bg-surface)',
                elevated: 'var(--bg-elevated)',
                hover: 'var(--bg-hover)',

                // Brand Colors (Blue)
                brand: {
                    DEFAULT: 'var(--brand-primary)', // This is the blue
                    hover: 'var(--brand-primary-hover)',
                    text: 'var(--brand-primary)',
                },

                // Text
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    tertiary: 'var(--text-tertiary)',
                },

                // Borders
                border: {
                    DEFAULT: 'var(--border-default)',
                    subtle: 'var(--border-subtle)',
                },

                // Status
                status: {
                    pending: 'var(--status-pending)',
                    documented: 'var(--status-documented)',
                    risk: 'var(--status-risk)',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
