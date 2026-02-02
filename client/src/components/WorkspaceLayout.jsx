import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * WorkspaceLayout - Sidebar + Framed Content
 * 
 * Layout:
 * ┌──────┬────────────────────────────┐
 * │ Side │  ┌──────────────────────┐  │
 * │ bar  │  │    Main Content      │  │
 * │      │  │      (Framed)        │  │
 * │      │  └──────────────────────┘  │
 * └──────┴────────────────────────────┘
 */
export default function WorkspaceLayout() {
    return (
        <div className="h-screen w-full flex bg-primary overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Wrapper - Adds the 'padding' effect around the active view */}
            <div className="flex-1 flex flex-col h-full min-w-0 p-2 pl-0">
                <main className="flex-1 bg-surface border border-subtle rounded-xl overflow-hidden flex flex-col relative shadow-2xl">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
