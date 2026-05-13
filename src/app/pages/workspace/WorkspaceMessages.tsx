import { Send, Paperclip, MoreVertical, Clock, Users, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'; // Force reload
import { useParams } from 'react-router';
import { api } from '../../core/services/api';
import { useAuth } from '../../core/stores/auth';

export function WorkspaceMessages() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.get(`/messages/${id}`, token || undefined);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling toutes les 5s
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const newMessage = await api.post(`/messages/${id}`, { content: message }, token || undefined);
      setMessages([...messages, newMessage]);
      setMessage('');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du message.");
    }
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center font-outfit text-blue-100 light:text-slate-500">Chargement de la discussion...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white light:text-slate-900 mb-1 tracking-tight">Messagerie Directe</h2>
          <p className="text-blue-100 light:text-slate-500 font-medium text-sm">Discussions sécurisées et archivées</p>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-white/10 light:border-slate-200 shadow-2xl shadow-slate-900/30 light:shadow-sm overflow-hidden bg-slate-950/70 light:bg-white">
        <div className="border-b border-white/10 light:border-slate-200 p-6 bg-white/5 light:bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                <Users className="size-6" />
              </div>
              <div>
                <div className="font-bold text-white light:text-slate-900">Canal de collaboration</div>
                <div className="text-xs text-green-300 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                  <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                  Ouvert
                </div>
              </div>
            </div>
            <button className="size-10 hover:bg-white/10 light:hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center border border-white/10 light:border-slate-200 shadow-sm hover:shadow-md">
              <MoreVertical className="size-5 text-blue-100 light:text-slate-500" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="h-[500px] overflow-y-auto p-8 space-y-6 light:bg-slate-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="size-20 bg-white/10 light:bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-dashed border-blue-400/20 light:border-slate-300">
                <Send className="size-8 text-blue-200 light:text-blue-500" />
              </div>
              <p className="text-blue-200 light:text-slate-500 font-bold uppercase text-xs tracking-widest">Commencez la discussion</p>
            </div>
          ) : messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${isMe ? 'right' : 'left'}-4 duration-300`}>
                <div className={`flex gap-4 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`size-10 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0 shadow-md ${
                    isMe ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-slate-700 to-slate-900'
                  }`}>
                    {msg.sender?.fullName?.charAt(0)}
                  </div>
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-3xl p-5 shadow-sm ${
                      isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900/80 light:bg-slate-100 border border-white/10 light:border-slate-200 text-blue-100 light:text-slate-700 rounded-tl-none'
                    }`}>
                      <div className={`text-[10px] font-black mb-2 uppercase tracking-widest ${isMe ? 'text-blue-100' : 'text-blue-300'}`}>
                        {msg.sender?.fullName} • {msg.sender?.role}
                      </div>
                      <p className={`text-sm leading-relaxed font-medium ${isMe ? 'text-white/90' : 'text-white/90 light:text-slate-700'}`}>
                        {msg.content}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-blue-300 light:text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-slate-950/80 light:bg-white border-t border-white/10 light:border-slate-200">
          <div className="flex items-center gap-4">
            <button className="size-12 hover:bg-white/10 light:hover:bg-slate-100 rounded-2xl transition-all flex items-center justify-center border border-white/10 light:border-slate-200 text-blue-100 light:text-slate-500 hover:text-white light:hover:text-slate-700">
              <Paperclip className="size-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Votre message stratégique..."
                className="w-full pl-6 pr-14 py-4 bg-slate-900/70 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none font-medium text-white light:text-slate-900 transition-all placeholder:text-blue-200 light:placeholder:text-slate-400"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 top-2 size-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg shadow-blue-700/20 transition-all flex items-center justify-center group"
              >
                <Send className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Sécurité", desc: "Échanges cryptés de bout en bout", icon: CheckCircle },
          { title: "Archivage", desc: "Historique complet conservé", icon: Clock },
          { title: "Notifications", desc: "Alertes temps réel activées", icon: Send }
        ].map((item, i) => (
          <div key={i} className="p-6 glass-soft rounded-3xl border border-white/10 light:border-slate-200 flex items-center gap-4">
            <div className="size-10 bg-white/10 light:bg-blue-50 rounded-xl flex items-center justify-center text-blue-300 light:text-blue-600 shadow-sm">
              <item.icon className="size-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white light:text-slate-900 tracking-tight">{item.title}</div>
              <div className="text-xs text-blue-100 light:text-slate-500 font-medium">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
