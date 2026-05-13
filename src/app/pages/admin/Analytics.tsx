import { AdminNav } from '../../components/AdminNav';
import { TrendingUp, TrendingDown, Activity, MapPin, Code2, DollarSign, Clock, Award } from 'lucide-react';

export function Analytics() {
  const monthlyData = [
    { month: 'Nov', projects: 32, revenue: 280000 },
    { month: 'Déc', projects: 38, revenue: 320000 },
    { month: 'Jan', projects: 42, revenue: 385000 },
    { month: 'Fév', projects: 45, revenue: 410000 },
    { month: 'Mar', projects: 51, revenue: 465000 },
    { month: 'Avr', projects: 47, revenue: 425000 },
  ];

  const geographicData = [
    { country: 'Maroc', projects: 85, experts: 54, revenue: 750000 },
    { country: 'Sénégal', projects: 42, experts: 28, revenue: 380000 },
    { country: 'Côte d\'Ivoire', projects: 38, experts: 22, revenue: 340000 },
    { country: 'Guinée', projects: 15, experts: 12, revenue: 130000 },
  ];

  const topTechnologies = [
    { name: 'Laravel', projects: 28, avgBudget: 18500, growth: '+12%' },
    { name: 'React', projects: 25, avgBudget: 16200, growth: '+8%' },
    { name: 'Node.js', projects: 22, avgBudget: 15800, growth: '+15%' },
    { name: 'AWS', projects: 18, avgBudget: 22000, growth: '+20%' },
    { name: 'PostgreSQL', projects: 16, avgBudget: 14500, growth: '+5%' },
    { name: 'Docker', projects: 14, avgBudget: 19000, growth: '+18%' },
    { name: 'Vue.js', projects: 12, avgBudget: 15000, growth: '+3%' },
    { name: 'Python', projects: 11, avgBudget: 17500, growth: '+10%' },
  ];

  const categories = [
    { name: 'E-commerce', count: 38, percentage: 28, color: 'bg-blue-500' },
    { name: 'Mobile', count: 32, percentage: 24, color: 'bg-indigo-500' },
    { name: 'Infrastructure', count: 28, percentage: 21, color: 'bg-purple-500' },
    { name: 'Web', count: 24, percentage: 18, color: 'bg-pink-500' },
    { name: 'Sécurité', count: 12, percentage: 9, color: 'bg-red-500' },
  ];

  const performanceMetrics = [
    { metric: 'Temps de matching moyen', value: '2.3 heures', trend: 'down', change: '-15%', good: true },
    { metric: 'Taux de réussite projets', value: '92%', trend: 'up', change: '+3%', good: true },
    { metric: 'Satisfaction client', value: '4.7/5', trend: 'up', change: '+0.2', good: true },
    { metric: 'Taux de litiges', value: '2.1%', trend: 'down', change: '-0.5%', good: true },
  ];

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
          {performanceMetrics.map((item) => (
            <div key={item.metric} className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-blue-900/10 backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-blue-100/70">{item.metric}</div>
                {item.trend === 'up' ? (
                  <TrendingUp className={`size-5 ${item.good ? 'text-green-300' : 'text-red-300'}`} />
                ) : (
                  <TrendingDown className={`size-5 ${item.good ? 'text-green-300' : 'text-red-300'}`} />
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
              <div className={`text-sm ${item.good ? 'text-green-300' : 'text-red-300'}`}>
                {item.change} ce mois
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Évolution mensuelle</h2>
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, index) => {
                const maxProjects = Math.max(...monthlyData.map(d => d.projects));
                const width = (data.projects / maxProjects) * 100;
                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-blue-100/70">
                      <div className="font-medium">{data.month}</div>
                      <div>{data.projects} projets • {(data.revenue / 1000).toFixed(0)}K€</div>
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
              <MapPin className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Répartition géographique</h2>
            </div>
            <div className="space-y-4">
              {geographicData.map((country) => (
                <div key={country.country} className="glass-soft rounded-3xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2 text-white/90">
                    <div className="font-medium">{country.country}</div>
                    <div className="text-sm text-blue-300">{(country.revenue / 1000).toFixed(0)}K€</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-blue-100/70">
                    <div>
                      <span className="text-slate-400">Projets:</span> {country.projects}
                    </div>
                    <div>
                      <span className="text-slate-400">Experts:</span> {country.experts}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Technologies les plus demandées</h2>
            </div>
            <div className="space-y-3">
              {topTechnologies.map((tech, index) => (
                <div key={tech.name} className="flex items-center gap-3 text-blue-100/80">
                  <div className="text-lg font-bold text-blue-200 w-6">{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-white">{tech.name}</div>
                      <div className="text-sm text-green-300 font-medium">{tech.growth}</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-100/70">
                      <span>{tech.projects} projets</span>
                      <span>Budget moyen: {tech.avgBudget.toLocaleString('fr-FR')}€</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="size-5 text-blue-200" />
              <h2 className="text-xl font-semibold text-white">Catégories de projets</h2>
            </div>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2 text-blue-100/80">
                    <div className="font-medium text-white">{cat.name}</div>
                    <div className="text-sm text-blue-200">{cat.count} projets ({cat.percentage}%)</div>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-blue-400/10 shadow-2xl shadow-blue-900/10 bg-black/40">
            <div className="flex items-center justify-between mb-4 text-blue-100/70">
              <div className="text-sm font-medium">Volume total des affaires</div>
              <DollarSign className="size-5 text-blue-300" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">1.2M€</div>
            <div className="text-sm text-blue-200">+25% par rapport au trimestre dernier</div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-green-400/10 shadow-2xl shadow-slate-950/10 bg-black/40">
            <div className="flex items-center justify-between mb-4 text-blue-100/70">
              <div className="text-sm font-medium">Revenus plateforme</div>
              <Award className="size-5 text-green-300" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">120K€</div>
            <div className="text-sm text-green-200">Commission moyenne: 10%</div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-purple-400/10 shadow-2xl shadow-slate-950/10 bg-black/40">
            <div className="flex items-center justify-between mb-4 text-blue-100/70">
              <div className="text-sm font-medium">Délai moyen</div>
              <Clock className="size-5 text-purple-300" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">78 jours</div>
            <div className="text-sm text-purple-200">Du brief à la livraison finale</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl shadow-slate-950/20 bg-black/40">
          <h2 className="text-xl font-semibold text-white mb-4">Insights et recommandations</h2>
          <div className="space-y-4">
            <div className="glass-soft rounded-3xl p-4 border border-green-400/10 bg-slate-950/40">
              <div className="flex items-start gap-3">
                <TrendingUp className="size-5 text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white mb-1">Forte croissance sur AWS/Cloud</div>
                  <div className="text-sm text-blue-100/70">
                    La demande pour l'infrastructure cloud a augmenté de 20% ce mois. Considérez le recrutement d'experts spécialisés DevOps.
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-soft rounded-3xl p-4 border border-blue-400/10 bg-slate-950/40">
              <div className="flex items-start gap-3">
                <Activity className="size-5 text-blue-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white mb-1">Temps de matching excellent</div>
                  <div className="text-sm text-blue-100/70">
                    Le temps moyen de 2.3h pour matcher client-expert est 15% meilleur que le mois dernier. L'IA d'assistance contribue positivement.
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-soft rounded-3xl p-4 border border-amber-400/10 bg-slate-950/40">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-amber-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white mb-1">Potentiel d'expansion</div>
                  <div className="text-sm text-blue-100/70">
                    La Guinée et la Côte d'Ivoire montrent un fort potentiel de croissance. Envisager une campagne marketing ciblée.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
