import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Send, Sparkles, CheckCircle, ArrowRight, Users, MessageCircle, Mic, MicOff } from 'lucide-react';
import { useTheme } from '../core/contexts/ThemeContext';
import { api } from '../core/services/api';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; actions?: ActionResult[]; }
interface ActionResult { tool: string; args: Record<string, any>; }
interface AIAssistantProps { context?: 'client' | 'expert' | 'workspace'; projectId?: string; }

export function AIAssistant({ context = 'client', projectId }: AIAssistantProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: context === 'client' ? "Bonjour ! Je suis votre assistant IA. Je peux agir pour vous : envoyer un message au développeur, ouvrir un workspace, chercher un expert, créer un projet... Demandez-moi n'importe quoi !" : context === 'expert' ? "Bonjour ! Je peux vous aider à rédiger des propositions, analyser des briefs ou résoudre des problèmes techniques. Que puis-je faire pour vous ?" : "Bonjour ! Je suis là pour vous assister. Besoin d'aide ?", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleAction = (action: ActionResult) => {
    switch (action.tool) {
      case 'open_workspace': navigate(`/workspace/${action.args.projectId}`); break;
      case 'navigate_to_page': navigate(action.args.path); break;
      case 'draft_proposal':
      case 'submit_proposal':
        // Émettre un événement personnalisé pour remplir le formulaire à gauche
        window.dispatchEvent(new CustomEvent('nexcore:fill-proposal', { detail: action.args }));
        break;
    }
  };
  const getActionLabel = (action: ActionResult) => {
    switch (action.tool) {
      case 'send_message_to_expert': return '✉️ Message envoyé au développeur';
      case 'open_workspace': return '📂 Ouvrir le workspace';
      case 'search_experts': return `🔍 ${action.args.skills?.join(', ')} - Experts trouvés`;
      case 'navigate_to_page': return '🔗 Ouvrir la page';
      case 'list_project_files': return '📂 Liste des documents consultée';
      case 'read_project_file': return '📖 Lecture du document terminée';
      case 'draft_proposal': return '📝 Brouillon généré dans le formulaire';
      case 'submit_proposal': return '🚀 Proposition soumise avec succès';
      default: return action.tool;
    }
  };
  const isClickableAction = (tool: string) => tool === 'open_workspace' || tool === 'navigate_to_page';

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]); setInputValue(''); setIsLoading(true);
    const currentMessages = [...messages, userMessage];
    try {
      const data = await api.post('/brief/chat', { messages: currentMessages.map(m => ({ role: m.role, content: m.content })), context, projectId });
      const aiResponse: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message || "Je n'ai pas pu générer de réponse.", timestamp: new Date(), actions: data.actions || [] };
      setMessages((prev) => [...prev, aiResponse]);
      if (data.actions?.length > 0) {
        setTimeout(() => { 
          for (const action of data.actions) { 
            if (action.tool === 'open_workspace') navigate(`/workspace/${action.args.projectId}`); 
            else if (action.tool === 'navigate_to_page') navigate(action.args.path);
            else if (action.tool === 'draft_proposal' || action.tool === 'submit_proposal') {
              window.dispatchEvent(new CustomEvent('nexcore:fill-proposal', { detail: action.args }));
            }
          } 
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Désolé, je rencontre une difficulté technique. Veuillez réessayer.", timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Reconnaissance vocale démarrée...');
      setIsRecording(true);
    };

    recognition.onend = () => {
      console.log('Reconnaissance vocale terminée.');
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        alert("L'accès au micro a été refusé. Veuillez autoriser le micro dans les paramètres de votre navigateur.");
      }
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Texte capturé:', transcript);
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Erreur lors du démarrage de la reconnaissance:', e);
      setIsRecording(false);
    }
  };

  const isLight = theme === 'light';

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 size-14 bg-gradient-to-br from-blue-600/80 to-cyan-400/40 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all flex items-center justify-center z-50 border border-white/10">
          <Sparkles className="size-6 text-white" />
        </button>
      )}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[calc(100vh-120px)] sm:h-[650px] rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300 ${isLight ? 'bg-white border border-slate-200' : 'bg-[#0a1628] border border-white/10 backdrop-blur-3xl'}`}>
          <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${isLight ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600' : 'bg-gradient-to-r from-blue-600/40 to-cyan-500/20 border-white/10'}`}>
            <div className="flex items-center gap-3">
              <div className="size-9 sm:size-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10"><Sparkles className="size-5 sm:size-6 text-blue-200" /></div>
              <div>
                <div className="font-bold text-base sm:text-lg tracking-tight text-white">Agent IA Nexcore</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-blue-200/60 font-black">Prêt à agir pour vous</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="size-8 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center border border-white/10"><X className="size-5 text-blue-100" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] p-4 ${message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600/90 to-cyan-500/40 text-white shadow-lg border border-white/10'
                    : isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-white/5 text-blue-100 border border-white/10'}`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.content}</p>
                    <div className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${message.role === 'user' ? 'text-blue-100/60' : isLight ? 'text-slate-400' : 'text-blue-200/40'}`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 ml-2 space-y-2">
                    {message.actions.map((action, idx) => (
                      <button key={idx} onClick={() => isClickableAction(action.tool) && handleAction(action)}
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                          isClickableAction(action.tool) ? `${isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' : 'bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border border-blue-400/30'} cursor-pointer shadow-lg`
                          : `${isLight ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-green-500/10 text-green-200 border border-green-400/20'}`}`}>
                        {action.tool === 'send_message_to_expert' && <CheckCircle className="size-4 text-green-400" />}
                        {action.tool === 'search_experts' && <Users className="size-4 text-blue-300" />}
                        {isClickableAction(action.tool) && <ArrowRight className="size-4 text-cyan-300" />}
                        <span>{getActionLabel(action)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`px-5 py-3 rounded-2xl ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex gap-1.5">
                      <div className="size-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="size-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="size-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-blue-200/40'}`}>L'agent analyse...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 sm:p-6 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'}`}>
            <div className="flex items-center gap-3">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Demandez-moi d'agir..." disabled={isLoading}
                className={`flex-1 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none text-sm disabled:opacity-50 transition-all ${isLight ? 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border border-white/10 text-white placeholder-blue-100/30'}`} />
              <button onClick={toggleRecording}
                className={`size-12 rounded-2xl flex items-center justify-center transition-all border border-white/10 shadow-lg ${isRecording ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-white/5 text-blue-100/70 hover:bg-white/10'}`}>
                {isRecording ? <MicOff className="size-5 animate-pulse" /> : <Mic className="size-5" />}
              </button>
              <button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}
                className="size-12 bg-gradient-to-br from-blue-600/90 to-cyan-500/40 text-white rounded-2xl hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 border border-white/10 shadow-lg">
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
