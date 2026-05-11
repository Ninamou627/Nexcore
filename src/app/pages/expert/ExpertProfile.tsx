import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Rocket, Award, Star, MapPin, Calendar, Code2, ExternalLink, Edit } from 'lucide-react';
import { AIAssistant } from '../../components/AIAssistant';
import { useAuth } from '../../core/stores/auth';
import { api } from '../../core/services/api';

export function ExpertProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/auth/me', token || undefined);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const portfolio = [
    {
      id: '1',
      title: 'Plateforme E-learning Multilingue',
      client: 'EduTech Africa',
      year: '2025',
      tags: ['Laravel', 'Vue.js', 'MySQL'],
      description: 'Développement d\'une plateforme d\'apprentissage en ligne avec système de gestion de contenu, vidéos interactives et suivi de progression.',
      image: 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=E-learning'
    },
    {
      id: '2',
      title: 'Application Mobile Bancaire',
      client: 'FinanceFirst',
      year: '2024',
      tags: ['React Native', 'Node.js', 'MongoDB'],
      description: 'Application mobile sécurisée avec authentification biométrique, virements instantanés et gestion multi-comptes.',
      image: 'https://placehold.co/600x400/7C3AED/FFFFFF/png?text=Banking+App'
    },
  ];

  if (isLoading) return <div className="p-12 text-center">Chargement...</div>;
  if (!profile) return <div className="p-12 text-center">Utilisateur non trouvé.</div>;

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EX';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ... nav ... */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="size-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">Nexcore Hub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/expert" className="text-slate-600 hover:text-slate-900 transition-colors">
                Tableau de bord
              </Link>
              <Link to="/expert/projects" className="text-slate-600 hover:text-slate-900 transition-colors">
                Opportunités
              </Link>
              <Link to="/expert/profile" className="text-indigo-600 font-medium">
                Mon profil
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="size-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                {getInitials(profile.fullName)}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">{profile.fullName}</h2>
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-4">
                <MapPin className="size-4" />
                <span>{profile.location || 'Localisation non définie'}</span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <Star className="size-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-slate-900">4.8</span>
                  </div>
                  <div className="text-sm text-slate-600">0 avis</div>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-sm text-slate-600">Projets</div>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center mb-4">
                <Award className="size-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Expert Certifié</span>
              </div>

              <Link
                to="/expert/profile/edit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                <Edit className="size-4" />
                Modifier le profil
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="size-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Informations</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-600">Expérience</div>
                  <div className="font-medium text-slate-900">{profile.experience || 'Non renseigné'}</div>
                </div>
                <div>
                  <div className="text-slate-600">Membre depuis</div>
                  <div className="font-medium text-slate-900">
                    {new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-600">Taux de réponse</div>
                  <div className="font-medium text-green-600">100%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">À propos</h3>
              <p className="text-slate-700 whitespace-pre-wrap">
                {profile.description || "Aucune description fournie pour le moment."}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="size-5 text-slate-900" />
                <h3 className="text-xl font-semibold text-slate-900">Compétences techniques</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || []).map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Code2 className="size-8 text-indigo-600" />
                Portfolio & Réalisations
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {!profile.portfolio || profile.portfolio.length === 0 ? (
                  <div className="col-span-2 py-16 text-center text-slate-500 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <Code2 className="size-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">Aucun projet dans le portfolio pour le moment.</p>
                    <Link to="/expert/profile/edit" className="text-indigo-600 font-bold hover:underline mt-2 inline-block">
                      Ajouter votre premier projet
                    </Link>
                  </div>
                ) : (
                  profile.portfolio.map((project: any) => (
                    <div key={project.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col">
                      {/* Image/Placeholder section */}
                      <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-700 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <span className="text-white font-black text-5xl tracking-tighter group-hover:scale-110 transition-transform duration-700">
                          {project.title.split(' ').map((w: string) => w[0]).join('').substring(0, 3).toUpperCase()}
                        </span>
                        <div className="absolute top-4 right-4 size-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="size-5" />
                        </div>
                      </div>

                      {/* Content section */}
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {project.title}
                          </h4>
                          <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                            {project.year}
                          </span>
                        </div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-4">
                          {project.client}
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                          {project.description}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-slate-50 flex flex-wrap gap-2">
                          {(project.tags || []).map((tag: string) => (
                            <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Avis clients</h3>
              <div className="space-y-4">
                {[
                  {
                    id: '1',
                    client: 'Marie Kouadio',
                    company: 'Retail Plus CI',
                    rating: 5,
                    comment: 'Excellent travail ! L\'équipe a su comprendre nos besoins et a livré une solution qui dépasse nos attentes.',
                    date: 'Mars 2026'
                  },
                  {
                    id: '2',
                    client: 'Amadou Diallo',
                    company: 'FinTech Solutions',
                    rating: 5,
                    comment: 'Très professionnels, réactifs et compétents. Je recommande vivement pour des projets complexes.',
                    date: 'Février 2026'
                  },
                ].map((review) => (
                  <div key={review.id} className="pb-4 border-b border-slate-100 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-slate-900">{review.client}</div>
                        <div className="text-sm text-slate-600">{review.company}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 mb-2">{review.comment}</p>
                    <div className="text-sm text-slate-500">{review.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant context="expert" />
    </div>
  );
}
