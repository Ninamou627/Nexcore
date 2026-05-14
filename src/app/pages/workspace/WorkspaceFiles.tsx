import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { Upload, FileText, Image, File, Download, Trash2, Lock, FolderOpen, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function WorkspaceFiles() {
  const { project } = useOutletContext<{ project: any }>();
  const { token } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!project?.id) return;
      try {
        const data = await api.get(`/files/project/${project.id}`, token || undefined);
        setFiles(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des fichiers:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, [project?.id, token]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !project?.id) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', project.id);
    formData.append('category', 'Général');

    try {
      // Note: l'API helper 'api.ts' pourrait avoir besoin d'être adapté pour FormData
      // ou on peut utiliser un fetch direct ici si nécessaire.
      // Mais supposons que api.post gère le FormData ou qu'on utilise fetch.
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newFile = await response.json();
        setFiles([newFile, ...files]);
      } else {
        alert("Erreur lors de l'upload du fichier.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (file: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/files/download/${file.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Téléchargement échoué');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Impossible de télécharger le fichier.');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

    try {
      await api.delete(`/files/${fileId}`, token || undefined);
      setFiles(files.filter(f => f.id !== fileId));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    }
  };

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'pdf') return <FileText className="size-8 text-red-400" />;
    if (['png', 'jpg', 'jpeg', 'svg', 'fig'].includes(t)) return <Image className="size-8 text-purple-400" />;
    if (['xlsx', 'xls', 'csv'].includes(t)) return <FileText className="size-8 text-green-400" />;
    return <File className="size-8 text-blue-100" />;
  };

  const categories = [
    { id: 'all', label: 'Tous les fichiers', count: files.length },
    { id: 'Général', label: 'Général', count: files.filter(f => f.category === 'Général').length },
    { id: 'Spec', label: 'Spécifications', count: files.filter(f => f.category === 'Spécifications').length },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-100/40">
        <Loader2 className="size-12 animate-spin mb-4" />
        <p>Chargement des documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white light:text-slate-900 mb-2">Fichiers du projet</h2>
          <p className="text-blue-100 light:text-slate-500">Coffre-fort documentaire sécurisé et chiffré</p>
        </div>
        <label className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isUploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
          {isUploading ? 'Importation...' : 'Importer un fichier'}
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-soft rounded-[1.75rem] p-4 border border-white/10 light:border-slate-200">
            <div className="flex items-center gap-3">
              <FolderOpen className="size-5 text-blue-300 light:text-blue-500" />
              <div className="flex-1">
                <div className="text-sm text-blue-100 light:text-slate-600">{cat.label}</div>
                <div className="text-lg font-bold text-white light:text-slate-900">{cat.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[2rem] border border-white/10 light:border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-white/10 light:border-slate-200">
          <div className="flex items-center justify-between text-sm text-blue-100 light:text-slate-500">
            <span>{files.length} fichier{files.length > 1 ? 's' : ''} disponibles</span>
          </div>
        </div>

        <div className="divide-y divide-white/10 light:divide-slate-200">
          {files.length === 0 ? (
            <div className="p-12 text-center text-blue-100/30">Aucun fichier n'a été partagé pour ce projet.</div>
          ) : files.map((file) => (
            <div key={file.id} className="p-4 hover:bg-white/5 light:hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-white/10 light:bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white light:text-slate-900 truncate">{file.name}</h3>
                    <Lock className="size-3 text-amber-300/60" title="Chiffré AES-256" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-blue-100/60 light:text-slate-500">
                    <span>{file.size}</span>
                    <span className="px-2 py-0.5 bg-white/5 light:bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider">{file.category}</span>
                    <span>Par {file.uploader?.fullName || 'Utilisateur'}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleDownload(file)} className="size-9 hover:bg-blue-500/10 rounded-xl transition-colors flex items-center justify-center group" title="Télécharger">
                    <Download className="size-5 text-blue-300 group-hover:text-blue-100" />
                  </button>
                  <button onClick={() => handleDelete(file.id)} className="size-9 hover:bg-red-500/10 rounded-xl transition-colors flex items-center justify-center group" title="Supprimer">
                    <Trash2 className="size-5 text-red-300/70 group-hover:text-red-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-soft rounded-[2rem] p-6 border border-amber-300/20">
        <div className="flex items-start gap-4 text-sm">
          <ShieldCheck className="size-6 text-amber-300 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-1">Stockage Chiffré AES-256</h3>
            <p className="text-blue-100/60">Chaque document est chiffré avant d'être écrit sur le disque. Seuls les acteurs authentifiés de ce workspace peuvent déchiffrer et lire ces fichiers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
