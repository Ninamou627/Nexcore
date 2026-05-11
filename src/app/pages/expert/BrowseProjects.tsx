import { Link } from 'react-router';
import { Rocket, Search, Filter, DollarSign, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIAssistant } from '../../components/AIAssistant';
import { AlertActivationModal } from '../../components/AlertActivationModal';
import { useAuth } from '../../core/stores/auth';
import { api } from '../../core/services/api';

export function BrowseProjects() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Tous les projets' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'security', label: 'Sécurité' },
    { id: 'web', label: 'Web' },
  ];

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get('/marketplace', token || undefined);
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [token]);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all'; // Temporairement simplifié car le champ catégorie n'est pas en DB
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.techStack || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
              <Link to="/expert" className="text-slate-600 hover:text-slate-900 transition-colors">
                Tableau de bord
              </Link>
              <Link to="/expert/projects" className="text-indigo-600 font-medium">
                Opportunités
              </Link>
              <Link to="/expert/profile" className="text-slate-600 hover:text-slate-900 transition-colors">
                Mon profil
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Opportunités de projets</h1>
          <p className="text-slate-600">Trouvez les projets qui correspondent à vos compétences</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="size-5 text-slate-900" />
                <h3 className="font-semibold text-slate-900">Filtres</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Catégorie
                  </label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget minimum
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="number"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="5 000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Délai maximum
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <select className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none">
                      <option>Tous</option>
                      <option>1 mois</option>
                      <option>2 mois</option>
                      <option>3 mois</option>
                      <option>6 mois</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-semibold text-slate-900 mb-2">Alertes intelligentes</h3>
              <p className="text-sm text-slate-600 mb-3">
                Recevez des notifications pour les projets qui correspondent à vos compétences
              </p>
              <button
                onClick={() => setAlertModalOpen(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm"
              >
                Activer les alertes
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Rechercher par titre, technologie..."
                />
              </div>
            </div>

            <div className="mb-4 text-sm text-slate-600">
              {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                  Chargement des opportunités...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                  Aucun projet trouvé.
                </div>
              ) : filteredProjects.map((project: any) => {
                const projectTags = project.techStack || [];
                const userSkills = user?.skills || [];
                const matches = projectTags.filter((tag: string) => userSkills.includes(tag));
                const matchScore = projectTags.length > 0 
                  ? Math.round((matches.length / projectTags.length) * 100) 
                  : 0;

                return (
                  <div key={project.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
                          {project.hasApplied && (
                            <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-wider">
                              DÉJÀ POSTULÉ
                            </span>
                          )}
                          {!project.hasApplied && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              matchScore >= 80
                                ? 'bg-green-100 text-green-700'
                                : matchScore >= 50
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {matchScore}% match
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3 font-medium">
                          <span>{project.client?.company || project.client?.fullName || 'Client Nexcore'}</span>
                          <span>•</span>
                          <span>Publié récemment</span>
                        </div>
                        <p className="text-slate-700 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {projectTags.map((tag: string) => (
                            <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${
                              userSkills.includes(tag) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4 min-w-[140px]">
                        <div className="text-xl font-bold text-slate-900 mb-1">{project.budget || 'À définir'}</div>
                        <div className="text-sm text-slate-500 mb-4 uppercase font-bold tracking-tight">{project.timeline || 'Sur devis'}</div>
                        <Link
                          to={`/expert/projects/${project.id}`}
                          className={`inline-block w-full px-4 py-2 rounded-lg transition-shadow text-sm font-bold text-center ${
                            project.hasApplied 
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                          }`}
                        >
                          {project.hasApplied ? 'Voir ma proposition' : 'Détails'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AIAssistant context="expert" />

      <AlertActivationModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        onActivate={(preferences) => {
          console.log('Alert preferences:', preferences);
        }}
      />
    </div>
  );
}
