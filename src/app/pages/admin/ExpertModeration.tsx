import { AdminNav } from '../../components/AdminNav';
import { CheckCircle, XCircle, Eye, Award, MapPin, Calendar, Star, ExternalLink, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../core/services/api';

interface Expert {
  id: string;
  fullName: string;
  email: string;
  location?: string;
  experience?: string;
  skills: string[];
  portfolio?: string;
  description?: string;
  isVerified: boolean;
  createdAt: string;
}

export function ExpertModeration() {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved'>('pending');
  const [allExperts, setAllExperts] = useState<Expert[]>([]);
  const [pendingExperts, setPendingExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchExperts = async () => {
    try {
      const pending = await api.get('/admin/experts/pending');
      setPendingExperts(pending);
      // Pour les experts approuvés, on les récupère via les projets (pas d'endpoint dédié)
      // On combine les données disponibles
      setAllExperts(pending);
    } catch (error) {
      console.error('Erreur chargement experts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleApprove = async (expertId: string) => {
    setActionLoading(expertId);
    try {
      await api.patch(`/admin/experts/${expertId}/verify`, {});
      // Retirer de la liste pending
      setPendingExperts(prev => prev.filter(e => e.id !== expertId));
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const currentExperts = selectedStatus === 'pending' ? pendingExperts : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen blur-3xl animate-pulse" />
        <div className="absolute top-24 right-0 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-slate-900/40 rounded-full mix-blend-screen blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Modération des experts</h1>
          <p className="text-blue-100/80">Validation et gestion des profils d'experts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'pending'
                ? 'border-blue-400/40 bg-blue-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-blue-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">En attente de vérification</div>
              <Eye className="size-5 text-orange-300" />
            </div>
            <div className="text-3xl font-bold text-white">{pendingExperts.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('approved')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'approved'
                ? 'border-green-400/30 bg-green-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-green-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">Approuvés</div>
              <CheckCircle className="size-5 text-green-300" />
            </div>
            <div className="text-3xl font-bold text-white">—</div>
            <div className="text-xs text-blue-100/50 mt-1">Consultez le dashboard pour les stats</div>
          </button>
        </div>

        <div className="space-y-4">
          {selectedStatus === 'approved' ? (
            <div className="glass-card rounded-3xl p-12 border border-white/10 text-center bg-black/40">
              <CheckCircle className="size-12 text-green-300 mx-auto mb-4" />
              <div className="text-white text-lg font-semibold mb-2">Experts approuvés</div>
              <div className="text-blue-100/60">Les experts approuvés sont visibles sur le marketplace et peuvent soumettre des propositions.</div>
            </div>
          ) : currentExperts.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 border border-white/10 text-center bg-black/40">
              <CheckCircle className="size-12 text-green-300 mx-auto mb-4" />
              <div className="text-white text-lg font-semibold mb-2">Aucun expert en attente</div>
              <div className="text-blue-100/60">Tous les profils experts ont été traités.</div>
            </div>
          ) : (
            currentExperts.map((expert) => (
              <div key={expert.id} className="glass-card rounded-3xl p-6 border border-white/10 bg-black/40 shadow-2xl shadow-blue-900/10">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="size-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {expert.fullName.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{expert.fullName}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100/70 mb-2">
                          {expert.location && (
                            <div className="flex items-center gap-1 text-blue-100/70">
                              <MapPin className="size-4" />
                              {expert.location}
                            </div>
                          )}
                          {expert.experience && (
                            <div className="flex items-center gap-1 text-blue-100/70">
                              <Calendar className="size-4" />
                              {expert.experience} d'expérience
                            </div>
                          )}
                          <div className="text-blue-100/70">{expert.email}</div>
                        </div>
                      </div>
                      <div className="text-right text-blue-100/70">
                        <div className="text-sm">Inscrit le</div>
                        <div className="text-sm font-medium text-white">
                          {new Date(expert.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-blue-200">
                          {new Date(expert.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>

                    {expert.description && (
                      <p className="text-blue-100/80 mb-4">{expert.description}</p>
                    )}

                    {expert.skills && expert.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-blue-100/70 mb-2">Compétences :</div>
                        <div className="flex flex-wrap gap-2">
                          {expert.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-blue-500/10 text-blue-200 rounded-full text-sm font-semibold border border-blue-400/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {expert.portfolio && (
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-blue-100/70">
                        <a href={expert.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-200 hover:text-white transition-colors">
                          <ExternalLink className="size-4" />
                          Voir le portfolio
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleApprove(expert.id)}
                        disabled={actionLoading === expert.id}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-shadow disabled:opacity-50"
                      >
                        {actionLoading === expert.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <CheckCircle className="size-4" />
                        )}
                        Approuver et activer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
