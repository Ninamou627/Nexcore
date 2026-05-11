import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket, Search, Star, TrendingUp, Briefcase, Award, LogOut, Bell } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function ExpertDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const opps = await api.get('/marketplace', token || undefined);
        setOpportunities(opps);
        
        const projs = await api.get('/projects', token || undefined);
        setActiveProjects(projs.filter((p: any) => p.status === 'in_progress'));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="size-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">Nexcore Hub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/expert" className="text-indigo-600 font-medium">
                Tableau de bord
              </Link>
              <Link to="/expert/projects" className="text-slate-600 hover:text-slate-900 transition-colors">
                Opportunités
              </Link>
              <Link to="/expert/profile" className="text-slate-600 hover:text-slate-900 transition-colors">
                Mon profil
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative size-10 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center">
              <Bell className="size-5 text-slate-600" />
              <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{user?.fullName || 'Expert IT'}</div>
              <div className="text-xs text-slate-500">{user?.email || 'expert@demo.com'}</div>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord Expert</h1>
          <p className="text-slate-600">Gérez vos missions et trouvez de nouvelles opportunités</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 font-medium">Projets actifs</div>
              <Briefcase className="size-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{activeProjects.length}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 font-medium">Opportunités</div>
              <TrendingUp className="size-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{opportunities.length}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 font-medium">Note moyenne</div>
              <Star className="size-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">4.8</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 font-medium">Projets complétés</div>
              <Award className="size-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">47</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Opportunités correspondantes</h2>
                <Link
                  to="/expert/projects"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  <Search className="size-4" />
                  Rechercher
                </Link>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                    Analyse des opportunités en cours...
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                    Aucune opportunité disponible actuellement.
                  </div>
                ) : opportunities.map((opp: any) => {
                  // Calcul simple du score de matching
                  const projectTags = opp.techStack || [];
                  const userSkills = user?.skills || [];
                  const matches = projectTags.filter((tag: string) => userSkills.includes(tag));
                  const matchScore = projectTags.length > 0 
                    ? Math.round((matches.length / projectTags.length) * 100) 
                    : 0;

                  return (
                    <div key={opp.id} className="bg-white rounded-xl p-8 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{opp.title}</h3>
                            {opp.hasApplied && (
                              <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-wider">
                                DÉJÀ POSTULÉ
                              </span>
                            )}
                            {matchScore > 50 && !opp.hasApplied && (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                matchScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {matchScore}% MATCH
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 font-medium">
                            <span className="text-slate-900">{opp.client?.company || opp.client?.fullName || 'Client Nexcore'}</span>
                            <span className="size-1 bg-slate-300 rounded-full"></span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">IT & Digital</span>
                            <span className="size-1 bg-slate-300 rounded-full"></span>
                            <span>{opp._count?.proposals || 0} propositions</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {projectTags.map((tag: string) => (
                              <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold ${
                                userSkills.includes(tag) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-black text-slate-900">{opp.budget || 'À définir'}</div>
                          <div className="text-sm text-slate-500 font-bold uppercase tracking-tight">{opp.timeline || 'Sur devis'}</div>
                        </div>
                      </div>
                      <Link
                        to={`/expert/projects/${opp.id}`}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
                      >
                        Voir les détails et postuler
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Projets en cours</h2>
              <div className="space-y-4">
                {activeProjects.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                    Vous n'avez aucun projet en cours pour le moment.
                  </div>
                ) : activeProjects.map((project: any) => (
                  <div key={project.id} className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-slate-600">{project.client?.company || project.client?.fullName || 'Client Nexcore'}</p>
                      </div>
                      <Link
                        to={`/workspace/${project.id}`}
                        className="px-4 py-2 text-indigo-600 hover:text-indigo-700 border-2 border-indigo-200 rounded-lg hover:border-indigo-300 transition-colors font-bold text-sm"
                      >
                        Accéder à l'espace
                      </Link>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">Progression</span>
                        <span className="font-semibold text-slate-900">{project.progress || 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Statut: <span className="text-indigo-600 font-bold uppercase text-xs">{project.status}</span></span>
                      <span className="text-slate-500">Créé le: {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-6">
              <Award className="size-8 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Profil Vérifié</h3>
              <p className="text-sm text-indigo-100 mb-4">
                Votre profil est vérifié et validé par Nexcore. Vous avez 2× plus de chances d'être sélectionné.
              </p>
              <Link
                to="/expert/profile"
                className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                Voir mon profil
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Statistiques ce mois</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Propositions envoyées</span>
                  <span className="font-semibold text-slate-900">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Taux d'acceptation</span>
                  <span className="font-semibold text-green-600">62%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Revenus générés</span>
                  <span className="font-semibold text-slate-900">32 000 €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant context="expert" />
    </div>
  );
}
