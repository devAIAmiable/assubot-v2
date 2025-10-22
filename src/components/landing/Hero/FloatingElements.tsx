import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements: React.FC = () => {
  const floatingElements = [
    {
      id: 1,
      icon: '🛡️',
      initialX: 20,
      initialY: 20,
      delay: 0,
      duration: 6,
    },
    {
      id: 2,
      icon: '📄',
      initialX: 80,
      initialY: 40,
      delay: 1,
      duration: 8,
    },
    {
      id: 3,
      icon: '🤖',
      initialX: 60,
      initialY: 80,
      delay: 2,
      duration: 7,
    },
    {
      id: 4,
      icon: '💡',
      initialX: 30,
      initialY: 60,
      delay: 3,
      duration: 9,
    },
    {
      id: 5,
      icon: '📊',
      initialX: 70,
      initialY: 10,
      delay: 4,
      duration: 6,
    },
    {
      id: 6,
      icon: '🔍',
      initialX: 10,
      initialY: 90,
      delay: 5,
      duration: 8,
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${element.initialX}%`,
            top: `${element.initialY}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: element.delay,
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Background gradient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </div>
  );
};

export default FloatingElements;
