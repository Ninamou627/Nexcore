import { Link, useParams, useNavigate } from 'react-router';
import { Rocket, ArrowLeft, Star, MapPin, Award, ExternalLink, MessageCircle, CheckCircle, Calendar, Clock, Sparkles, Target } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { useState, useEffect } from 'react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAcceptCount, setAutoAcceptCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, proposalsData] = await Promise.all([
          api.get(`/projects/${id}`, token || undefined),
          api.get(`/projects/${id}/proposals`, token || undefined)
        ]);
        setProject(projectData);
        setProposals(proposalsData);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchData();
  }, [id, token]);

  const handleAnalyzeProposals = async () => {
    setIsAnalyzing(true); setAnalysis(null);
    try {
      const result = await api.post(`/projects/${id}/analyze-proposals`, {}, token || undefined);
      setAnalysis(result.recommendation);
      if (result.recommendation.matchingScore >= 90) {
        let count = 5; setAutoAcceptCount(count);
        const timer = setInterval(() => { count -= 1; setAutoAcceptCount(count); if (count === 0) { clearInterval(timer); handleAcceptProposal(result.recommendation.proposalId, true); } }, 1000);
      }
    } catch (err) { console.error(err); alert("Erreur lors de l'analyse IA."); } finally { setIsAnalyzing(false); }
  };

  const handleAcceptProposal = async (proposalId: string, isAuto = false) => {
    if (!isAuto && !window.confirm("Êtes-vous sûr de vouloir accepter cette proposition ?")) return;
    try {
      if (isAuto) setAutoAcceptCount(null);
      await api.post(`/projects/${id}/proposals/${proposalId}/accept`, {}, token || undefined);
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 z-[9999] bg-blue-600 flex flex-col items-center justify-center text-white font-outfit animate-in fade-in duration-500';
      overlay.innerHTML = `<div class="text-center p-10 animate-in zoom-in duration-700"><div class="size-40 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-12 animate-pulse ring-8 ring-white/10"><svg class="size-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path></svg></div><h2 class="text-7xl font-black mb-6 tracking-tighter animate-in slide-in-from-bottom duration-1000">CONTRAT SÉCURISÉ !</h2><p class="text-3xl text-blue-100 font-medium mb-12 opacity-90">L'IA a finalisé les accords. Votre espace de travail est prêt.</p></div>`;
      document.body.appendChild(overlay);
      setTimeout(() => { navigate(`/workspace/${id}`); overlay.remove(); }, 5000);
    } catch (err) { console.error(err); alert("Erreur lors de l'acceptation de la proposition."); }
  };

  const handleChat = (proposalId: string) => { navigate(`/workspace/${id}/messages`); };

  if (isLoading) return <div className="glass-shell min-h-screen flex items-center justify-center font-outfit"><div className="text-slate-300 light:text-slate-600">Chargement des propositions...</div></div>;
  if (!project) return <div className="glass-shell min-h-screen flex items-center justify-center font-outfit"><div className="text-red-400">Projet introuvable.</div></div>;

  return (
    <div className="glass-shell min-h-screen font-outfit">
      <nav className="glass-panel border-b border-white/10 light:border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/client" className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-400/30">
              <Rocket className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white light:text-slate-900">Nexcore Hub</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/client" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-bold">
          <ArrowLeft className="size-4" /> Retour au tableau de bord
        </Link>

        {analysis && project.status === 'matching' && (
          <div className="mb-12 glass-strong rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-white/10 light:border-slate-200">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><Sparkles className="size-64" /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-1.5 glass-soft border border-blue-400/30 rounded-full text-xs font-black uppercase tracking-[0.2em] text-blue-300 light:text-blue-600">IA Recommendation</div>
                {autoAcceptCount !== null && (<div className="px-4 py-1.5 glass-soft border border-green-400/30 rounded-full text-xs font-black uppercase tracking-[0.2em] text-green-300 light:text-green-600 animate-pulse">Acceptation automatique dans {autoAcceptCount}s...</div>)}
                <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent" />
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-black mb-4 leading-tight text-white light:text-slate-900">Nous vous recommandons <span className="text-blue-300 light:text-blue-600">{analysis.expertName}</span></h2>
                  <p className="text-blue-100/80 light:text-slate-600 text-lg leading-relaxed mb-8 font-medium">{analysis.reasoning}</p>
                  <div className="flex items-center gap-8">
                    <div><div className="text-4xl font-black text-white light:text-slate-900">{analysis.matchingScore}%</div><div className="text-xs font-bold text-blue-300 light:text-blue-600 uppercase tracking-widest">Score de Match</div></div>
                    <div className="w-px h-12 bg-white/10 light:bg-slate-200" />
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button onClick={() => { const el = document.getElementById(`proposal-${analysis.proposalId}`); el?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="w-full sm:w-auto px-8 py-4 glass-soft border border-white/20 light:border-slate-300 text-white light:text-slate-700 rounded-2xl font-black hover:glass-card transition-all text-sm">Voir sa proposition</button>
                      <button onClick={() => handleAcceptProposal(analysis.proposalId)}
                        className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white rounded-2xl font-black hover:bg-blue-400 transition-all text-sm shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-2">
                        <CheckCircle className="size-5" /> Accepter & Démarrer
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-soft border border-white/10 light:border-slate-200 rounded-3xl p-6">
                    <h4 className="text-blue-300 light:text-blue-600 text-xs font-black uppercase tracking-widest mb-4">Points Forts</h4>
                    <ul className="space-y-3">{analysis.pros.map((pro: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm font-bold text-white light:text-slate-700"><CheckCircle className="size-4 text-green-400 shrink-0 mt-0.5" />{pro}</li>))}</ul>
                  </div>
                  <div className="glass-soft border border-white/10 light:border-slate-200 rounded-3xl p-6">
                    <h4 className="text-amber-300 light:text-amber-600 text-xs font-black uppercase tracking-widest mb-4">Points d'attention</h4>
                    <ul className="space-y-3">{analysis.cons.map((con: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm font-bold text-white/70 light:text-slate-600"><Target className="size-4 text-amber-400 shrink-0 mt-0.5" />{con}</li>))}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="glass-card rounded-[2rem] p-10 border border-white/10 light:border-slate-200 shadow-xl light:shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-4xl font-black text-white light:text-slate-900 tracking-tight leading-tight">{project.title}</h1>
                <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                  project.status === 'matching' ? 'bg-yellow-500/20 text-yellow-300 light:text-yellow-700 border border-yellow-400/30 light:border-yellow-300' : 'bg-green-500/20 text-green-300 light:text-green-700 border border-green-400/30 light:border-green-300'}`}>
                  {project.status === 'matching' ? 'Recherche Expert' : 'En cours'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 light:text-slate-500 mb-8 font-medium">
                <div className="flex items-center gap-2"><CheckCircle className="size-5 text-blue-400" /><span>IT & Digital</span></div>
                <div className="flex items-center gap-2"><Star className="size-5 text-indigo-400" /><span>Budget: <span className="text-white light:text-slate-900 font-bold">{project.budget || 'À définir'}</span></span></div>
                <div className="flex items-center gap-2"><Calendar className="size-5 text-purple-400" /><span>Publié le {new Date(project.createdAt).toLocaleDateString()}</span></div>
              </div>
              <div className="prose prose-slate max-w-none mb-8 text-slate-200 light:text-slate-600 leading-relaxed text-lg"><p className="whitespace-pre-wrap">{project.description}</p></div>
              <div className="flex flex-wrap gap-2.5">
                {(project.techStack || []).map((tag: string) => (
                  <span key={tag} className="px-4 py-2 glass-soft text-slate-200 light:text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/20 light:border-slate-200">{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white light:text-slate-900 tracking-tight">Propositions reçues</h2>
                <span className="size-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black">{proposals.length}</span>
              </div>
              <div className="space-y-6">
                {proposals.length === 0 ? (
                  <div className="p-16 text-center text-slate-400 light:text-slate-500 glass-card rounded-[2rem] border-2 border-dashed border-white/20 light:border-slate-300">
                    <MessageCircle className="size-16 mx-auto mb-4 opacity-20" />
                    <p className="text-xl font-bold text-white light:text-slate-700">Aucune proposition pour le moment.</p>
                    <p className="text-sm">L'IA de matching contacte actuellement les meilleurs experts.</p>
                  </div>
                ) : project.status !== 'matching' ? (
                  proposals.filter((p: any) => p.status === 'accepted').map((proposal: any) => (
                    <div key={proposal.id} className="glass-card rounded-[2rem] p-8 border-2 border-green-500/50 light:border-green-300 shadow-2xl shadow-green-400/10 light:shadow-sm">
                      <div className="flex items-center gap-2 text-green-400 light:text-green-600 text-xs font-black uppercase tracking-widest mb-4"><CheckCircle className="size-4" /> Expert Sélectionné - Projet en Cours</div>
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-start gap-5">
                          <div className="size-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-green-400/30">{proposal.expert?.fullName?.charAt(0) || 'E'}</div>
                          <div>
                            <div className="flex items-center gap-3 mb-2"><h3 className="text-2xl font-bold text-white light:text-slate-900">{proposal.expert?.fullName}</h3><Award className="size-6 text-green-400" /></div>
                            <div className="flex items-center gap-6 text-sm text-slate-300 light:text-slate-500 font-bold"><div className="flex items-center gap-1.5 text-yellow-400"><Star className="size-5 fill-current" /><span>Expert Certifié</span></div></div>
                          </div>
                        </div>
                        <div className="text-right"><div className="text-3xl font-black text-green-400 light:text-green-600 tracking-tighter">{proposal.budget || proposal.proposedPrice}</div><div className="text-sm font-black text-slate-400 light:text-slate-500 uppercase tracking-widest">{proposal.timeline}</div></div>
                      </div>
                      <div className="pt-6 border-t border-white/10 light:border-slate-200">
                        <button onClick={() => handleChat(proposal.id)} className="w-full py-4 bg-slate-700 light:bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-600 transition-all flex items-center justify-center gap-3 border border-white/20"><MessageCircle className="size-5" /> Ouvrir le Workspace de travail</button>
                      </div>
                    </div>
                  ))
                ) : (
                  proposals.map((proposal: any) => (
                    <div key={proposal.id} id={`proposal-${proposal.id}`}
                      className={`group glass-card rounded-[2rem] p-8 border transition-all duration-500 ${analysis?.proposalId === proposal.id ? 'border-blue-400/50 light:border-blue-400 shadow-2xl shadow-blue-400/20 light:shadow-lg ring-4 ring-blue-400/10' : 'border-white/10 light:border-slate-200 hover:shadow-2xl hover:shadow-blue-400/10 light:hover:shadow-lg'}`}>
                      {analysis?.proposalId === proposal.id && (<div className="flex items-center gap-2 text-blue-400 light:text-blue-600 text-xs font-black uppercase tracking-widest mb-4"><Sparkles className="size-4" /> Meilleur Choix IA</div>)}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-start gap-5">
                          <div className="size-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-400/30 group-hover:scale-110 transition-transform duration-500">{proposal.expert?.fullName?.charAt(0) || 'E'}</div>
                          <div>
                            <div className="flex items-center gap-3 mb-2"><h3 className="text-2xl font-bold text-white light:text-slate-900">{proposal.expert?.fullName}</h3><Award className="size-6 text-blue-400" /></div>
                            <div className="flex items-center gap-6 text-sm text-slate-300 light:text-slate-500 font-bold">
                              <div className="flex items-center gap-1.5 text-yellow-400"><Star className="size-5 fill-current" /><span>4.9</span></div>
                              <div className="flex items-center gap-1.5"><MapPin className="size-5 text-slate-400" /><span>Dakar, Sénégal</span></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right"><div className="text-3xl font-black text-blue-400 light:text-blue-600 tracking-tighter">{proposal.budget || proposal.proposedPrice}</div><div className="text-sm font-black text-slate-400 light:text-slate-500 uppercase tracking-widest">{proposal.timeline}</div></div>
                      </div>
                      <div className="space-y-6 mb-8">
                        <div className="glass-soft rounded-2xl p-6 border border-white/20 light:border-slate-200 group-hover:glass-card transition-colors">
                          <h4 className="text-xs font-black text-slate-400 light:text-slate-500 uppercase tracking-widest mb-3">Approche technique</h4>
                          <p className="text-slate-200 light:text-slate-700 leading-relaxed whitespace-pre-wrap">{proposal.approach}</p>
                        </div>
                        {proposal.methodology && (<div className="glass-soft rounded-2xl p-6 border border-white/20 light:border-slate-200 group-hover:glass-card transition-colors"><h4 className="text-xs font-black text-slate-400 light:text-slate-500 uppercase tracking-widest mb-3">Méthodologie</h4><p className="text-slate-200 light:text-slate-700 leading-relaxed whitespace-pre-wrap">{proposal.methodology}</p></div>)}
                        {proposal.experience && (<div className="glass-soft rounded-2xl p-6 border border-white/20 light:border-slate-200 group-hover:glass-card transition-colors"><h4 className="text-xs font-black text-slate-400 light:text-slate-500 uppercase tracking-widest mb-3">Expérience pertinente</h4><p className="text-slate-200 light:text-slate-700 leading-relaxed whitespace-pre-wrap">{proposal.experience}</p></div>)}
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-white/10 light:border-slate-200">
                        <div className="flex gap-4">
                          <button onClick={() => handleAcceptProposal(proposal.id)} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-400/30 transition-all text-sm"><CheckCircle className="size-5" /> Accepter l'offre</button>
                          <button onClick={() => handleChat(proposal.id)} className="flex items-center gap-2 px-6 py-3.5 glass-soft border border-white/20 light:border-slate-300 text-slate-200 light:text-slate-700 rounded-2xl font-bold hover:glass-card transition-all text-sm"><MessageCircle className="size-5" /> Discuter</button>
                        </div>
                        <button className="flex items-center gap-2 text-indigo-400 light:text-indigo-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">Profil Complet <ExternalLink className="size-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-[2rem] p-8 border border-white/10 light:border-slate-200 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-white light:text-slate-900 mb-6">Récapitulatif</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 glass-soft rounded-2xl border border-white/20 light:border-slate-200">
                  <span className="text-sm font-bold text-slate-300 light:text-slate-500 uppercase tracking-tight">Statut</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${project.status === 'matching' ? 'bg-yellow-500/20 text-yellow-300 light:text-yellow-700 border border-yellow-400/30' : 'bg-green-500/20 text-green-300 light:text-green-700 border border-green-400/30'}`}>{project.status === 'matching' ? 'Matching' : 'En cours'}</span>
                </div>
                <div className="flex items-center justify-between p-4 glass-soft rounded-2xl border border-white/20 light:border-slate-200">
                  <span className="text-sm font-bold text-slate-300 light:text-slate-500 uppercase tracking-tight">Offres</span>
                  <span className="text-lg font-black text-white light:text-slate-900">{proposals.length}</span>
                </div>
              </div>
              {proposals.length > 0 && project.status === 'matching' && (
                <button onClick={handleAnalyzeProposals} disabled={isAnalyzing}
                  className="w-full py-4 bg-slate-700 light:bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-600 light:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl border border-white/20 light:border-blue-700">
                  {isAnalyzing ? (<><div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyse en cours...</>) : (<><Sparkles className="size-5 text-blue-400 light:text-white" /> Analyser avec l'IA</>)}
                </button>
              )}
              <div className="mt-8 pt-8 border-t border-white/10 light:border-slate-200">
                <div className="glass-card rounded-2xl p-6 shadow-lg shadow-blue-400/10 light:shadow-sm border border-white/10 light:border-slate-200">
                  <Award className="size-10 mb-4 opacity-50 text-white light:text-blue-500" />
                  <h4 className="text-lg font-bold mb-2 text-white light:text-slate-900">Besoin d'aide ?</h4>
                  <p className="text-blue-200 light:text-slate-500 text-sm leading-relaxed">Notre IA peut analyser les propositions pour vous et recommander le meilleur expert selon vos critères.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AIAssistant context="client" />
    </div>
  );
}
