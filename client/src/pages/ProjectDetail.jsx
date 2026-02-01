import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { GitPullRequest, CheckCircle2, Clock, User, ArrowUpRight } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';

/**
 * ProjectDetail - GitHub-style PR list
 * 
 * Shows PRs as cards with status badges
 */
export default function ProjectDetail() {
    const { id } = useParams();
    const [prs, setPRs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);

    useEffect(() => {
        loadPRs();
    }, [id]);

    const loadPRs = async () => {
        try {
            const data = await api.getPRs(id);
            setPRs(data);
            if (data.length > 0 && data[0].project) {
                setProject(data[0].project);
            } else {
                // If no PRs, we might need to fetch project details separately
                // For now, we rely on the PR list containing project info
                // A real app would have a separate getProject() call
                const projects = await api.getProjects();
                const found = projects.find(p => p._id === id);
                if (found) setProject(found);
            }
        } catch (error) {
            console.error('Failed to load PRs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-12 px-6">
                <div className="mb-8 h-8 w-48 bg-elevated rounded animate-pulse" />
                <LoadingSkeleton count={5} type="list" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            {/* Project Header */}
            {project && (
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary mb-1">
                            {project.name}
                        </h1>
                        <p className="text-secondary">{project.owner}</p>
                    </div>
                    <a
                        href={project.githubUrl || `https://github.com/${project.owner}/${project.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-link flex items-center gap-1 hover:underline"
                    >
                        Open in GitHub <ArrowUpRight size={14} />
                    </a>
                </div>
            )}

            {/* PR List */}
            {prs.length === 0 ? (
                <div className="surface-elevated border border-dashed border-subtle rounded-xl p-16 text-center">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GitPullRequest size={32} className="text-tertiary" />
                    </div>
                    <h3 className="text-lg font-medium text-primary mb-2">
                        No pull requests yet
                    </h3>
                    <p className="text-secondary max-w-md mx-auto mb-6">
                        Pull requests will appear here automatically when they are created in the GitHub repository.
                    </p>
                    <div className="inline-block p-4 bg-primary/5 rounded border border-subtle text-sm text-secondary text-left">
                        <p className="font-medium text-primary mb-2">How it works:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Create a PR in GitHub</li>
                            <li>Refresh this page</li>
                            <li>Add decision context using WhyStack</li>
                        </ol>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {prs.map(pr => {
                        const hasDecision = pr.decisionStatus === 'DOCUMENTED';

                        return (
                            <Link
                                key={pr._id}
                                to={`/prs/${pr._id}`}
                                className="block p-5 surface-elevated rounded-lg border border-subtle hover:border-[var(--brand-primary)] transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`mt-1 ${hasDecision ? 'status-documented' : 'text-tertiary'}`}>
                                        {hasDecision ? (
                                            <CheckCircle2 size={20} />
                                        ) : (
                                            <GitPullRequest size={20} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-primary group-hover:text-[var(--brand-primary)] transition-colors mb-2">
                                            {pr.title}
                                        </h3>

                                        <div className="flex items-center gap-4 text-sm text-secondary">
                                            <span className="font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">#{pr.number}</span>
                                            <span className="flex items-center gap-1">
                                                <User size={14} />
                                                {pr.author}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(pr.githubCreatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${hasDecision
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {hasDecision ? 'Documented' : 'Context Missing'}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
