import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Rocket, FileText, Clock, CheckCircle, Users, TrendingUp, LogOut } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function ClientDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statusConfig = {
    matching: { label: 'Recherche agence', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
    completed: { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
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
              <Link to="/client" className="text-blue-600 font-medium">
                Tableau de bord
              </Link>
              <Link to="/client/projects" className="text-slate-600 hover:text-slate-900 transition-colors">
                Mes projets
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{user?.fullName || 'Utilisateur'}</div>
              <div className="text-xs text-slate-500">{user?.email || 'email@demo.com'}</div>
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
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-600 text-lg">Gérez vos projets de digitalisation en un seul endroit</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-blue-100/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Projets actifs</div>
              <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900">{projects.filter((p: any) => p.status === 'in_progress').length}</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-indigo-100/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Appels d'offres</div>
              <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="size-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900">{projects.filter((p: any) => p.status === 'matching').length}</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-green-100/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Projets terminés</div>
              <div className="size-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="size-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900">{projects.filter((p: any) => p.status === 'completed').length}</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-purple-100/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Projets</div>
              <div className="size-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="size-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900">{projects.length}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Projets récents</h2>
          <Link
            to="/client/project/new"
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-200 transition-all font-bold text-sm"
          >
            <Plus className="size-5" />
            Nouveau projet
          </Link>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-100">
              <Rocket className="size-12 mx-auto mb-4 animate-pulse opacity-20" />
              <p className="font-bold">Chargement de votre univers...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-100">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="size-10 opacity-20" />
              </div>
              <p className="text-xl font-bold text-slate-900 mb-2">Aucun projet pour le moment</p>
              <p className="mb-8">Commencez votre transformation digitale dès maintenant !</p>
              <Link
                to="/client/project/new"
                className="inline-block px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Créer mon premier projet
              </Link>
            </div>
          ) : projects.map((project: any) => {
            const sc = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.matching;
            const StatusIcon = sc.icon;
            return (
              <Link
                key={project.id}
                to={`/client/project/${project.id}`}
                className="block bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-bold">
                      <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs uppercase tracking-widest border border-slate-100">{project.techStack?.[0] || 'Digital'}</span>
                      <span className="text-slate-900 font-black">{project.budget || 'Non défini'}</span>
                      <span className="text-slate-400">Créé le {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-3xl font-black text-slate-900">{project._count?.proposals || 0}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-black">offres</div>
                    </div>
                    <span className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest ${sc.color}`}>
                      <StatusIcon className="size-4" />
                      {sc.label}
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
