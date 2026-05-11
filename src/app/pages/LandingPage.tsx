import { Link } from 'react-router';
import { Building2, Code2, Rocket, Shield, Zap, Users } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Rocket className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Nexcore Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors">
              Connexion
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Accélérez votre transformation digitale
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            La plateforme B2B qui connecte les entreprises avec les meilleurs experts IT pour réussir vos projets de digitalisation
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register?type=client" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl transition-shadow text-lg">
              Je suis une entreprise
            </Link>
            <Link to="/register?type=expert" className="px-8 py-4 bg-white text-slate-900 rounded-lg border-2 border-slate-200 hover:border-blue-600 transition-colors text-lg">
              Je suis un expert IT
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="size-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Pour les entreprises</h3>
            <p className="text-slate-600">
              Publiez vos besoins, recevez des propositions qualifiées et pilotez vos projets en toute sérénité
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="size-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="size-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Pour les experts IT</h3>
            <p className="text-slate-600">
              Trouvez des missions qui correspondent à vos compétences et développez votre activité
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="size-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Sécurisé et fiable</h3>
            <p className="text-slate-600">
              Paiements sécurisés, validation par jalons et support dédié pour chaque projet
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Assistant IA intégré</h2>
              <p className="text-blue-100 mb-6">
                Notre intelligence artificielle vous accompagne à chaque étape : génération de cahier des charges, estimation budgétaire, rédaction de propositions et support technique.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="size-5" />
                  <span>Instantané</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  <span>24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="size-5" />
                  <span>Confidentiel</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-sm text-blue-200 mb-2">Exemple de conversation</div>
              <div className="space-y-3">
                <div className="bg-white/20 rounded-lg p-3 text-sm">
                  "Je veux créer une boutique en ligne pour vendre mes produits artisanaux"
                </div>
                <div className="bg-indigo-800/50 rounded-lg p-3 text-sm">
                  "Parfait ! Je vais vous aider à créer un cahier des charges complet. Combien de produits souhaitez-vous proposer au lancement ?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 Nexcore Hub. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
