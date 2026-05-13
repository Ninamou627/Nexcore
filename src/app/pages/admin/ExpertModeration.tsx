import { AdminNav } from '../../components/AdminNav';
import { CheckCircle, XCircle, Eye, Award, MapPin, Calendar, Star, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function ExpertModeration() {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const experts = {
    pending: [
      {
        id: '1',
        name: 'Digital Experts SN',
        email: 'contact@digitalexperts.sn',
        location: 'Dakar, Sénégal',
        experience: '8 ans',
        skills: ['Shopify', 'Vue.js', 'Node.js', 'Payment Gateway'],
        portfolio: 12,
        submittedAt: new Date('2026-05-04T14:30:00'),
        description: 'Agence digitale certifiée avec 8 ans d\'expérience. Nous proposons une approche agile et un support post-lancement de 6 mois inclus.',
      },
      {
        id: '2',
        name: 'Code Masters Maroc',
        email: 'info@codemasters.ma',
        location: 'Rabat, Maroc',
        experience: '5 ans',
        skills: ['React', 'Python', 'Django', 'PostgreSQL'],
        portfolio: 8,
        submittedAt: new Date('2026-05-03T10:15:00'),
        description: 'Équipe de développeurs spécialisés dans les applications web sur mesure pour les PME.',
      },
      {
        id: '3',
        name: 'Aminata Diop',
        email: 'aminata.diop@dev.gn',
        location: 'Conakry, Guinée',
        experience: '3 ans',
        skills: ['WordPress', 'PHP', 'JavaScript', 'MySQL'],
        portfolio: 5,
        submittedAt: new Date('2026-05-02T16:45:00'),
        description: 'Développeuse freelance spécialisée dans les solutions WordPress personnalisées.',
      },
    ],
    approved: [
      {
        id: '4',
        name: 'TechSolutions Maroc',
        email: 'contact@techsolutions.ma',
        location: 'Casablanca, Maroc',
        experience: '8 ans',
        skills: ['Laravel', 'React', 'PostgreSQL', 'AWS'],
        portfolio: 30,
        approvedAt: new Date('2026-04-15T09:00:00'),
        rating: 4.8,
      },
    ],
    rejected: [],
  };

  const currentExperts = experts[selectedStatus];

  const handleApprove = (expertId: string) => {
    console.log('Approving expert:', expertId);
  };

  const handleReject = (expertId: string) => {
    console.log('Rejecting expert:', expertId);
  };

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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'pending'
                ? 'border-blue-400/40 bg-blue-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-blue-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">En attente</div>
              <Eye className="size-5 text-orange-300" />
            </div>
            <div className="text-3xl font-bold text-white">{experts.pending.length}</div>
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
            <div className="text-3xl font-bold text-white">{experts.approved.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('rejected')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'rejected'
                ? 'border-red-400/30 bg-red-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-red-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">Rejetés</div>
              <XCircle className="size-5 text-red-300" />
            </div>
            <div className="text-3xl font-bold text-white">{experts.rejected.length}</div>
          </button>
        </div>

        <div className="space-y-4">
          {currentExperts.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 border border-white/10 text-center bg-black/40">
              <div className="text-slate-400 mb-2">Aucun expert dans cette catégorie</div>
            </div>
          ) : (
            currentExperts.map((expert) => (
              <div key={expert.id} className="glass-card rounded-3xl p-6 border border-white/10 bg-black/40 shadow-2xl shadow-blue-900/10">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="size-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {expert.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{expert.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100/70 mb-2">
                          <div className="flex items-center gap-1 text-blue-100/70">
                            <MapPin className="size-4" />
                            {expert.location}
                          </div>
                          <div className="flex items-center gap-1 text-blue-100/70">
                            <Calendar className="size-4" />
                            {expert.experience} d'expérience
                          </div>
                          <div className="text-blue-100/70">{expert.email}</div>
                        </div>
                        {'rating' in expert && (
                          <div className="flex items-center gap-2 text-sm text-blue-100/70">
                            <div className="flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{expert.rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {'submittedAt' in expert && (
                        <div className="text-right text-blue-100/70">
                          <div className="text-sm">Soumis le</div>
                          <div className="text-sm font-medium text-white">
                            {expert.submittedAt.toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-blue-200">
                            {expert.submittedAt.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-blue-100/80 mb-4">{expert.description}</p>

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

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-blue-100/70">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="size-4" />
                        <span>{expert.portfolio} projets au portfolio</span>
                      </div>
                      <button className="flex items-center gap-1 text-sm text-blue-200 hover:text-white transition-colors">
                        <ExternalLink className="size-4" />
                        Voir le profil complet
                      </button>
                    </div>

                    {selectedStatus === 'pending' && (
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleApprove(expert.id)}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-shadow"
                        >
                          <CheckCircle className="size-4" />
                          Approuver et activer
                        </button>
                        <button
                          onClick={() => handleReject(expert.id)}
                          className="flex items-center gap-2 px-6 py-2 border border-red-300 text-red-200 rounded-2xl hover:border-red-200 transition-colors"
                        >
                          <XCircle className="size-4" />
                          Rejeter
                        </button>
                        <button className="px-6 py-2 border border-white/10 text-blue-100 rounded-2xl hover:border-blue-300 transition-colors">
                          Demander plus d'informations
                        </button>
                      </div>
                    )}

                    {selectedStatus === 'approved' && 'approvedAt' in expert && (
                      <div className="glass-soft rounded-3xl p-4 border border-green-300/20 bg-green-500/10 text-green-100 text-sm">
                        Profil approuvé le {expert.approvedAt.toLocaleDateString('fr-FR')} - Statut: Actif
                      </div>
                    )}
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
