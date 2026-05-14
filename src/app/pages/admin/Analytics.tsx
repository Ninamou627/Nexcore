import { AdminNav } from '../../components/AdminNav';
import { TrendingUp, Activity, Code2, DollarSign, Clock, Award, Users, Briefcase, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../core/services/api';

interface AdminStats {
  totalProjects: number;
  activeProjects: number;
  totalExperts: number;
  verifiedExperts: number;
  totalClients: number;
  totalVolume: number;
}

interface Project {
  id: string;
  title: string;
  status: string;
  budget?: string;
  timeline?: string;
  techStack?: string[];
  createdAt: string;
  client?: { fullName: string; company?: string };
  expert?: { fullName: string } | null;
}

export function Analytics() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, projectsData] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/projects'),
        ]);
        setStats(statsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Erreur chargement analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculer les technologies les plus demandées
  const techCounts: Record<string, number> = {};
  const techBudgets: Record<string, number[]> = {};
  projects.forEach((p) => {
    if (p.techStack && Array.isArray(p.techStack)) {
      const budgetNum = p.budget ? parseFloat(p.budget.replace(/[^0-9.]/g, '')) || 0 : 0;
      p.techStack.forEach((tech) => {
        techCounts[tech] = (techCounts[tech] || 0) + 1;
        if (!techBudgets[tech]) techBudgets[tech] = [];
        if (budgetNum > 0) techBudgets[tech].push(budgetNum);
      });
    }
  });
  const topTechnologies = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => {
      const budgets = techBudgets[name] || [];
      const avgBudget = budgets.length > 0 ? budgets.reduce((a, b) => a + b, 0) / budgets.length : 0;
      return { name, projects: count, avgBudget };
    });

  // Calculer la répartition par statut
  const statusCounts = {
    matching: projects.filter(p => p.status === 'matching').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  // Calculer les projets par mois (6 derniers mois)
  const monthlyData: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleDateString('fr-FR', { month: 'short' });
    const year = d.getFullYear();
    const month = d.getMonth();
    const count = projects.filter(p => {
      const pd = new Date(p.createdAt);
      return pd.getMonth() === month && pd.getFullYear() === year;
    }).length;
    monthlyData.push({ month: monthName, count });
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K€`;
    return `${value.toFixed(0)}€`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    );
  }

  const completionRate = projects.length > 0
    ? Math.round((statusCounts.completed / projects.length) * 100)
    : 0;

  const matchingRate = projects.length > 0
    ? Math.round(((statusCounts.in_progress + statusCounts.completed) / projects.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen blur-3xl animate-pulse" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-slate-900/40 rounded-full mix-blend-screen blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
      </div>

      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytiques et statistiques</h1>
          <p className="text-blue-100/80">Analyse détaillée de la performance de la plateforme</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { metric: 'Total projets', value: String(stats?.totalProjects ?? 0), icon: Briefcase, color: 'blue' },
            { metric: 'Taux de matching', value: `${matchingRate}%`, icon: Activity, color: 'cyan' },
            { metric: 'Projets complétés', value: `${completionRate}%`, icon: TrendingUp, color: 'green' },
            { metric: 'Experts actifs', value: `${stats?.verifiedExperts ?? 0}/${stats?.totalExperts ?? 0}`, icon: Users, color: 'purple' },
          ].map((item) => (
            <div key={item.metric} className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-blue-900/10 backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-blue-100/70">{item.metric}</div>
                <item.icon className={`size-5 text-${item.color}-300`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Projets créés par mois</h2>
            </div>
            <div className="space-y-4">
              {monthlyData.map((data) => {
                const maxCount = Math.max(...monthlyData.map(d => d.count), 1);
                const width = (data.count / maxCount) * 100;
                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-blue-100/70">
                      <div className="font-medium capitalize">{data.month}</div>
                      <div>{data.count} projet{data.count > 1 ? 's' : ''}</div>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Répartition par statut</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: 'En matching', count: statusCounts.matching, color: 'bg-orange-500' },
                { name: 'En cours', count: statusCounts.in_progress, color: 'bg-blue-500' },
                { name: 'Terminés', count: statusCounts.completed, color: 'bg-green-500' },
              ].map((cat) => {
                const percentage = projects.length > 0 ? Math.round((cat.count / projects.length) * 100) : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2 text-blue-100/80">
                      <div className="font-medium text-white">{cat.name}</div>
                      <div className="text-sm text-blue-200">{cat.count} projet{cat.count > 1 ? 's' : ''} ({percentage}%)</div>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Technologies les plus demandées</h2>
            </div>
            {topTechnologies.length === 0 ? (
              <div className="text-blue-100/50 text-center py-8">Aucune donnée technologique disponible</div>
            ) : (
              <div className="space-y-3">
                {topTechnologies.map((tech, index) => (
                  <div key={tech.name} className="flex items-center gap-3 text-blue-100/80">
                    <div className="text-lg font-bold text-blue-200 w-6">{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-white">{tech.name}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-blue-100/70">
                        <span>{tech.projects} projet{tech.projects > 1 ? 's' : ''}</span>
                        {tech.avgBudget > 0 && (
                          <span>Budget moyen: {tech.avgBudget.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Users className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Utilisateurs</h2>
            </div>
            <div className="space-y-4">
              <div className="glass-soft rounded-3xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2 text-white/90">
                  <div className="font-medium">Clients</div>
                  <div className="text-sm text-blue-300">{stats?.totalClients ?? 0}</div>
                </div>
                <div className="text-sm text-blue-100/60">Utilisateurs ayant créé des projets</div>
              </div>
              <div className="glass-soft rounded-3xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2 text-white/90">
                  <div className="font-medium">Experts inscrits</div>
                  <div className="text-sm text-blue-300">{stats?.totalExperts ?? 0}</div>
                </div>
                <div className="text-sm text-blue-100/60">Total des experts sur la plateforme</div>
              </div>
              <div className="glass-soft rounded-3xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2 text-white/90">
                  <div className="font-medium">Experts vérifiés</div>
                  <div className="text-sm text-green-300">{stats?.verifiedExperts ?? 0}</div>
                </div>
                <div className="text-sm text-blue-100/60">Actifs sur le marketplace</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-blue-400/10 shadow-2xl shadow-blue-900/10 bg-black/40">
            <div className="flex items-center justify-between mb-4 text-blue-100/70">
              <div className="text-sm font-medium">Volume total des affaires</div>
              <DollarSign className="size-5 text-blue-300" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{formatCurrency(stats?.totalVolume ?? 0)}</div>
            <div className="text-sm text-blue-200">{stats?.totalProjects ?? 0} projets au total</div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-green-400/10 shadow-2xl shadow-slate-950/10 bg-black/40">
            <div className="flex items-center justify-between mb-4 text-blue-100/70">
              <div className="text-sm font-medium">Projets actifs</div>
              <Award className="size-5 text-green-300" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats?.activeProjects ?? 0}</div>
            <div className="text-sm text-green-200">En cours de réalisation</div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-purple-400/10 shadow-2xl shadow-slate-950/10 bg-black/40">
            <div className="flex items-center justify-between mb-4 text-blue-100/70">
              <div className="text-sm font-medium">Taux de complétion</div>
              <Clock className="size-5 text-purple-300" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{completionRate}%</div>
            <div className="text-sm text-purple-200">{statusCounts.completed} projet{statusCounts.completed > 1 ? 's' : ''} terminé{statusCounts.completed > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
