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
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Modération des projets</h1>
          <p className="text-slate-600">Validation et surveillance des offres de projets</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedStatus === 'pending'
                ? 'border-orange-300 bg-orange-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">En attente</div>
              <Eye className="size-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{projects.pending.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('approved')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedStatus === 'approved'
                ? 'border-green-300 bg-green-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Approuvés</div>
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{projects.approved.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('flagged')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedStatus === 'flagged'
                ? 'border-amber-300 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Signalés</div>
              <AlertCircle className="size-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{projects.flagged.length}</div>
          </button>
        </div>

        <div className="space-y-4">
          {currentProjects.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
              <div className="text-slate-400 mb-2">Aucun projet dans cette catégorie</div>
            </div>
          ) : (
            currentProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {project.category}
                      </span>
                      {'visibility' in project && (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          project.visibility === 'public'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {project.visibility === 'public' ? 'Public' : 'Privé'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 mb-4">
                      Client: {project.client}
                    </div>

                    {'description' in project && (
                      <p className="text-slate-700 mb-4">{project.description}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4" />
                        <span className="font-medium">{project.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>Délai: {project.deadline}</span>
                      </div>
                      {'proposals' in project && (
                        <div>{project.proposals} propositions reçues</div>
                      )}
                    </div>

                    {'flagReason' in project && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertCircle className="size-4" />
                          <span className="text-sm font-medium">{project.flagReason}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {'submittedAt' in project && (
                    <div className="text-right ml-6">
                      <div className="text-sm text-slate-600">Soumis le</div>
                      <div className="text-sm font-medium text-slate-900">
                        {project.submittedAt.toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {project.submittedAt.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {selectedStatus === 'pending' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <CheckCircle className="size-4" />
                      Approuver et publier
                    </button>
                    <button
                      onClick={() => handleFlag(project.id)}
                      className="flex items-center gap-2 px-6 py-2 border-2 border-amber-200 text-amber-700 rounded-lg hover:border-amber-300 transition-colors"
                    >
                      <AlertCircle className="size-4" />
                      Signaler pour vérification
                    </button>
                    <button
                      onClick={() => handleReject(project.id)}
                      className="flex items-center gap-2 px-6 py-2 border-2 border-red-200 text-red-700 rounded-lg hover:border-red-300 transition-colors"
                    >
                      <XCircle className="size-4" />
                      Rejeter
                    </button>
                  </div>
                )}

                {selectedStatus === 'approved' && 'approvedAt' in project && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                    Projet approuvé le {project.approvedAt.toLocaleDateString('fr-FR')} - Statut: Publié
                  </div>
                )}

                {selectedStatus === 'flagged' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <CheckCircle className="size-4" />
                      Approuver après vérification
                    </button>
                    <button
                      onClick={() => handleReject(project.id)}
                      className="flex items-center gap-2 px-6 py-2 border-2 border-red-200 text-red-700 rounded-lg hover:border-red-300 transition-colors"
                    >
                      <XCircle className="size-4" />
                      Rejeter définitivement
                    </button>
                    <button className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors">
                      Contacter le client
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-slate-900 mb-2">Critères de modération</h3>
          <ul className="text-sm text-slate-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Vérifier que le budget et les délais sont réalistes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>S'assurer que la description est claire et complète</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Signaler les projets dans des secteurs réglementés (finance, santé, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Rejeter tout contenu illégal, discriminatoire ou contraire aux CGU</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
