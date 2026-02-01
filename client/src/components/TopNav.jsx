import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronDown, Plus, LogOut } from 'lucide-react';

/**
 * TopNav - GitHub-inspired navigation
 * 
 * Features:
 * - WhyStack logo (left)
 * - Project dropdown (center)
 * - Import + Logout (right)
 */
export default function TopNav() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        // Auto-select project from URL
        const match = location.pathname.match(/\/projects\/([^/]+)/);
        if (match && projects.length > 0) {
            const project = projects.find(p => p._id === match[1]);
            setSelectedProject(project);
        }
    }, [location, projects]);

    const loadProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setShowDropdown(false);
        navigate(`/projects/${project._id}`);
    };

    const handleLogout = () => {
        api.logout();
    };

    return (
        <nav className="h-16 border-b border-subtle flex items-center justify-between px-6">
            {/* Logo */}
            <Link to="/projects" className="brand-text text-xl font-bold">
                WhyStack
            </Link>

            {/* Project Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded hover:bg-elevated transition-colors"
                >
                    <span className="text-primary font-medium">
                        {selectedProject ? selectedProject.name : 'Select Project'}
                    </span>
                    <ChevronDown size={16} className="text-secondary" />
                </button>

                {showDropdown && (
                    <div className="absolute top-full mt-2 w-64 surface-elevated border border-subtle rounded shadow-xl z-50">
                        <div className="p-2 max-h-96 overflow-y-auto">
                            {projects.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-secondary">
                                    No projects yet
                                </div>
                            ) : (
                                projects.map(project => {
                                    const isActive = selectedProject && selectedProject._id === project._id;
                                    return (
                                        <button
                                            key={project._id}
                                            onClick={() => handleProjectSelect(project)}
                                            className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between group ${isActive ? 'bg-primary/10' : 'hover:bg-hover'
                                                }`}
                                        >
                                            <div className="min-w-0">
                                                <div className={`font-medium text-sm ${isActive ? 'text-[var(--brand-primary)]' : 'text-primary'}`}>
                                                    {project.name}
                                                </div>
                                                <div className="text-xs text-tertiary">
                                                    {project.owner}
                                                </div>
                                            </div>
                                            {isActive && (
                                                <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/projects?import=true')}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={16} />
                    Import
                </button>

                <button
                    onClick={handleLogout}
                    className="p-2 text-secondary hover:text-primary transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
}
