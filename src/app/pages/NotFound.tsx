import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-main overflow-hidden relative">
      <div className="fixed inset-0 -z-10 overflow-hidden light:hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-900/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="text-center">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 drop-shadow-lg">404</div>
          <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-4">Page non trouvée</h1>
          <p className="text-blue-100/80 light:text-slate-600 mb-8 max-w-md">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white rounded-lg hover:shadow-lg transition-shadow border border-white/10">
              <Home className="w-5 h-5" /> Retour à l'accueil
            </Link>
            <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-3 border-2 border-white/20 light:border-slate-300 text-blue-100/80 light:text-slate-600 rounded-lg hover:border-white/30 light:hover:border-slate-400 hover:bg-black/20 light:hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-5 h-5" /> Page précédente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
