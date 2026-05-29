import { motion } from 'framer-motion';
import type { DealStage } from '@/types';

interface StatusBadgeProps {
  stage: DealStage | string;
  size?: 'sm' | 'md';
}

const stageConfig: Record<string, { bg: string; text: string }> = {
  'Новый лид': { bg: 'rgba(6,182,212,0.1)', text: '#06B6D4' },
  'Выявление потребностей': { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6' },
  'Предложение отправлено': { bg: 'rgba(249,115,22,0.1)', text: '#F97316' },
  'Переговоры': { bg: 'rgba(168,85,247,0.1)', text: '#A855F7' },
  'Успешно закрыта': { bg: 'rgba(34,197,94,0.1)', text: '#22C55E' },
  'Проиграна': { bg: 'rgba(239,68,68,0.1)', text: '#EF4444' },
  'В работе': { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6' },
  'Ожидает': { bg: 'rgba(249,115,22,0.1)', text: '#F97316' },
  'Высокий приоритет': { bg: 'rgba(168,85,247,0.1)', text: '#A855F7' },
  'Выполнено': { bg: 'rgba(34,197,94,0.1)', text: '#22C55E' },
};

export default function StatusBadge({ stage, size = 'sm' }: StatusBadgeProps) {
  const config = stageConfig[stage] || { bg: 'rgba(148,163,184,0.1)', text: '#94A3B8' };
  const padding = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';

  return (
    <motion.span
      className={`inline-flex items-center rounded-full text-xs font-medium ${padding}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {stage}
    </motion.span>
  );
}
