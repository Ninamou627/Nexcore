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

  if (isLoading) return <div className="p-12 text-center text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-outfit">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/expert/profile" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="size-4" />
          Retour au profil
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Modifier mon profil</h1>
              <p className="text-indigo-100 opacity-90">Personnalisez votre vitrine professionnelle pour attirer les meilleurs projets.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-12">
            {/* Informations de base */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold">1</span>
                Informations générales
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Nom complet</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Localisation</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ex: Paris, France"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Expérience</label>
                <input
                  type="text"
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                  placeholder="Ex: 5 ans d'expérience en React"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">À propos</label>
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none"
                  rows={5}
                  placeholder="Décrivez votre parcours et vos forces..."
                />
              </div>
            </div>

            {/* Compétences */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold">2</span>
                Compétences techniques
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:bg-white focus:border-purple-500 outline-none transition-all"
                  placeholder="Ajouter une compétence (ex: React)"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  <Plus className="size-6" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                      <X className="size-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <span className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">3</span>
                Portfolio
              </h2>
              
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100"
                    placeholder="Titre du projet"
                  />
                  <input
                    type="text"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100"
                    placeholder="Client (ex: EduTech Africa)"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newProject.year}
                    onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100"
                    placeholder="Année (ex: 2025)"
                  />
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100"
                    placeholder="Tags (séparés par des virgules)"
                  />
                </div>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-100 resize-none"
                  rows={3}
                  placeholder="Description détaillée du projet..."
                />
                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100"
                >
                  <Plus className="size-5" /> Ajouter ce projet au portfolio
                </button>
              </div>

              <div className="space-y-4">
                {portfolio.map((project: any) => (
                  <div key={project.id} className="p-6 border border-slate-100 rounded-2xl flex items-start justify-between group bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-lg">{project.title}</h4>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-emerald-600 font-bold">{project.year}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-500 mb-3">{project.client}</p>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.tags || []).map((tag: string) => (
                          <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 text-lg"
              >
                <Save className="size-6" /> Enregistrer les modifications
              </button>
              <Link
                to="/expert/profile"
                className="flex-1 px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center"
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
