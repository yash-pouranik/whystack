import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AlertCircle, CheckCircle, Clock, GitPullRequest, ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge, Button, Card } from '../components/id-ui';

export default function ProjectDetail() {
    const { id } = useParams();
    const [prs, setPrs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPRs();
    }, [id]);

    const loadPRs = async () => {
        try {
            const data = await api.getPRs(id);
            setPrs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-zinc-500">Loading Pull Requests...</div>

    return (
        <div className="max-w-5xl mx-auto">
            <Link to="/projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition">
                <ArrowLeft size={16} /> Back to Projects
            </Link>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Pull Requests</h1>
                    <p className="text-zinc-400">Track decisions for each PR in this repository.</p>
                </div>
                <div className="flex gap-4 text-sm font-medium text-zinc-500 bg-zinc-900/50 p-1 rounded-lg border border-border">
                    <div className="px-3 py-1 rounded bg-zinc-800 text-white shadow">All</div>
                    <div className="px-3 py-1 rounded hover:text-white cursor-pointer">Open</div>
                    <div className="px-3 py-1 rounded hover:text-white cursor-pointer">Merged</div>
                </div>
            </div>

            <Card className="overflow-hidden border-zinc-800">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-900/50 text-zinc-500 text-xs uppercase font-medium tracking-wider">
                        <tr>
                            <th className="p-5 border-b border-border w-[40%]">Pull Request</th>
                            <th className="p-5 border-b border-border">Decision Status</th>
                            <th className="p-5 border-b border-border">PR Status</th>
                            <th className="p-5 border-b border-border text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {prs.map(pr => (
                            <tr key={pr._id} className="group hover:bg-zinc-900/30 transition">
                                <td className="p-5">
                                    <div className="flex items-start gap-3">
                                        <GitPullRequest className="text-zinc-600 mt-1" size={18} />
                                        <div>
                                            <div className="font-medium text-zinc-200 group-hover:text-primary transition-colors flex items-center gap-2">
                                                {pr.title}
                                                <span className="text-zinc-600 font-mono text-xs">#{pr.githubPrNumber}</span>
                                            </div>
                                            <div className="text-xs text-zinc-500 mt-1">
                                                by <span className="text-zinc-400">{pr.author}</span> • Updated {new Date(pr.githubUpdatedAt || pr.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <StatusBadge status={pr.decisionStatus} mergedWithoutDecision={pr.mergedWithoutDecision} />
                                </td>
                                <td className="p-5">
                                    <Badge variant={
                                        pr.status === 'MERGED' ? 'default' :
                                            pr.status === 'OPEN' ? 'success' : 'secondary'
                                    } className={
                                        pr.status === 'MERGED' ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' : ''
                                    }>
                                        {pr.status}
                                    </Badge>
                                </td>
                                <td className="p-5 text-right">
                                    <Link to={`/prs/${pr._id}`}>
                                        <Button size="sm" variant={pr.decisionStatus === 'DOCUMENTED' ? 'secondary' : 'default'}>
                                            {pr.decisionStatus === 'DOCUMENTED' ? 'View Decision' : 'Write Decision'}
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {prs.length === 0 && <div className="p-12 text-center text-zinc-500">No PRs found yet. Listen for webhooks.</div>}
            </Card>
        </div>
    );
}

function StatusBadge({ status, mergedWithoutDecision }) {
    if (mergedWithoutDecision) {
        return (
            <Badge variant="destructive" className="gap-1.5 pl-1.5">
                <AlertCircle size={14} /> NEEDS DECISION
            </Badge>
        );
    }

    if (status === 'DOCUMENTED') {
        return (
            <Badge variant="success" className="gap-1.5 pl-1.5">
                <CheckCircle size={14} /> Documented
            </Badge>
        );
    }

    return (
        <Badge variant="warning" className="gap-1.5 pl-1.5">
            <Clock size={14} /> Pending
        </Badge>
    );
}
