import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Rocket, Mail, Lock, Building2, User, Code2 } from 'lucide-react';
import { api } from '../core/services/api';
import { useAuth } from '../core/stores/auth';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type');

  const [userType, setUserType] = useState<'client' | 'expert'>(
    typeFromUrl === 'expert' ? 'expert' : 'client'
  );
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        fullName: userType === 'expert' ? formData.fullName : formData.companyName,
        company: userType === 'client' ? formData.companyName : undefined,
        role: userType.toUpperCase(),
      });

      login(data, data.token);
      navigate(userType === 'client' ? '/client' : '/expert');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="size-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Rocket className="size-7 text-white" />
            </div>
            <span className="text-2xl font-semibold text-slate-900">Nexcore Hub</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Créer un compte</h1>
          <p className="text-slate-600">Rejoignez la plateforme de digitalisation B2B</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType('client')}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === 'client'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Building2 className={`size-8 mx-auto mb-2 ${userType === 'client' ? 'text-blue-600' : 'text-slate-400'}`} />
              <div className="font-medium text-slate-900">Entreprise</div>
              <div className="text-sm text-slate-500">Je cherche des experts</div>
            </button>

            <button
              type="button"
              onClick={() => setUserType('expert')}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === 'expert'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Code2 className={`size-8 mx-auto mb-2 ${userType === 'expert' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <div className="font-medium text-slate-900">Expert IT</div>
              <div className="text-sm text-slate-500">Je propose mes services</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {userType === 'client' ? 'Nom de l\'entreprise' : 'Nom complet'}
              </label>
              <div className="relative">
                {userType === 'client' ? (
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                ) : (
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                )}
                <input
                  type="text"
                  value={userType === 'client' ? formData.companyName : formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [userType === 'client' ? 'companyName' : 'fullName']: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={userType === 'client' ? 'Votre Entreprise SARL' : 'Jean Dupont'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email professionnel
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="vous@entreprise.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
