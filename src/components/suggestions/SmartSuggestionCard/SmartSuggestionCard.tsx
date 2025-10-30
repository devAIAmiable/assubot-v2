import type { ComponentType, SVGProps } from 'react';

import { motion } from 'framer-motion';

export type SmartSuggestionCardProps = {
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick: () => void;
  badgeLabel?: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  accentColor?: string; // default: #1e51ab
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
};

const DEFAULT_ACCENT = '#1e51ab';

export const SmartSuggestionCard = ({
  title,
  description,
  ctaLabel,
  onCtaClick,
  badgeLabel,
  Icon,
  accentColor = DEFAULT_ACCENT,
  secondaryAction,
  className,
}: SmartSuggestionCardProps) => {
  return (
    <motion.div
      className={`relative rounded-3xl border shadow-[0_10px_30px_rgba(0,0,0,0.06)] ${className || ''}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      style={{ borderColor: `${accentColor}55`, backgroundColor: 'transparent' }}
    >
      <div className="relative rounded-[22px] bg-white/90 backdrop-blur p-6 sm:p-8">
        <div className="flex items-start gap-5">
          {Icon ? (
            <div className="relative shrink-0">
              <motion.div
                className="relative grid place-items-center w-14 h-14 rounded-2xl"
                style={{ backgroundColor: `${accentColor}20` }}
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.2 }}
              >
                <Icon width={28} height={28} style={{ color: accentColor }} />
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1" style={{ boxShadow: `inset 0 0 0 1px ${accentColor}33` }} />
              </motion.div>
            </div>
          ) : null}

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h3>
              {badgeLabel ? (
                <span className="select-none rounded-full border px-3 py-1 text-xs font-medium text-gray-700 bg-white/70" style={{ borderColor: `${accentColor}33` }}>
                  {badgeLabel}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>

            <div className="mt-5 flex items-center gap-4">
              <motion.button
                type="button"
                onClick={onCtaClick}
                aria-label={ctaLabel}
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: accentColor }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {ctaLabel}
              </motion.button>

              {secondaryAction ? (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className="text-sm text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 rounded"
                >
                  {secondaryAction.label}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
