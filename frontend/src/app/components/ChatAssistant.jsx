import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  const initialMessage = user?.role === 'recruiter' 
    ? "Welcome to your Command Center! I'm your AI hiring co-pilot. Need help with candidate matching or job analytics?"
    : "Your career journey starts here! I'm your AI scout. Ask me to find jobs, track applications, or boost your profile score.";

  const [messages, setMessages] = useState([
    { text: initialMessage, isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const keywordResponses = {
    // Candidate Keywords
    'job': "I've analyzed our current listings. Head to 'Find Jobs' to explore high-growth roles matching your profile. Don't forget to use the Salary Slider!",
    'apply': "Found a role you love? Just click 'Apply'! Pro tip: Recruiter response rates are 40% higher for candidates with a 100% complete profile.",
    'status': "Real-time updates are my specialty. Check 'Track Status' to see exactly where you stand: Reviewed, Shortlisted, or Hired.",
    'resume': "Your resume is your digital handshake. Upload it in 'Profile' to let recruiters download it instantly in professional PDF format.",
    'skills': "Our AI matchmaker loves skills! Add things like 'React' or 'Python' to your profile to get priority notifications for new jobs.",
    
    // Recruiter Keywords
    'post': "Ready to grow your team? Post a job and our Match Engine will instantly notify qualified candidates in our database.",
    'applicants': "Your talent pool is waiting! Click any job to see the Applicants List. You can now filter them by 'Shortlisted' or 'Hired'.",
    'export': "Data is power. Use the 'Export Selected' button in the applicant list to download a full CSV report of your top candidates.",
    'hire': "Making a hire? Use the briefcase icon. We'll automatically send a congratulatory email to the candidate for you!",
    'match': "My background engine calculates skill match percentages for every applicant. Look for the '%' score to find your perfect fit fast.",

    // General
    'help': "I'm trained to help with recruitment automation, job discovery, and profile optimization. What's on your mind?",
    'hi': "Hello! Ready to accelerate your professional growth today?",
    'hello': "Hi there! How can I make your JobRush experience better?",
    'thanks': "My pleasure! I'm always here to help you succeed.",
    'thank you': "You're very welcome. Let's get back to work!"
  };

  const quickActions = user?.role === 'recruiter'
    ? ["Post job", "View applicants", "Match engine", "Help"]
    : ["Find jobs", "Track status", "Edit profile", "Help"];

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessages(prev => [...prev, { 
      text: userMsg, 
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerMsg = userMsg.toLowerCase();
      let response = "I'm still learning! Try keywords like 'jobs', 'profile', or 'applicants' for the best results. Or use one of the quick actions below.";
      
      for (const key in keywordResponses) {
        if (lowerMsg.includes(key)) {
          response = keywordResponses[key];
          break;
        }
      }

      setMessages(prev => [...prev, {
        text: response,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (action) => {
    setMessage(action);
    handleSend();
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 md:bottom-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-xl shadow-[#3b82f6]/40 flex items-center justify-center hover:scale-110 transition-transform z-50 group"
          >
            <MessageCircle className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-[#0a0b14] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-24 md:bottom-8 right-8 w-[400px] h-[600px] rounded-3xl backdrop-blur-2xl bg-[#0f111a]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#3b82f6]/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-[#0f111a]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">JobRush AI</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-xs text-white/40 font-medium">Ready to assist</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors text-white/40 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.isUser
                        ? 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white rounded-tr-none'
                        : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none backdrop-blur-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-white/20 mt-1.5 px-1 uppercase font-bold tracking-widest">{msg.time}</span>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-white/40 italic text-xs"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>AI is thinking...</span>
                </motion.div>
              )}
            </div>

            {/* Footer with Input & Quick Actions */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <AnimatePresence>
                {messages.length < 5 && !isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {quickActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5 transition-all text-xs font-semibold text-white/60 hover:text-white"
                      >
                        {action}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-[#3b82f6]/50 focus:bg-white/[0.08] outline-none transition-all placeholder-white/20 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isTyping}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center hover:shadow-xl hover:shadow-[#3b82f6]/40 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <Send className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}} />
    </>
  );
}
