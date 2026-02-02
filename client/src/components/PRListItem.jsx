import { GitPullRequest, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PRListItem({ pr, isActive, onClick }) {
    const hasDecision = pr.decisionStatus === 'DOCUMENTED';

    return (
        <button
            onClick={onClick}
            className={`w-full text-left py-3 px-4 mb-2 rounded-lg transition-all relative group ${isActive
                ? 'bg-white/5 shadow-sm'
                : 'hover:bg-white/[0.02] text-secondary'
                }`}
        >
            {/* Active Indicator */}
            {isActive && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-1 bg-[var(--accent-pink)] rounded-full shadow-[0_0_10px_var(--accent-pink)] opacity-80" />
            )}

            <div className="flex items-start gap-3 pl-1">
                <div className={`mt-0.5 transition-colors ${hasDecision ? 'text-[var(--status-documented)]' : 'text-tertiary group-hover:text-secondary'
                    }`}>
                    {hasDecision ? <CheckCircle2 size={18} /> : <GitPullRequest size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-medium mb-0.5 truncate transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                        }`}>
                        {pr.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-tertiary">
                        <span className="font-mono text-[10px] opacity-75">
                            #{pr.githubPrNumber || pr.number}
                        </span>
                        <span>•</span>
                        <span>{new Date(pr.githubCreatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}
