import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Rocket, Mail, Lock, Building2, User, Code2 } from 'lucide-react';
import { api } from '../core/services/api';
import { useAuth } from '../core/stores/auth';
import { ThemeToggle } from '../components/ThemeToggle';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type');
  const [userType, setUserType] = useState<'client' | 'expert'>(typeFromUrl === 'expert' ? 'expert' : 'client');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', companyName: '', fullName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
    setIsLoading(true); setError('');
    try {
      const data = await api.post('/auth/register', {
        email: formData.email, password: formData.password,
        fullName: userType === 'expert' ? formData.fullName : formData.companyName,
        company: userType === 'client' ? formData.companyName : undefined,
        role: userType.toUpperCase(),
      });
      login(data, data.token);
      navigate(userType === 'client' ? '/client' : '/expert');
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  const inputCls = "w-full pl-11 pr-4 py-3 border border-white/10 light:border-slate-300 rounded-lg bg-black/30 light:bg-white text-white light:text-slate-900 placeholder-blue-100/50 light:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="min-h-screen bg-main overflow-hidden relative">
      <div className="fixed inset-0 -z-10 overflow-hidden light:hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-900/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="absolute top-6 right-6 z-20"><ThemeToggle /></div>
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/40 to-cyan-400/20 rounded-2xl flex items-center justify-center backdrop-blur-2xl border border-white/10 shadow-lg shadow-blue-900/20">
                <Rocket className="w-7 h-7 text-blue-200 light:text-blue-600" />
              </div>
              <span className="text-2xl font-semibold text-white light:text-slate-900">Nexcore Hub</span>
            </Link>
            <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-2">Créer un compte</h1>
            <p className="text-blue-100/80 light:text-slate-600">Rejoignez la plateforme de digitalisation B2B</p>
          </div>
          <div className="bg-black/40 light:bg-white/80 rounded-2xl shadow-2xl light:shadow-lg p-8 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
            {error && (
              <div className="mb-6 p-4 bg-red-50/10 light:bg-red-50 text-red-200 light:text-red-700 rounded-lg text-sm font-medium border border-red-500/20 light:border-red-200">{error}</div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button type="button" onClick={() => setUserType('client')}
                className={`p-4 rounded-xl border-2 transition-all ${userType === 'client'
                  ? 'border-blue-400/60 bg-blue-500/20 text-blue-100 light:text-blue-700 shadow-lg shadow-blue-900/30 light:shadow-sm'
                  : 'border-white/10 light:border-slate-200 bg-black/20 light:bg-slate-50 text-blue-100/70 light:text-slate-600 hover:border-white/20 light:hover:border-slate-300'}`}>
                <Building2 className={`size-8 mx-auto mb-2 ${userType === 'client' ? 'text-blue-300 light:text-blue-600' : 'text-blue-400 light:text-slate-400'}`} />
                <div className="font-medium text-white light:text-slate-900">Entreprise</div>
                <div className="text-sm text-blue-100/60 light:text-slate-500">Je cherche des experts</div>
              </button>
              <button type="button" onClick={() => setUserType('expert')}
                className={`p-4 rounded-xl border-2 transition-all ${userType === 'expert'
                  ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-100 light:text-cyan-700 shadow-lg shadow-cyan-900/30 light:shadow-sm'
                  : 'border-white/10 light:border-slate-200 bg-black/20 light:bg-slate-50 text-blue-100/70 light:text-slate-600 hover:border-white/20 light:hover:border-slate-300'}`}>
                <Code2 className={`size-8 mx-auto mb-2 ${userType === 'expert' ? 'text-cyan-300 light:text-cyan-600' : 'text-blue-400 light:text-slate-400'}`} />
                <div className="font-medium text-white light:text-slate-900">Expert IT</div>
                <div className="text-sm text-blue-100/60 light:text-slate-500">Je propose mes services</div>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-blue-100/80 light:text-slate-700 mb-2">{userType === 'client' ? "Nom de l'entreprise" : 'Nom complet'}</label>
                <div className="relative">
                  {userType === 'client' ? <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" /> : <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />}
                  <input type="text" value={userType === 'client' ? formData.companyName : formData.fullName}
                    onChange={(e) => setFormData({ ...formData, [userType === 'client' ? 'companyName' : 'fullName']: e.target.value })}
                    className={inputCls} placeholder={userType === 'client' ? 'Votre Entreprise SARL' : 'Jean Dupont'} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100/80 light:text-slate-700 mb-2">Email professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputCls} placeholder="vous@entreprise.com" required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100/80 light:text-slate-700 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={inputCls} placeholder="••••••••" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100/80 light:text-slate-700 mb-2">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={inputCls} placeholder="••••••••" required />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-white/10">
                {isLoading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-blue-100/70 light:text-slate-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-blue-200 light:text-blue-600 hover:text-blue-100 font-medium transition-colors">Se connecter</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
