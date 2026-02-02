import { api } from '../services/api';
import { Layers, Github, ArrowRight } from 'lucide-react';

/**
 * Login Page - Ultimate Cyber-Industrial Design
 */
export default function Login() {
    const handleLogin = () => {
        api.login();
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#030303] text-white selection:bg-white/20">

            {/* Ambient Lighting - Subtle & Deep */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top Spotlight */}
                <div className="absolute -top-[20%] left-[20%] w-[60%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
                {/* Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-700">

                <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/5 rounded-xl p-8 shadow-2xl flex flex-col items-center text-center hover:border-white/10 transition-colors duration-500">

                    {/* Logo - Minimalist */}
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center mb-6 shadow-lg shadow-black/50">
                        <Layers size={20} className="text-white" strokeWidth={1.5} />
                    </div>

                    {/* Branding - Sharp & Industrial */}
                    <h1 className="text-2xl font-semibold tracking-tight mb-2 text-white">
                        WhyStack
                    </h1>
                    <p className="text-[#71717a] text-xs font-medium mb-8 max-w-[240px] leading-relaxed">
                        Capture the context. Document the decision.<br />
                        Build with clarity.
                    </p>

                    {/* Divider */}
                    <div className="w-full flex items-center gap-4 mb-8">
                        <div className="h-px bg-white/5 flex-1" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#52525b] font-medium">Authentication</span>
                        <div className="h-px bg-white/5 flex-1" />
                    </div>

                    {/* Action Button - High End Tactile */}
                    <button
                        onClick={handleLogin}
                        className="group w-full relative overflow-hidden rounded-lg bg-white text-black font-medium py-3 px-4 transition-all duration-200 hover:bg-[#fafafa] hover:scale-[1.01] hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] active:scale-[0.99]"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            <Github size={18} />
                            <span className="text-sm tracking-wide">Connect with GitHub</span>
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                        </div>
                    </button>

                    {/* System Status Footer */}
                    <div className="mt-8 flex items-center gap-2 text-[10px] text-[#3f3f46] font-mono tracking-wider uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-0.5 h-0.5 rounded-full bg-emerald-500" />
                        </div>
                        v0.1.0 • System Operational
                    </div>
                </div>
            </div>
        </div>
    );
}
