import { AdminNav } from '../../components/AdminNav';
import { CheckCircle, XCircle, Eye, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function ProjectModeration() {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved' | 'flagged'>('pending');

  const projects = {
    pending: [
      {
        id: '1',
        title: 'Plateforme de réservation en ligne',
        client: 'Hôtel Prestige International',
        category: 'Web',
        budget: '20 000 - 25 000 €',
        deadline: '3 mois',
        description: 'Développement d\'une plateforme de réservation en ligne intégrée avec système de paiement, gestion des chambres, calendrier de disponibilité et interface d\'administration.',
        submittedAt: new Date('2026-05-04T09:30:00'),
        visibility: 'public',
      },
      {
        id: '2',
        title: 'Application mobile de suivi médical',
        client: 'Clinique Santé Plus',
        category: 'Mobile',
        budget: '30 000 €',
        deadline: '4 mois',
        description: 'Application mobile iOS et Android pour le suivi des patients, rendez-vous médicaux, prescriptions et téléconsultation.',
        submittedAt: new Date('2026-05-03T14:15:00'),
        visibility: 'private',
      },
    ],
    approved: [
      {
        id: '3',
        title: 'Site E-commerce Artisanat',
        client: 'Artisanat Traditionnel SARL',
        category: 'E-commerce',
        budget: '15 000 - 20 000 €',
        deadline: '10-12 semaines',
        approvedAt: new Date('2026-04-15T10:00:00'),
        proposals: 8,
      },
    ],
    flagged: [
      {
        id: '4',
        title: 'Site web pour crypto-monnaie',
        client: 'CryptoInvest Pro',
        category: 'Web',
        budget: '50 000 €',
        deadline: '2 mois',
        description: 'Plateforme d\'échange de crypto-monnaies avec wallet intégré.',
        submittedAt: new Date('2026-05-01T16:00:00'),
        flagReason: 'Vérification requise - Secteur réglementé',
      },
    ],
  };

  const currentProjects = projects[selectedStatus];

  const handleApprove = (projectId: string) => {
    console.log('Approving project:', projectId);
  };

  const handleReject = (projectId: string) => {
    console.log('Rejecting project:', projectId);
  };

  const handleFlag = (projectId: string) => {
    console.log('Flagging project:', projectId);
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
          <h1 className="text-3xl font-bold text-white mb-2">Modération des projets</h1>
          <p className="text-blue-100/80">Validation et surveillance des offres de projets</p>
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
            <div className="text-3xl font-bold text-white">{projects.pending.length}</div>
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
            <div className="text-3xl font-bold text-white">{projects.approved.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('flagged')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'flagged'
                ? 'border-amber-400/30 bg-amber-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-amber-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">Signalés</div>
              <AlertCircle className="size-5 text-amber-300" />
            </div>
            <div className="text-3xl font-bold text-white">{projects.flagged.length}</div>
          </button>
        </div>

        <div className="space-y-4">
          {currentProjects.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 border border-white/10 text-center bg-black/40">
              <div className="text-slate-400 mb-2">Aucun projet dans cette catégorie</div>
            </div>
          ) : (
            currentProjects.map((project) => (
              <div key={project.id} className="glass-card rounded-3xl p-6 border border-white/10 bg-black/40 shadow-2xl shadow-blue-900/10">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-200 rounded-full text-sm font-semibold border border-blue-400/20">
                        {project.category}
                      </span>
                      {'visibility' in project && (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          project.visibility === 'public'
                            ? 'bg-blue-500/10 text-blue-200 border border-blue-400/20'
                            : 'bg-purple-500/10 text-purple-200 border border-purple-400/20'
                        }`}>
                          {project.visibility === 'public' ? 'Public' : 'Privé'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-blue-100/70 mb-4">
                      Client: {project.client}
                    </div>

                    {'description' in project && (
                      <p className="text-blue-100/80 mb-4">{project.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100/70">
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4 text-blue-300" />
                        <span className="font-medium">{project.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-blue-300" />
                        <span>Délai: {project.deadline}</span>
                      </div>
                      {'proposals' in project && (
                        <div>{project.proposals} propositions reçues</div>
                      )}
                    </div>

                    {'flagReason' in project && (
                      <div className="mt-4 p-4 glass-soft rounded-3xl border border-amber-300/20 bg-amber-500/10 text-amber-100">
                        <div className="flex items-center gap-2 text-amber-200">
                          <AlertCircle className="size-4" />
                          <span className="text-sm font-medium">{project.flagReason}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {'submittedAt' in project && (
                    <div className="text-right ml-6 text-blue-100/80">
                      <div className="text-sm">Soumis le</div>
                      <div className="text-sm font-medium text-white">
                        {project.submittedAt.toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-blue-200">
                        {project.submittedAt.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {selectedStatus === 'pending' && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-shadow"
                    >
                      <CheckCircle className="size-4" />
                      Approuver et publier
                    </button>
                    <button
                      onClick={() => handleFlag(project.id)}
                      className="flex items-center gap-2 px-6 py-2 border border-amber-300 text-amber-200 rounded-2xl hover:border-amber-200 transition-colors"
                    >
                      <AlertCircle className="size-4" />
                      Signaler pour vérification
                    </button>
                    <button
                      onClick={() => handleReject(project.id)}
                      className="flex items-center gap-2 px-6 py-2 border border-red-300 text-red-200 rounded-2xl hover:border-red-200 transition-colors"
                    >
                      <XCircle className="size-4" />
                      Rejeter
                    </button>
                  </div>
                )}

                {selectedStatus === 'approved' && 'approvedAt' in project && (
                  <div className="mt-4 glass-soft rounded-3xl p-4 border border-green-300/20 bg-green-500/10 text-green-100 text-sm">
                    Projet approuvé le {project.approvedAt.toLocaleDateString('fr-FR')} - Statut: Publié
                  </div>
                )}

                {selectedStatus === 'flagged' && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-shadow"
                    >
                      <CheckCircle className="size-4" />
                      Approuver après vérification
                    </button>
                    <button
                      onClick={() => handleReject(project.id)}
                      className="flex items-center gap-2 px-6 py-2 border border-red-300 text-red-200 rounded-2xl hover:border-red-200 transition-colors"
                    >
                      <XCircle className="size-4" />
                      Rejeter définitivement
                    </button>
                    <button className="px-6 py-2 border border-white/10 text-blue-100 rounded-2xl hover:border-blue-300 transition-colors">
                      Contacter le client
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 glass-card rounded-3xl p-6 border border-white/10 bg-black/40">
          <h3 className="font-semibold text-white mb-4">Critères de modération</h3>
          <ul className="text-sm text-blue-100/80 space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">•</span>
              <span>Vérifier que le budget et les délais sont réalistes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">•</span>
              <span>S'assurer que la description est claire et complète</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">•</span>
              <span>Signaler les projets dans des secteurs réglementés (finance, santé, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">•</span>
              <span>Rejeter tout contenu illégal, discriminatoire ou contraire aux CGU</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
