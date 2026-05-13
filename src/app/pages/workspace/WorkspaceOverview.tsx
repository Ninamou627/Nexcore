import { TrendingUp, Calendar, DollarSign, Users, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useOutletContext } from 'react-router';

export function WorkspaceOverview() {
  const { project } = useOutletContext<{ project: any }>();

  // Calculer la progression (mocké pour l'instant si pas de jalons réels)
  const completedMilestones = project.milestones?.filter((m: any) => m.status === 'completed').length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-300 light:text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-3">
            <Clock className="size-4" /> Workspace Actif
          </div>
          <h2 className="text-4xl font-black text-white light:text-slate-900 tracking-tight mb-2">{project.title}</h2>
          <p className="text-blue-100 light:text-slate-500 font-medium text-lg">
            Collaboration entre <span className="text-white light:text-slate-900 font-bold">{project.client?.fullName}</span> et <span className="text-white light:text-slate-900 font-bold">{project.expert?.fullName}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-6 py-2 bg-green-500/10 light:bg-green-50 text-green-200 light:text-green-700 rounded-2xl text-sm font-black uppercase tracking-widest border border-green-400/20 light:border-green-300">
            En Cours
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-[2rem] p-8 border border-white/10 light:border-slate-200 shadow-2xl shadow-blue-900/10 light:shadow-sm group hover:scale-105 transition-transform duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="size-12 bg-blue-500/15 light:bg-blue-50 rounded-2xl flex items-center justify-center text-blue-200 light:text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
              <TrendingUp className="size-6" />
            </div>
            <div className="text-sm font-black text-blue-100 light:text-slate-500 uppercase tracking-widest">Progression</div>
          </div>
          <div className="text-4xl font-black text-white light:text-slate-900 mb-2">{progress}%</div>
          <div className="w-full h-2 bg-white/10 light:bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 border border-white/10 light:border-slate-200 shadow-2xl shadow-green-900/10 light:shadow-sm group hover:scale-105 transition-transform duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="size-12 bg-green-500/15 light:bg-green-50 rounded-2xl flex items-center justify-center text-green-200 light:text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
              <CheckCircle className="size-6" />
            </div>
            <div className="text-sm font-black text-blue-100 light:text-slate-500 uppercase tracking-widest">Jalons</div>
          </div>
          <div className="text-4xl font-black text-white light:text-slate-900">{completedMilestones}/{totalMilestones || 5}</div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 border border-white/10 light:border-slate-200 shadow-2xl shadow-amber-900/10 light:shadow-sm group hover:scale-105 transition-transform duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="size-12 bg-amber-500/15 light:bg-amber-50 rounded-2xl flex items-center justify-center text-amber-200 light:text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500">
              <Calendar className="size-6" />
            </div>
            <div className="text-sm font-black text-blue-100 light:text-slate-500 uppercase tracking-widest">Échéance</div>
          </div>
          <div className="text-2xl font-black text-white light:text-slate-900">{project.timeline || 'À définir'}</div>
        </div>

        <div className="glass-card rounded-[2rem] p-8 border border-white/10 light:border-slate-200 shadow-2xl shadow-purple-900/10 light:shadow-sm group hover:scale-105 transition-transform duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="size-12 bg-purple-500/15 light:bg-purple-50 rounded-2xl flex items-center justify-center text-purple-200 light:text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500">
              <DollarSign className="size-6" />
            </div>
            <div className="text-sm font-black text-blue-100 light:text-slate-500 uppercase tracking-widest">Budget</div>
          </div>
          <div className="text-3xl font-black text-white light:text-slate-900">{project.budget || 'Sur devis'}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 light:border-slate-200 shadow-2xl shadow-slate-900/20 light:shadow-sm">
          <h3 className="text-2xl font-black text-white light:text-slate-900 mb-8 tracking-tight">Membres de l'équipe</h3>
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 glass-soft rounded-[1.5rem] border border-white/10 light:border-slate-200 hover:border-white/20 light:hover:border-slate-300 transition-colors">
              <div className="size-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {project.client?.fullName?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white light:text-slate-900">{project.client?.fullName}</div>
                <div className="text-sm font-bold text-blue-100 light:text-slate-500 uppercase tracking-widest">{project.client?.company || 'Client'}</div>
              </div>
              <div className="px-4 py-1.5 bg-blue-500/10 light:bg-blue-50 text-blue-200 light:text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest">
                Client
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 glass-soft rounded-[1.5rem] border border-white/10 light:border-slate-200 hover:border-white/20 light:hover:border-slate-300 transition-colors">
              <div className="size-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {project.expert?.fullName?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white light:text-slate-900">{project.expert?.fullName}</div>
                <div className="text-sm font-bold text-blue-100 light:text-slate-500 uppercase tracking-widest">Expert Nexcore</div>
              </div>
              <div className="px-4 py-1.5 bg-indigo-500/10 light:bg-indigo-50 text-indigo-200 light:text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest">
                Expert
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 light:border-slate-200 shadow-2xl shadow-slate-900/20 light:shadow-sm">
          <h3 className="text-2xl font-black text-white light:text-slate-900 mb-8 tracking-tight">Activité récente</h3>
          <div className="space-y-6">
            {(project.messages?.length > 0) ? (
              project.messages.slice(-3).map((msg: any) => (
                <div key={msg.id} className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 light:border-slate-200 bg-black/20 light:bg-slate-50 transition-colors">
                  <div className="size-10 bg-blue-500/10 light:bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="size-5 text-blue-200 light:text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white light:text-slate-900">Nouveau message de {msg.sender?.fullName}</div>
                    <p className="text-xs text-blue-100 light:text-slate-500 line-clamp-1 mt-1">{msg.content}</p>
                    <div className="text-[10px] font-black text-blue-300 light:text-blue-600 uppercase mt-2 tracking-widest">Il y a quelques instants</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 glass-soft rounded-[2rem] border border-white/10 light:border-slate-200">
                <div className="size-20 bg-blue-500/10 light:bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-blue-400/20 light:border-blue-300">
                  <Clock className="size-8 text-blue-200 light:text-blue-500" />
                </div>
                <p className="text-blue-100 light:text-slate-500 font-bold uppercase text-xs tracking-widest">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] p-12 shadow-2xl relative overflow-hidden border border-white/10 light:border-slate-200">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TrendingUp className="size-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="px-4 py-1.5 bg-white/10 light:bg-blue-50 backdrop-blur-md border border-white/20 light:border-blue-200 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 light:text-blue-600">
              Statut du projet
            </div>
          </div>
          <h3 className="text-4xl font-black mb-6 tracking-tight text-white light:text-slate-900">Projet en excellente voie</h3>
          <p className="text-blue-100/80 light:text-slate-600 text-xl leading-relaxed max-w-3xl font-medium">
            Le projet progresse conformément au planning initial. L'IA surveille la collaboration pour garantir
            la fluidité des échanges et le respect des jalons critiques. Vous êtes à <span className="text-white light:text-slate-900 font-black">{progress}%</span> de la livraison finale.
          </p>
        </div>
      </div>
    </div>
  );
}
