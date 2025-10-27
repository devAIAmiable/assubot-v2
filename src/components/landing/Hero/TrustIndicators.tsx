import { FaShieldAlt, FaStar, FaUsers } from 'react-icons/fa';

import React from 'react';
import { motion } from 'framer-motion';

const TrustIndicators: React.FC = () => {
  const indicators = [
    {
      icon: <FaUsers className="text-2xl text-[#1e51ab]" />,
      value: '100+',
      label: 'Utilisateurs actifs',
    },
    {
      icon: <FaShieldAlt className="text-2xl text-green-500" />,
      value: '250+',
      label: 'Contrats analysés',
    },
    {
      icon: <FaStar className="text-2xl text-yellow-500" />,
      value: '4.9/5',
      label: 'Note moyenne',
    },
  ];

  return (
    <motion.div className="flex flex-wrap justify-center gap-8 mt-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
      {indicators.map((indicator, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {indicator.icon}
          <div>
            <motion.div className="text-lg font-bold text-gray-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + index * 0.2 }}>
              {indicator.value}
            </motion.div>
            <div className="text-sm text-gray-600">{indicator.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrustIndicators;
