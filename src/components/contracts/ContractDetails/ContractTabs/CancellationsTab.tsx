import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { FaChevronDown, FaChevronUp, FaExclamationTriangle, FaMagic } from 'react-icons/fa';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import type { Contract } from '../../../../types/contract';
import AIDisclaimer from '../ui/AIDisclaimer';
import PendingSummarizationMessage from '../ui/PendingSummarizationMessage';

interface CancellationsTabProps {
  contract: Contract;
  summarizeStatus?: Contract['summarizeStatus'];
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
}

const CancellationsTab: React.FC<CancellationsTabProps> = ({ contract, summarizeStatus, isProcessing, isSummarizing, onSummarize }) => {
  if (summarizeStatus === 'pending' || summarizeStatus === 'ongoing') {
    return (
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
        <PendingSummarizationMessage status={summarizeStatus} isProcessing={isProcessing} isSummarizing={isSummarizing} onSummarize={onSummarize} />
        <AIDisclaimer />
      </div>
    );
  }

  const cancellations = contract.cancellations ?? [];

  return (
    <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0 space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-8 rounded-2xl border border-yellow-100">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 mr-2 sm:mr-3" />
          Questions fréquentes sur la résiliation
          <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {cancellations.length > 0 ? (
            cancellations.map((termination) => (
              <Disclosure key={termination.id}>
                {({ open }) => (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <DisclosureButton className="w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm sm:text-base text-gray-900">{termination.question}</span>
                        {open ? <FaChevronUp className="text-gray-400 flex-shrink-0" /> : <FaChevronDown className="text-gray-400 flex-shrink-0" />}
                      </div>
                    </DisclosureButton>
                    <DisclosurePanel className="p-3 sm:p-4 pt-0 border-t border-gray-100">
                      <div className="prose prose-sm max-w-none text-sm sm:text-base text-gray-700 leading-relaxed">
                        <ReactMarkdown>{termination.response}</ReactMarkdown>
                      </div>
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            ))
          ) : (
            <div className="text-center text-gray-600 text-sm sm:text-base bg-white border border-gray-200 rounded-xl p-6">Aucune information de résiliation disponible</div>
          )}
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
};

export default CancellationsTab;
