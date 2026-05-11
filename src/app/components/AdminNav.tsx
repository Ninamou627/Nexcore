import { Link } from 'react-router';
import { Rocket, LayoutDashboard, Shield, FileText, AlertTriangle, BarChart3, LogOut } from 'lucide-react';

export function AdminNav() {
  const navItems = [
    { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/experts', label: 'Experts', icon: Shield },
    { path: '/admin/projects', label: 'Projets', icon: FileText },
    { path: '/admin/disputes', label: 'Litiges', icon: AlertTriangle },
    { path: '/admin/analytics', label: 'Analytiques', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <Rocket className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Nexcore Hub Admin</span>
          </Link>
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 transition-colors ${
                    isActive ? 'text-red-600 font-medium' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-900">Admin Nexcore</div>
            <div className="text-xs text-slate-500">admin@nexcore.com</div>
          </div>
          <button className="size-10 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center">
            <LogOut className="size-5 text-slate-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
