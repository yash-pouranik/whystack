import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ThreeColumnLayout from '../components/ThreeColumnLayout';
import PRListItem from '../components/PRListItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { FileText, GitBranch, Calendar, User, Target, Brain, Scale, Sparkles, Save, Check, Clock, Link as LinkIcon } from 'lucide-react';

/**
 * ProjectView - The "GitBook" container
 *
 * Manages the state for:
 * 1. PR List (Left)
 * 2. Active Selection (Center - DecisionView/Editor)
 * 3. Metadata (Right)
 */
export default function ProjectView() {
    const { projectId, prId } = useParams(); // Need to update routes to support this params structure
    const navigate = useNavigate();

    const [prs, setPRs] = useState([]);
    const [activePR, setActivePR] = useState(null);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        loadProjectData();
    }, [projectId]);

    // Handle Selection from URL or Default
    useEffect(() => {
        if (prs.length > 0) {
            if (prId) {
                const found = prs.find(p => p._id === prId);
                if (found) setActivePR(found);
            } else {
                // Optional: Select first by default or show "Select a PR" empty state
                // navigate(`/projects/${projectId}/prs/${prs[0]._id}`, { replace: true });
            }
        }
    }, [prId, prs]);

    const loadProjectData = async () => {
        setLoading(true);
        try {
            const prData = await api.getPRs(projectId); // This endpoint needs to return PRs
            setPRs(prData);

            // Verify we have the full project object including owner
            // If just an ID or partial object, fallback to fetching list
            if (prData.length > 0 && prData[0].project && prData[0].project.owner) {
                setProject(prData[0].project);
            } else {
                const p = await api.getProjects();
                const found = p.find(proj => proj._id === projectId);
                setProject(found);
            }
        } catch (error) {
            console.error("Failed to load project", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePRSelect = (pr) => {
        navigate(`/projects/${projectId}/prs/${pr._id}`);
    };

    // --- Left Content: PR List ---
    const leftContent = (
        <div className="pb-4">
            <div className="px-4 py-3 border-b border-white/5 mb-2">
                <h2 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                    Pull Requests
                </h2>
            </div>
            {loading ? (
                <div className="p-4"><LoadingSkeleton count={5} type="list" /></div>
            ) : prs.length === 0 ? (
                <div className="p-8 text-center text-tertiary text-sm">
                    No pull requests found.
                </div>
            ) : (
                prs.map(pr => (
                    <PRListItem
                        key={pr._id}
                        pr={pr}
                        isActive={activePR?._id === pr._id}
                        onClick={() => handlePRSelect(pr)}
                    />
                ))
            )}
        </div>
    );

    // --- Center Content: Decision Editor/Viewer ---
    const MainContent = activePR ? (
        <EmbeddedDecisionEditor pr={activePR} />
    ) : (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <FileText size={64} strokeWidth={1} className="mb-4" />
            <h3 className="text-xl font-medium">Select a Pull Request</h3>
            <p>Choose a PR from the sidebar to view or document its decision.</p>
        </div>
    );

    // --- Right Content: Metadata ---
    const rightContent = activePR ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* PR Details Card */}
            <div className="p-5 rounded-2xl bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-bold mb-3 flex items-center gap-2">
                    <GitBranch size={12} className="text-indigo-400" />
                    PR Details
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-[var(--text-secondary)]">ID</span>
                        <span className="text-sm font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            #{activePR.githubPrNumber || activePR.number}
                        </span>
                    </div>
                    <a
                        href={`https://github.com/${project?.owner}/${project?.name}/pull/${activePR.githubPrNumber || activePR.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all text-xs font-medium text-[var(--text-secondary)] hover:text-indigo-400 group/link"
                    >
                        <span>View on GitHub</span>
                        <LinkIcon size={12} className="opacity-50 group-hover/link:opacity-100" />
                    </a>
                </div>
            </div>

            {/* Author Card */}
            <div className="p-5 rounded-2xl bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 hover:border-pink-500/30 transition-colors">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-bold mb-3 flex items-center gap-2">
                    <User size={12} className="text-pink-400" />
                    Author
                </h3>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-xs font-bold text-pink-400">
                        {activePR.author?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white">{activePR.author}</span>
                </div>
            </div>

            {/* Timeline Card */}
            <div className="p-5 rounded-2xl bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 hover:border-amber-500/30 transition-colors">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-bold mb-3 flex items-center gap-2">
                    <Clock size={12} className="text-amber-400" />
                    Timeline
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                        <span>Created {new Date(activePR.githubCreatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                        <span>Last Updated Today</span>
                    </div>
                </div>
            </div>

            {/* History (Clean List) */}
            <div className="pt-4 border-t border-white/5">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-bold mb-3">
                    Version History
                </h3>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">v{activePR.version || 1} (Current)</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                </div>
            </div>
        </div>
    ) : null;

    return (
        <ThreeColumnLayout
            leftContent={leftContent}
            mainContent={MainContent}
            rightContent={rightContent}
            onBack={() => navigate('/projects')}
            backLabel="Back to Projects"
        />
    );
}

// Sub-component for the editor to isolate state
function EmbeddedDecisionEditor({ pr }) {
    const [decision, setDecision] = useState({ what: '', why: '', options: '', tradeoffs: '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Fetch decision for this PR
        const load = async () => {
            const data = await api.getDecision(pr._id);
            if (data) {
                setDecision({
                    what: data.what || '',
                    why: data.why || '',
                    options: data.optionsConsidered || '',
                    tradeoffs: data.tradeoffs || ''
                });
            } else {
                setDecision({ what: '', why: '', options: '', tradeoffs: '' });
            }
        };
        load();
    }, [pr._id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.saveDecision(pr._id, {
                what: decision.what,
                why: decision.why,
                optionsConsidered: decision.options,
                tradeoffs: decision.tradeoffs
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            console.error("Save failed", e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">

            {/* Ambient Background - Grid & Orbs */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none mask-image:linear-gradient(to_bottom,transparent,black)" />

            {/* Glowing Orbs */}
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Document Header - Sticky */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-20 sticky top-0">
                <div className="max-w-5xl mx-auto px-8 py-5 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                                <Sparkles size={10} />
                                Decision Record
                            </span>
                            <span className="text-xs font-mono text-[var(--text-tertiary)]">#{pr.githubPrNumber || pr.number}</span>
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-xl">
                            {pr.title}
                        </h1>
                    </div>

                    <div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all duration-300 ${saved
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                : 'bg-white text-black hover:bg-indigo-50 hover:text-indigo-600 shadow-lg shadow-white/10 hover:shadow-indigo-500/20'
                                }`}
                        >
                            {saved ? <Check size={14} strokeWidth={3} /> : <Save size={14} strokeWidth={3} />}
                            {saved ? 'Saved' : saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Body - Cards */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-8">
                <div className="max-w-5xl mx-auto space-y-8 pb-32">

                    {/* Intro Card */}
                    <div className="p-6 rounded-2xl bg-[#111]/80 border border-white/10">
                        <div className="flex gap-4">
                            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 h-fit">
                                <FileText size={24} className="text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white mb-1">Architecture Decision Record</h2>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                                    This document serves as the single source of truth for this architectural change.
                                    Record the context, decisions, and tradeoffs to ensure long-term maintainability.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Section
                        icon={<Target size={24} className="text-cyan-400" />}
                        label="The Decision"
                        sublabel="What is changing?"
                        placeholder="Describe the core decision..."
                        value={decision.what}
                        onChange={(v) => setDecision(p => ({ ...p, what: v }))}
                        rows={4}
                        color="cyan"
                    />

                    <Section
                        icon={<Brain size={24} className="text-pink-400" />}
                        label="The Reasoning"
                        sublabel="Why this path?"
                        placeholder="Explain the motivation, context, and why this is the right move..."
                        value={decision.why}
                        onChange={(v) => setDecision(p => ({ ...p, why: v }))}
                        rows={8}
                        color="pink"
                    />

                    <Section
                        icon={<Scale size={24} className="text-amber-400" />}
                        label="The Impact"
                        sublabel="Tradeoffs & Risks"
                        placeholder="What are the downsides? What alternatives were rejected?"
                        value={decision.options}
                        onChange={(v) => setDecision(p => ({ ...p, options: v }))}
                        rows={6}
                        color="amber"
                    />
                </div>
            </div>
        </div>
    );
}

function Section({ icon, label, sublabel, placeholder, value, onChange, rows, color }) {
    // Dynamic styles based on color prop
    const colors = {
        cyan: 'hover:border-cyan-500/50 focus-within:border-cyan-500 shadow-cyan-500/5',
        pink: 'hover:border-pink-500/50 focus-within:border-pink-500 shadow-pink-500/5',
        amber: 'hover:border-amber-500/50 focus-within:border-amber-500 shadow-amber-500/5',
    };

    const activeClass = colors[color] || colors.cyan;

    return (
        <div className={`
            group relative p-1 rounded-2xl transition-all duration-300 transform-gpu
            ${value ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-transparent'}
        `}>
            <div className={`
                relative bg-[#111]/90 border border-white/5 rounded-xl p-6 transition-all duration-200
                ${activeClass} group-hover:shadow-lg focus-within:shadow-lg focus-within:bg-[#0a0a0a]
            `}>
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-105 transition-transform duration-200">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-base font-bold text-white tracking-wide uppercase">{label}</h3>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">{sublabel}</span>
                        </div>

                        <div className="relative mt-4">
                            <textarea
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                rows={rows}
                                className="w-full bg-transparent border-none p-0 text-base leading-7 text-[var(--text-primary)] placeholder-[var(--text-tertiary)]/30 focus:outline-none resize-none font-light"
                            />
                            {/* Animated Underline */}
                            <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-${color}-500 to-transparent transition-all duration-300 ${value || 'group-focus-within:w-full w-0'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
