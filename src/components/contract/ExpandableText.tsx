import { AnimatePresence, motion } from 'framer-motion';

import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showButton?: boolean;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 200, className = '', showButton = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : text.slice(0, maxLength) + '...';

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isExpanded ? 'expanded' : 'collapsed'}
          initial={{ opacity: 0, height: 'auto' }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-gray-900 leading-relaxed">
            {displayText}{' '}
            {showButton && (
              <button onClick={toggleExpanded} className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                {isExpanded ? <>Voir moins</> : <>Voir plus</>}
              </button>
            )}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExpandableText;
