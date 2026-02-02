import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
    GitCommit,
    GitPullRequest,
    FileText,
    ArrowRight,
    Database,
    Search,
    Users,
    Clock,
    Shield,
    Github,
    Check,
    Layout
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = api.getToken();
        setIsLoggedIn(!!token);
    }, []);

    const handleStart = () => {
        if (isLoggedIn) {
            navigate('/projects');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-[#f5f5f5] font-sans selection:bg-[#f472b6]/30">

            {/* 1. HERO SECTION */}
            <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-start text-left">
                <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-[#f472b6]/10 border border-[#f472b6]/20">
                        <GitCommit className="text-[#f472b6]" size={20} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">WhyStack</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    The missing <span className="text-[#f472b6]">WHY</span><br />
                    behind your pull requests.
                </h1>

                <p className="text-xl text-[#a1a1aa] max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    GitHub tracks code changes. WhyStack preserves the reasoning behind them.
                    Transform pull requests from temporary discussions into permanent architectural decisions.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <button
                        onClick={handleStart}
                        className="px-8 py-4 bg-[#f472b6] hover:bg-[#ec4899] text-white font-semibold rounded text-sm transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:shadow-[0_0_30px_rgba(244,114,182,0.5)]"
                    >
                        {isLoggedIn ? (
                            <>
                                <Layout size={18} />
                                Go to Projects
                                <ArrowRight size={16} className="ml-1" />
                            </>
                        ) : (
                            <>
                                <Github size={18} />
                                Connect GitHub & Start Tracking
                            </>
                        )}
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded text-sm border border-white/10 transition-colors">
                        View Demo
                    </button>
                </div>

                <div className="mt-16 flex items-center gap-4 text-[#52525b] font-mono text-sm animate-in fade-in duration-1000 delay-500">
                    <span>Code Change</span>
                    <ArrowRight size={14} />
                    <span>Pull Request</span>
                    <ArrowRight size={14} />
                    <span className="text-[#f472b6]">Decision Record</span>
                </div>
            </section>

            {/* 2. PROBLEM SECTION */}
            <section className="bg-[#121214] py-24 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">The problem isn’t code.<br />It’s lost context.</h2>
                        <p className="text-[#a1a1aa] leading-relaxed mb-8">
                            Every day, engineering teams make critical architectural decisions inside Pull Requests.
                            Once the PR is merged, that context is buried.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {[
                            "PR discussions disappear into closed tabs.",
                            "Slack debates are lost to scroll history.",
                            "New engineers don't understand why architecture exists.",
                            "Teams repeat the same circular arguments."
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                                <span className="text-lg text-[#d4d4d8]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SOLUTION SECTION */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">WhyStack turns pull requests<br />into decision memory.</h2>
                    <p className="text-[#a1a1aa] text-lg max-w-2xl">
                        We attach a structured "Why" document to every PR, enforcing documentation
                        before merge. It creates a searchable brain for your codebase.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Database, title: "Structured Memory", desc: "No more ad-hoc comments. Decisions are stored as first-class, structured records linked to code." },
                        { icon: Search, title: "Searchable Context", desc: "Find out why a library was chosen or a feature cut in seconds, not hours of digging." },
                        { icon: Users, title: "Human Constraints", desc: "Authored by engineers, for engineers. Captures tradeoffs, risks, and alternatives considered." }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 bg-[#121214] border border-white/5 rounded-lg hover:border-[#f472b6]/30 transition-colors">
                            <feature.icon className="text-[#f472b6] mb-6" size={32} />
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-[#a1a1aa] leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="bg-[#121214] py-24 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <h3 className="text-xs font-bold text-[#f472b6] uppercase tracking-widest mb-12">Workflow</h3>
                    <div className="space-y-12">
                        {[
                            { step: "01", title: "Connect GitHub", desc: "Single-click integration to sync your private or public repositories." },
                            { step: "02", title: "Open Pull Request", desc: "WhyStack detects new PRs and creates a pending decision record." },
                            { step: "03", title: "Document the Decision", desc: "The author fills out the 'Why', 'Alternatives', and 'Tradeoffs'." },
                            { step: "04", title: "Permanent Archive", desc: "The record is frozen and indexed alongside the merged code." }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-8 items-start group">
                                <span className="text-2xl font-mono text-[#52525b] group-hover:text-[#f472b6] transition-colors">{step.step}</span>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                                    <p className="text-[#a1a1aa]">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. PRODUCT PREVIEW */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Built for clarity.</h2>
                    <p className="text-[#a1a1aa]">No marketing fluff. Just your projects and their decisions.</p>
                </div>

                {/* UI Mockup Block */}
                <div className="bg-[#18181b] border border-white/10 rounded-lg overflow-hidden shadow-2xl max-w-4xl mx-auto">
                    {/* Mock Window Header */}
                    <div className="bg-[#27272a] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                            <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                        </div>
                        <div className="ml-4 px-3 py-1 bg-[#18181b] rounded text-xs text-[#a1a1aa] font-mono flex-1 text-center">whystack.bitbros.in/projects/core-api</div>
                    </div>

                    {/* Mock Content */}
                    <div className="p-8 grid md:grid-cols-4 gap-8">
                        <div className="col-span-1 space-y-4">
                            <div className="h-4 w-24 bg-white/10 rounded" />
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-white/5 rounded" />
                                <div className="h-2 w-3/4 bg-white/5 rounded" />
                                <div className="h-2 w-5/6 bg-white/5 rounded" />
                            </div>
                        </div>
                        <div className="col-span-3 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex gap-2 items-center mb-2">
                                        <span className="text-[#fbbf24] text-xs font-mono border border-[#fbbf24]/20 px-1 rounded">PENDING</span>
                                        <span className="text-[#a1a1aa] text-xs font-mono">PR #1024</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Migrate Auth Service to PostgreSQL</h3>
                                </div>
                            </div>
                            <div className="p-4 bg-[#09090b] border border-white/10 rounded">
                                <h4 className="text-xs text-[#52525b] uppercase font-bold mb-2">The Why</h4>
                                <p className="text-sm text-[#d4d4d8] leading-relaxed">
                                    Redis was causing data persistence issues during high-load restarts.
                                    Moving to Postgres ensures ACID compliance for user sessions while maintaining acceptable latency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. WHO IT'S FOR */}
            <section className="bg-[#121214] py-24 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Who needs WhyStack?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            "Engineering Leadership",
                            "Open Source Maintainers",
                            "Scaling Startups",
                            "Legacy Codebase Owners"
                        ].map((tag, i) => (
                            <span key={i} className="px-6 py-3 bg-[#09090b] border border-white/10 rounded text-[#d4d4d8] font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. COMPARISON */}
            <section className="max-w-4xl mx-auto px-6 py-24">
                <h2 className="text-3xl font-bold mb-8">Why not just use PR descriptions?</h2>
                <div className="space-y-6">
                    <div className="p-6 bg-[#18181b] rounded border border-white/5 flex gap-4">
                        <div className="mt-1"><Clock className="text-[#f87171]" size={20} /></div>
                        <div>
                            <h4 className="font-bold text-white">PRs are temporal</h4>
                            <p className="text-[#a1a1aa] text-sm mt-1">They are designed to be merged and forgotten. Searching closed PRs is a friction-heavy process.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-[#18181b] rounded border border-white/5 flex gap-4">
                        <div className="mt-1"><FileText className="text-[#f87171]" size={20} /></div>
                        <div>
                            <h4 className="font-bold text-white">Docs go stale</h4>
                            <p className="text-[#a1a1aa] text-sm mt-1">External documentation (Notion/Confluence) drifts away from the actual code implementation.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-[#09090b] rounded border border-[#f472b6]/30 flex gap-4 shadow-[0_0_20px_rgba(244,114,182,0.05)]">
                        <div className="mt-1"><Check className="text-[#f472b6]" size={20} /></div>
                        <div>
                            <h4 className="font-bold text-white">WhyStack is linked</h4>
                            <p className="text-[#a1a1aa] text-sm mt-1">Decisions are tightly coupled to the specific code change event, preserving exact context forever.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. TRUST / OPEN SOURCE */}
            <section className="bg-[#121214] py-16 border-y border-white/5 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <Shield className="mx-auto text-[#52525b] mb-4" size={32} />
                    <h3 className="text-lg font-bold text-white mb-2">Developer First & Open</h3>
                    <p className="text-[#a1a1aa] max-w-lg mx-auto text-sm">
                        WhyStack is built by developers for developers. We don't lock you in.
                        Export your decision data to JSON/Markdown at any time.
                    </p>
                </div>
            </section>

            {/* 9. FINAL CTA */}
            <section className="py-32 px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Never lose the <span className="text-[#f472b6]">WHY</span><br />behind your code again.</h2>
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleStart}
                        className="px-10 py-5 bg-[#f472b6] hover:bg-[#ec4899] text-white font-bold rounded text-lg transition-colors shadow-lg hover:shadow-[#f472b6]/20"
                    >
                        {isLoggedIn ? "Go to Projects" : "Start with GitHub"}
                    </button>
                    <button className="text-[#a1a1aa] hover:text-white text-sm mt-4 underline decoration-white/20 underline-offset-4">
                        View Example Decision Record
                    </button>
                </div>
            </section>

            {/* 10. FOOTER */}
            <footer className="py-12 border-t border-white/5 text-center text-[#52525b] text-sm">
                <div className="flex justify-center gap-8 mb-4">
                    <span className="cursor-pointer hover:text-[#a1a1aa]">Privacy</span>
                    <span className="cursor-pointer hover:text-[#a1a1aa]">Terms</span>
                    <span className="cursor-pointer hover:text-[#a1a1aa]">Docs</span>
                    <span className="cursor-pointer hover:text-[#a1a1aa]">GitHub</span>
                </div>
                <p>&copy; {new Date().getFullYear()} WhyStack. System Operational.</p>
            </footer>

        </div>
    );
}
