import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import {
    Layout,
    GitBranch,
    Settings,
    LogOut,
    ChevronDown,
    Plus,
    Search,
    Layers,
    PanelLeftClose,
    PanelLeftOpen,
    Trash2
} from 'lucide-react';

export default function Sidebar() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectMenu, setShowProjectMenu] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);

            // Auto-select based on URL
            const match = location.pathname.match(/\/projects\/([^/]+)/);
            if (match) {
                const found = data.find(p => p._id === match[1]);
                if (found) setSelectedProject(found);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setShowProjectMenu(false);
        navigate(`/projects/${project._id}`);
    };

    const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation(); // Prevent selection
        if (window.confirm('Are you sure you want to delete this project? This will delete all associated decisions and cannot be undone.')) {
            try {
                await api.deleteProject(projectId);
                setProjects(prev => prev.filter(p => p._id !== projectId));

                // If we deleted the active project, go back to list
                if (selectedProject?._id === projectId) {
                    setSelectedProject(null);
                    navigate('/projects');
                }
            } catch (error) {
                console.error("Failed to delete project", error);
                alert("Failed to delete project");
            }
        }
    };

    return (
        <aside
            className={`flex flex-col bg-primary border-r border-transparent flex-shrink-0 z-50 transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-64'
                }`}
        >
            {/* App Logo / Brand */}
            <div className={`h-14 flex items-center mb-2 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
                <Link to="/projects" className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-[var(--brand-primary)] to-purple-400 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
                        <Layers size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight whitespace-nowrap overflow-hidden">
                            WhyStack
                        </span>
                    )}
                </Link>
            </div>

            {/* Project Switcher */}
            <div className={`px-3 mb-2 relative ${collapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={() => !collapsed && setShowProjectMenu(!showProjectMenu)}
                    className={`flex items-center rounded-md hover:bg-white/5 transition-colors border border-white/10 ${collapsed
                        ? 'justify-center p-2 w-10 h-10'
                        : 'w-full justify-between p-2 text-left'
                        }`}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <GitBranch size={16} className="text-blue-500 flex-shrink-0" />
                        {!collapsed && (
                            <span className="text-sm font-medium text-primary truncate">
                                {selectedProject ? selectedProject.name : 'Select Project'}
                            </span>
                        )}
                    </div>
                    {!collapsed && <ChevronDown size={14} className="text-secondary" />}
                </button>

                {/* Dropdown - Only show when NOT collapsed */}
                {showProjectMenu && !collapsed && (
                    <div className="absolute top-full left-3 right-3 mt-1 py-1 rounded-md bg-[#2A2B30] border border-[#3E4045] shadow-xl z-50">
                        <div className="max-h-60 overflow-y-auto px-1">
                            {projects.map(project => (
                                <button
                                    key={project._id}
                                    onClick={() => handleProjectSelect(project)}
                                    className="w-full text-left px-2 py-1.5 rounded text-sm text-secondary hover:text-primary hover:bg-white/5 flex items-center gap-2 group/item"
                                >
                                    <span className="truncate flex-1">{project.name}</span>

                                    {/* Delete Action - Visible on Hover */}
                                    <div
                                        onClick={(e) => handleDeleteProject(e, project._id)}
                                        className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-500/20 rounded text-tertiary hover:text-red-400 transition-all"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={12} />
                                    </div>

                                    {selectedProject?._id === project._id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-white/10 mt-1 pt-1 px-1">
                            <button
                                onClick={() => navigate('/projects?import=true')}
                                className="w-full text-left px-2 py-1.5 rounded text-sm text-blue-400 hover:bg-blue-500/10 flex items-center gap-2"
                            >
                                <Plus size={14} />
                                Import Project
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-0.5 mt-4">
                {!collapsed && (
                    <div className="text-[11px] font-bold text-tertiary uppercase tracking-wider px-2 mb-2 whitespace-nowrap overflow-hidden">
                        Platform
                    </div>
                )}

                <NavItem
                    to="/projects"
                    icon={<Layout size={18} />}
                    label="All Projects"
                    active={location.pathname === '/projects'}
                    collapsed={collapsed}
                />

                <NavItem
                    to="#"
                    icon={<Search size={18} />}
                    label="Search"
                    collapsed={collapsed}
                />

                {!collapsed && (
                    <div className="mt-6 text-[11px] font-bold text-tertiary uppercase tracking-wider px-2 mb-2 whitespace-nowrap overflow-hidden">
                        Settings
                    </div>
                )}
                <NavItem
                    to="#"
                    icon={<Settings size={18} />}
                    label="Preferences"
                    collapsed={collapsed}
                />
            </nav>

            {/* Footer / Toggle */}
            <div className="p-3 border-t border-white/5 space-y-1">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`w-full flex items-center p-2 rounded-md hover:bg-white/5 text-secondary hover:text-primary transition-colors ${collapsed ? 'justify-center' : 'gap-3'
                        }`}
                >
                    {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    {!collapsed && <span className="text-sm font-medium">Collapse</span>}
                </button>

                <button
                    onClick={() => api.logout()}
                    className={`w-full flex items-center p-2 rounded-md hover:bg-white/5 text-secondary hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : 'gap-3'
                        }`}
                >
                    <LogOut size={18} />
                    {!collapsed && <span className="text-sm font-medium">Log Out</span>}
                </button>
            </div>
        </aside>
    );
}

function NavItem({ to, icon, label, active, collapsed }) {
    return (
        <Link
            to={to}
            className={`flex items-center rounded-md transition-all group relative ${active
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-secondary hover:text-primary hover:bg-white/5'
                } ${collapsed ? 'justify-center p-2' : 'gap-3 px-2 py-2'}`}
            title={collapsed ? label : undefined}
        >
            <span className={`${active ? 'text-blue-400' : 'text-secondary group-hover:text-primary'}`}>
                {icon}
            </span>
            {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}

            {/* Tooltip for collapsed state could go here */}
        </Link>
    );
}
