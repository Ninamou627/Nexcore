import { AdminNav } from '../../components/AdminNav';
import { CheckCircle, Eye, DollarSign, Calendar, Loader2, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../core/services/api';

interface Project {
  id: string;
  title: string;
  description?: string;
  budget?: string;
  timeline?: string;
  techStack?: string[];
  status: string;
  createdAt: string;
  client?: { fullName: string; company?: string };
  expert?: { fullName: string } | null;
}

export function ProjectModeration() {
  const [selectedStatus, setSelectedStatus] = useState<'matching' | 'in_progress' | 'completed'>('matching');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get('/admin/projects');
        setProjects(data);
      } catch (error) {
        console.error('Erreur chargement projets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const matchingProjects = projects.filter(p => p.status === 'matching');
  const inProgressProjects = projects.filter(p => p.status === 'in_progress');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const currentProjects = selectedStatus === 'matching' ? matchingProjects
    : selectedStatus === 'in_progress' ? inProgressProjects
    : completedProjects;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">Modération des projets</h1>
          <p className="text-blue-100/80">Suivi et surveillance de tous les projets de la plateforme</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setSelectedStatus('matching')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'matching'
                ? 'border-orange-400/40 bg-orange-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-orange-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">En matching</div>
              <Eye className="size-5 text-orange-300" />
            </div>
            <div className="text-3xl font-bold text-white">{matchingProjects.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('in_progress')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'in_progress'
                ? 'border-blue-400/30 bg-blue-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-blue-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">En cours</div>
              <Briefcase className="size-5 text-blue-300" />
            </div>
            <div className="text-3xl font-bold text-white">{inProgressProjects.length}</div>
          </button>

          <button
            onClick={() => setSelectedStatus('completed')}
            className={`p-6 rounded-3xl border transition-all text-left ${
              selectedStatus === 'completed'
                ? 'border-green-400/30 bg-green-500/10 text-white'
                : 'border-white/10 bg-black/40 text-blue-100 hover:border-green-300/30 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-blue-100/70">Terminés</div>
              <CheckCircle className="size-5 text-green-300" />
            </div>
            <div className="text-3xl font-bold text-white">{completedProjects.length}</div>
          </button>
        </div>

        <div className="space-y-4">
          {currentProjects.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 border border-white/10 text-center bg-black/40">
              <Briefcase className="size-12 text-blue-100/30 mx-auto mb-4" />
              <div className="text-white text-lg font-semibold mb-2">Aucun projet dans cette catégorie</div>
              <div className="text-blue-100/50">Les projets apparaîtront ici une fois créés par les clients.</div>
            </div>
          ) : (
            currentProjects.map((project) => (
              <div key={project.id} className="glass-card rounded-3xl p-6 border border-white/10 bg-black/40 shadow-2xl shadow-blue-900/10">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        project.status === 'matching' ? 'bg-orange-500/10 text-orange-200 border border-orange-400/20' :
                        project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-200 border border-blue-400/20' :
                        'bg-green-500/10 text-green-200 border border-green-400/20'
                      }`}>
                        {project.status === 'matching' ? 'En matching' : project.status === 'in_progress' ? 'En cours' : 'Terminé'}
                      </span>
                    </div>
                    <div className="text-sm text-blue-100/70 mb-4">
                      Client: <span className="text-white font-medium">{project.client?.fullName || 'N/A'}</span>
                      {project.client?.company && <span className="text-blue-100/50"> ({project.client.company})</span>}
                      {project.expert && (
                        <span> • Expert: <span className="text-white font-medium">{project.expert.fullName}</span></span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-blue-100/80 mb-4 line-clamp-3">{project.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100/70 mb-4">
                      {project.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4 text-blue-300" />
                          <span className="font-medium">{project.budget}</span>
                        </div>
                      )}
                      {project.timeline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-blue-300" />
                          <span>Délai: {project.timeline}</span>
                        </div>
                      )}
                    </div>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-blue-500/10 text-blue-200 rounded-full text-sm font-semibold border border-blue-400/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-6 text-blue-100/80">
                    <div className="text-sm">Créé le</div>
                    <div className="text-sm font-medium text-white">
                      {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-blue-200">
                      {new Date(project.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 glass-card rounded-3xl p-6 border border-white/10 bg-black/40">
          <h3 className="font-semibold text-white mb-4">Résumé</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-300">{matchingProjects.length}</div>
              <div className="text-sm text-blue-100/60">En matching</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-300">{inProgressProjects.length}</div>
              <div className="text-sm text-blue-100/60">En cours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">{completedProjects.length}</div>
              <div className="text-sm text-blue-100/60">Terminés</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
