import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface StatsCounterProps {
  stats: StatItem[];
}

const StatsCounter: React.FC<StatsCounterProps> = ({ stats }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts(
        stats.map((stat) => {
          const target = stat.value;
          const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          return Math.floor(target * eased);
        })
      );

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(stats.map((stat) => stat.value));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isInView, stats]);

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Des chiffres qui parlent</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">Rejoignez une communauté grandissante qui fait confiance à AssuBot</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
              </motion.div>

              <motion.div
                className="text-4xl font-bold text-white mb-2"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
              >
                {counts[index].toLocaleString()}
                {stat.suffix}
              </motion.div>

              <p className="text-blue-100 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default StatsCounter;
