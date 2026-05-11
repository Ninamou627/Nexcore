import { X, CheckCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface MilestoneValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: {
    title: string;
    budget: string;
  };
  onValidate: () => void;
}

export function MilestoneValidationModal({ isOpen, onClose, milestone, onValidate }: MilestoneValidationModalProps) {
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const handleValidate = () => {
    onValidate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Valider le jalon</h2>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Que se passe-t-il après validation ?</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Le paiement de <strong>{milestone.budget}</strong> sera automatiquement libéré vers l'expert</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Le jalon sera marqué comme "Terminé" et ne pourra plus être modifié</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Le jalon suivant sera automatiquement déverrouillé</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>L'expert recevra une notification de validation</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="size-6 text-green-600" />
              <h3 className="font-semibold text-slate-900">Montant à débloquer</h3>
            </div>
            <div className="text-4xl font-bold text-green-900">{milestone.budget}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Commentaires ou remarques (optionnel)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              rows={4}
              placeholder="Ajoutez des commentaires sur ce livrable..."
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-900">
              ⚠️ <strong>Attention :</strong> Cette action est irréversible. Assurez-vous que le livrable correspond bien à vos attentes avant de valider.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleValidate}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
            >
              <CheckCircle className="size-5" />
              Confirmer et débloquer le paiement
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
