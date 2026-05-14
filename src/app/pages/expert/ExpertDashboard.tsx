import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket, Search, Star, TrendingUp, Briefcase, Award, LogOut, Bell, CheckCircle } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';
import { ThemeToggle } from '../../components/ThemeToggle';

export function ExpertDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const opps = await api.get('/marketplace', token || undefined);
        setOpportunities(opps);
        const projs = await api.get('/projects', token || undefined);
        setAllProjects(projs);
        setActiveProjects(projs.filter((p: any) => p.status === 'in_progress'));
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchData();
  }, [token]);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Calculer les stats réelles
  const completedProjects = allProjects.filter((p: any) => p.status === 'completed');
  const totalProposals = allProjects.reduce((acc: number, p: any) => acc + (p._count?.proposals || 0), 0);

  return (
    <div className="min-h-screen bg-main overflow-hidden relative">
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
              <Link to="/expert" className="text-blue-200 light:text-blue-600 font-medium">Tableau de bord</Link>
              <Link to="/expert/projects" className="text-blue-100/70 light:text-slate-500 hover:text-blue-100 light:hover:text-blue-600 transition-colors">Opportunités</Link>
              <Link to="/expert/profile" className="text-blue-100/70 light:text-slate-500 hover:text-blue-100 light:hover:text-blue-600 transition-colors">Mon profil</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative w-10 h-10 bg-black/20 light:bg-slate-100 rounded-lg hover:bg-black/30 light:hover:bg-slate-200 transition-colors flex items-center justify-center border border-white/10 light:border-slate-200">
              <Bell className="w-5 h-5 text-blue-100/70 light:text-slate-600" />
              {opportunities.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="text-right">
              <div className="text-sm font-medium text-white light:text-slate-900">{user?.fullName || 'Expert IT'}</div>
              <div className="text-xs text-blue-100/60 light:text-slate-500">{user?.email || 'expert@demo.com'}</div>
            </div>
            <button onClick={handleLogout} className="w-10 h-10 bg-black/20 light:bg-slate-100 rounded-lg hover:bg-black/30 light:hover:bg-slate-200 transition-colors flex items-center justify-center border border-white/10 light:border-slate-200">
              <LogOut className="w-5 h-5 text-blue-100/70 light:text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-2">Tableau de bord Expert</h1>
          <p className="text-blue-100/80 light:text-slate-600">Gérez vos missions et trouvez de nouvelles opportunités</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Projets actifs', value: activeProjects.length, icon: Briefcase, color: 'blue' },
            { label: 'Opportunités', value: opportunities.length, icon: TrendingUp, color: 'cyan' },
            { label: 'Projets complétés', value: completedProjects.length, icon: CheckCircle, color: 'green' },
            { label: 'Total projets', value: allProjects.length, icon: Award, color: 'purple' },
          ].map((item, i) => (
            <div key={i} className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 shadow-2xl light:shadow-sm backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-blue-100/70 light:text-slate-500 font-medium">{item.label}</div>
                <item.icon className={`w-5 h-5 text-${item.color}-300 light:text-${item.color}-600`} />
              </div>
              <div className="text-3xl font-bold text-white light:text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white light:text-slate-900">Opportunités correspondantes</h2>
                <Link to="/expert/projects" className="flex items-center gap-2 text-blue-200 light:text-blue-600 hover:text-blue-100 font-medium transition-colors">
                  <Search className="w-4 h-4" /> Rechercher
                </Link>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="p-12 text-center text-blue-100/60 light:text-slate-500 bg-black/40 light:bg-white/80 rounded-xl border border-white/10 light:border-slate-200 backdrop-blur-3xl">Analyse des opportunités en cours...</div>
                ) : opportunities.length === 0 ? (
                  <div className="p-12 text-center text-blue-100/60 light:text-slate-500 bg-black/40 light:bg-white/80 rounded-xl border border-white/10 light:border-slate-200 backdrop-blur-3xl">Aucune opportunité disponible actuellement.</div>
                ) : opportunities.map((opp: any) => {
                  const projectTags = opp.techStack || [];
                  const userSkills = user?.skills || [];
                  const matches = projectTags.filter((tag: string) => userSkills.includes(tag));
                  const matchScore = projectTags.length > 0 ? Math.round((matches.length / projectTags.length) * 100) : 0;
                  return (
                    <div key={opp.id} className="bg-black/40 light:bg-white/80 rounded-xl p-8 border border-white/10 light:border-slate-200 hover:border-blue-400/30 hover:shadow-2xl light:hover:shadow-lg transition-all group backdrop-blur-3xl">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-white light:text-slate-900 group-hover:text-blue-200 light:group-hover:text-blue-600 transition-colors">{opp.title}</h3>
                            {opp.hasApplied && (<span className="px-3 py-1 bg-black/60 light:bg-slate-200 text-white light:text-slate-700 rounded-full text-xs font-black uppercase tracking-wider border border-white/10 light:border-slate-300">DÉJÀ POSTULÉ</span>)}
                            {matchScore > 50 && !opp.hasApplied && (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${matchScore >= 80 ? 'bg-green-500/20 text-green-200 light:text-green-700 border border-green-400/30' : 'bg-blue-500/20 text-blue-200 light:text-blue-700 border border-blue-400/30'}`}>{matchScore}% MATCH</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-blue-100/70 light:text-slate-500 mb-4 font-medium">
                            <span className="text-white light:text-slate-900">{opp.client?.company || opp.client?.fullName || 'Client Nexcore'}</span>
                            <span className="w-1 h-1 bg-blue-400/50 light:bg-slate-300 rounded-full"></span>
                            <span className="px-2 py-0.5 bg-black/20 light:bg-slate-100 text-blue-100/80 light:text-slate-600 rounded border border-white/10 light:border-slate-200">IT & Digital</span>
                            <span className="w-1 h-1 bg-blue-400/50 light:bg-slate-300 rounded-full"></span>
                            <span>{opp._count?.proposals || 0} propositions</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {projectTags.map((tag: string) => (
                              <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold ${userSkills.includes(tag) ? 'bg-blue-500/20 text-blue-200 light:text-blue-700 border border-blue-400/30' : 'bg-black/20 light:bg-slate-100 text-blue-100/70 light:text-slate-600 border border-white/10 light:border-slate-200'}`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-black text-white light:text-slate-900">{opp.budget || 'À définir'}</div>
                          <div className="text-sm text-blue-100/50 light:text-slate-400 font-bold uppercase tracking-tight">{opp.timeline || 'Sur devis'}</div>
                        </div>
                      </div>
                      <Link to={`/expert/projects/${opp.id}`} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white rounded-xl hover:shadow-xl transition-all font-bold border border-white/10">
                        Voir les détails et postuler
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white light:text-slate-900 mb-4">Projets en cours</h2>
              <div className="space-y-4">
                {activeProjects.length === 0 ? (
                  <div className="p-8 text-center text-blue-100/60 light:text-slate-500 bg-black/40 light:bg-white/80 rounded-xl border border-white/10 light:border-slate-200 backdrop-blur-3xl">Vous n'avez aucun projet en cours pour le moment.</div>
                ) : activeProjects.map((project: any) => (
                  <div key={project.id} className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-blue-100/70 light:text-slate-500">{project.client?.company || project.client?.fullName || 'Client Nexcore'}</p>
                      </div>
                      <Link to={`/workspace/${project.id}`} className="px-4 py-2 text-blue-200 light:text-blue-600 hover:text-blue-100 border-2 border-blue-400/30 rounded-lg hover:border-blue-400/50 transition-colors font-bold text-sm">Accéder à l'espace</Link>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-100/70 light:text-slate-500">Statut: <span className="text-blue-200 light:text-blue-600 font-bold uppercase text-xs">{project.status === 'in_progress' ? 'En cours' : project.status}</span></span>
                      <span className="text-blue-100/50 light:text-slate-400">Créé le: {new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-xl p-6 border backdrop-blur-3xl ${user?.isVerified !== false ? 'bg-gradient-to-br from-blue-600/90 to-cyan-400/40 text-white border-white/10' : 'bg-orange-500/10 text-orange-200 border-orange-400/30'}`}>
              {user?.isVerified !== false ? (
                <>
                  <Award className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Profil Vérifié</h3>
                  <p className="text-sm text-blue-100 mb-4">Votre profil est vérifié et validé par Nexcore. Vous êtes visible sur le marketplace.</p>
                </>
              ) : (
                <>
                  <Star className="w-8 h-8 mb-3 text-orange-300" />
                  <h3 className="text-xl font-semibold mb-2">Profil en attente</h3>
                  <p className="text-sm text-orange-100 mb-4">Votre profil est en cours de vérification par l'équipe Nexcore.</p>
                </>
              )}
              <Link to="/expert/profile" className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm">Voir mon profil</Link>
            </div>
            <div className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <h3 className="font-semibold text-white light:text-slate-900 mb-4">Résumé</h3>
              <div className="space-y-3">
                {[
                  { label: 'Projets actifs', value: String(activeProjects.length), color: 'text-blue-300 light:text-blue-600' },
                  { label: 'Projets complétés', value: String(completedProjects.length), color: 'text-green-300 light:text-green-600' },
                  { label: 'Opportunités disponibles', value: String(opportunities.length), color: 'text-cyan-300 light:text-cyan-600' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-blue-100/70 light:text-slate-500">{stat.label}</span>
                    <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AIAssistant context="expert" />
    </div>
  );
}
