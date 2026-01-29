import { useState, useRef, useEffect } from 'react';
import { Send, Code2, Binary, Network, Layers, Terminal, Lightbulb, Trash2 } from 'lucide-react';

export default function DSAInstructorChat() {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hello! I\'m your DSA Instructor powered by Google Gemini. Ask me anything about data structures, algorithms, complexity analysis, or coding patterns. Let\'s level up your problem-solving skills!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = {
        type: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage = {
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running on http://localhost:5000',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { icon: <Binary className="w-4 h-4" />, text: "Explain binary search trees" },
    { icon: <Network className="w-4 h-4" />, text: "What is dynamic programming?" },
    { icon: <Layers className="w-4 h-4" />, text: "Time complexity of merge sort" },
    { icon: <Code2 className="w-4 h-4" />, text: "Implement a stack in Python" }
  ];

  const clearChat = () => {
    setMessages([{
      type: 'assistant',
      content: 'Chat cleared! What would you like to learn about today?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-mono relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-cyan-500/5"></div>
      
      {/* Floating code symbols */}
      <div className="absolute top-20 left-10 text-emerald-500/10 text-6xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }}>{'{'}</div>
      <div className="absolute top-40 right-20 text-cyan-500/10 text-6xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}>{'}'}</div>
      <div className="absolute bottom-40 left-32 text-emerald-500/10 text-5xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>{'<>'}</div>
      <div className="absolute bottom-20 right-40 text-cyan-500/10 text-5xl animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>{'[]'}</div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-emerald-500/20 bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Terminal className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  DSA Instructor
                </h1>
                <p className="text-xs text-slate-400">Powered by Google Gemini</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </header>

        {/* Main Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col max-w-6xl mx-auto w-full px-6">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-8 space-y-6 scrollbar-thin scrollbar-thumb-emerald scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.type === 'assistant' 
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20' 
                    : 'bg-gradient-to-br from-slate-700 to-slate-600'
                }`}>
                  {message.type === 'assistant' ? (
                    <Terminal className="w-5 h-5 text-slate-950" />
                  ) : (
                    <span className="text-slate-100 font-bold">U</span>
                  )}
                </div>
                
                <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`rounded-2xl px-6 py-4 ${
                    message.type === 'assistant'
                      ? 'bg-slate-800/50 border border-emerald-500/20 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-slate-700/80 to-slate-600/80 border border-slate-600/50'
                  }`}>
                    <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs text-slate-500 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 animate-fadeIn">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Terminal className="w-5 h-5 text-slate-950" />
                </div>
                <div className="rounded-2xl px-6 py-4 bg-slate-800/50 border border-emerald-500/20">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="py-4 animate-fadeIn">
              <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-500" />
                Quick start prompts:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt.text)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 text-left group"
                  >
                    <div className="text-emerald-500 group-hover:text-emerald-400 transition-colors">
                      {prompt.icon}
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="py-6">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about algorithms, data structures, complexity analysis..."
                className="w-full px-6 py-4 pr-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none text-slate-100 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 min-h-[60px] max-h-[200px]"
                rows="1"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-600 disabled:opacity-50 flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:shadow-none"
              >
                <Send className="w-5 h-5 text-slate-950" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Press <kbd className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50">Enter</kbd> to send • <kbd className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50">Shift + Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}