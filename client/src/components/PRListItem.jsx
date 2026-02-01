import { GitPullRequest, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PRListItem({ pr, isActive, onClick }) {
    const hasDecision = pr.decisionStatus === 'DOCUMENTED';

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 border-b border-subtle transition-colors group ${isActive
                    ? 'bg-elevated border-l-2 border-l-[var(--brand-primary)]'
                    : 'hover:bg-hover border-l-2 border-l-transparent'
                }`}
        >
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${hasDecision ? 'status-documented' : 'text-tertiary'}`}>
                    {hasDecision ? <CheckCircle2 size={16} /> : <GitPullRequest size={16} />}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-medium mb-1 truncate ${isActive ? 'text-primary' : 'text-secondary group-hover:text-primary'
                        }`}>
                        {pr.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-tertiary">
                        <span className="font-mono text-[10px] bg-primary/10 px-1 rounded">
                            #{pr.githubPrNumber || pr.number}
                        </span>
                        <span>{new Date(pr.githubCreatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}
