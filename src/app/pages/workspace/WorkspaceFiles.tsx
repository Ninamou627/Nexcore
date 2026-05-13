import { Upload, FileText, Image, File, Download, Trash2, Lock, FolderOpen } from 'lucide-react';

export function WorkspaceFiles() {
  const files = [
    {
      id: '1',
      name: 'Cahier des charges complet.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'HR Tech Group',
      uploadedAt: new Date('2026-03-01T09:00:00'),
      category: 'Spécifications',
    },
    {
      id: '2',
      name: 'Maquettes Figma - Plateforme RH.fig',
      type: 'figma',
      size: '8.7 MB',
      uploadedBy: 'TechSolutions Maroc',
      uploadedAt: new Date('2026-03-15T14:30:00'),
      category: 'Design',
    },
    {
      id: '3',
      name: 'Guide de style et charte graphique.pdf',
      type: 'pdf',
      size: '1.2 MB',
      uploadedBy: 'HR Tech Group',
      uploadedAt: new Date('2026-03-02T11:00:00'),
      category: 'Design',
    },
    {
      id: '4',
      name: 'Documentation API - v1.2.pdf',
      type: 'pdf',
      size: '3.8 MB',
      uploadedBy: 'TechSolutions Maroc',
      uploadedAt: new Date('2026-04-10T16:45:00'),
      category: 'Documentation',
    },
    {
      id: '5',
      name: 'Accès serveur production.txt',
      type: 'txt',
      size: '0.5 KB',
      uploadedBy: 'TechSolutions Maroc',
      uploadedAt: new Date('2026-04-20T10:00:00'),
      category: 'Accès',
      encrypted: true,
    },
    {
      id: '6',
      name: 'Tests utilisateurs - module paie.xlsx',
      type: 'excel',
      size: '145 KB',
      uploadedBy: 'HR Tech Group',
      uploadedAt: new Date('2026-04-28T13:20:00'),
      category: 'Tests',
    },
  ];

  const categories = [
    { id: 'all', label: 'Tous les fichiers', count: files.length },
    { id: 'Spécifications', label: 'Spécifications', count: 1 },
    { id: 'Design', label: 'Design', count: 2 },
    { id: 'Documentation', label: 'Documentation', count: 1 },
    { id: 'Accès', label: 'Accès sécurisés', count: 1 },
    { id: 'Tests', label: 'Tests', count: 1 },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="size-8 text-red-400" />;
      case 'figma':
        return <Image className="size-8 text-purple-400" />;
      case 'excel':
        return <FileText className="size-8 text-green-400" />;
      default:
        return <File className="size-8 text-blue-100" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white light:text-slate-900 mb-2">Fichiers du projet</h2>
          <p className="text-blue-100 light:text-slate-500">Coffre-fort documentaire sécurisé</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-shadow shadow-blue-900/20">
          <Upload className="size-5" />
          Importer un fichier
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="glass-soft rounded-[1.75rem] p-4 border border-white/10 light:border-slate-200 hover:border-blue-400/30 light:hover:border-blue-300 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="size-5 text-blue-300 light:text-blue-500" />
              <div className="flex-1">
                <div className="text-sm text-blue-100 light:text-slate-600">{cat.label}</div>
                <div className="text-lg font-bold text-white light:text-slate-900">{cat.count}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[2rem] border border-white/10 light:border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-white/10 light:border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-100 light:text-slate-500">
              {files.length} fichier{files.length > 1 ? 's' : ''} • {
                (files.reduce((acc, f) => {
                  const size = parseFloat(f.size);
                  const unit = f.size.includes('MB') ? 'MB' : 'KB';
                  return acc + (unit === 'MB' ? size : size / 1024);
                }, 0)).toFixed(1)
              } MB au total
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/10 light:divide-slate-200">
          {files.map((file) => (
            <div key={file.id} className="p-4 hover:bg-white/5 light:hover:bg-slate-50 transition-colors rounded-[1.5rem]">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-white/10 light:bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white light:text-slate-900 truncate">{file.name}</h3>
                    {file.encrypted && (
                      <Lock className="size-4 text-amber-300 light:text-amber-600 flex-shrink-0" title="Fichier chiffré" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100 light:text-slate-500">
                    <span>{file.size}</span>
                    <span className="px-2 py-0.5 bg-white/5 light:bg-slate-100 rounded text-xs">{file.category}</span>
                    <span>Par {file.uploadedBy}</span>
                    <span>
                      {file.uploadedAt.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="size-9 hover:bg-blue-500/10 rounded-2xl transition-colors flex items-center justify-center">
                    <Download className="size-5 text-blue-300" />
                  </button>
                  <button className="size-9 hover:bg-red-500/10 rounded-2xl transition-colors flex items-center justify-center">
                    <Trash2 className="size-5 text-red-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-soft rounded-[2rem] p-6 border border-amber-300/20 light:border-amber-200">
        <div className="flex items-start gap-4">
          <Lock className="size-6 text-amber-300 light:text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-white light:text-slate-900 mb-2">Sécurité des fichiers</h3>
            <ul className="text-sm text-blue-100 light:text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-300 mt-0.5">•</span>
                <span>Tous les fichiers sensibles (accès serveurs, mots de passe) sont automatiquement chiffrés</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-300 mt-0.5">•</span>
                <span>Seuls les membres autorisés du projet peuvent accéder aux fichiers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-300 mt-0.5">•</span>
                <span>Toutes les actions (téléchargement, suppression) sont tracées</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
