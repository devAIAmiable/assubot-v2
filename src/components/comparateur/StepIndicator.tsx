import { FaCheck } from 'react-icons/fa';

import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
  subsectionProgress?: {
    current: number;
    total: number;
  };
}

interface StepIndicatorProps {
  steps: Step[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, onStepClick, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => step.completed && onStepClick?.(step.id)}
                disabled={!step.completed}
                className={`
                  relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${
                    step.completed
                      ? 'bg-[#1e51ab] border-[#1e51ab] text-white cursor-pointer hover:bg-[#163d82] hover:border-[#163d82]'
                      : step.current
                        ? 'bg-white border-[#1e51ab] text-[#1e51ab] ring-4 ring-blue-100'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                  ${!step.completed && !step.current ? 'cursor-not-allowed' : ''}
                `}
              >
                {step.completed ? <FaCheck className="w-4 h-4" /> : <span className="text-sm font-semibold">{index + 1}</span>}
              </button>

              {/* Step Label */}
              <div className="mt-2 text-center max-w-24">
                <p className={`text-xs font-medium ${step.current ? 'text-[#1e51ab]' : step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>

                {/* Subsection Progress */}
                {step.current && step.subsectionProgress && (
                  <div className="mt-1">
                    <div className="bg-gray-200 rounded-full h-1 w-full">
                      <div
                        className="bg-[#1e51ab] h-1 rounded-full transition-all duration-300"
                        style={{
                          width: `${(step.subsectionProgress.current / step.subsectionProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.subsectionProgress.current} / {step.subsectionProgress.total}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div className="h-0.5 bg-gray-200 active:bg-[#1e51ab] transition-colors duration-200">
                  <div className={`h-full transition-all duration-300 ${step.completed ? 'bg-[#1e51ab] w-full' : 'bg-gray-200 w-0'}`} />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
