import { Link, useNavigate } from 'react-router';
import { Rocket, Plus, Clock, CheckCircle, TrendingUp, LogOut, Filter } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { useState, useEffect } from 'react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function MyProjects() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get('/projects', token || undefined);
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

  const statusConfig: any = {
    matching: { label: 'Recherche Expert', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
    completed: { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  };

  const filteredProjects = filterStatus === 'all'
    ? projects
    : projects.filter(p => p.status === filterStatus);

  const logout = useAuth((state: any) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Rocket className="size-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">Nexcore Hub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/client" className="text-slate-600 hover:text-slate-900 transition-colors">
                Tableau de bord
              </Link>
              <Link to="/client/projects" className="text-blue-600 font-medium">
                Mes projets
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{user?.fullName || 'Entreprise Demo'}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="size-10 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
            >
              <LogOut className="size-5 text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes projets</h1>
            <p className="text-slate-600">Gérez et suivez tous vos projets de digitalisation</p>
          </div>
          <Link
            to="/client/project/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow font-bold"
          >
            <Plus className="size-5" />
            Nouveau projet
          </Link>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="size-5 text-slate-600" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tous ({projects.length})
              </button>
              <button
                onClick={() => setFilterStatus('matching')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'matching'
                    ? 'bg-yellow-100 text-yellow-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Recherche Expert ({projects.filter(p => p.status === 'matching').length})
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'in_progress'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                En cours ({projects.filter(p => p.status === 'in_progress').length})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Terminés ({projects.filter(p => p.status === 'completed').length})
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
              Chargement de vos projets...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
              Aucun projet trouvé.
            </div>
          ) : filteredProjects.map((project: any) => {
            const config = statusConfig[project.status] || statusConfig.matching;
            const StatusIcon = config.icon;
            return (
              <Link
                key={project.id}
                to={`/client/project/${project.id}`}
                className="block bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider">IT & Digital</span>
                      <span>{project.budget || 'À définir'}</span>
                      <span>Créé le {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">{project._count?.proposals || 0}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">propositions</div>
                    </div>
                    <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${config.color}`}>
                      <StatusIcon className="size-4" />
                      {config.label}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <AIAssistant context="client" />
    </div>
  );
}
