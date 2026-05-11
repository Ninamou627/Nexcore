import { AdminNav } from '../../components/AdminNav';
import { AlertTriangle, CheckCircle, Clock, Eye, MessageSquare, FileText, Scale } from 'lucide-react';
import { useState } from 'react';

export function DisputeResolution() {
  const [selectedStatus, setSelectedStatus] = useState<'open' | 'in_review' | 'resolved'>('open');

  const disputes = {
    open: [
      {
        id: '1',
        projectTitle: 'Plateforme RH Digitale',
        client: 'HR Tech Group',
        expert: 'TechSolutions Maroc',
        milestone: 'Module de gestion de congés',
        amount: '5 500 €',
        openedAt: new Date('2026-05-03T16:45:00'),
        issue: 'Désaccord sur les fonctionnalités livrées',
        clientStatement: 'Le module ne correspond pas aux spécifications convenues. Plusieurs fonctionnalités manquent (validation hiérarchique multi-niveaux, export Excel).',
        expertStatement: 'Toutes les fonctionnalités du cahier des charges initial ont été implémentées. Les demandes supplémentaires n\'étaient pas dans le scope initial.',
        priority: 'high',
      },
    ],
    in_review: [
      {
        id: '2',
        projectTitle: 'Site E-commerce Artisanat',
        client: 'Artisanat Traditionnel SARL',
        expert: 'Digital Experts SN',
        milestone: 'Intégration paiement mobile',
        amount: '2 000 €',
        openedAt: new Date('2026-05-01T10:00:00'),
        assignedTo: 'Admin Nexcore',
        issue: 'Problème technique non résolu',
        priority: 'medium',
      },
    ],
    resolved: [
      {
        id: '3',
        projectTitle: 'Application Mobile Livraison',
        client: 'Express Delivery Co',
        expert: 'Code Masters Maroc',
        milestone: 'Interface livreur',
        amount: '4 000 €',
        resolvedAt: new Date('2026-04-28T14:30:00'),
        resolution: 'Résolu en faveur de l\'expert - Paiement libéré',
        outcome: 'expert',
      },
    ],
  };

  const currentDisputes = disputes[selectedStatus];

  const priorityColors = {
    urgent: 'border-red-300 bg-red-50',
    high: 'border-orange-300 bg-orange-50',
    medium: 'border-yellow-300 bg-yellow-50',
    low: 'border-blue-300 bg-blue-50',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Résolution des litiges</h1>
          <p className="text-slate-600">Médiation et arbitrage des désaccords entre clients et experts</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setSelectedStatus('open')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedStatus === 'open'
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Ouverts</div>
              <AlertTriangle className="size-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{disputes.open.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('in_review')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedStatus === 'in_review'
                ? 'border-orange-300 bg-orange-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">En cours d'examen</div>
              <Clock className="size-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{disputes.in_review.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('resolved')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedStatus === 'resolved'
                ? 'border-green-300 bg-green-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Résolus</div>
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{disputes.resolved.length}</div>
          </button>
        </div>

        <div className="space-y-4">
          {currentDisputes.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
              <div className="text-slate-400 mb-2">Aucun litige dans cette catégorie</div>
            </div>
          ) : (
            currentDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className={`bg-white rounded-xl p-6 border-2 ${'priority' in dispute ? priorityColors[dispute.priority as keyof typeof priorityColors] : 'border-slate-200'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="size-5 text-red-600" />
                      <h3 className="text-xl font-semibold text-slate-900">{dispute.projectTitle}</h3>
                      {'priority' in dispute && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          Priorité {dispute.priority === 'high' ? 'haute' : dispute.priority === 'medium' ? 'moyenne' : 'basse'}
                        </span>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-slate-600 mb-1">Client</div>
                        <div className="font-medium text-slate-900">{dispute.client}</div>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="text-sm text-slate-600 mb-1">Expert</div>
                        <div className="font-medium text-slate-900">{dispute.expert}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-slate-600 mb-2">Jalon concerné:</div>
                      <div className="font-medium text-slate-900">{dispute.milestone}</div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Scale className="size-4" />
                        <span>Montant en jeu: <span className="font-semibold text-slate-900">{dispute.amount}</span></span>
                      </div>
                      {'openedAt' in dispute && (
                        <div>
                          Ouvert le {dispute.openedAt.toLocaleDateString('fr-FR')} à{' '}
                          {dispute.openedAt.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>

                    {'issue' in dispute && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-slate-700 mb-2">Motif du litige:</div>
                        <div className="text-slate-900">{dispute.issue}</div>
                      </div>
                    )}

                    {'clientStatement' in dispute && 'expertStatement' in dispute && (
                      <div className="space-y-3 mb-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="size-4 text-blue-600" />
                            <div className="text-sm font-medium text-slate-700">Position du client:</div>
                          </div>
                          <p className="text-sm text-slate-700">{dispute.clientStatement}</p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="size-4 text-indigo-600" />
                            <div className="text-sm font-medium text-slate-700">Position de l'expert:</div>
                          </div>
                          <p className="text-sm text-slate-700">{dispute.expertStatement}</p>
                        </div>
                      </div>
                    )}

                    {'resolution' in dispute && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="size-4 text-green-600" />
                          <div className="text-sm font-medium text-green-700">Résolution:</div>
                        </div>
                        <p className="text-sm text-green-700">{dispute.resolution}</p>
                        {'resolvedAt' in dispute && (
                          <div className="text-xs text-green-600 mt-1">
                            Résolu le {dispute.resolvedAt.toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    )}

                    {'assignedTo' in dispute && (
                      <div className="text-sm text-slate-600 mb-4">
                        Assigné à: <span className="font-medium text-slate-900">{dispute.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  {'openedAt' in dispute && (
                    <div className="text-right ml-6">
                      <div className="size-16 bg-red-100 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-red-700">
                          {Math.floor((Date.now() - dispute.openedAt.getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs text-red-600">jours</div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedStatus === 'open' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <Eye className="size-4" />
                      Examiner le workspace (lecture seule)
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <Scale className="size-4" />
                      Prendre en charge
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors">
                      <MessageSquare className="size-4" />
                      Demander plus d'informations
                    </button>
                  </div>
                )}

                {selectedStatus === 'in_review' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <Eye className="size-4" />
                      Accéder au workspace
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <CheckCircle className="size-4" />
                      Résoudre en faveur du client
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                      <CheckCircle className="size-4" />
                      Résoudre en faveur de l'expert
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors">
                      <FileText className="size-4" />
                      Proposer un compromis
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-start gap-4">
            <Scale className="size-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Processus de médiation</h3>
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Examiner attentivement les arguments des deux parties et consulter le workspace en lecture seule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Comparer le livrable avec le cahier des charges initial validé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Privilégier la médiation et le compromis avant toute décision arbitrale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Documenter toutes les décisions prises pour maintenir la transparence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
