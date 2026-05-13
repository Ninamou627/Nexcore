import { Link } from 'react-router';
import { Rocket, LayoutDashboard, Shield, FileText, AlertTriangle, BarChart3, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function AdminNav() {
  const navItems = [
    { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/experts', label: 'Experts', icon: Shield },
    { path: '/admin/projects', label: 'Projets', icon: FileText },
    { path: '/admin/disputes', label: 'Litiges', icon: AlertTriangle },
    { path: '/admin/analytics', label: 'Analytiques', icon: BarChart3 },
  ];

  return (
    <nav className="bg-black/40 light:bg-white/85 border-b border-white/10 light:border-slate-200 backdrop-blur-3xl relative z-20 light:shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600/50 to-orange-400/20 rounded-xl flex items-center justify-center backdrop-blur-2xl border border-white/10 shadow-lg shadow-red-900/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white light:text-slate-900">Nexcore Admin</span>
          </Link>
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 transition-all ${
                    isActive ? 'text-red-400 light:text-red-600 font-bold' : 'text-blue-100/70 light:text-slate-600 hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-widest font-black text-[10px]">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white light:text-slate-900">Admin Nexcore</div>
            <div className="text-xs text-blue-100/60 light:text-slate-500">admin@nexcore.com</div>
          </div>
          <button className="w-10 h-10 bg-black/20 light:bg-slate-100 rounded-lg hover:bg-black/30 light:hover:bg-slate-200 transition-colors flex items-center justify-center border border-white/10 light:border-slate-200 backdrop-blur-sm">
            <LogOut className="w-5 h-5 text-blue-100/70 light:text-slate-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
