import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * ThreeColumnLayout
 * 
 * Layout:
 * ┌──────────┬──────────────────────────┬──────────────┐
 * │  List    │        Main Doc          │   Meta       │
 * │ (20%)    │         (60%)            │  (20%)       │
 * └──────────┴──────────────────────────┴──────────────┘
 */
export default function ThreeColumnLayout({
    leftContent,
    mainContent,
    rightContent,
    onBack,
    backLabel = "Back"
}) {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-primary">
            {/* Left Sidebar - Navigation / List */}
            <aside className="w-80 border-r border-subtle flex flex-col bg-surface">
                {onBack && (
                    <div className="p-4 border-b border-subtle">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm"
                        >
                            <ChevronLeft size={16} />
                            {backLabel}
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {leftContent}
                </div>
            </aside>

            {/* Center - Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-primary">
                <div className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar">
                    <div className="max-w-3xl mx-auto w-full">
                        {mainContent}
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Metadata */}
            {rightContent && (
                <aside className="w-72 border-l border-subtle flex flex-col bg-surface">
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {rightContent}
                    </div>
                </aside>
            )}
        </div>
    );
}
