import { Link } from 'react-router';
import { Building2, Code2, Rocket, Shield, Users, Lock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-main overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden light:hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-900/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-3xl bg-black/30 light:bg-white/85 border-b border-blue-500/10 light:border-slate-200 shadow-2xl shadow-blue-900/20 light:shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/40 to-cyan-400/20 rounded-2xl flex items-center justify-center backdrop-blur-2xl border border-white/10 shadow-lg shadow-blue-900/20">
              <Rocket className="w-6 h-6 text-blue-200 light:text-blue-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white light:text-slate-900">Nexcore</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-blue-100/80 light:text-slate-600">
            <a href="#features" className="hover:text-blue-200 light:hover:text-blue-600 transition-colors">Fonctionnalités</a>
            <a href="#services" className="hover:text-blue-200 light:hover:text-blue-600 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-200 light:hover:text-blue-600 transition-colors">À propos</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="px-4 py-2 rounded-xl bg-black/40 light:bg-slate-100 border border-white/10 light:border-slate-200 text-blue-100/80 light:text-slate-700 hover:text-blue-200 light:hover:text-blue-600 transition-colors backdrop-blur shadow-sm shadow-blue-900/30 light:shadow-none">
              Connexion
            </Link>
            <Link to="/register" className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white text-sm font-semibold border border-white/10 shadow-xl shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-300 transition-all">
              Démarrer
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-40 relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 light:bg-blue-50 border border-blue-500/10 light:border-blue-200 backdrop-blur-xl shadow-lg shadow-blue-900/10 light:shadow-none">
              <Sparkles className="w-4 h-4 text-cyan-200 light:text-blue-500 animate-pulse" />
              <span className="text-sm text-blue-100 light:text-blue-700">Plateforme B2B nouvelle génération</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-white light:text-slate-900">
              Transformez votre
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-200 light:from-blue-600 light:via-blue-500 light:to-cyan-500 bg-clip-text text-transparent">vision digitale</span>
            </h1>
            <p className="text-xl text-blue-100/80 light:text-slate-600 mb-10 leading-relaxed font-light">
              Une expérience glassmorphism avec des fonds noir, bleu et transparents pour un site premium et moderne.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link to="/register?type=client" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600/90 to-cyan-400/40 light:from-blue-600 light:to-blue-500 text-white font-semibold shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                Je suis une entreprise
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to="/register?type=expert" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/10 light:bg-white text-white light:text-slate-700 border border-white/10 light:border-slate-200 backdrop-blur hover:bg-white/15 light:hover:bg-slate-50 transition-all shadow-sm shadow-blue-900/20 light:shadow-sm">
                Je suis un expert IT
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-8 text-sm text-blue-100/70 light:text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-200 light:text-blue-500" />
                <span>500+ projets</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-200 light:text-blue-500" />
                <span>2000+ experts</span>
              </div>
            </div>
          </div>

          <div className="relative h-96">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-black/70 via-blue-950/40 to-slate-900/40 light:from-white light:via-blue-50 light:to-slate-50 backdrop-blur-3xl border border-white/10 light:border-slate-200 shadow-2xl shadow-blue-900/30 light:shadow-lg" />
            <div className="relative z-10 p-8 space-y-6">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400/70 backdrop-blur" />
                <div className="w-3 h-3 rounded-full bg-cyan-400/70 backdrop-blur" />
                <div className="w-3 h-3 rounded-full bg-slate-300/80 backdrop-blur" />
              </div>
              <div className="space-y-4">
                <div className="h-3 w-3/4 rounded-full bg-white/10 light:bg-slate-200" />
                <div className="h-3 w-1/2 rounded-full bg-white/10 light:bg-slate-200" />
                <div className="h-3 w-2/3 rounded-full bg-blue-400/50 light:bg-blue-300" />
                <div className="h-3 w-3/4 rounded-full bg-white/10 light:bg-slate-200" />
              </div>
              <div className="space-y-3 pt-8">
                <div className="flex items-center gap-3 p-4 rounded-3xl bg-black/40 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl shadow-lg shadow-blue-900/20 light:shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-cyan-200 light:text-blue-500" />
                  <span className="text-sm text-blue-100 light:text-slate-700">Matching IA avancé</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-3xl bg-black/40 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl shadow-lg shadow-blue-900/20 light:shadow-sm">
                  <Lock className="w-5 h-5 text-blue-200 light:text-blue-500" />
                  <span className="text-sm text-blue-100 light:text-slate-700">Sécurité niveau entreprise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white light:text-slate-900">Pourquoi Nexcore ?</h2>
            <p className="text-xl text-blue-100/80 light:text-slate-600 mb-12">Une plateforme conçue pour vos ambitions digitales, dans un style verre sombre et bleu.</p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: Building2,
              title: 'Pour les Entreprises',
              description: 'Publiez vos projets et trouvez les meilleurs experts en quelques clics',
              features: ['Cahier des charges IA', 'Propositions qualifiées', 'Suivi temps réel']
            },
            {
              icon: Code2,
              title: 'Pour les Experts IT',
              description: 'Accédez aux missions qui correspondent à vos compétences',
              features: ['Matching IA', 'Missions variées', 'Croissance garantie']
            },
            {
              icon: Shield,
              title: 'Sécurité & Fiabilité',
              description: 'Protégé par les meilleures pratiques de sécurité',
              features: ['Paiements sécurisés', 'Escrow payment', 'Support 24/7']
            }
          ].map((item, idx) => (
            <div key={idx} className="group p-8 rounded-[2rem] border border-white/10 light:border-slate-200 bg-black/30 light:bg-white/80 backdrop-blur-2xl hover:border-blue-500/20 light:hover:border-blue-300 hover:bg-black/40 light:hover:bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 light:hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-500/50 to-cyan-300/30 flex items-center justify-center mb-6 border border-white/10">
                <item.icon className="w-7 h-7 text-blue-100 light:text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white light:text-slate-900">{item.title}</h3>
              <p className="text-blue-100/80 light:text-slate-600 mb-6">{item.description}</p>
              <ul className="space-y-3">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-blue-100/70 light:text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-cyan-200 light:text-blue-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section id="services" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Projets actifs', value: '500+' },
            { label: 'Experts certifiés', value: '2000+' },
            { label: 'Taux de satisfaction', value: '98%' },
            { label: 'Délai moyen', value: '5 jours' }
          ].map((stat, idx) => (
            <div key={idx} className="group p-8 rounded-[2rem] border border-white/10 light:border-slate-200 bg-gradient-to-br from-slate-950/70 to-blue-950/20 light:from-white light:to-blue-50 backdrop-blur-2xl text-center hover:border-blue-500/20 light:hover:border-blue-300 hover:from-slate-900/80 hover:to-blue-950/40 transition-all hover:shadow-2xl hover:shadow-blue-900/30 light:hover:shadow-lg">
              <div className="text-4xl font-bold text-blue-200 light:text-blue-600 mb-2">{stat.value}</div>
              <div className="text-blue-100/60 light:text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative p-16 rounded-[2.5rem] border border-white/10 light:border-slate-200 bg-black/40 light:bg-white/80 backdrop-blur-3xl overflow-hidden shadow-2xl shadow-blue-900/30 light:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
          <div className="relative text-center">
            <h2 className="text-5xl font-bold mb-6 text-white light:text-slate-900">Prêt à transformer ?</h2>
            <p className="text-xl text-blue-100/80 light:text-slate-600 mb-10 max-w-3xl mx-auto font-light">
              Rejoignez les entreprises et experts qui ont déjà transformé leurs projets avec Nexcore. Moderne, transparent et sécurisé.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link to="/register?type=client" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600/90 to-cyan-400/45 light:from-blue-600 light:to-blue-500 text-white font-semibold border border-white/10 shadow-xl shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-300 transition-all">
                Créer un projet
              </Link>
              <Link to="/register?type=expert" className="px-8 py-4 rounded-2xl bg-black/40 light:bg-white text-white light:text-slate-700 font-semibold border border-white/10 light:border-slate-200 backdrop-blur hover:bg-black/50 light:hover:bg-slate-50 transition-all shadow-sm shadow-blue-900/30 light:shadow-sm">
                Trouver une mission
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 light:border-slate-200 mt-20 py-16 backdrop-blur-3xl bg-black/30 light:bg-white/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-6 h-6 text-blue-200 light:text-blue-600" />
                <span className="font-bold text-lg text-white light:text-slate-900">Nexcore</span>
              </div>
              <p className="text-blue-100/70 light:text-slate-500 text-sm leading-relaxed">Transformez votre entreprise avec les meilleurs experts IT</p>
            </div>
            {[
              { title: 'Produit', links: ['Features', 'Tarifs', 'Sécurité'] },
              { title: 'Entreprise', links: ['À propos', 'Blog', 'Carrières'] },
              { title: 'Ressources', links: ['Documentation', 'Support', 'API'] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4 text-white light:text-slate-900">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-blue-100/60 light:text-slate-500 hover:text-blue-200 light:hover:text-blue-600 text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 light:border-slate-200 pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-blue-100/60 light:text-slate-500">
            <p>&copy; 2026 Nexcore Hub. Tous droits réservés.</p>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-blue-200 light:hover:text-blue-600 transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-blue-200 light:hover:text-blue-600 transition-colors">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
