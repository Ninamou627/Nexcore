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
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Modération des experts</h1>
          <p className="text-slate-600">Validation et gestion des profils d'experts</p>
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
            <div className="text-3xl font-bold text-slate-900">{experts.pending.length}</div>
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
            <div className="text-3xl font-bold text-slate-900">{experts.approved.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('rejected')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedStatus === 'rejected'
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Rejetés</div>
              <XCircle className="size-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{experts.rejected.length}</div>
          </button>
        </div>

        <div className="space-y-4">
          {currentExperts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
              <div className="text-slate-400 mb-2">Aucun expert dans cette catégorie</div>
            </div>
          ) : (
            currentExperts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-start gap-6">
                  <div className="size-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {expert.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">{expert.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {expert.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {expert.experience} d'expérience
                          </div>
                          <div>{expert.email}</div>
                        </div>
                        {'rating' in expert && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{expert.rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {'submittedAt' in expert && (
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Soumis le</div>
                          <div className="text-sm font-medium text-slate-900">
                            {expert.submittedAt.toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-slate-500">
                            {expert.submittedAt.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-700 mb-4">{expert.description}</p>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-slate-700 mb-2">Compétences :</div>
                      <div className="flex flex-wrap gap-2">
                        {expert.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Award className="size-4" />
                        <span>{expert.portfolio} projets au portfolio</span>
                      </div>
                      <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                        <ExternalLink className="size-4" />
                        Voir le profil complet
                      </button>
                    </div>

                    {selectedStatus === 'pending' && (
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => handleApprove(expert.id)}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                        >
                          <CheckCircle className="size-4" />
                          Approuver et activer
                        </button>
                        <button
                          onClick={() => handleReject(expert.id)}
                          className="flex items-center gap-2 px-6 py-2 border-2 border-red-200 text-red-700 rounded-lg hover:border-red-300 transition-colors"
                        >
                          <XCircle className="size-4" />
                          Rejeter
                        </button>
                        <button className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors">
                          Demander plus d'informations
                        </button>
                      </div>
                    )}

                    {selectedStatus === 'approved' && 'approvedAt' in expert && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
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
