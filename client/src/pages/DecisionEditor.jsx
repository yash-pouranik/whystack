import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Save, Check } from 'lucide-react';

/**
 * DecisionEditor - Clean, modern editor
 * 
 * Features:
 * - Large textareas with placeholders
 * - Auto-save indicator
 * - Clean layout
 */
export default function DecisionEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [decision, setDecision] = useState({
        what: '',
        why: '',
        optionsConsidered: '',
        tradeoffs: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const decisionData = await api.getDecision(id);
            if (decisionData) {
                setDecision({
                    what: decisionData.what || '',
                    why: decisionData.why || '',
                    optionsConsidered: decisionData.optionsConsidered || '',
                    tradeoffs: decisionData.tradeoffs || ''
                });
            }
        } catch (error) {
            console.error('Failed to load decision:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await api.saveDecision(id, decision);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save decision');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setDecision(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="text-secondary">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-subtle">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to PRs</span>
                </button>

                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-2 text-sm status-documented">
                            <Check size={16} />
                            Saved
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Decision'}
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="space-y-6">
                {/* What */}
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        What was decided?
                    </label>
                    <textarea
                        value={decision.what}
                        onChange={(e) => handleChange('what', e.target.value)}
                        placeholder="Describe the decision made in this PR..."
                        className="w-full bg-elevated border border-subtle rounded-lg p-4 text-primary placeholder-tertiary focus:outline-none focus:border-[var(--brand-primary)] resize-none transition-colors"
                        rows={3}
                    />
                </div>

                {/* Why */}
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        Why was this decision made?
                    </label>
                    <textarea
                        value={decision.why}
                        onChange={(e) => handleChange('why', e.target.value)}
                        placeholder="Explain the reasoning, context, and motivation behind this decision..."
                        className="w-full bg-elevated border border-subtle rounded-lg p-4 text-primary placeholder-tertiary focus:outline-none focus:border-[var(--brand-primary)] resize-none transition-colors"
                        rows={6}
                    />
                </div>

                {/* Options Considered */}
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        What alternatives were considered?
                    </label>
                    <textarea
                        value={decision.optionsConsidered}
                        onChange={(e) => handleChange('optionsConsidered', e.target.value)}
                        placeholder="List other approaches that were evaluated and why they weren't chosen..."
                        className="w-full bg-elevated border border-subtle rounded-lg p-4 text-primary placeholder-tertiary focus:outline-none focus:border-[var(--brand-primary)] resize-none transition-colors"
                        rows={5}
                    />
                </div>

                {/* Tradeoffs */}
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        What are the tradeoffs?
                    </label>
                    <textarea
                        value={decision.tradeoffs}
                        onChange={(e) => handleChange('tradeoffs', e.target.value)}
                        placeholder="Document the pros, cons, and compromises of this decision..."
                        className="w-full bg-elevated border border-subtle rounded-lg p-4 text-primary placeholder-tertiary focus:outline-none focus:border-[var(--brand-primary)] resize-none transition-colors"
                        rows={5}
                    />
                </div>
            </div>
        </div>
    );
}
