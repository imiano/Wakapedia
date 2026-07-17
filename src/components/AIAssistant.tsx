import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, Trash2, ArrowRight } from "lucide-react";
import { ChatMessage } from "../types";

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "msg-1", role: "assistant", content: "Hello! I am Castro AI, your Intelligent Construction & Engineering Advisor. Ask me anything about concrete mix ratios, foundation designs, Bill of Quantities (BOQ) prep, or construction safety regulations." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Quick preset questions from user spec
  const presetQuestions = [
    "What foundation suits clay soil?",
    "Explain reinforced concrete.",
    "Estimate paint quantity.",
    "How do I prepare a BOQ?",
    "What are expansion joints?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Build brief chat context from recent logs
      const historyContext = messages.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: historyContext }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive advice");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        role: "assistant",
        content: data.response
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: `msg-err-${Date.now()}`, role: "assistant", content: "I encountered a communication hazard while querying structural models. Please double-check your network or secrets configurations!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-210px)]">
      {/* Quick Directives Column */}
      <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-between h-full overflow-y-auto">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Engineering Presets</h3>
          <p className="text-xs text-slate-500 leading-normal">
            Click any core engineering prompt below to instantly evaluate standard construction mechanics:
          </p>
          <div className="space-y-2">
            {presetQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 border border-slate-900 text-xs text-slate-300 hover:border-amber-500/30 transition-all flex justify-between items-center cursor-pointer"
              >
                <span>{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-500 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900">
          <button
            onClick={() => setMessages([messages[0]])}
            className="w-full text-center text-xs text-red-400 font-semibold flex items-center justify-center gap-1.5 py-2 hover:bg-red-500/5 rounded-xl border border-red-500/10 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Consultation History
          </button>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="lg:col-span-3 glass-panel rounded-2xl flex flex-col justify-between h-full overflow-hidden border border-slate-800">
        {/* Messages Screen */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3.5 max-w-2xl text-xs leading-relaxed ${
                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                m.role === "user" ? "bg-amber-500 text-slate-950" : "bg-blue-600 text-white"
              }`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl border ${
                m.role === "user" 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-100 rounded-tr-none" 
                  : "bg-slate-900/60 border-slate-900 text-slate-200 rounded-tl-none whitespace-pre-wrap"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3.5 max-w-2xl text-xs leading-relaxed">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span>Formulating engineering advice...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Inputs */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-4 bg-slate-950 border-t border-slate-900 flex gap-2"
        >
          <input
            type="text"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Ask about M20 mix designs, column starter bars, or clay foundation depths..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-amber-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-bold px-5 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-amber-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
