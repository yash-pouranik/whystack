import { api } from '../services/api';

/**
 * Login Page - Professional design
 * 
 * Design:
 * - Centered card on black background
 * - WhyStack logo (blue)
 * - GitHub icon in button
 * - Clean typography
 */
export default function Login() {
    const handleLogin = () => {
        api.login();
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            {/* Login Card */}
            <div className="w-full max-w-md surface-elevated border border-subtle rounded-xl p-8 shadow-2xl">
                <div className="text-center space-y-8">
                    {/* Logo & Header */}
                    <div className="space-y-2">
                        <h1 className="brand-text text-4xl mb-2">
                            WhyStack
                        </h1>
                        <h2 className="text-xl text-primary font-medium">
                            Welcome back
                        </h2>
                        <p className="text-secondary text-sm">
                            Document the reasoning behind your code changes
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-subtle"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-elevated text-tertiary">Sign in to continue</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleLogin}
                        className="w-full btn-primary py-3 flex items-center justify-center gap-3 group transition-all"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        <span>Continue with GitHub</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-tertiary text-xs">
                &copy; {new Date().getFullYear()} WhyStack. Built for developers.
            </div>
        </div>
    );
}
