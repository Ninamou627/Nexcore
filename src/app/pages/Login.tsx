import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket, Mail, Lock } from 'lucide-react';
import { api } from '../core/services/api';
import { useAuth } from '../core/stores/auth';
import { ThemeToggle } from '../components/ThemeToggle';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (!isMfaStep) {
        const data = await api.post('/auth/login', { email, password });
        if (data.mfaRequired) {
          setIsMfaStep(true);
          setTempToken(data.tempToken);
          return;
        }
        completeLogin(data);
      } else {
        const data = await api.post('/auth/login-2fa', { code: mfaCode, tempToken });
        completeLogin(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const completeLogin = (data: any) => {
    login(data, data.token);
    const userRole = data.role?.toUpperCase();
    if (userRole === 'EXPERT') navigate('/expert');
    else if (userRole === 'ADMIN') navigate('/admin');
    else navigate('/client');
  };

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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/40 to-cyan-400/20 rounded-2xl flex items-center justify-center backdrop-blur-2xl border border-white/10 shadow-lg shadow-blue-900/20">
                <Rocket className="w-7 h-7 text-blue-200 light:text-blue-600" />
              </div>
              <span className="text-2xl font-semibold text-white light:text-slate-900">Nexcore Hub</span>
            </Link>
            <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-2">Bon retour !</h1>
            <p className="text-blue-100/80 light:text-slate-600">Connectez-vous à votre compte</p>
          </div>
          <div className="bg-black/40 light:bg-white/80 rounded-2xl shadow-2xl light:shadow-lg p-8 border border-white/10 light:border-slate-200 backdrop-blur-3xl">
            {error && (
              <div className="mb-6 p-4 bg-red-50/10 light:bg-red-50 text-red-200 light:text-red-700 rounded-lg text-sm font-medium border border-red-500/20 light:border-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isMfaStep ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 light:text-slate-700 mb-2">Email professionnel</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-white/10 light:border-slate-300 rounded-lg bg-black/30 light:bg-white text-white light:text-slate-900 placeholder-blue-100/50 light:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="vous@entreprise.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 light:text-slate-700 mb-2">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-white/10 light:border-slate-300 rounded-lg bg-black/30 light:bg-white text-white light:text-slate-900 placeholder-blue-100/50 light:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••" required />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Vérification 2FA</h3>
                    <p className="text-sm text-blue-100/60">Entrez le code généré par votre application d'authentification.</p>
                  </div>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="000 000"
                    maxLength={6}
                    className="w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    autoFocus
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsMfaStep(false)}
                    className="w-full text-sm text-blue-200/60 hover:text-blue-200 transition-colors"
                  >
                    Retour à la connexion classique
                  </button>
                </div>
              )}
              
              {!isMfaStep && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 text-blue-600 focus:ring-blue-500 bg-black/30" />
                    <span className="text-blue-100/70 light:text-slate-600">Se souvenir de moi</span>
                  </label>
                  <a href="#" className="text-blue-200 light:text-blue-600 hover:text-blue-100 transition-colors">Mot de passe oublié ?</a>
                </div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-white/10">
                {isLoading ? 'Chargement...' : isMfaStep ? 'Vérifier le code' : 'Se connecter'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-blue-100/70 light:text-slate-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-blue-200 light:text-blue-600 hover:text-blue-100 font-medium transition-colors">Créer un compte</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
