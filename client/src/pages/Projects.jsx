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

    // Projects Grid
    return (
        <div className="max-w-7xl mx-auto py-8 px-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary mb-2">
                    Your Projects
                </h1>
                <p className="text-secondary">
                    {projects.length} {projects.length === 1 ? 'repository' : 'repositories'} tracked
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                    <button
                        key={project._id}
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="p-6 surface-elevated rounded-lg border border-subtle hover:border-default transition-all text-left group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <GitBranch size={20} className="text-secondary" />
                                <h3 className="font-semibold text-primary group-hover:brand-text transition-colors">
                                    {project.name}
                                </h3>
                            </div>
                        </div>

                        <p className="text-sm text-secondary mb-4">
                            {project.owner}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-tertiary">
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
