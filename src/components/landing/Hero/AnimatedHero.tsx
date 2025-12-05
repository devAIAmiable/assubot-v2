import React, { useEffect, useState } from 'react';

import FloatingElements from './FloatingElements';
import TrustIndicators from './TrustIndicators';
import { motion } from 'framer-motion';
import { trackCtaClick } from '@/services/analytics';

interface AnimatedHeroProps {
  navigateToApp: () => void;
}

const heroTexts = ["Simplifiez vos Assurances avec l'IA", 'Gérez vos contrats intelligemment', 'Comparez et économisez facilement'];

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ navigateToApp }) => {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <FloatingElements />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div className="text-center lg:text-left" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            {/* Animated headline */}
            <div className="mb-6">
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
                key={currentText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-[#1e51ab]">
                  {heroTexts[currentText].split(' ').map((word, index) => (
                    <motion.span key={index} className="inline-block mr-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      {word}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>
            </div>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              AssuBot révolutionne votre gestion d'assurance avec une IA qui comprend vos besoins. Plus de contrats oubliés, plus de clauses incompréhensibles - juste une
              tranquillité d'esprit totale.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                className="bg-[#1e51ab] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#163d82] transition-colors shadow-lg relative overflow-hidden group"
                onClick={navigateToApp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Commencer gratuitement</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>

              <motion.button
                onClick={() => {
                  trackCtaClick({
                    label: 'Voir la démo',
                    location: 'landing_hero_secondary',
                    destination: '#demo',
                  });
                  const demoSection = document.getElementById('demo');
                  demoSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="border-2 border-[#1e51ab] text-[#1e51ab] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir la démo
              </motion.button>
            </motion.div>

            <TrustIndicators />
          </motion.div>

          {/* Right side - Hero Illustration */}
          <motion.div
            className="relative flex justify-center items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Main illustration container */}
              <motion.div
                className="relative w-full max-w-lg"
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Hero illustration placeholder - will be replaced with actual SVG */}
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🤖</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">AssuBot IA</h3>
                    <p className="text-gray-600">Votre assistant assurance personnel</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating cards around the main illustration */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                animate={{
                  y: [-5, 5, -5],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-green-500">✓</div>
                  <span className="text-sm font-medium">Contrats analysés</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                animate={{
                  y: [5, -5, 5],
                  rotate: [2, -2, 2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-blue-500">📊</div>
                  <span className="text-sm font-medium">Économies trouvées</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-8 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                animate={{
                  x: [-3, 3, -3],
                  y: [-2, 2, -2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 3,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-purple-500">🛡️</div>
                  <span className="text-sm font-medium">Protection garantie</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AnimatedHero;
