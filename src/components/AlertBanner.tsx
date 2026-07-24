import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';

interface AlertBannerProps {
  title?: string;
  message: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  message,
  type = 'warning',
  actionLabel,
  onAction,
  onClose,
  className = ''
}) => {
  const styles = {
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200',
      iconBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
      Icon: AlertTriangle,
      btn: 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600'
    },
    danger: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30 text-rose-900 dark:text-rose-200',
      iconBg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
      Icon: AlertCircle,
      btn: 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-600'
    },
    info: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      iconBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      Icon: Info,
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600'
    },
    success: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      iconBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      Icon: CheckCircle2,
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    }
  }[type];

  const IconComponent = styles.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`relative p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md flex items-start justify-between gap-3 shadow-xs ${styles.bg} ${className}`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${styles.iconBg}`}>
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          {title && (
            <h4 className="text-xs sm:text-sm font-bold tracking-tight mb-0.5">
              {title}
            </h4>
          )}
          <p className="text-xs sm:text-sm leading-relaxed font-medium opacity-90 break-words">
            {message}
          </p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={`mt-2.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 ${styles.btn}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
