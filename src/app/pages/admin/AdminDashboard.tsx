import { AdminNav } from '../../components/AdminNav';
import { TrendingUp, Users, Briefcase, Clock, AlertCircle, CheckCircle, DollarSign, Award, Loader2 } from 'lucide-react';
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

interface PendingExpert {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  client?: { fullName: string; company?: string };
  expert?: { fullName: string } | null;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingExperts, setPendingExperts] = useState<PendingExpert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, expertsData, projectsData] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/experts/pending'),
          api.get('/admin/projects'),
        ]);
        setStats(statsData);
        setPendingExperts(expertsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Erreur chargement données admin:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentProjects = projects.slice(0, 4);

  const pendingActions = [
    { id: '1', task: `${pendingExperts.length} profil(s) expert(s) à valider`, count: pendingExperts.length, link: '/admin/experts' },
    { id: '2', task: `${projects.filter(p => p.status === 'matching').length} projet(s) en cours de matching`, count: projects.filter(p => p.status === 'matching').length, link: '/admin/projects' },
  ];

  // Calculer les technologies les plus demandées à partir des vrais projets
  const techCounts: Record<string, number> = {};
  projects.forEach((p: any) => {
    if (p.techStack && Array.isArray(p.techStack)) {
      p.techStack.forEach((tech: string) => {
        techCounts[tech] = (techCounts[tech] || 0) + 1;
      });
    }
  });
  const topTechnologies = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const formatVolume = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K€`;
    return `${value.toFixed(0)}€`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    );
  }

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
            { label: 'Projets actifs', value: stats?.activeProjects ?? 0, sub: `${stats?.totalProjects ?? 0} total`, icon: Briefcase, clr: 'blue' },
            { label: 'Experts vérifiés', value: stats?.verifiedExperts ?? 0, sub: `${stats?.totalExperts ?? 0} inscrits`, icon: Users, clr: 'cyan' },
            { label: "Volume d'affaires", value: formatVolume(stats?.totalVolume ?? 0), sub: `${stats?.totalProjects ?? 0} projets`, icon: DollarSign, clr: 'green' },
            { label: 'Clients inscrits', value: stats?.totalClients ?? 0, sub: 'sur la plateforme', icon: Award, clr: 'purple' },
          ].map((s, i) => (
            <div key={i} className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 shadow-2xl light:shadow-sm backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-blue-100/70 light:text-slate-500">{s.label}</div>
                <s.icon className={`w-5 h-5 text-${s.clr}-300`} />
              </div>
              <div className="text-3xl font-bold text-white light:text-slate-900 mb-1">{s.value}</div>
              <div className="text-sm text-green-300 light:text-green-600 flex items-center gap-1">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <h2 className="text-xl font-semibold text-white light:text-slate-900 mb-4">Projets récents</h2>
              <div className="space-y-3">
                {recentProjects.length === 0 ? (
                  <div className="text-blue-100/50 light:text-slate-400 text-center py-6">Aucun projet pour le moment</div>
                ) : (
                  recentProjects.map((p) => (
                    <div key={p.id} className="p-4 rounded-lg border backdrop-blur-sm bg-blue-500/10 light:bg-blue-50 border-blue-400/30 light:border-blue-200">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-medium text-white light:text-slate-900">{p.title}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status === 'matching' ? 'bg-orange-500/20 text-orange-200' :
                          p.status === 'in_progress' ? 'bg-blue-500/20 text-blue-200' :
                          p.status === 'completed' ? 'bg-green-500/20 text-green-200' :
                          'bg-slate-500/20 text-slate-200'
                        }`}>{p.status}</span>
                      </div>
                      <div className="text-sm text-blue-100/70 light:text-slate-600">
                        Client: {p.client?.fullName || 'N/A'} {p.client?.company ? `(${p.client.company})` : ''}
                        {p.expert ? ` • Expert: ${p.expert.fullName}` : ''}
                      </div>
                      <div className="text-xs text-blue-100/50 light:text-slate-400 mt-1">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <h2 className="text-xl font-semibold text-white light:text-slate-900 mb-4">Technologies les plus demandées</h2>
              {topTechnologies.length === 0 ? (
                <div className="text-blue-100/50 light:text-slate-400 text-center py-6">Aucune donnée technologique disponible</div>
              ) : (
                <div className="space-y-4">
                  {topTechnologies.map((tech, index) => (
                    <div key={tech.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-blue-100/50 light:text-slate-300">{index + 1}</div>
                          <div>
                            <div className="font-medium text-white light:text-slate-900">{tech.name}</div>
                            <div className="text-sm text-blue-100/60 light:text-slate-500">{tech.count} projet{tech.count > 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-black/20 light:bg-slate-200 rounded-full overflow-hidden border border-white/10 light:border-slate-300">
                        <div className="h-full bg-gradient-to-r from-blue-600/90 to-cyan-400/40 rounded-full" style={{ width: `${(tech.count / (topTechnologies[0]?.count || 1)) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 light:from-red-50 light:to-orange-50 rounded-xl p-6 border border-red-400/30 light:border-red-200 backdrop-blur-3xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-red-300 light:text-red-600" />
                <h3 className="text-lg font-semibold text-white light:text-slate-900">Actions requises</h3>
              </div>
              <div className="space-y-3">
                {pendingActions.filter(a => a.count > 0).length === 0 ? (
                  <div className="p-4 bg-black/20 light:bg-white rounded-lg border border-green-400/30 light:border-green-200 text-center">
                    <div className="text-sm text-green-200 light:text-green-600">Aucune action en attente ✅</div>
                  </div>
                ) : (
                  pendingActions.filter(a => a.count > 0).map((action) => (
                    <a key={action.id} href={action.link} className="block p-4 bg-black/20 light:bg-white rounded-lg border border-red-400/30 light:border-red-200 hover:border-red-400/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white light:text-slate-900">{action.task}</div>
                        <div className="w-8 h-8 bg-red-500/20 text-red-200 light:text-red-600 rounded-full flex items-center justify-center text-sm font-bold border border-red-400/30">{action.count}</div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
            <div className="bg-black/40 light:bg-white/80 rounded-xl p-6 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
              <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-4">Répartition des projets</h3>
              <div className="space-y-4">
                {[
                  { label: 'En matching', value: projects.filter(p => p.status === 'matching').length, total: projects.length, color: 'orange' },
                  { label: 'En cours', value: projects.filter(p => p.status === 'in_progress').length, total: projects.length, color: 'blue' },
                  { label: 'Terminés', value: projects.filter(p => p.status === 'completed').length, total: projects.length, color: 'green' },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-blue-100/70 light:text-slate-500">{m.label}</div>
                      <div className="text-sm font-semibold text-white light:text-slate-900">{m.value}</div>
                    </div>
                    <div className="w-full h-2 bg-black/20 light:bg-slate-200 rounded-full overflow-hidden border border-white/10 light:border-slate-300">
                      <div className={`h-full bg-${m.color}-500/60 rounded-full`} style={{ width: `${m.total > 0 ? (m.value / m.total) * 100 : 0}%` }} />
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
              <div className="mt-3 text-xs text-blue-100/50 light:text-slate-400">Dernière vérification: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
