import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface FeatureShowcaseProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  index: number;
  illustration?: React.ReactNode;
}

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ icon, title, subtitle, description, index, illustration }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.2 + 0.3,
        type: 'spring',
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="group relative"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{
        y: -10,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main card */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
        {/* Icon */}
        <motion.div
          className="text-[#1e51ab] mb-6"
          variants={iconVariants}
          whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 },
          }}
        >
          {icon}
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1e51ab] transition-colors">{title}</h3>

          <p className="text-[#1e51ab] font-medium text-lg italic">"{subtitle}"</p>

          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#1e51ab] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Illustration (if provided) */}
      {illustration && (
        <motion.div
          className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center"
          initial={{ scale: 0, rotate: -45 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
          transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
        >
          {illustration}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeatureShowcase;
