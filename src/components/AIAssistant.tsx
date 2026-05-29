import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Send } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #A855F7, #06B6D4)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src="/assets/ai-avatar.jpg"
          alt="ИИ"
          className="w-12 h-12 rounded-full object-cover animate-float"
        />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 w-[380px] rounded-2xl shadow-2xl overflow-hidden"
      style={{
        backgroundColor: '#1E2A42',
        backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(217,119,6,0.15) 0%, transparent 50%)',
        border: '1px solid rgba(148,163,184,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #A855F7, #06B6D4)',
              }}
            >
              <img src="/assets/ai-avatar.jpg" alt="ИИ" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold" style={{ color: '#F1F5F9' }}>
                Octavia ИИ
              </span>
              <span
                className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse-dot"
              />
              <span className="text-xs" style={{ color: '#64748B' }}>
                Онлайн
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-[rgba(30,42,66,0.5)] transition-colors cursor-pointer"
        >
          <ChevronDown size={16} style={{ color: '#64748B' }} />
        </button>
      </div>

      {/* Message */}
      <div className="px-4 py-3">
        <div
          className="rounded-xl p-3"
          style={{
            backgroundColor: 'rgba(217,119,6,0.15)',
            border: '1px solid rgba(217,119,6,0.1)',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#F1F5F9' }}>
            Доброе утро, Алекс! Сегодня требуют внимания 3 сделки. По предложению Acme Inc нужен повторный контакт. Подготовить письмо?
          </p>
        </div>

        {/* Suggested actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['Написать письмо', 'Открыть сделки', 'Отложить'].map((action) => (
            <motion.button
              key={action}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer"
              style={{
                borderColor: 'rgba(148,163,184,0.15)',
                color: '#D97706',
                backgroundColor: 'transparent',
              }}
              whileHover={{
                borderColor: '#D97706',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {action}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Спросите Octavia..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-[#64748B]"
            style={{ color: '#F1F5F9' }}
          />
          <motion.button
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={16} style={{ color: '#D97706' }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
