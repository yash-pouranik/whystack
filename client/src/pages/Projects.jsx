import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Github, Folder, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/id-ui';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const myProjects = await api.getProjects();
            setProjects(myProjects);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (view === 'import') {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Import Repository</h1>
                    <Button variant="ghost" onClick={() => setView('list')}>Cancel</Button>
                </div>
                <ImportView onImport={() => { setView('list'); loadData(); }} />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-10 border-b border-border pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
                    <p className="text-zinc-400">Manage and track decisions across your repositories.</p>
                </div>
                <Button onClick={() => setView('import')} className="gap-2 shadow-lg shadow-primary/20">
                    <Plus size={18} /> Import Project
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-500" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <Link key={p._id} to={`/projects/${p._id}`} className="group block h-full">
                            <Card className="h-full hover:border-zinc-600 hover:bg-zinc-900/50 transition-all duration-200 group-hover:shadow-xl group-hover:shadow-black/50">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                            <Folder size={24} />
                                        </div>
                                        {p.visibility === 'private' && <Badge variant="outline">Private</Badge>}
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-sm text-zinc-500 font-mono mb-1">{p.owner}</div>
                                        <h3 className="text-xl font-bold tracking-tight">{p.name}</h3>
                                    </div>

                                    <div className="pt-6 border-t border-border flex items-center justify-between text-sm text-zinc-500">
                                        <span>Last updated</span>
                                        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30">
                            <Folder size={48} className="mx-auto text-zinc-700 mb-4" />
                            <h3 className="text-lg font-medium text-zinc-300">No projects yet</h3>
                            <p className="text-zinc-500 mb-6">Import a GitHub repository to get started</p>
                            <Button onClick={() => setView('import')}>Import Project</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ImportView({ onImport }) {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRepos();
    }, []);

    const fetchRepos = async () => {
        try {
            // Fetch repos with JWT token
            const token = api.getToken();
            const res = await fetch('/projects/github', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            setRepos(data);
        } catch (e) {
            console.error("Failed to load repos", e);
            alert('Failed to load repositories. Please try logging in again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (repo) => {
        try {
            await api.importProject({
                githubRepoId: String(repo.id),
                name: repo.name,
                owner: repo.owner,
                visibility: repo.private ? 'private' : 'public',
                githubUrl: repo.url
            });
            onImport();
        } catch (e) {
            console.error('Import error:', e);
            alert('Import failed');
        }
    }

    if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline mr-2" /> Loading repositories from GitHub...</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Github /> Select Repository</CardTitle>
            </CardHeader>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {repos.map(repo => (
                    <div key={repo.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition">
                        <div>
                            <div className="font-bold flex items-center gap-2">
                                {repo.full_name}
                                {repo.private && <Badge variant="outline" className="text-[10px] h-5">Private</Badge>}
                            </div>
                            <div className="text-sm text-zinc-500 truncate max-w-md">{repo.description}</div>
                        </div>
                        {repo.isImported ? (
                            <Badge variant="success">Imported</Badge>
                        ) : (
                            <Button size="sm" variant="secondary" onClick={() => handleImport(repo)}>Import</Button>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    )
}
