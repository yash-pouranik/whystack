import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Save, Loader2, FileText } from 'lucide-react';
import { Button, Input, Textarea, Card, CardContent } from '../components/id-ui';

export default function DecisionEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        what: '', why: '', optionsConsidered: '', tradeoffs: ''
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const decision = await api.getDecision(id);
            if (decision) {
                setFormData({
                    what: decision.what,
                    why: decision.why,
                    optionsConsidered: decision.optionsConsidered || '',
                    tradeoffs: decision.tradeoffs || ''
                });
            }
        } catch (e) {
            console.log('Creating new...');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.saveDecision(id, formData);
            navigate(-1);
        } catch (e) {
            alert("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-500" /></div>;

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <Link
                to="#"
                onClick={(e) => { e.preventDefault(); navigate(-1); }} // Go back safely
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition"
            >
                <ArrowLeft size={16} /> Back
            </Link>

            <header className="mb-8 pb-6 border-b border-border flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Decision Record</h1>
                    <div className="text-zinc-400 font-mono flex items-center gap-2">
                        <FileText size={16} />
                        PR #{id}
                    </div>
                </div>

                <Button onClick={handleSubmit} disabled={saving} className="gap-2 shadow-lg shadow-primary/20">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Record
                </Button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Section
                    label="What is changing?"
                    help="Brief summary of the architectural or logical change."
                >
                    <Input
                        value={formData.what}
                        onChange={e => setFormData({ ...formData, what: e.target.value })}
                        placeholder="e.g., Switching from Polling to Webhooks"
                        required
                        className="font-medium"
                    />
                </Section>

                <Section
                    label="The WHY"
                    help="The core reasoning. Why this approach? Why now?"
                    required
                >
                    <Textarea
                        value={formData.why}
                        onChange={e => setFormData({ ...formData, why: e.target.value })}
                        placeholder="Reviewing the latency logs revealed that..."
                        required
                        className="min-h-[150px]"
                    />
                </Section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Section
                        label="Options Considered"
                        help="Alternatives rejected"
                    >
                        <Textarea
                            value={formData.optionsConsidered}
                            onChange={e => setFormData({ ...formData, optionsConsidered: e.target.value })}
                            placeholder="- Websockets (too complex)"
                            className="min-h-[120px]"
                        />
                    </Section>

                    <Section
                        label="Tradeoffs & Risks"
                        help="Downsides of this choice"
                    >
                        <Textarea
                            value={formData.tradeoffs}
                            onChange={e => setFormData({ ...formData, tradeoffs: e.target.value })}
                            placeholder="Increased memory usage on server..."
                            className="min-h-[120px]"
                        />
                    </Section>
                </div>
            </form>
        </div>
    );
}

function Section({ label, help, children, required }) {
    return (
        <div className="group">
            <label className="block text-lg font-bold text-zinc-200 mb-1 flex items-baseline gap-1">
                {label} {required && <span className="text-primary text-sm">*</span>}
            </label>
            <p className="text-sm text-zinc-500 mb-3 group-focus-within:text-zinc-400 transition-colors">{help}</p>
            {children}
        </div>
    )
}
