import { AdminNav } from '../../components/AdminNav';
import { TrendingUp, Users, Briefcase, Clock, AlertCircle, CheckCircle, DollarSign, Award } from 'lucide-react';

export function AdminDashboard() {
  const recentActivity = [
    {
      id: '1',
      type: 'expert_pending',
      title: 'Nouveau profil expert en attente',
      description: 'Digital Experts SN a soumis son profil pour validation',
      timestamp: new Date('2026-05-04T14:30:00'),
      priority: 'high',
    },
    {
      id: '2',
      type: 'project_published',
      title: 'Nouveau projet publié',
      description: 'Artisanat Traditionnel SARL - Site E-commerce Artisanat',
      timestamp: new Date('2026-05-04T11:00:00'),
      priority: 'normal',
    },
    {
      id: '3',
      type: 'dispute',
      title: 'Litige signalé',
      description: 'Désaccord sur le jalon 3 du projet "Plateforme RH Digitale"',
      timestamp: new Date('2026-05-03T16:45:00'),
      priority: 'urgent',
    },
    {
      id: '4',
      type: 'payment',
      title: 'Paiement effectué',
      description: 'HR Tech Group - 8 000 € pour le jalon 3',
      timestamp: new Date('2026-05-03T10:00:00'),
      priority: 'normal',
    },
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

  const priorityColors = {
    urgent: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    normal: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord administrateur</h1>
          <p className="text-slate-600">Vue d'ensemble de la plateforme Nexcore Hub</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Projets actifs</div>
              <Briefcase className="size-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">47</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="size-4" />
              +18% ce mois
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Experts vérifiés</div>
              <Users className="size-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">142</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="size-4" />
              +12 cette semaine
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Volume d'affaires</div>
              <DollarSign className="size-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">1.2M€</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="size-4" />
              +25% ce trimestre
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Taux de satisfaction</div>
              <Award className="size-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">4.7</div>
            <div className="text-sm text-slate-600">sur 5.0 (289 avis)</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Activité récente</h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-lg border ${priorityColors[activity.priority as keyof typeof priorityColors]}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-slate-900">{activity.title}</div>
                      <div className="text-xs text-slate-500">
                        {activity.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="text-sm text-slate-700">{activity.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Technologies les plus demandées</h2>
              <div className="space-y-4">
                {topTechnologies.map((tech, index) => (
                  <div key={tech.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-slate-400">{index + 1}</div>
                        <div>
                          <div className="font-medium text-slate-900">{tech.name}</div>
                          <div className="text-sm text-slate-600">{tech.count} projets</div>
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">{tech.trend}</div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                        style={{ width: `${(tech.count / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="size-6 text-red-600" />
                <h3 className="text-lg font-semibold text-slate-900">Actions requises</h3>
              </div>
              <div className="space-y-3">
                {pendingActions.map((action) => (
                  <a
                    key={action.id}
                    href={action.link}
                    className="block p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-900">{action.task}</div>
                      <div className="size-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {action.count}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Métriques clés</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-slate-600">Temps de réponse moyen</div>
                    <div className="text-sm font-semibold text-slate-900">2.3h</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-slate-600">Taux de matching</div>
                    <div className="text-sm font-semibold text-slate-900">78%</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-slate-600">Projets complétés</div>
                    <div className="text-sm font-semibold text-slate-900">92%</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-5 text-green-600" />
                <h3 className="font-semibold text-slate-900">Système opérationnel</h3>
              </div>
              <div className="text-sm text-slate-700">
                Tous les services fonctionnent normalement
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Dernière vérification: il y a 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
