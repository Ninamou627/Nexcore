import { Link, Outlet, useParams } from 'react-router';
import { Rocket, LayoutDashboard, ListChecks, MessageSquare, FolderOpen, Users } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { useState, useEffect } from 'react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';
import { ThemeToggle } from '../../components/ThemeToggle';

export function Workspace() {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await api.get(`/projects/${id}`, token || undefined);
        setProject(data);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchProject();
  }, [id, token]);

  const navItems = [
    { path: `/workspace/${id}`, label: "Vue d'ensemble", icon: LayoutDashboard },
    { path: `/workspace/${id}/milestones`, label: 'Jalons', icon: ListChecks },
    { path: `/workspace/${id}/messages`, label: 'Messagerie', icon: MessageSquare },
    { path: `/workspace/${id}/files`, label: 'Fichiers', icon: FolderOpen },
  ];

  if (isLoading) return <div className="glass-shell min-h-screen flex items-center justify-center font-outfit text-slate-300 light:text-slate-600">Chargement du workspace...</div>;
  if (!project) return <div className="glass-shell min-h-screen flex items-center justify-center font-outfit text-red-400">Workspace introuvable.</div>;

  return (
    <div className="glass-shell min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 light:hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-900/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      </div>

      <nav className="glass-panel border border-white/10 light:border-slate-200 shadow-2xl shadow-blue-900/20 light:shadow-sm backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600/50 to-cyan-400/20 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-white light:text-slate-900">Nexcore Hub</span>
            </Link>
            <div className="flex items-center gap-2 text-blue-100/80 light:text-slate-600">
              <Users className="w-5 h-5 text-blue-200 light:text-blue-500" />
              <span className="text-white light:text-slate-900 font-medium">Plateforme RH Digitale</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/client" className="px-4 py-2 text-blue-100/80 light:text-slate-600 hover:text-white light:hover:text-blue-600 transition-colors font-bold text-sm">Retour au tableau de bord</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="glass-card rounded-[2rem] border border-white/10 light:border-slate-200 overflow-hidden shadow-2xl shadow-blue-900/10 light:shadow-lg">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 light:border-slate-200 bg-black/20 light:bg-slate-50 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-2 px-6 py-4 transition-all text-sm rounded-2xl ${
                    isActive ? 'bg-blue-500/15 light:bg-blue-50 text-white light:text-blue-700 border border-blue-400/20 light:border-blue-200' : 'text-blue-100/70 light:text-slate-500 hover:text-white light:hover:text-blue-600 hover:bg-white/5 light:hover:bg-slate-100'
                  }`}>
                  <Icon className="w-5 h-5" /> {item.label}
                </Link>
              );
            })}
          </div>
          <div className="glass-soft p-6">
            <Outlet context={{ project }} />
          </div>
        </div>
      </div>
      <AIAssistant context="workspace" />
    </div>
  );
}
