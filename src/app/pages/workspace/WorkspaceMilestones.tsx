import { CheckCircle, Clock, Play, Lock, DollarSign, Calendar, Sparkles, Target, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';
import { MilestoneValidationModal } from '../../components/MilestoneValidationModal';
import { MilestoneRevisionModal } from '../../components/MilestoneRevisionModal';

export function WorkspaceMilestones() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { project: initialProject } = useOutletContext<{ project: any }>();
  const [project, setProject] = useState(initialProject);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [validationModal, setValidationModal] = useState<{ isOpen: boolean; milestone?: any }>({ isOpen: false });
  const [revisionModal, setRevisionModal] = useState<{ isOpen: boolean; milestone?: any }>({ isOpen: false });

  const isExpert = user?.role === 'EXPERT';

  const refreshProject = async () => {
    try {
      const data = await api.get(`/projects/${id}`, token || undefined);
      setProject(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateMilestones = async () => {
    setIsGenerating(true);
    try {
      const generated = await api.post(`/projects/${id}/generate-milestones`, {}, token || undefined);
      for (const m of generated) {
        await api.post(`/projects/${id}/milestones`, {
          title: m.title,
          description: m.description,
          amount: m.amount,
          deliverables: m.deliverables,
          dueDate: new Date(Date.now() + (m.duration || 7) * 24 * 60 * 60 * 1000)
        }, token || undefined);
      }
      await refreshProject();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteMilestone = async (mId: string) => {
    if (!confirm("Supprimer ce jalon ?")) return;
    try {
      await api.delete(`/projects/milestones/${mId}`, token || undefined);
      await refreshProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMilestone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      amount: formData.get('amount'),
      dueDate: formData.get('dueDate'),
      deliverables: (formData.get('deliverables') as string).split(',').map(s => s.trim())
    };

    try {
      if (editingMilestone) {
        await api.patch(`/projects/milestones/${editingMilestone.id}`, data, token || undefined);
      } else {
        await api.post(`/projects/${id}/milestones`, data, token || undefined);
      }
      setIsAdding(false);
      setEditingMilestone(null);
      await refreshProject();
    } catch (err) {
      console.error(err);
    }
  };

  const milestones = project.milestones || [];

  const statusConfig = {
    pending: { label: 'À financer', color: 'bg-slate-700/60 text-blue-100 border-blue-500/30', icon: Clock, iconColor: 'text-blue-100' },
    funded: { label: 'Fonds sécurisés', color: 'bg-indigo-700/20 text-indigo-100 border-indigo-300/40', icon: Lock, iconColor: 'text-indigo-200' },
    in_progress: { label: 'En cours', color: 'bg-blue-700/20 text-blue-100 border-blue-300/40', icon: Play, iconColor: 'text-blue-200' },
    completed: { label: 'Terminé', color: 'bg-green-600/10 text-green-200 border-green-400/20', icon: CheckCircle, iconColor: 'text-green-300' },
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white light:text-slate-900 tracking-tight mb-2">Découpage du Projet</h2>
          <p className="text-blue-100 light:text-slate-500 font-medium">Suivi des étapes clés et déblocage des paiements</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {isExpert && milestones.length === 0 && (
            <button
              onClick={handleGenerateMilestones}
              disabled={isGenerating}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/30 disabled:opacity-50"
            >
              <Sparkles className="size-5 text-blue-400" />
              Générer par IA
            </button>
          )}

          {isExpert && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black hover:shadow-xl transition-all shadow-blue-900/30"
            >
              <Plus className="size-5" />
              Ajouter un jalon
            </button>
          )}
        </div>
      </div>

      {(isAdding || editingMilestone) && (
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-slate-900/30 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-8 gap-4">
            <h3 className="text-xl font-black text-white light:text-slate-900 uppercase tracking-tight">
              {editingMilestone ? "Modifier le jalon" : "Nouveau jalon stratégique"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingMilestone(null); }} className="size-10 bg-white/10 light:bg-slate-100 rounded-xl flex items-center justify-center text-blue-100 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors">
              <X className="size-5" />
            </button>
          </div>
          <form onSubmit={handleSaveMilestone} className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-xs font-black text-blue-100 light:text-slate-500 uppercase tracking-widest mb-2 block">Titre du jalon</label>
              <input name="title" defaultValue={editingMilestone?.title} required className="w-full px-6 py-4 bg-slate-900/80 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none font-bold text-white" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-black text-blue-100 light:text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
              <textarea name="description" defaultValue={editingMilestone?.description} required rows={3} className="w-full px-6 py-4 bg-slate-900/80 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none font-medium text-white" />
            </div>
            <div>
              <label className="text-xs font-black text-blue-100 light:text-slate-500 uppercase tracking-widest mb-2 block">Montant (€)</label>
              <input name="amount" type="number" step="0.01" defaultValue={editingMilestone?.amount} required className="w-full px-6 py-4 bg-slate-900/80 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none font-bold text-white" />
            </div>
            <div>
              <label className="text-xs font-black text-blue-100 light:text-slate-500 uppercase tracking-widest mb-2 block">Échéance</label>
              <input name="dueDate" type="date" defaultValue={editingMilestone?.dueDate?.split('T')[0]} required className="w-full px-6 py-4 bg-slate-900/80 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none font-bold text-white" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-black text-blue-100 light:text-slate-500 uppercase tracking-widest mb-2 block">Livrables (séparés par des virgules)</label>
              <input name="deliverables" defaultValue={editingMilestone?.deliverables?.join(', ')} required className="w-full px-6 py-4 bg-slate-900/80 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none font-medium text-white" />
            </div>
            <div className="col-span-2 pt-4">
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/30">
                {editingMilestone ? "Enregistrer les modifications" : "Créer le jalon"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6 relative">
        <div className="absolute left-10 top-10 bottom-10 w-px bg-white/10 light:bg-slate-200 -z-10" />

        {milestones.length === 0 ? (
          <div className="p-20 text-center glass-soft rounded-[3rem] border border-dashed border-white/10 light:border-slate-300">
            <Target className="size-20 mx-auto mb-6 text-blue-200 light:text-blue-400" />
            <h3 className="text-2xl font-black text-blue-100 light:text-slate-700 uppercase tracking-widest">
              {isExpert ? "Aucun jalon défini" : "En attente du plan de travail"}
            </h3>
            <p className="text-blue-200 light:text-slate-500 mt-2">
              {isExpert 
                ? "Utilisez l'assistant IA pour découper votre projet automatiquement." 
                : "Votre expert est en train de préparer le découpage stratégique du projet."}
            </p>
          </div>
        ) : (
          milestones.map((milestone: any, index: number) => {
            const config = statusConfig[milestone.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <div
                key={milestone.id}
                className="glass-card rounded-[2.5rem] border border-white/10 light:border-slate-200 shadow-2xl shadow-slate-900/20 light:shadow-sm transition-all duration-500 hover:-translate-y-1"
              >
                <div className="p-10">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                    <div className={`size-20 rounded-3xl flex items-center justify-center shrink-0 shadow-xl ${
                      milestone.status === 'completed' ? 'bg-green-600 text-white' : 'bg-slate-900 text-white'
                    }`}>
                      <span className="text-3xl font-black">{index + 1}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-white light:text-slate-900 tracking-tight">{milestone.title}</h3>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {isExpert && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingMilestone(milestone)}
                                className="size-8 bg-blue-500/10 text-blue-200 rounded-2xl flex items-center justify-center hover:bg-blue-500/20 transition-all"
                                title="Modifier"
                              >
                                <Edit2 className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMilestone(milestone.id)}
                                className="size-8 bg-red-500/10 text-red-300 rounded-2xl flex items-center justify-center hover:bg-red-500/20 transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          )}
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-blue-100 light:text-slate-600 leading-relaxed text-lg mb-8">{milestone.description}</p>

                      <div className="grid sm:grid-cols-2 gap-10">
                        <div>
                          <h4 className="text-[10px] font-black text-blue-200 light:text-blue-600 uppercase tracking-[0.2em] mb-4">Livrables attendus</h4>
                          <div className="space-y-3">
                            {(milestone.deliverables || []).map((del: string) => (
                              <div key={del} className="flex items-center gap-3 text-blue-100 light:text-slate-700 font-bold text-sm">
                                <div className="size-1.5 bg-blue-500 rounded-full" />
                                {del}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-6 bg-white/5 light:bg-slate-50 rounded-2xl border border-white/10 light:border-slate-200">
                            <div>
                              <div className="text-[10px] font-black text-blue-200 light:text-blue-600 uppercase tracking-widest mb-1">Montant</div>
                              <div className="text-2xl font-black text-white light:text-slate-900">{milestone.amount ? `${milestone.amount} €` : 'N/A'}</div>
                            </div>
                            <DollarSign className="size-8 text-blue-400 opacity-30" />
                          </div>
                          <div className="flex items-center justify-between p-6 bg-white/5 light:bg-slate-50 rounded-2xl border border-white/10 light:border-slate-200">
                            <div>
                              <div className="text-[10px] font-black text-blue-200 light:text-blue-600 uppercase tracking-widest mb-1">Échéance</div>
                              <div className="text-lg font-black text-white light:text-slate-900">{new Date(milestone.dueDate).toLocaleDateString('fr-FR')}</div>
                            </div>
                            <Calendar className="size-8 text-indigo-300 opacity-30" />
                          </div>
                        </div>
                      </div>

                      {!isExpert && milestone.status === 'pending' && (
                        <div className="mt-10">
                          <button
                            onClick={async () => {
                              try {
                                await api.patch(`/projects/milestones/${milestone.id}`, { status: 'funded' }, token || undefined);
                                await refreshProject();
                                alert("Fonds sécurisés chez Nexcore ! L'expert peut maintenant démarrer.");
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/20"
                          >
                            <Lock className="size-5" />
                            Bloquer les fonds (Escrow)
                          </button>
                        </div>
                      )}

                      {isExpert && milestone.status === 'funded' && (
                        <div className="mt-10">
                          <button
                            onClick={async () => {
                              try {
                                await api.patch(`/projects/milestones/${milestone.id}`, { status: 'in_progress' }, token || undefined);
                                await refreshProject();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
                          >
                            <Play className="size-5 text-blue-200" />
                            Démarrer le travail
                          </button>
                        </div>
                      )}

                      {isExpert && milestone.status === 'pending' && (
                        <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-dashed border-blue-300 text-center text-blue-200 font-bold text-sm">
                          En attente du dépôt des fonds par le client
                        </div>
                      )}

                      {!isExpert && milestone.status === 'funded' && (
                        <div className="mt-10 p-4 bg-blue-900/40 rounded-2xl border border-dashed border-blue-400/30 text-center text-blue-100 font-bold text-sm">
                          Fonds sécurisés. En attente du démarrage par l'expert.
                        </div>
                      )}

                      {milestone.status === 'in_progress' && !isExpert && (
                        <div className="mt-10 flex gap-4 flex-col lg:flex-row">
                          <button
                            onClick={() => setValidationModal({ isOpen: true, milestone })}
                            className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-900/20"
                          >
                            <CheckCircle className="size-5" /> Valider & Payer
                          </button>
                          <button
                            onClick={() => setRevisionModal({ isOpen: true, milestone })}
                            className="flex-1 py-4 bg-white/10 border border-white/10 text-blue-100 rounded-2xl font-black hover:bg-white/15 transition-all"
                          >
                            Demander révision
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MilestoneValidationModal
        isOpen={validationModal.isOpen}
        onClose={() => setValidationModal({ isOpen: false })}
        milestone={validationModal.milestone}
        onValidated={refreshProject}
      />

      <MilestoneRevisionModal
        isOpen={revisionModal.isOpen}
        onClose={() => setRevisionModal({ isOpen: false })}
        milestone={revisionModal.milestone}
        onSubmitted={refreshProject}
      />
    </div>
  );
}
