import { Github } from 'lucide-react';

export default function Login() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-text relative overflow-hidden">
            {/* Bg Gradient decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 text-center space-y-8 p-6">
                <div className="space-y-4">
                    <h1 className="text-7xl font-bold tracking-tighter text-white drop-shadow-2xl">
                        Why<span className="text-primary">Stack</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-md mx-auto leading-relaxed">
                        Capture the context behind your decisions. <br />
                        Stop wondering "why did we do this?" in 6 months.
                    </p>
                </div>

                {/* Direct link instead of button with onClick */}
                <a
                    href="http://localhost:5000/auth/github"
                    className="inline-flex items-center justify-center gap-3 h-14 px-8 text-lg font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary-hover shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-200"
                >
                    <Github size={24} />
                    Continue with GitHub
                </a>

                <p className="text-xs text-zinc-600">
                    By continuing, you agree to track your decisions responsibly.
                </p>
            </div>
        </div>
    );
}
