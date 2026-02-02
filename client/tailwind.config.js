/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundColor: {
                primary: 'var(--bg-primary)',
                surface: 'var(--bg-surface)',
                elevated: 'var(--bg-elevated)',
                hover: 'var(--bg-hover)',
            },
            textColor: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)',
                tertiary: 'var(--text-tertiary)',
                brand: 'var(--brand-primary)',
            },
            colors: {
                // Brand Colors
                brand: {
                    DEFAULT: 'var(--brand-primary)',
                    hover: 'var(--brand-primary-hover)',
                    text: 'var(--brand-primary)',
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
