import { Link, useParams, useNavigate } from 'react-router';
import { Rocket, ArrowLeft, DollarSign, Calendar, Building2, FileText, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIAssistant } from '../../components/AIAssistant';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function ProjectOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [proposal, setProposal] = useState({
    approach: '',
    timeline: '',
    budget: '',
    methodology: '',
    experience: '',
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await api.get(`/marketplace/${id}`, token || undefined);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id, token]);

  // Écouter les événements de remplissage automatique de l'IA
  useEffect(() => {
    const handleFillForm = (e: any) => {
      const data = e.detail;
      setProposal(prev => ({
        ...prev,
        approach: data.approach || prev.approach,
        methodology: data.methodology || prev.methodology,
        experience: data.experience || prev.experience,
        budget: data.proposedPrice?.toString() || data.budget || prev.budget,
        timeline: data.timeline || prev.timeline,
      }));
    };

    window.addEventListener('nexcore:fill-proposal', handleFillForm);
    return () => window.removeEventListener('nexcore:fill-proposal', handleFillForm);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/marketplace/${id}/proposals`, {
        ...proposal,
        proposedPrice: proposal.budget // Mapper budget vers proposedPrice pour le backend
      }, token || undefined);
      alert("Votre proposition a été envoyée avec succès !");
      navigate('/expert');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la proposition.");
    }
  };

  if (isLoading) return <div className="p-12 text-center text-blue-100">Chargement de l'opportunité...</div>;
  if (!project) return <div className="p-12 text-center text-red-400">Opportunité introuvable.</div>;

  return (
    <div className="glass-shell text-white min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-900/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      </div>

      <nav className="glass-panel border border-white/10 light:border-slate-200 shadow-2xl shadow-blue-900/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Rocket className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white light:text-slate-900">Nexcore Hub</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/expert/projects" className="inline-flex items-center gap-2 text-blue-200 light:text-blue-600 hover:text-white light:hover:text-blue-800 mb-6">
          <ArrowLeft className="size-4" />
          Retour aux opportunités
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card rounded-[2rem] p-8 border border-white/10 light:border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-white light:text-slate-900">{project.title}</h1>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-200 light:text-green-600 border border-green-400/30 light:border-green-300">
                  95% correspondance
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-blue-100/80 light:text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-blue-200 light:text-blue-600" />
                  {project.client?.company || project.client?.fullName || 'Client Nexcore'}
                </div>
                <span className="px-2 py-1 bg-white/5 light:bg-slate-100 rounded text-blue-100 light:text-slate-700">IT & Digital</span>
                <span>Publié récemment</span>
              </div>

              <div className="prose prose-slate max-w-none mb-6 text-blue-100/70 light:text-slate-700">
                <p className="whitespace-pre-wrap">{project.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(project.techStack || []).map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-blue-500/10 light:bg-blue-50 text-blue-200 light:text-blue-600 rounded-lg text-sm border border-blue-400/20 light:border-blue-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8 border border-white/10 light:border-slate-200">
              {project.hasApplied ? (
                <div className="py-12 text-center space-y-6">
                  <div className="size-20 bg-green-500/10 light:bg-green-50 text-green-200 light:text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="size-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white light:text-slate-900 mb-2">Proposition déjà envoyée !</h2>
                    <p className="text-blue-100/70 light:text-slate-600">Vous avez déjà soumis une proposition pour ce projet. Le client l'étudiera prochainement.</p>
                  </div>
                  <Link
                    to="/expert"
                    className="inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Retour au tableau de bord
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white light:text-slate-900 mb-6">Soumettre une proposition</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-100/80 light:text-slate-600 mb-2">
                        Approche technique proposée *
                      </label>
                      <textarea
                        value={proposal.approach}
                        onChange={(e) => setProposal({ ...proposal, approach: e.target.value })}
                        className="w-full px-4 py-3 border border-white/10 light:border-slate-300 rounded-2xl bg-black/30 light:bg-white text-white light:text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-400"
                        rows={5}
                        placeholder="Décrivez votre approche technique pour réaliser ce projet..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-100/80 light:text-slate-600 mb-2">
                        Méthodologie de travail *
                      </label>
                      <textarea
                        value={proposal.methodology}
                        onChange={(e) => setProposal({ ...proposal, methodology: e.target.value })}
                        className="w-full px-4 py-3 border border-white/10 light:border-slate-300 rounded-2xl bg-black/30 light:bg-white text-white light:text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-400"
                        rows={4}
                        placeholder="Comment allez-vous organiser le projet ? (Agile, jalons, communication...)"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-100/80 light:text-slate-600 mb-2">
                        Expérience pertinente
                      </label>
                      <textarea
                        value={proposal.experience}
                        onChange={(e) => setProposal({ ...proposal, experience: e.target.value })}
                        className="w-full px-4 py-3 border border-white/10 light:border-slate-300 rounded-2xl bg-black/30 light:bg-white text-white light:text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-400"
                        rows={4}
                        placeholder="Décrivez vos projets similaires et votre expertise dans ce domaine..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-100/80 light:text-slate-600 mb-2">
                          Votre proposition de budget *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-blue-200 light:text-blue-600" />
                          <input
                            type="text"
                            value={proposal.budget}
                            onChange={(e) => setProposal({ ...proposal, budget: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-white/10 light:border-slate-300 rounded-2xl bg-black/30 light:bg-white text-white light:text-slate-900 placeholder:text-slate-400 placeholder-blue-100/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Ex: 16 500 €"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-100/80 light:text-slate-600 mb-2">
                          Délai de réalisation *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-blue-200 light:text-blue-600" />
                          <input
                            type="text"
                            value={proposal.timeline}
                            onChange={(e) => setProposal({ ...proposal, timeline: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-white/10 light:border-slate-300 rounded-2xl bg-black/30 light:bg-white text-white light:text-slate-900 placeholder:text-slate-400 placeholder-blue-100/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Ex: 10 semaines"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 light:bg-blue-50 border border-blue-400/20 light:border-blue-200 rounded-2xl p-4 text-blue-100 light:text-slate-700">
                      <div className="flex items-start gap-3">
                        <FileText className="size-5 text-blue-200 light:text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-100/85 light:text-slate-600">
                          <strong>Conseil :</strong> Utilisez l'assistant IA pour vous aider à rédiger une proposition convaincante et adaptée au projet.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-shadow font-medium"
                      >
                        <Send className="size-5" />
                        Envoyer la proposition
                      </button>
                      <Link
                        to="/expert/projects"
                        className="px-6 py-3 border border-white/10 light:border-slate-300 text-blue-100 light:text-slate-600 rounded-2xl hover:border-blue-300 light:hover:bg-slate-100 transition-colors"
                      >
                        Annuler
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-[2rem] p-6 border border-white/10 light:border-slate-200">
              <h3 className="font-semibold text-white light:text-slate-900 mb-4">Détails du projet</h3>
              <div className="space-y-3 text-sm text-blue-100/80 light:text-slate-600">
                <div>
                  <div className="text-blue-100/70 light:text-slate-500">Budget client</div>
                  <div className="font-semibold text-white light:text-slate-900 text-lg">{project.budget || 'À définir'}</div>
                </div>
                <div>
                  <div className="text-blue-100/70 light:text-slate-500">Délai souhaité</div>
                  <div className="font-semibold text-white light:text-slate-900">{project.timeline || 'À définir'}</div>
                </div>
                <div>
                  <div className="text-blue-100/70 light:text-slate-500">Catégorie</div>
                  <div className="font-semibold text-white light:text-slate-900">IT & Digital</div>
                </div>
              </div>
            </div>

            <div className="glass-soft rounded-[2rem] p-6 border border-blue-400/20 light:border-blue-300">
              <h3 className="font-semibold text-white light:text-slate-900 mb-2">Conseils pour votre proposition</h3>
              <ul className="text-sm text-blue-100/80 light:text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 light:text-blue-600 mt-0.5">•</span>
                  <span>Démontrez votre compréhension du besoin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 light:text-blue-600 mt-0.5">•</span>
                  <span>Mettez en valeur votre expérience et vos références</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 light:text-blue-600 mt-0.5">•</span>
                  <span>Proposez un planning clair et un budget adapté</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 light:text-blue-600 mt-0.5">•</span>
                  <span>Expliquez votre méthodologie de travail</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant context="expert" />
    </div>
  );
}
