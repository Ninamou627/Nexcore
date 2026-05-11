import { X, Bell, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface AlertActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (preferences: AlertPreferences) => void;
}

interface AlertPreferences {
  categories: string[];
  technologies: string[];
  budgetMin: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export function AlertActivationModal({ isOpen, onClose, onActivate }: AlertActivationModalProps) {
  const [preferences, setPreferences] = useState<AlertPreferences>({
    categories: [],
    technologies: [],
    budgetMin: '',
    emailNotifications: true,
    pushNotifications: true,
  });

  if (!isOpen) return null;

  const categories = ['E-commerce', 'Mobile', 'Web', 'Infrastructure', 'Sécurité', 'Cloud'];
  const technologies = [
    'Laravel', 'React', 'Node.js', 'Vue.js', 'Python', 'AWS',
    'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB'
  ];

  const toggleCategory = (cat: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleTechnology = (tech: string) => {
    setPreferences(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const handleActivate = () => {
    onActivate(preferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="size-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Activer les alertes intelligentes</h2>
              <p className="text-sm text-slate-600">Recevez des notifications pour les projets qui correspondent à vos compétences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-10 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <X className="size-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Catégories d'intérêt
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    preferences.categories.includes(cat)
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-5 rounded border-2 flex items-center justify-center ${
                      preferences.categories.includes(cat)
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-slate-300'
                    }`}>
                      {preferences.categories.includes(cat) && (
                        <CheckCircle className="size-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{cat}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Technologies
            </label>
            <div className="grid md:grid-cols-4 gap-2">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechnology(tech)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    preferences.technologies.includes(tech)
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Budget minimum (optionnel)
            </label>
            <input
              type="text"
              value={preferences.budgetMin}
              onChange={(e) => setPreferences({ ...preferences, budgetMin: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Ex: 5 000 €"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Méthodes de notification
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="size-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900">Email</div>
                <div className="text-sm text-slate-600">Recevoir des emails pour chaque nouveau projet correspondant</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                className="size-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900">Notifications push</div>
                <div className="text-sm text-slate-600">Notifications en temps réel dans votre navigateur</div>
              </div>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Info :</strong> Vous pouvez modifier vos préférences d'alertes à tout moment depuis votre profil.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleActivate}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
            >
              <Bell className="size-5" />
              Activer les alertes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
