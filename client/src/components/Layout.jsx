import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../utils';
import { LayoutDashboard, Search, LogOut, Github } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background text-text flex flex-col">
            {/* Navbar */}
            <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-black font-bold text-lg group-hover:bg-primary-hover transition">W</div>
                            <span className="text-xl font-bold tracking-tight">WhyStack</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            <NavLink to="/projects" icon={<LayoutDashboard size={18} />}>Projects</NavLink>
                            <NavLink to="/search" icon={<Search size={18} />}>Search</NavLink>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                            YP
                        </div>
                        <button className="text-zinc-500 hover:text-white transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}

function NavLink({ to, children, icon }) {
    const location = useLocation();
    const isActive = location.pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                isActive
                    ? "text-white bg-zinc-800 shadow-sm border border-zinc-700/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
        >
            {icon}
            {children}
        </Link>
    )
}
