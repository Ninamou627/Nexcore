import { AdminNav } from '../../components/AdminNav';
import { AlertTriangle, CheckCircle, Clock, Scale, Inbox } from 'lucide-react';
import { useState } from 'react';

export function DisputeResolution() {
  const [selectedStatus, setSelectedStatus] = useState<'open' | 'in_review' | 'resolved'>('open');

  // Pas encore de backend pour les litiges — état vide réel
  const disputes = {
    open: [] as any[],
    in_review: [] as any[],
    resolved: [] as any[],
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
          <div className="glass-card rounded-3xl p-12 border border-white/10 text-center bg-black/40">
            <Inbox className="size-16 text-blue-100/20 mx-auto mb-4" />
            <div className="text-white text-xl font-semibold mb-2">Aucun litige</div>
            <div className="text-blue-100/60 max-w-md mx-auto">
              Les litiges apparaîtront ici lorsqu'un client ou un expert signalera un désaccord sur un jalon ou une livraison.
            </div>
          </div>
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
