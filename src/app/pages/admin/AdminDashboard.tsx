import { AdminNav } from '../../components/AdminNav';
import { TrendingUp, Users, Briefcase, Clock, AlertCircle, CheckCircle, DollarSign, Award } from 'lucide-react';

export function AdminDashboard() {
  const recentActivity = [
    { id: '1', type: 'expert_pending', title: 'Nouveau profil expert en attente', description: 'Digital Experts SN a soumis son profil pour validation', timestamp: new Date('2026-05-04T14:30:00'), priority: 'high' },
    { id: '2', type: 'project_published', title: 'Nouveau projet publié', description: 'Artisanat Traditionnel SARL - Site E-commerce Artisanat', timestamp: new Date('2026-05-04T11:00:00'), priority: 'normal' },
    { id: '3', type: 'dispute', title: 'Litige signalé', description: 'Désaccord sur le jalon 3 du projet "Plateforme RH Digitale"', timestamp: new Date('2026-05-03T16:45:00'), priority: 'urgent' },
    { id: '4', type: 'payment', title: 'Paiement effectué', description: 'HR Tech Group - 8 000 € pour le jalon 3', timestamp: new Date('2026-05-03T10:00:00'), priority: 'normal' },
  ];
  const pendingActions = [
    { id: '1', task: '3 profils experts à valider', count: 3, link: '/admin/experts' },
    { id: '2', task: '2 projets en attente de modération', count: 2, link: '/admin/projects' },
    { id: '3', task: '1 litige à résoudre', count: 1, link: '/admin/disputes' },
  ];
  const topTechnologies = [
    { name: 'Laravel', count: 28, trend: '+12%' },
    { name: 'React', count: 25, trend: '+8%' },
    { name: 'Node.js', count: 22, trend: '+15%' },
    { name: 'AWS', count: 18, trend: '+20%' },
    { name: 'PostgreSQL', count: 16, trend: '+5%' },
  ];

  return (
    <div className="min-h-screen bg-main overflow-hidden relative">
      <div className="fixed inset-0 -z-10 overflow-hidden light:hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-900/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
      </div>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-2">Tableau de bord administrateur</h1>
          <p className="text-blue-100/80 light:text-slate-600">Vue d'ensemble de la plateforme Nexcore Hub</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Projets actifs', value: '47', trend: '+18% ce mois', icon: Briefcase, clr: 'blue' },
            { label: 'Experts vérifiés', value: '142', trend: '+12 cette semaine', icon: Users, clr: 'cyan' },
            { label: "Volume d'affaires", value: '1.2M€', trend: '+25% ce trimestre', icon: DollarSign, clr: 'green' },
            { label: 'Taux de satisfaction', value: '4.7', trend: 'sur 5.0 (289 avis)', icon: Award, clr: 'purple' },
          ].map((s, i) => (
            <div key={i} className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 shadow-2xl light:shadow-sm backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-blue-100/70 light:text-slate-500">{s.label}</div>
                <s.icon className={`w-5 h-5 text-${s.clr}-300`} />
              </div>
              <div className="text-3xl font-bold text-white light:text-slate-900 mb-1">{s.value}</div>
              <div className="text-sm text-green-300 light:text-green-600 flex items-center gap-1">
                {i < 3 && <TrendingUp className="w-4 h-4" />}{s.trend}
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <h2 className="text-xl font-semibold text-white light:text-slate-900 mb-4">Activité récente</h2>
              <div className="space-y-3">
                {recentActivity.map((a) => (
                  <div key={a.id} className={`p-4 rounded-lg border backdrop-blur-sm ${
                    a.priority === 'urgent' ? 'bg-red-500/10 light:bg-red-50 border-red-400/30 light:border-red-200' :
                    a.priority === 'high' ? 'bg-orange-500/10 light:bg-orange-50 border-orange-400/30 light:border-orange-200' :
                    'bg-blue-500/10 light:bg-blue-50 border-blue-400/30 light:border-blue-200'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-white light:text-slate-900">{a.title}</div>
                      <div className="text-xs text-blue-100/50 light:text-slate-400">{a.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="text-sm text-blue-100/70 light:text-slate-600">{a.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <h2 className="text-xl font-semibold text-white light:text-slate-900 mb-4">Technologies les plus demandées</h2>
              <div className="space-y-4">
                {topTechnologies.map((tech, index) => (
                  <div key={tech.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-blue-100/50 light:text-slate-300">{index + 1}</div>
                        <div>
                          <div className="font-medium text-white light:text-slate-900">{tech.name}</div>
                          <div className="text-sm text-blue-100/60 light:text-slate-500">{tech.count} projets</div>
                        </div>
                      </div>
                      <div className="text-sm text-green-300 light:text-green-600 font-medium">{tech.trend}</div>
                    </div>
                    <div className="w-full h-2 bg-black/20 light:bg-slate-200 rounded-full overflow-hidden border border-white/10 light:border-slate-300">
                      <div className="h-full bg-gradient-to-r from-blue-600/90 to-cyan-400/40 rounded-full" style={{ width: `${(tech.count / 30) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 light:from-red-50 light:to-orange-50 rounded-xl p-6 border border-red-400/30 light:border-red-200 backdrop-blur-3xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-red-300 light:text-red-600" />
                <h3 className="text-lg font-semibold text-white light:text-slate-900">Actions requises</h3>
              </div>
              <div className="space-y-3">
                {pendingActions.map((action) => (
                  <a key={action.id} href={action.link} className="block p-4 bg-black/20 light:bg-white rounded-lg border border-red-400/30 light:border-red-200 hover:border-red-400/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-white light:text-slate-900">{action.task}</div>
                      <div className="w-8 h-8 bg-red-500/20 text-red-200 light:text-red-600 rounded-full flex items-center justify-center text-sm font-bold border border-red-400/30">{action.count}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-4">Métriques clés</h3>
              <div className="space-y-4">
                {[
                  { label: 'Temps de réponse moyen', value: '2.3h', pct: 85, color: 'green' },
                  { label: 'Taux de matching', value: '78%', pct: 78, color: 'blue' },
                  { label: 'Projets complétés', value: '92%', pct: 92, color: 'purple' },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-blue-100/70 light:text-slate-500">{m.label}</div>
                      <div className="text-sm font-semibold text-white light:text-slate-900">{m.value}</div>
                    </div>
                    <div className="w-full h-2 bg-black/20 light:bg-slate-200 rounded-full overflow-hidden border border-white/10 light:border-slate-300">
                      <div className={`h-full bg-${m.color}-500/60 rounded-full`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-green-500/10 light:bg-green-50 rounded-xl p-6 border border-green-400/30 light:border-green-200 backdrop-blur-3xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-300 light:text-green-600" />
                <h3 className="font-semibold text-white light:text-slate-900">Système opérationnel</h3>
              </div>
              <div className="text-sm text-blue-100/70 light:text-slate-600">Tous les services fonctionnent normalement</div>
              <div className="mt-3 text-xs text-blue-100/50 light:text-slate-400">Dernière vérification: il y a 5 minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
