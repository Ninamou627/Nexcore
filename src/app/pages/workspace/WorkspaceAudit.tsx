import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router';
import { ShieldCheck, CheckCircle, AlertTriangle, Play, Save, Loader2, FileText } from 'lucide-react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function WorkspaceAudit() {
  const { id: projectId } = useParams();
  const { token, user } = useAuth();
  const { project } = useOutletContext<{ project: any }>();
  
  const [audits, setAudits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeAudit, setActiveAudit] = useState<any>(null);
  
  // Champs éditables
  const [securityScore, setSecurityScore] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);
  const [conformityScore, setConformityScore] = useState(0);
  const [expertComments, setExpertComments] = useState('');
  const [status, setStatus] = useState('PENDING');
  
  // Dépôt GitHub
  const [githubUrl, setGithubUrl] = useState(project.githubRepoUrl || '');
  const [isSavingGithub, setIsSavingGithub] = useState(false);

  const fetchAudits = async () => {
    try {
      const data = await api.get(`/audits/project/${projectId}`, token || undefined);
      setAudits(data);
      if (data.length > 0) {
        selectAudit(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [projectId, token]);

  const selectAudit = (audit: any) => {
    setActiveAudit(audit);
    setSecurityScore(audit.securityScore);
    setQualityScore(audit.qualityScore);
    setConformityScore(audit.conformityScore);
    setExpertComments(audit.expertComments || audit.aiReport);
    setStatus(audit.status);
  };

  const handleSaveGithubUrl = async () => {
    setIsSavingGithub(true);
    try {
      await api.patch(`/projects/${projectId}`, { githubRepoUrl: githubUrl }, token || undefined);
      alert('Lien GitHub enregistré avec succès.');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement du lien GitHub.');
    } finally {
      setIsSavingGithub(false);
    }
  };

  const handleGenerateAudit = async () => {
    if (!project.githubRepoUrl && (!project.files || project.files.length === 0) && !githubUrl) {
      alert('Veuillez d\'abord enregistrer un lien GitHub ou uploader des fichiers pour permettre l\'analyse.');
      return;
    }
    
    if (githubUrl && githubUrl !== project.githubRepoUrl) {
       await handleSaveGithubUrl();
    }

    if (!confirm('Voulez-vous générer un nouvel audit assisté par l\'IA ? Cela peut prendre quelques instants.')) return;
    
    setIsGenerating(true);
    try {
      const newAudit = await api.post(`/audits/project/${projectId}/generate`, {}, token || undefined);
      setAudits([newAudit, ...audits]);
      selectAudit(newAudit);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors de la génération de l\'audit.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAudit = async () => {
    if (!activeAudit) return;
    
    setIsSaving(true);
    try {
      const updatedAudit = await api.patch(`/audits/${activeAudit.id}`, {
        securityScore,
        qualityScore,
        conformityScore,
        expertComments,
        status
      }, token || undefined);
      
      setAudits(audits.map(a => a.id === updatedAudit.id ? updatedAudit : a));
      selectAudit(updatedAudit);
      alert('Audit sauvegardé avec succès.');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const ScoreGauge = ({ label, score, colorClass }: { label: string, score: number, colorClass: string }) => (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
      <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">{label}</div>
      <div className={`text-4xl font-bold ${colorClass}`}>{score}/100</div>
      <div className="mt-4">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${colorClass.replace('text-', 'bg-')}`} style={{ width: `${score}%` }}></div>
        </div>
      </div>
    </div>
  );

  const getColorClass = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-600';
  };

  const FullScreenScanner = () => {
    const messages = [
      "Initialisation de l'agent IA...",
      "Connexion au dépôt GitHub...",
      "Extraction de l'arborescence des fichiers...",
      "Analyse de la qualité du code source...",
      "Recherche de failles de sécurité (OWASP)...",
      "Évaluation de la conformité au cahier des charges...",
      "Compilation des résultats et génération du rapport..."
    ];
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setMsgIndex(prev => (prev < messages.length - 1 ? prev + 1 : prev));
      }, 1500); // Change message every 1.5s
      return () => clearInterval(interval);
    }, [messages.length]);

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md">
        <div className="relative">
          {/* Scanner ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" style={{ animationDuration: '3s', margin: '-1rem' }}></div>
          <div className="absolute inset-0 rounded-full border-r-2 border-indigo-500 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse', margin: '-2rem' }}></div>
          
          <div className="bg-slate-800 p-8 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.5)] relative overflow-hidden">
             {/* Ligne de scan qui descend */}
             <div className="absolute inset-x-0 top-0 h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
             <ShieldCheck className="size-20 text-blue-400 animate-pulse" />
          </div>
        </div>
        
        <h2 className="mt-12 text-3xl font-black text-white tracking-widest uppercase">Audit en cours</h2>
        <div className="mt-6 flex items-center gap-3">
          <Loader2 className="size-5 text-blue-400 animate-spin" />
          <p className="text-xl text-blue-200 font-mono transition-opacity duration-300">{messages[msgIndex]}</p>
        </div>
        
        <div className="w-64 h-2 bg-slate-800 rounded-full mt-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out"
            style={{ width: `${((msgIndex + 1) / messages.length) * 100}%` }}
          />
        </div>

        <style>{`
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {isGenerating && <FullScreenScanner />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Audit de Livraison</h2>
          <p className="text-slate-600">Vérification de la sécurité, qualité et conformité avant livraison.</p>
        </div>
      </div>

      {user?.role === 'EXPERT' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">Dépôt GitHub du Projet (Public)</label>
            <input 
              type="url" 
              placeholder="https://github.com/votre-nom/votre-repo" 
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <button 
            onClick={handleSaveGithubUrl}
            disabled={isSavingGithub || githubUrl === project.githubRepoUrl}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isSavingGithub ? 'Enregistrement...' : 'Enregistrer le lien'}
          </button>
          <button 
            onClick={handleGenerateAudit}
            disabled={isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="size-5 animate-spin" /> : <Play className="size-5" />}
            {isGenerating ? 'Analyse IA en cours...' : 'Générer l\'Audit IA'}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 text-blue-600 animate-spin" />
        </div>
      ) : audits.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <ShieldCheck className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun audit n'a été réalisé</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Il est fortement recommandé de générer un audit assisté par l'IA avant de finaliser et livrer le projet au client.
          </p>
          {user?.role === 'EXPERT' && (
            <button 
              onClick={handleGenerateAudit}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="size-5 animate-spin" /> : <Play className="size-5" />}
              Lancer le premier Audit
            </button>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-blue-600" />
                  Résultats de l'Audit
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'PASSED' ? 'bg-green-100 text-green-700' : 
                  status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {status === 'PASSED' ? 'Validé' : status === 'FAILED' ? 'Échoué' : 'En révision'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {user?.role === 'EXPERT' && status !== 'PASSED' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 uppercase">Sécurité</label>
                      <input type="number" min="0" max="100" value={securityScore} onChange={(e) => setSecurityScore(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 uppercase">Qualité</label>
                      <input type="number" min="0" max="100" value={qualityScore} onChange={(e) => setQualityScore(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 uppercase">Conformité</label>
                      <input type="number" min="0" max="100" value={conformityScore} onChange={(e) => setConformityScore(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                    </div>
                  </>
                ) : (
                  <>
                    <ScoreGauge label="Sécurité" score={securityScore} colorClass={getColorClass(securityScore)} />
                    <ScoreGauge label="Qualité Code" score={qualityScore} colorClass={getColorClass(qualityScore)} />
                    <ScoreGauge label="Conformité" score={conformityScore} colorClass={getColorClass(conformityScore)} />
                  </>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="size-4 text-slate-500" />
                  Rapport et recommandations
                </h4>
                {user?.role === 'EXPERT' && status !== 'PASSED' ? (
                  <textarea
                    value={expertComments}
                    onChange={(e) => setExpertComments(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
                    placeholder="Détaillez les résultats de l'audit..."
                  />
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed border border-slate-200">
                    {expertComments}
                  </div>
                )}
              </div>

              {user?.role === 'EXPERT' && status !== 'PASSED' && (
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStatus('PASSED')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${status === 'PASSED' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Approuver l'Audit
                    </button>
                    <button
                      onClick={() => setStatus('FAILED')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${status === 'FAILED' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Déclarer Échoué
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSaveAudit}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Enregistrer les modifications
                  </button>
                </div>
              )}
            </div>
            
            {status === 'FAILED' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700">
                <AlertTriangle className="size-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Livraison bloquée</h4>
                  <p className="text-sm">Cet audit ayant échoué, le projet ne peut techniquement pas être livré au client. Veuillez corriger les problèmes soulevés et relancer un audit.</p>
                </div>
              </div>
            )}
            
            {status === 'PASSED' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 text-green-700">
                <CheckCircle className="size-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Audit validé avec succès</h4>
                  <p className="text-sm">Le projet respecte les normes de sécurité et de conformité. Vous pouvez procéder à la livraison finale.</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Historique des audits</h3>
              <div className="space-y-3">
                {audits.map((audit) => (
                  <button
                    key={audit.id}
                    onClick={() => selectAudit(audit)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      activeAudit?.id === audit.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {new Date(audit.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <span className={`size-2 rounded-full ${
                        audit.status === 'PASSED' ? 'bg-green-500' : 
                        audit.status === 'FAILED' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Par {audit.expert?.fullName || 'Expert'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Comment fonctionne l'IA ?</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                L'agent IA analyse le code, les fichiers partagés (coffre-fort) et la complétion des jalons pour générer une estimation réaliste des scores.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ce rapport sert de base. Il est de la responsabilité de l'expert d'ajuster les notes et de valider humainement l'audit avant la livraison finale.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
