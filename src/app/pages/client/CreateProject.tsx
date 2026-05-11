import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Rocket, ArrowLeft, Sparkles, Send, CheckCircle2, FileText, Calendar, DollarSign, Globe, Lock, Mic, Square } from 'lucide-react';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function CreateProject() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Bonjour ! Je suis votre consultant IA Nexcore. Pour vous aider à créer le meilleur projet possible, j'ai besoin de comprendre votre besoin. Quel type de projet souhaitez-vous lancer ? (ex: Site e-commerce, App mobile, CRM...)",
      timestamp: new Date(),
    },
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

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleVoiceSubmit(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erreur micro:", err);
      alert("Impossible d'accéder au micro.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleVoiceSubmit = async (blob: Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('audio', blob);
    formData.append('messages', JSON.stringify(messages.map(m => ({ role: m.role, content: m.content }))));

    try {
      const response = await fetch('http://localhost:5001/api/brief/voice', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      
      // Ajouter la transcription de l'utilisateur
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: data.userTranscript,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      if (data.aiResponse?.isComplete && data.aiResponse?.data) {
        setIsComplete(true);
        setFinalBrief(data.aiResponse.data);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.aiResponse?.message || "Je comprends. Pouvez-vous me donner plus de détails ?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const currentMessages = [...messages, userMessage];
      const response = await fetch('http://localhost:5001/api/brief/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          messages: currentMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();

      if (data.isComplete && data.data) {
        setIsComplete(true);
        setFinalBrief(data.data);
        const aiSuccessMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Génial ! J'ai généré votre cahier des charges complet. Vous pouvez le vérifier à droite et le publier quand vous êtes prêt.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiSuccessMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || "Je comprends. Pouvez-vous me donner plus de détails ?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!finalBrief) return;
    try {
      await api.post('/projects', finalBrief, token || undefined);
      navigate('/client');
    } catch (err) {
      alert("Erreur lors de la publication du projet");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <nav className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/client" className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Rocket className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Nexcore Hub</span>
          </Link>
          <Link to="/client" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 font-medium">
             <ArrowLeft size={18} /> Annuler
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section */}
        <div className={`flex-1 flex flex-col transition-all duration-500 ${isComplete ? 'max-w-[50%]' : 'max-w-full'}`}>
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      message.role === 'user' ? 'bg-blue-600' : 'bg-slate-100'
                    }`}>
                      {message.role === 'user' ? <Rocket className="size-5 text-white" /> : <Sparkles className="size-5 text-purple-600" />}
                    </div>
                    <div className={`rounded-2xl px-6 py-4 shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed font-medium">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 px-6 py-4 rounded-2xl animate-pulse text-slate-400 font-medium italic">
                    L'IA réfléchit...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-6 md:p-12 border-t border-slate-100 bg-white">
            <div className="max-w-3xl mx-auto">
              {!isComplete ? (
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isRecording ? "Enregistrement en cours..." : "Répondez à l'IA ici..."}
                      disabled={isRecording}
                      className="w-full pl-6 pr-16 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg font-medium disabled:bg-slate-100"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading || isRecording}
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
                    >
                      <Send className="size-6" />
                    </button>
                  </div>
                  
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`size-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isRecording ? <Square className="size-6" /> : <Mic className="size-6" />}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Brief terminé !</h3>
                  <p className="text-slate-500 text-center max-w-md">Vérifiez les détails du projet sur la droite avant de publier.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Sidebar (Visible only when complete) */}
        {isComplete && (
          <div className="w-[50%] bg-slate-50 border-l border-slate-200 overflow-y-auto p-12 animate-in slide-in-from-right duration-500">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  <FileText size={22} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">VOTRE PROJET</h2>
              </div>

              <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 space-y-10">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Titre du projet</label>
                  <h3 className="text-3xl font-bold text-slate-900 leading-tight">{finalBrief?.title}</h3>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Description</label>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{finalBrief?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Budget Estimé</label>
                    <div className="flex items-center gap-3 text-blue-600 font-bold text-xl">
                      <DollarSign size={20} />
                      {finalBrief?.budget}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Délai Estimé</label>
                    <div className="flex items-center gap-3 text-indigo-600 font-bold text-xl">
                      <Calendar size={20} />
                      {finalBrief?.timeline}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Technologies Suggérées</label>
                  <div className="flex flex-wrap gap-3">
                    {finalBrief?.techStack?.map((tech: string) => (
                      <span key={tech} className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold tracking-wide">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <button
                    onClick={handlePublish}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                  >
                    Publier mon projet <Rocket size={24} />
                  </button>
                  <p className="text-center text-slate-400 text-sm mt-4 font-medium italic">En publiant, votre projet sera visible par les experts Nexcore.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

