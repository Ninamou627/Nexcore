import { Link, Outlet, useParams, useOutletContext } from 'react-router';
import { Rocket, LayoutDashboard, ListChecks, MessageSquare, FolderOpen, Users, ArrowLeft } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { useState, useEffect } from 'react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

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
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id, token]);

  const navItems = [
    { path: `/workspace/${id}`, label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { path: `/workspace/${id}/milestones`, label: 'Jalons', icon: ListChecks },
    { path: `/workspace/${id}/messages`, label: 'Messagerie', icon: MessageSquare },
    { path: `/workspace/${id}/files`, label: 'Fichiers', icon: FolderOpen },
  ];

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-outfit">Chargement du workspace...</div>;
  if (!project) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-outfit text-red-500">Workspace introuvable.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Rocket className="size-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">Nexcore Hub</span>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-slate-400" />
              <span className="text-slate-900 font-medium">Plateforme RH Digitale</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/client" className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="flex items-center border-b border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="p-6">
            <Outlet context={{ project }} />
          </div>
        </div>
      </div>

      <AIAssistant context="workspace" />
    </div>
  );
}
