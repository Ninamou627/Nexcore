import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Rocket, FileText, Clock, CheckCircle, Users, TrendingUp, LogOut, Shield } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';
import { ThemeToggle } from '../../components/ThemeToggle';

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
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchProjects();
  }, [token]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const statusConfig = {
    matching: { label: 'Recherche agence', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
    completed: { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  };

  return (
    <div className="min-h-screen bg-main overflow-hidden relative font-outfit">
      <div className="fixed inset-0 -z-10 overflow-hidden light:hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-900/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
      </div>

      <nav className="bg-black/40 light:bg-white/85 border-b border-white/10 light:border-slate-200 backdrop-blur-3xl relative z-20 light:shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/40 to-cyan-400/20 rounded-xl flex items-center justify-center backdrop-blur-2xl border border-white/10 shadow-lg shadow-blue-900/20">
                <Rocket className="w-6 h-6 text-blue-200 light:text-blue-600" />
              </div>
              <span className="text-xl font-semibold text-white light:text-slate-900">Nexcore Hub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/client" className="text-blue-200 light:text-blue-600 font-medium">Tableau de bord</Link>
              <Link to="/client/projects" className="text-blue-100/70 light:text-slate-500 hover:text-blue-100 light:hover:text-blue-600 transition-colors">Mes projets</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/client/profile" className="flex items-center gap-3 px-3 py-1.5 hover:bg-black/20 light:hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-white/10 light:hover:border-slate-200 group">
              <div className="text-right">
                <div className="text-sm font-medium text-white light:text-slate-900 group-hover:text-blue-200 light:group-hover:text-blue-600 transition-colors">{user?.fullName || 'Utilisateur'}</div>
                <div className="text-xs text-blue-100/60 light:text-slate-500">{user?.email || 'email@demo.com'}</div>
              </div>
              <div className="w-8 h-8 bg-blue-500/20 text-blue-300 light:text-blue-600 rounded-lg flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
            </Link>
            <button onClick={handleLogout} className="w-10 h-10 bg-black/20 light:bg-slate-100 rounded-lg hover:bg-black/30 light:hover:bg-slate-200 transition-colors flex items-center justify-center border border-white/10 light:border-slate-200">
              <LogOut className="w-5 h-5 text-blue-100/70 light:text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white light:text-slate-900 mb-2 tracking-tight">Tableau de bord</h1>
          <p className="text-blue-100/80 light:text-slate-600 text-lg">Gérez vos projets de digitalisation en un seul endroit</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/40 light:bg-white/80 rounded-3xl p-6 border border-white/10 light:border-slate-200 shadow-2xl shadow-blue-900/20 light:shadow-sm backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70 light:text-slate-500 font-bold uppercase tracking-wider">Projets actifs</div>
              <div className="w-10 h-10 bg-blue-500/20 text-blue-300 light:text-blue-600 rounded-xl flex items-center justify-center border border-blue-400/30">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-white light:text-slate-900">{projects.filter((p: any) => p.status === 'in_progress').length}</div>
          </div>
          <div className="bg-black/40 light:bg-white/80 rounded-3xl p-6 border border-white/10 light:border-slate-200 shadow-2xl shadow-cyan-900/20 light:shadow-sm backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70 light:text-slate-500 font-bold uppercase tracking-wider">Appels d'offres</div>
              <div className="w-10 h-10 bg-cyan-500/20 text-cyan-300 light:text-cyan-600 rounded-xl flex items-center justify-center border border-cyan-400/30">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-white light:text-slate-900">{projects.filter((p: any) => p.status === 'matching').length}</div>
          </div>
          <div className="bg-black/40 light:bg-white/80 rounded-3xl p-6 border border-white/10 light:border-slate-200 shadow-2xl shadow-green-900/20 light:shadow-sm backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70 light:text-slate-500 font-bold uppercase tracking-wider">Projets terminés</div>
              <div className="w-10 h-10 bg-green-500/20 text-green-300 light:text-green-600 rounded-xl flex items-center justify-center border border-green-400/30">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-white light:text-slate-900">{projects.filter((p: any) => p.status === 'completed').length}</div>
          </div>
          <div className="bg-black/40 light:bg-white/80 rounded-3xl p-6 border border-white/10 light:border-slate-200 shadow-2xl shadow-purple-900/20 light:shadow-sm backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70 light:text-slate-500 font-bold uppercase tracking-wider">Total Projets</div>
              <div className="w-10 h-10 bg-purple-500/20 text-purple-300 light:text-purple-600 rounded-xl flex items-center justify-center border border-purple-400/30">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-4xl font-black text-white light:text-slate-900">{projects.length}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white light:text-slate-900 tracking-tight">Projets récents</h2>
          <Link to="/client/project/new" className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white rounded-2xl hover:shadow-xl transition-all font-bold text-sm border border-white/10">
            <Plus className="w-5 h-5" /> Nouveau projet
          </Link>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="p-16 text-center text-blue-100/60 light:text-slate-500 bg-black/40 light:bg-white/80 rounded-3xl border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <Rocket className="w-12 h-12 mx-auto mb-4 animate-pulse opacity-40" />
              <p className="font-bold text-white light:text-slate-900">Chargement de votre univers...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-16 text-center bg-black/40 light:bg-white/80 rounded-3xl border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <div className="w-20 h-20 bg-black/20 light:bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 light:border-slate-200">
                <Rocket className="w-10 h-10 opacity-40 text-blue-100/60 light:text-slate-400" />
              </div>
              <p className="text-xl font-bold text-white light:text-slate-900 mb-2">Aucun projet pour le moment</p>
              <p className="mb-8 text-blue-100/70 light:text-slate-500">Commencez votre transformation digitale dès maintenant !</p>
              <Link to="/client/project/new" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all border border-white/10">
                Créer mon premier projet
              </Link>
            </div>
          ) : projects.map((project: any) => {
            const sc = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.matching;
            const StatusIcon = sc.icon;
            return (
              <Link key={project.id} to={`/client/project/${project.id}`}
                className="block bg-black/40 light:bg-white/80 rounded-[2rem] p-8 border border-white/10 light:border-slate-200 hover:shadow-2xl hover:shadow-blue-900/30 light:hover:shadow-lg transition-all group backdrop-blur-3xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white light:text-slate-900 mb-3 group-hover:text-blue-200 light:group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100/70 light:text-slate-500 font-bold">
                      <span className="px-4 py-1.5 bg-black/20 light:bg-slate-100 text-blue-100/80 light:text-slate-600 rounded-xl text-xs uppercase tracking-widest border border-white/10 light:border-slate-200">{project.techStack?.[0] || 'Digital'}</span>
                      <span className="text-white light:text-slate-900 font-black">{project.budget || 'Non défini'}</span>
                      <span className="text-blue-100/50 light:text-slate-400">Créé le {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-3xl font-black text-white light:text-slate-900">{project._count?.proposals || 0}</div>
                      <div className="text-xs text-blue-100/50 light:text-slate-400 uppercase tracking-widest font-black">offres</div>
                    </div>
                    <span className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest backdrop-blur-sm ${
                      project.status === 'matching' ? 'bg-yellow-500/20 text-yellow-200 light:text-yellow-700 border border-yellow-400/30' :
                      project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-200 light:text-blue-700 border border-blue-400/30' :
                      'bg-green-500/20 text-green-200 light:text-green-700 border border-green-400/30'
                    }`}>
                      <StatusIcon className="w-4 h-4" /> {sc.label}
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
