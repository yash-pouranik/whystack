import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { GitBranch, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';

/**
 * Projects Page - Modern GitHub-style
 * 
 * Empty: Clean hero with CTA
 * With projects: Grid of project cards
 */
export default function Projects() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [repos, setRepos] = useState([]);
    const [importing, setImporting] = useState(false);
    const navigate = useNavigate();
    const showImport = searchParams.get('import') === 'true';

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (showImport) {
            fetchRepos();
        }
    }, [showImport]);

    const loadProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRepos = async () => {
        try {
            const token = api.getToken();
            const res = await fetch('/projects/github', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch repos');
            const data = await res.json();
            setRepos(data);
        } catch (error) {
            console.error('Failed to load repos:', error);
        }
    };

    const handleImport = async (repo) => {
        setImporting(true);
        try {
            await api.importProject({
                githubRepoId: String(repo.id),
                name: repo.name,
                owner: repo.owner,
                visibility: repo.private ? 'private' : 'public',
                githubUrl: repo.url
            });
            setSearchParams({});
            loadProjects();
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import project');
        } finally {
            setImporting(false);
        }
    };

    // Import Modal
    if (showImport) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-primary mb-1">
                            Import Repository
                        </h1>
                        <p className="text-secondary text-sm">
                            Select a GitHub repository to track decisions
                        </p>
                    </div>
                    <button
                        onClick={() => setSearchParams({})}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>

                <div className="space-y-2">
                    {repos.map(repo => (
                        <div
                            key={repo.id}
                            className="p-4 surface-elevated rounded-lg border border-subtle hover:border-default transition-colors flex items-center justify-between"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <GitBranch size={16} className="text-secondary" />
                                    <span className="font-medium text-primary">
                                        {repo.fullName}
                                    </span>
                                </div>
                                {repo.description && (
                                    <p className="text-sm text-secondary truncate">
                                        {repo.description}
                                    </p>
                                )}
                            </div>

                            {repo.isImported ? (
                                <span className="text-sm text-tertiary ml-4">Imported</span>
                            ) : (
                                <button
                                    onClick={() => handleImport(repo)}
                                    disabled={importing}
                                    className="btn-primary ml-4"
                                >
                                    Import
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Loading State
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-8 px-6">
                <div className="mb-8 h-10 w-48 bg-elevated rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LoadingSkeleton count={6} type="card" />
                </div>
            </div>
        );
    }

    // Empty State
    if (projects.length === 0) {
        return (
            <div className="h-full flex items-center justify-center px-6">
                <div className="max-w-2xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-elevated border-2 border-[var(--brand-primary)] flex items-center justify-center mx-auto">
                        <GitBranch size={32} className="brand-text" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-3">
                            Track Decision Context
                        </h1>
                        <p className="text-lg text-secondary max-w-xl mx-auto">
                            Document the "why" behind your pull requests. Never lose context in Slack threads again.
                        </p>
                    </div>

                    <button
                        onClick={() => setSearchParams({ import: 'true' })}
                        className="btn-primary text-base px-6 py-3"
                    >
                        Import Your First Repository
                    </button>
                </div>
            </div>
        );
    }

    // Projects List
    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="mb-10 pl-2">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 tracking-tight">
                    Tracked Repositories
                </h1>
                <p className="text-[var(--text-secondary)] text-sm">
                    WhyStack watches pull requests to capture decisions.
                </p>
            </div>

            {/* List Header (Visual Guide) */}
            <div className="flex items-center px-4 py-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider border-b border-white/5 mb-2">
                <div className="flex-1">Repository</div>
                <div className="w-48">Last Activity</div>
                <div className="w-10"></div>
            </div>

            {/* Projects List - Dense & Clean */}
            <div className="flex flex-col space-y-[1px]">
                {projects.map(project => (
                    <button
                        key={project._id}
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="group relative flex items-center w-full text-left py-4 px-4 hover:bg-white/[0.03] transition-all rounded-lg"
                    >
                        {/* Left Accent Indicator (On Hover) */}
                        <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Repo Info */}
                        <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-baseline gap-3 mb-0.5">
                                <h3 className="text-base font-medium text-[var(--text-primary)] truncate">
                                    {project.name}
                                </h3>
                                <div className="text-sm text-[var(--text-tertiary)] flex items-center gap-1.5 font-mono">
                                    <span className="opacity-50">/</span>
                                    <span>{project.owner}</span>
                                </div>
                            </div>

                            {/* Optional: Description could go here if needed, keeping it minimal for now */}
                        </div>

                        {/* Metadata */}
                        <div className="w-48 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Clock size={14} className="text-[var(--text-tertiary)]" />
                            <span className="opacity-80">
                                {new Date(project.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        {/* Action Arrow */}
                        <div className="w-10 flex justify-end">
                            <div className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                →
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Add Project Action (Subtle) */}
            <div className="mt-8 pt-6 border-t border-white/5 pl-2">
                <button
                    onClick={() => setSearchParams({ import: 'true' })}
                    className="text-sm text-[var(--link-blue)] hover:text-white transition-colors flex items-center gap-2"
                >
                    + Import another repository
                </button>
            </div>
        </div>
    );
}
