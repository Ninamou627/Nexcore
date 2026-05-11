import { X, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';

interface MilestoneRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: {
    title: string;
  };
  onRequestRevision: (feedback: string) => void;
}

export function MilestoneRevisionModal({ isOpen, onClose, milestone, onRequestRevision }: MilestoneRevisionModalProps) {
  const [feedback, setFeedback] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  if (!isOpen) return null;

  const commonIssues = [
    'Fonctionnalités manquantes',
    'Bugs ou erreurs techniques',
    'Design non conforme',
    'Performance insuffisante',
    'Documentation incomplète',
    'Tests manquants',
  ];

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleSubmit = () => {
    const fullFeedback = `${selectedIssues.length > 0 ? 'Points à revoir:\n' + selectedIssues.map(i => `- ${i}`).join('\n') + '\n\n' : ''}${feedback}`;
    onRequestRevision(fullFeedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="size-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Demander des modifications</h2>
              <p className="text-sm text-slate-600">{milestone.title}</p>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Conseil :</strong> Soyez aussi précis que possible dans vos retours pour faciliter les corrections de l'expert.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Problèmes identifiés (cochez tout ce qui s'applique)
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {commonIssues.map((issue) => (
                <button
                  key={issue}
                  onClick={() => toggleIssue(issue)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedIssues.includes(issue)
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-5 rounded border-2 flex items-center justify-center ${
                      selectedIssues.includes(issue)
                        ? 'border-orange-600 bg-orange-600'
                        : 'border-slate-300'
                    }`}>
                      {selectedIssues.includes(issue) && (
                        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-slate-900">{issue}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description détaillée des modifications requises *
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              rows={6}
              placeholder="Décrivez précisément ce qui doit être modifié, corrigé ou amélioré..."
              required
            />
            <p className="text-sm text-slate-500 mt-2">
              Plus vos retours seront détaillés, plus vite l'expert pourra apporter les corrections nécessaires.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FileText className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900">
                <strong>Note :</strong> L'expert recevra une notification et pourra consulter vos commentaires. Le jalon restera en statut "En cours" jusqu'à validation.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertCircle className="size-5" />
              Envoyer la demande de modification
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
