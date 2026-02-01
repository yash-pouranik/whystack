import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ThreeColumnLayout from '../components/ThreeColumnLayout';
import PRListItem from '../components/PRListItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { FileText, GitBranch, Calendar, User } from 'lucide-react';

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
                // navigate(\`/projects/\${projectId}/prs/\${prs[0]._id}\`, { replace: true });
            }
        }
    }, [prId, prs]);

    const loadProjectData = async () => {
        setLoading(true);
        try {
            const prData = await api.getPRs(projectId); // This endpoint needs to return PRs
            setPRs(prData);

            // Assume first PR has project populated or fetch project separately
            if (prData.length > 0 && prData[0].project) {
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
            <div className="p-4 border-b border-subtle mb-2">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
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
    // We'll lazy load the editor here or create a sub-component
    // For now, let's keep it simple: if selected, render editor, else empty state
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
        <div className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-xs uppercase tracking-wider text-tertiary">PR Details</h3>
                <p className="font-medium text-primary text-sm flex items-center gap-2">
                    <GitBranch size={14} className="text-secondary" />
                    #{activePR.githubPrNumber || activePR.number}
                </p>
                <a
                    href={`https://github.com/${project?.owner}/${project?.name}/pull/${activePR.githubPrNumber || activePR.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-link hover:underline block truncate"
                >
                    View on GitHub
                </a>
            </div>

            <div className="space-y-1">
                <h3 className="text-xs uppercase tracking-wider text-tertiary">Author</h3>
                <div className="flex items-center gap-2 text-sm text-secondary">
                    <User size={14} />
                    {activePR.author}
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-xs uppercase tracking-wider text-tertiary">Timeline</h3>
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <Calendar size={14} />
                    Created {new Date(activePR.githubCreatedAt).toLocaleDateString()}
                </div>
            </div>

            {/* Future: Version History Dropdown Here */}
            <div className="pt-6 border-t border-subtle">
                <h3 className="text-xs uppercase tracking-wider text-tertiary mb-2">History</h3>
                <p className="text-xs text-secondary italic">Current Version: {activePR.version || 1}</p>
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
import { Save, Check } from 'lucide-react';
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
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header / Title Area */}
            <div className="border-b border-subtle pb-6 flex items-start justify-between">
                <div className="max-w-xl">
                    <h1 className="text-3xl font-bold text-primary mb-2 leading-tight">
                        {pr.title}
                    </h1>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`btn-primary flex items-center gap-2 shadow-lg transition-all ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Saved' : saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/* Document Body */}
            <div className="space-y-12">
                <Section
                    label="What was decided?"
                    placeholder="Briefly summarize the architectural decision or change..."
                    value={decision.what}
                    onChange={(v) => setDecision(p => ({ ...p, what: v }))}
                    rows={3}
                />
                <Section
                    label="Why? (Context & Reasoning)"
                    placeholder="Explain the motivation. Why this approach? Why now?"
                    value={decision.why}
                    onChange={(v) => setDecision(p => ({ ...p, why: v }))}
                    rows={10} // Main writing area
                    primary
                />
                <Section
                    label="Options Considered"
                    placeholder="What alternatives did you reject? e.g. 'Option A was too slow...'"
                    value={decision.options}
                    onChange={(v) => setDecision(p => ({ ...p, options: v }))}
                    rows={4}
                />
                <Section
                    label="Tradeoffs"
                    placeholder="What are the downsides? e.g. 'Adds complexity to build step...'"
                    value={decision.tradeoffs}
                    onChange={(v) => setDecision(p => ({ ...p, tradeoffs: v }))}
                    rows={4}
                />
            </div>
        </div>
    );
}

function Section({ label, placeholder, value, onChange, rows, primary }) {
    return (
        <div className="group">
            <h3 className={`text-sm font-semibold mb-3 ${primary ? 'text-[var(--brand-primary)]' : 'text-secondary'}`}>
                {label}
            </h3>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full bg-transparent border-none p-0 text-lg text-primary placeholder-tertiary focus:outline-none resize-none leading-relaxed"
                style={{ minHeight: `${rows * 1.5}rem` }}
            />
            {/* Subtle focus indicator line */}
            <div className="h-px bg-subtle mt-2 group-focus-within:bg-[var(--brand-primary)] transition-colors" />
        </div>
    );
}
