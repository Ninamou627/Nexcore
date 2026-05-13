import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket, ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useAuth } from '../../core/stores/auth';
import { api } from '../../core/services/api';

export function ExpertProfileEdit() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    experience: '',
    description: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [newProject, setNewProject] = useState({ title: '', client: '', description: '', year: '', tags: '' });
  
  // 2FA State
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
          location: data.location || '',
          experience: data.experience || '',
          description: data.description || '',
        });
        setSkills(data.skills || []);
        setPortfolio(data.portfolio || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const addProject = () => {
    if (newProject.title.trim()) {
      const tagsArray = newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      setPortfolio([...portfolio, { ...newProject, tags: tagsArray, id: Date.now().toString() }]);
      setNewProject({ title: '', client: '', description: '', year: '', tags: '' });
    }
  };

  const removeProject = (id: string) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await api.put('/users/profile', {
        fullName: profile.name,
        location: profile.location,
        experience: profile.experience,
        description: profile.description,
        skills,
        portfolio
      }, token || undefined);
      
      updateUser(updatedUser);
      alert("Profil mis à jour avec succès !");
      navigate('/expert/profile');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  if (isLoading) return <div className="glass-shell min-h-screen flex items-center justify-center"><div className="text-slate-300">Chargement...</div></div>;

  return (
    <div className="glass-shell min-h-screen py-12 font-outfit">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/expert/profile" className="inline-flex items-center gap-2 text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="size-4" />
          Retour au profil
        </Link>

        <div className="glass-card rounded-[2rem] shadow-xl shadow-blue-400/10 light:shadow-sm border border-white/10 light:border-slate-200 overflow-hidden">
          <div className="p-10 border-b border-white/10 light:border-slate-200 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Modifier mon profil</h1>
              <p className="text-blue-100 opacity-90">Personnalisez votre vitrine professionnelle pour attirer les meilleurs projets.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-12">
            {/* Informations de base */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl glass-soft text-blue-300 light:text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-400/30 light:border-blue-300">1</span>
                Informations générales
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 light:text-slate-600 uppercase tracking-wider ml-1">Nom complet</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-5 py-3.5 glass-soft border border-white/20 light:border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-400/20 focus:bg-white/5 light:focus:bg-slate-50 focus:border-blue-400 outline-none transition-all text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 light:text-slate-600 uppercase tracking-wider ml-1">Localisation</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-5 py-3.5 glass-soft border border-white/20 light:border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-400/20 focus:bg-white/5 light:focus:bg-slate-50 focus:border-blue-400 outline-none transition-all text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                    placeholder="Ex: Paris, France"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 light:text-slate-600 uppercase tracking-wider ml-1">Expérience</label>
                <input
                  type="text"
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className="w-full px-5 py-3.5 glass-soft border border-white/20 light:border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-400/20 focus:bg-white/5 light:focus:bg-slate-50 focus:border-blue-400 outline-none transition-all text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                  placeholder="Ex: 5 ans d'expérience en React"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 light:text-slate-600 uppercase tracking-wider ml-1">À propos</label>
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full px-5 py-3.5 glass-soft border border-white/20 light:border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-400/20 focus:bg-white/5 light:focus:bg-slate-50 focus:border-blue-400 outline-none transition-all resize-none text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                  rows={5}
                  placeholder="Décrivez votre parcours et vos forces..."
                />
              </div>
            </div>

            {/* Compétences */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl glass-soft text-purple-300 light:text-purple-600 flex items-center justify-center text-lg font-bold border border-purple-400/30 light:border-purple-300">2</span>
                Compétences techniques
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-5 py-3.5 glass-soft border border-white/20 light:border-slate-300 rounded-2xl focus:ring-4 focus:ring-purple-400/20 focus:bg-white/5 light:focus:bg-slate-50 focus:border-purple-400 outline-none transition-all text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                  placeholder="Ajouter une compétence (ex: React)"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-3.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:shadow-lg transition-all shadow-slate-400/20 border border-white/20"
                >
                  <Plus className="size-6" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 glass-soft text-blue-300 light:text-blue-600 rounded-xl text-sm font-bold border border-blue-400/30 light:border-blue-300">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 light:hover:text-red-600 transition-colors">
                      <X className="size-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl glass-soft text-emerald-300 light:text-emerald-600 flex items-center justify-center text-lg font-bold border border-emerald-400/30 light:border-emerald-300">3</span>
                Portfolio
              </h2>
              
              <div className="glass-soft p-6 rounded-[2rem] border border-white/20 light:border-slate-300 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-4 py-3 glass-card light:bg-white border border-white/20 light:border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                    placeholder="Titre du projet"
                  />
                  <input
                    type="text"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    className="w-full px-4 py-3 glass-card light:bg-white border border-white/20 light:border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                    placeholder="Client (ex: EduTech Africa)"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newProject.year}
                    onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                    className="w-full px-4 py-3 glass-card light:bg-white border border-white/20 light:border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                    placeholder="Année (ex: 2025)"
                  />
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    className="w-full px-4 py-3 glass-card light:bg-white border border-white/20 light:border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                    placeholder="Tags (séparés par des virgules)"
                  />
                </div>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 glass-card light:bg-white border border-white/20 light:border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-400 resize-none text-white light:text-slate-900 placeholder:text-slate-400 light:placeholder:text-slate-500"
                  rows={3}
                  placeholder="Description détaillée du projet..."
                />
                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg font-bold flex items-center justify-center gap-2 transition-all shadow-emerald-400/20 border border-emerald-400/30"
                >
                  <Plus className="size-5" /> Ajouter ce projet au portfolio
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.map((project: any) => (
                  <div key={project.id} className="p-6 border border-white/10 light:border-slate-200 rounded-2xl flex items-start justify-between group glass-card light:bg-white hover:border-blue-400/30 light:hover:border-blue-300 hover:shadow-lg transition-all shadow-blue-400/10 light:shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white light:text-slate-900 text-lg">{project.title}</h4>
                        <span className="text-slate-400 light:text-slate-500">•</span>
                        <span className="text-sm text-emerald-300 light:text-emerald-600 font-bold">{project.year}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-400 light:text-slate-500 mb-3">{project.client}</p>
                      <p className="text-sm text-slate-300 light:text-slate-600 leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.tags || []).map((tag: string) => (
                          <span key={tag} className="px-2.5 py-1 glass-soft text-slate-300 light:text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/20 light:border-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="text-red-400 hover:text-red-300 hover:glass-soft p-2 rounded-xl transition-all"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sécurité 2FA */}
            <div className="space-y-6 pt-6 border-t border-white/10 light:border-slate-200">
              <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl glass-soft text-amber-300 light:text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-400/30 light:border-amber-300">4</span>
                Sécurité & Double Authentification (2FA)
              </h2>
              
              <div className="glass-soft p-6 rounded-[2rem] border border-white/20 light:border-slate-300">
                {user?.isTwoFactorEnabled ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                        <Rocket className="size-6 rotate-45" />
                      </div>
                      <div>
                        <p className="text-white light:text-slate-900 font-bold">2FA Activée</p>
                        <p className="text-sm text-slate-400 light:text-slate-500">Votre compte est protégé par la double authentification.</p>
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
                    <p className="text-slate-300 light:text-slate-600">
                      Renforcez la sécurité de votre compte en activant la double authentification (2FA).
                    </p>
                    
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
                        Activer la 2FA
                      </button>
                    ) : (
                      <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/10">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          {twoFactorData?.qrCode && (
                            <img src={twoFactorData.qrCode} alt="QR Code" className="size-40 bg-white p-2 rounded-xl" />
                          )}
                          <div className="flex-1 space-y-3 text-sm">
                            <p className="text-white font-bold">1. Scannez ce QR Code</p>
                            <p className="text-slate-400">Utilisez une application comme Google Authenticator ou Authy.</p>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10 break-all">
                              <span className="text-xs text-slate-500 block mb-1">Code de secours :</span>
                              <code className="text-blue-300">{twoFactorData?.secret}</code>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-white font-bold">2. Entrez le code à 6 chiffres</p>
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
                                } catch (e) { alert("Code invalide ou erreur."); }
                              }}
                              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
                            >
                              Vérifier et Activer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 light:border-slate-200 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="flex-[2] bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-400/30 transition-all flex items-center justify-center gap-3 text-lg border border-blue-400/30"
              >
                <Save className="size-6" /> Enregistrer les modifications
              </button>
              <Link
                to="/expert/profile"
                className="flex-1 px-8 py-4 glass-soft border-2 border-white/20 light:border-slate-300 text-slate-300 light:text-slate-600 rounded-2xl font-bold hover:bg-white/5 light:hover:bg-slate-100 transition-colors flex items-center justify-center"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
