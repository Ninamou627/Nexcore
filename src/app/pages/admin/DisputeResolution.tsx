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
          <h1 className="text-3xl font-bold text-white mb-2">Résolution des litiges</h1>
          <p className="text-blue-100/80">Médiation et arbitrage des désaccords entre clients et experts</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setSelectedStatus('open')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'open'
                ? 'border-red-400/30 bg-red-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-red-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">Ouverts</div>
              <AlertTriangle className="size-5 text-red-300" />
            </div>
            <div className="text-3xl font-bold text-white">{disputes.open.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('in_review')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'in_review'
                ? 'border-orange-400/30 bg-orange-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-orange-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">En cours d'examen</div>
              <Clock className="size-5 text-orange-300" />
            </div>
            <div className="text-3xl font-bold text-white">{disputes.in_review.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('resolved')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'resolved'
                ? 'border-green-400/30 bg-green-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-green-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">Résolus</div>
              <CheckCircle className="size-5 text-green-300" />
            </div>
            <div className="text-3xl font-bold text-white">{disputes.resolved.length}</div>
          </button>
        </div>

        <div className="space-y-4">
          {currentDisputes.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 border border-white/10 text-center bg-black/40">
              <div className="text-slate-400 mb-2">Aucun litige dans cette catégorie</div>
            </div>
          ) : (
            currentDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className={`glass-card rounded-3xl p-6 border-2 bg-black/40 shadow-2xl shadow-blue-900/10 ${
                  'priority' in dispute
                    ? dispute.priority === 'high'
                      ? 'border-red-400/30'
                      : dispute.priority === 'medium'
                        ? 'border-yellow-400/30'
                        : 'border-blue-400/30'
                    : 'border-white/10'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <AlertTriangle className="size-5 text-red-300" />
                      <h3 className="text-xl font-semibold text-white">{dispute.projectTitle}</h3>
                      {'priority' in dispute && (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-500/10 text-red-200 border border-red-400/20">
                          Priorité {dispute.priority === 'high' ? 'haute' : dispute.priority === 'medium' ? 'moyenne' : 'basse'}
                        </span>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="glass-soft rounded-3xl p-4 border border-white/10 bg-black/40">
                        <div className="text-sm text-blue-100/70 mb-1">Client</div>
                        <div className="font-medium text-white">{dispute.client}</div>
                      </div>
                      <div className="glass-soft rounded-3xl p-4 border border-white/10 bg-black/40">
                        <div className="text-sm text-blue-100/70 mb-1">Expert</div>
                        <div className="font-medium text-white">{dispute.expert}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-blue-100/70 mb-2">Jalon concerné :</div>
                      <div className="font-medium text-white">{dispute.milestone}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100/70 mb-4">
                      <div className="flex items-center gap-2">
                        <Scale className="size-4 text-blue-200" />
                        <span>Montant en jeu : <span className="font-semibold text-white">{dispute.amount}</span></span>
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
                        <div className="text-sm font-medium text-blue-100/70 mb-2">Motif du litige :</div>
                        <div className="text-blue-100/80">{dispute.issue}</div>
                      </div>
                    )}

                    {'clientStatement' in dispute && 'expertStatement' in dispute && (
                      <div className="space-y-3 mb-4">
                        <div className="glass-soft rounded-3xl p-4 border border-white/10 bg-black/40">
                          <div className="flex items-center gap-2 mb-2 text-blue-100/70">
                            <MessageSquare className="size-4 text-blue-300" />
                            <div className="text-sm font-medium">Position du client :</div>
                          </div>
                          <p className="text-blue-100/80 text-sm">{dispute.clientStatement}</p>
                        </div>

                        <div className="glass-soft rounded-3xl p-4 border border-white/10 bg-black/40">
                          <div className="flex items-center gap-2 mb-2 text-blue-100/70">
                            <MessageSquare className="size-4 text-cyan-300" />
                            <div className="text-sm font-medium">Position de l'expert :</div>
                          </div>
                          <p className="text-blue-100/80 text-sm">{dispute.expertStatement}</p>
                        </div>
                      </div>
                    )}

                    {'resolution' in dispute && (
                      <div className="glass-soft rounded-3xl p-4 border border-green-300/20 bg-green-500/10 mb-4 text-sm text-green-100">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="size-4 text-green-300" />
                          <div className="text-sm font-medium">Résolution :</div>
                        </div>
                        <p>{dispute.resolution}</p>
                        {'resolvedAt' in dispute && (
                          <div className="text-xs text-green-200 mt-1">
                            Résolu le {dispute.resolvedAt.toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    )}

                    {'assignedTo' in dispute && (
                      <div className="text-sm text-blue-100/70 mb-4">
                        Assigné à : <span className="font-medium text-white">{dispute.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  {'openedAt' in dispute && (
                    <div className="text-right ml-6">
                      <div className="size-16 bg-red-500/10 rounded-3xl flex flex-col items-center justify-center p-4">
                        <div className="text-2xl font-bold text-red-300">
                          {Math.floor((Date.now() - dispute.openedAt.getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs text-red-200">jours</div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedStatus === 'open' && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-shadow">
                      <Eye className="size-4" />
                      Examiner le workspace (lecture seule)
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-shadow">
                      <Scale className="size-4" />
                      Prendre en charge
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 border border-white/10 text-blue-100 rounded-2xl hover:border-blue-300 transition-colors">
                      <MessageSquare className="size-4" />
                      Demander plus d'informations
                    </button>
                  </div>
                )}

                {selectedStatus === 'in_review' && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-shadow">
                      <Eye className="size-4" />
                      Accéder au workspace
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-shadow">
                      <CheckCircle className="size-4" />
                      Résoudre en faveur du client
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-shadow">
                      <CheckCircle className="size-4" />
                      Résoudre en faveur de l'expert
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 border border-white/10 text-blue-100 rounded-2xl hover:border-blue-300 transition-colors">
                      <FileText className="size-4" />
                      Proposer un compromis
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 glass-card rounded-3xl p-6 border border-amber-300/10 bg-black/40">
          <div className="flex items-start gap-4">
            <Scale className="size-6 text-amber-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2">Processus de médiation</h3>
              <ul className="text-sm text-blue-100/80 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-0.5">•</span>
                  <span>Examiner attentivement les arguments des deux parties et consulter le workspace en lecture seule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-0.5">•</span>
                  <span>Comparer le livrable avec le cahier des charges initial validé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-0.5">•</span>
                  <span>Privilégier la médiation et le compromis avant toute décision arbitrale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 mt-0.5">•</span>
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
