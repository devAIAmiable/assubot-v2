import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { VscRobot } from 'react-icons/vsc';

const InteractiveDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying] = useState(true);

  const demoSteps = [
    {
      title: 'Upload de contrat',
      subtitle: 'Téléchargez votre document',
      description: "Téléchargez votre contrat d'assurance en quelques clics",
      mockup: (
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">📄</div>
            <p className="text-gray-600 text-lg">Glissez-déposez votre contrat ici</p>
          </div>
        </div>
      ),
      animation: 'upload',
    },
    {
      title: 'Analyse du contrat',
      subtitle: 'Extraction automatique',
      description: "AI'A analyse et extrait les informations clés",
      mockup: (
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full animate-pulse" />
            </div>
            <span className="font-medium text-lg">Analyse en cours...</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Garanties', 'Exclusions', 'Franchises', 'Limites'].map((item, index) => (
              <motion.div key={item} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }}>
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-base">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      animation: 'analysis',
    },
    {
      title: 'Chat pour en savoir plus',
      subtitle: 'Questions et réponses',
      description: 'Posez vos questions et obtenez des réponses personnalisées',
      mockup: (
        <div className="bg-white rounded-lg p-8 shadow-lg space-y-4">
          {/* User message */}
          <motion.div className="flex justify-end" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">Que couvre mon assurance en cas d'accident?</p>
            </div>
          </motion.div>

          {/* AI response */}
          <motion.div className="flex justify-start" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <div className="bg-gray-50 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">🤖</div>
                <span className="text-xs text-gray-500">AssuBot</span>
              </div>
              <motion.p className="text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                Votre contrat couvre les dommages corporels et matériels en cas d'accident. Les garanties incluent la responsabilité civile, la défense recours, et l'assistance
                24h/24.
              </motion.p>
            </div>
          </motion.div>

          {/* Follow-up question */}
          <motion.div className="flex justify-end" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 }}>
            <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">Et pour les dommages à mon véhicule?</p>
            </div>
          </motion.div>

          {/* AI typing indicator - at the bottom */}
          <motion.div className="flex justify-start" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.2 }}>
            <div className="bg-gray-50 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">🤖</div>
                <span className="text-xs text-gray-500">AssuBot</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        </div>
      ),
      animation: 'chat',
    },
    {
      title: 'Comparaison en langage naturel',
      subtitle: 'Analyse intelligente',
      description: 'Comparez les offres avec des questions en langage naturel',
      mockup: (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {/* User question */}
          <motion.div className="bg-blue-50 rounded-lg p-3 mb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-sm font-medium">"Quelle assurance couvre le mieux les accidents de la route?"</p>
          </motion.div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Assureur 1</th>
                  <th className="p-2">Assureur 2</th>
                  <th className="p-2">Assureur 3</th>
                </tr>
              </thead>
              <tbody>
                {[{ values: [false, true, true] }, { values: [true, true, true] }, { values: [true, true, false] }, { values: [false, true, true] }].map((row, i) => (
                  <motion.tr key={i} className="border-b" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                    {row.values.map((val, j) => (
                      <td key={j} className="p-2 text-center">
                        <motion.span
                          className={val ? 'text-green-500' : 'text-red-500'}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.1 + j * 0.05 }}
                        >
                          {val ? '✓' : '✗'}
                        </motion.span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Score bars */}
          <div className="mt-4 space-y-2">
            {[
              { name: 'Assureur 1', score: 2, color: 'bg-blue-500' },
              { name: 'Assureur 2', score: 5, color: 'bg-green-500' },
              { name: 'Assureur 3', score: 4, color: 'bg-purple-500' },
            ].map((insurer, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.1 }}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{insurer.name}</span>
                  <span className="font-bold">{insurer.score}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`${insurer.color} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${insurer.score * 20}%` }}
                    transition={{ delay: 1.5 + i * 0.2, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final recommendation */}
          <motion.div
            className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold text-sm">🏆 Recommandation:</span>
              <span className="text-green-700 text-sm">Assureur 2 offre la meilleure couverture</span>
            </div>
          </motion.div>
        </div>
      ),
      animation: 'comparison',
    },
    {
      title: 'Suggestions intelligentes',
      subtitle: 'Recommandations mensuelles',
      description: 'Recevez des conseils personnalisés et économisez chaque mois',
      mockup: (
        <div className="bg-white p-8 shadow-lg">
          <motion.div className="flex items-start gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="w-12 h-12 rounded-full bg-[#1e51ab] flex items-center justify-center">
              <VscRobot className="text-white" />
            </div>
            <div className="flex-1">
              <motion.p className="font-medium mb-3 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                Suggestion intelligente
              </motion.p>
              <motion.p className="text-base text-gray-600 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                Nous avons détecté des doublons sur vos contrats.
              </motion.p>

              {/* Savings highlight */}
              <motion.div
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 text-sm">Économisez 17€/mois avec notre suggestion</span>
                </div>
                <p className="text-sm text-green-700">Soit 204€ d'économies par an</p>
              </motion.div>

              {/* Benefits list */}
              <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Suppression des doublons de garanties</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Optimisation de votre couverture</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Suivi mensuel automatique</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      ),
      animation: 'suggestion',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  const currentDemo = demoSteps[currentStep];

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AssuBot en action</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Découvrez comment notre IA transforme votre gestion d'assurance en quelques étapes simples</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Demo content */}
          <motion.div className="space-y-8" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="space-y-6">
              {/* Current step content */}
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentDemo.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{currentDemo.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Timeline navigation */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                <motion.div
                  className="absolute left-6 top-0 w-0.5 bg-[#1e51ab]"
                  initial={{ height: 0 }}
                  animate={{ height: `${(currentStep / (demoSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />

                {/* Step markers */}
                {demoSteps.map((step, index) => (
                  <div key={index} className="relative flex items-center mb-8 cursor-pointer group" onClick={() => setCurrentStep(index)}>
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-[#1e51ab] text-white shadow-lg shadow-[#1e51ab]/30'
                          : 'bg-white border-2 border-gray-300 text-gray-500 group-hover:border-[#1e51ab] group-hover:text-[#1e51ab]'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {index < currentStep ? '✓' : index + 1}
                    </motion.div>
                    <div className="ml-4">
                      <div
                        className={`font-semibold text-lg transition-colors duration-300 ${index <= currentStep ? 'text-[#1e51ab]' : 'text-gray-700 group-hover:text-[#1e51ab]'}`}
                      >
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500">{step.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side - Interactive mockup */}
          <motion.div className="relative" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.3 }}
              >
                {currentDemo.mockup}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default InteractiveDemo;
