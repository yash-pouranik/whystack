import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';

/**
 * WorkspaceLayout - Full-width layout with top nav
 * 
 * Layout:
 * ┌────────────────────────────────┐
 * │     TopNav (fixed)             │
 * ├────────────────────────────────┤
 * │                                │
 * │     Workspace (full-width)     │
 * │                                │
 * └────────────────────────────────┘
 */
export default function WorkspaceLayout() {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <TopNav />

            {/* Main Workspace - Full Width */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
