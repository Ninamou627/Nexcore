import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket, ArrowLeft, Save, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../core/stores/auth';
import { api } from '../../core/services/api';
import { ThemeToggle } from '../../components/ThemeToggle';

export function ClientProfile() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<any>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/auth/me', token || undefined);
        setProfile({
          name: data.fullName || '',
          email: data.email || '',
          company: data.company || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await api.put('/users/profile', {
        fullName: profile.name,
        company: profile.company,
      }, token || undefined);
      
      updateUser(updatedUser);
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  if (isLoading) return <div className="glass-shell min-h-screen flex items-center justify-center"><div className="text-slate-300">Chargement...</div></div>;

  return (
    <div className="glass-shell min-h-screen py-12 font-outfit relative">
       <div className="absolute top-6 right-6 z-20"><ThemeToggle /></div>
       
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/client" className="inline-flex items-center gap-2 text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="size-4" />
          Retour au tableau de bord
        </Link>

        <div className="glass-card rounded-[2rem] shadow-xl shadow-blue-400/10 border border-white/10 overflow-hidden">
          <div className="p-10 border-b border-white/10 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Mon Profil Client</h1>
              <p className="text-blue-100 opacity-90">Gérez vos informations et la sécurité de votre compte.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-12">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl glass-soft text-blue-300 light:text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-400/30">1</span>
                Informations personnelles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 light:text-slate-600 uppercase tracking-wider ml-1">Nom complet</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-5 py-3.5 glass-soft border border-white/20 rounded-2xl focus:ring-4 focus:ring-blue-400/20 text-white light:text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 light:text-slate-600 uppercase tracking-wider ml-1">Entreprise</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-5 py-3.5 glass-soft border border-white/20 rounded-2xl focus:ring-4 focus:ring-blue-400/20 text-white light:text-slate-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 light:text-slate-600 uppercase tracking-wider ml-1">Email (non modifiable)</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-5 py-3.5 glass-soft border border-white/10 rounded-2xl opacity-50 cursor-not-allowed text-white light:text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10"
              >
                Enregistrer les infos
              </button>
            </div>

            {/* Sécurité 2FA */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl glass-soft text-amber-300 light:text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-400/30">2</span>
                Sécurité & Double Authentification (2FA)
              </h2>
              
              <div className="glass-soft p-6 rounded-[2rem] border border-white/20">
                {user?.isTwoFactorEnabled ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                        <ShieldCheck className="size-6" />
                      </div>
                      <div>
                        <p className="text-white light:text-slate-900 font-bold">2FA Activée</p>
                        <p className="text-sm text-slate-400">Votre compte client est hautement sécurisé.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm("Voulez-vous vraiment désactiver la 2FA ?")) {
                          try {
                            await api.post('/auth/2fa/disable', {});
                            alert("2FA désactivée.");
                            window.location.reload();
                          } catch (e) { alert("Erreur."); }
                        }
                      }}
                      className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-bold border border-red-500/20 transition-all"
                    >
                      Désactiver
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                      <ShieldAlert className="size-6 text-amber-400 shrink-0" />
                      <p className="text-sm text-amber-200/80">
                        La double authentification n'est pas encore activée. Nous vous recommandons de l'activer pour protéger vos projets et données financières.
                      </p>
                    </div>
                    
                    {!show2FASetup ? (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const data = await api.get('/auth/2fa/setup');
                            setTwoFactorData(data);
                            setShow2FASetup(true);
                          } catch (e) { alert("Erreur lors de la configuration 2FA."); }
                        }}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                      >
                        Activer la 2FA maintenant
                      </button>
                    ) : (
                      <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/10">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          {twoFactorData?.qrCode && (
                            <img src={twoFactorData.qrCode} alt="QR Code" className="size-40 bg-white p-2 rounded-xl" />
                          )}
                          <div className="flex-1 space-y-3 text-sm">
                            <p className="text-white font-bold">1. Scannez ce QR Code</p>
                            <p className="text-slate-400">Utilisez Google Authenticator pour ajouter votre compte Nexcore.</p>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10 break-all text-xs">
                              <span className="text-slate-500 block mb-1">Code manuel :</span>
                              <code className="text-blue-300 font-bold">{twoFactorData?.secret}</code>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-white font-bold">2. Validation</p>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={twoFactorCode}
                              onChange={(e) => setTwoFactorCode(e.target.value)}
                              placeholder="000000"
                              className="w-40 px-4 py-3 glass-card border border-white/20 rounded-xl outline-none text-white text-center font-bold tracking-[0.5em]"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await api.post('/auth/2fa/verify', { code: twoFactorCode });
                                  alert("2FA activée avec succès !");
                                  window.location.reload();
                                } catch (e) { alert("Code invalide."); }
                              }}
                              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
                            >
                              Activer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
