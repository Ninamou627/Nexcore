import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket, ArrowLeft, Sparkles, Send, CheckCircle2, FileText, Calendar, DollarSign, Globe, Lock, Mic, Square } from 'lucide-react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';
import { ThemeToggle } from '../../components/ThemeToggle';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; }

export function CreateProject() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Bonjour ! Je suis votre consultant IA Nexcore. Pour vous aider à créer le meilleur projet possible, j'ai besoin de comprendre votre besoin. Quel type de projet souhaitez-vous lancer ? (ex: Site e-commerce, App mobile, CRM...)", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalBrief, setFinalBrief] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = async () => { const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); await handleVoiceSubmit(audioBlob); stream.getTracks().forEach(track => track.stop()); };
      mediaRecorder.start(); setIsRecording(true);
    } catch (err) { console.error("Erreur micro:", err); alert("Impossible d'accéder au micro."); }
  };
  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const handleVoiceSubmit = async (blob: Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('audio', blob);
    formData.append('messages', JSON.stringify(messages.map(m => ({ role: m.role, content: m.content }))));
    if (finalBrief) formData.append('currentBrief', JSON.stringify(finalBrief));
    try {
      const data = await api.postFormData('/brief/voice', formData);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: data.userTranscript, timestamp: new Date() }]);
      if (data.aiResponse?.data) setFinalBrief(data.aiResponse.data);
      if (data.aiResponse?.isComplete) setIsComplete(true);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.aiResponse?.message || "Je comprends. Pouvez-vous me donner plus de détails ?", timestamp: new Date() }]);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]); setInputValue(''); setIsLoading(true);
    try {
      const currentMessages = [...messages, userMessage];
      const data = await api.post('/brief/chat', { 
        messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
        currentBrief: finalBrief // Envoyer le brief actuel pour que l'IA puisse le mettre à jour
      });
      if (data.data) setFinalBrief(data.data);
      if (data.isComplete) setIsComplete(true);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message || "Je comprends. Pouvez-vous me donner plus de détails ?", timestamp: new Date() }]);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const handlePublish = async () => {
    if (!finalBrief) return;
    try { await api.post('/projects', finalBrief, token || undefined); navigate('/client'); } catch (err) { alert("Erreur lors de la publication du projet"); }
  };

  return (
    <div className="h-screen flex flex-col bg-main text-white light:text-slate-900">
      <nav className="glass-panel border-b border-white/10 light:border-slate-200 backdrop-blur-xl shrink-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/client" className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Rocket className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white light:text-slate-900">Nexcore Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/client" className="text-blue-100/60 light:text-slate-500 hover:text-white light:hover:text-blue-600 transition-colors flex items-center gap-2 font-medium">
               <ArrowLeft size={18} /> Annuler
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col border-r border-white/10 light:border-slate-200 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-black/20 light:bg-slate-50/50">
            <div className="max-w-2xl mx-auto space-y-8">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`size-8 md:size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${message.role === 'user' ? 'bg-blue-600' : 'glass-card text-purple-400'}`}>
                      {message.role === 'user' ? <Rocket className="size-4 md:size-5 text-white" /> : <Sparkles className="size-4 md:size-5" />}
                    </div>
                    <div className={`rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-sm ${message.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'glass-card text-white light:text-slate-800 rounded-tl-none'}`}>
                      <p className="leading-relaxed font-medium text-sm md:text-base">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass-card px-4 md:px-6 py-3 md:py-4 rounded-2xl animate-pulse text-slate-400 font-medium italic text-sm md:text-base">L'IA réfléchit...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 md:p-8 border-t border-white/10 light:border-slate-200 glass-panel shrink-0">
            <div className="max-w-2xl mx-auto">
              {!isComplete ? (
                <div className="flex gap-3 md:gap-4 items-center">
                  <div className="relative flex-1">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isRecording ? "Enregistrement..." : "Répondez..."} disabled={isRecording}
                      className="w-full pl-5 pr-14 py-3 md:py-4 glass-soft border-2 border-white/10 light:border-slate-200 rounded-2xl focus:border-blue-500 light:focus:border-blue-500 focus:bg-white/5 light:focus:bg-white outline-none transition-all text-base md:text-lg font-medium text-white light:text-slate-800 disabled:bg-slate-100" />
                    <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading || isRecording}
                      className="absolute right-2 top-1/2 -translate-y-1/2 size-10 md:size-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20">
                      <Send className="size-5 md:size-6" />
                    </button>
                  </div>
                  <button onClick={isRecording ? stopRecording : startRecording}
                    className={`size-12 md:size-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {isRecording ? <Square className="size-5 md:size-6" /> : <Mic className="size-5 md:size-6" />}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2 md:py-4">
                  <div className="size-10 md:size-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center"><CheckCircle2 size={20} /></div>
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-bold text-white light:text-slate-900">Brief terminé !</h3>
                    <p className="text-xs md:text-sm text-blue-200/60 light:text-slate-500">Relisez votre cahier des charges ci-dessous avant de publier.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 light:border-slate-200 bg-black/10">
          <div className="p-6 md:p-8 lg:p-10 border-b border-white/10 shrink-0 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="size-8 md:size-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><FileText size={18} md:size={22} /></div>
              <h2 className="text-xl md:text-2xl font-black text-white light:text-slate-900 tracking-tight uppercase">Cahier des charges</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 space-y-8">
            {!finalBrief && !isComplete ? (
              <div className="glass-card rounded-3xl p-6 md:p-8 border-2 border-dashed border-white/20 light:border-slate-300 flex flex-col items-center justify-center text-center space-y-4">
                <div className="size-12 md:size-16 glass-soft rounded-full flex items-center justify-center"><Sparkles className="size-6 md:size-8 text-blue-300 light:text-blue-600" /></div>
                <div><h4 className="font-bold text-white light:text-slate-900 text-sm md:text-base">En cours de rédaction...</h4><p className="text-xs text-blue-200/70 light:text-slate-500 mt-1">Discutez avec l'IA pour définir votre projet.</p></div>
                <div className="w-full space-y-2"><div className="h-3 md:h-4 glass-soft rounded-full w-3/4 mx-auto animate-pulse" /><div className="h-3 md:h-4 glass-soft rounded-full w-1/2 mx-auto animate-pulse" /></div>
              </div>
            ) : (
              <div className="glass-card rounded-[2rem] p-6 md:p-8 shadow-xl border border-white/10 light:border-slate-200 space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-300">
                <div><label className="text-[9px] md:text-[10px] font-black text-blue-200/50 light:text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2 block">Titre du projet</label><h3 className="text-xl md:text-2xl font-bold text-white light:text-slate-900 leading-tight">{finalBrief?.title || "Titre en attente..."}</h3></div>
                <div><label className="text-[9px] md:text-[10px] font-black text-blue-200/50 light:text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2 block">Description</label><p className="text-blue-100 light:text-slate-600 leading-relaxed text-xs md:text-sm whitespace-pre-wrap">{finalBrief?.description || "L'IA analyse votre besoin pour rédiger la description..."}</p></div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="glass-soft p-3 md:p-4 rounded-2xl"><label className="text-[8px] md:text-[9px] font-black text-blue-200/50 light:text-slate-400 uppercase tracking-[0.1em] mb-1 block">Budget</label><div className="flex items-center gap-2 text-blue-400 light:text-blue-600 font-bold text-sm md:text-base"><DollarSign size={14} md:size={16} />{finalBrief?.budget || "Calcul..."}</div></div>
                  <div className="glass-soft p-3 md:p-4 rounded-2xl"><label className="text-[8px] md:text-[9px] font-black text-blue-200/50 light:text-slate-400 uppercase tracking-[0.1em] mb-1 block">Délai</label><div className="flex items-center gap-2 text-indigo-400 light:text-indigo-600 font-bold text-sm md:text-base"><Calendar size={14} md:size={16} />{finalBrief?.timeline || "Estimation..."}</div></div>
                </div>
                {finalBrief?.techStack && finalBrief.techStack.length > 0 && (
                  <div><label className="text-[9px] md:text-[10px] font-black text-blue-200/50 light:text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3 block">Technologies</label><div className="flex flex-wrap gap-2">{finalBrief.techStack.map((tech: string) => (<span key={tech} className="px-2.5 py-1.5 glass-strong text-white light:text-slate-700 rounded-lg text-[10px] md:text-xs font-bold tracking-wide border border-white/10 light:border-slate-200">{tech}</span>))}</div></div>
                )}
                {isComplete && (
                  <div className="pt-4 md:pt-6 border-t border-white/10 light:border-slate-200">
                    <button onClick={handlePublish} className="w-full py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 md:gap-3 uppercase tracking-wider">Publier le projet <Rocket size={18} md:size={20} /></button>
                    <p className="text-center text-slate-400 text-[9px] md:text-[10px] mt-3 md:mt-4 font-medium italic">En publiant, votre projet sera visible par les experts.</p>
                  </div>
                )}
              </div>
            )}
            <div className="glass-soft border border-white/10 light:border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="size-7 md:size-8 bg-blue-500/10 text-blue-300 light:text-blue-600 rounded-full flex items-center justify-center shrink-0"><Sparkles size={14} md:size={16} /></div>
              <p className="text-[10px] md:text-xs text-blue-200/70 light:text-slate-600">Notre IA Nexcore analyse chaque mot pour construire un brief technique précis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}