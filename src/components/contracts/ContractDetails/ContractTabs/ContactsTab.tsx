import { FaClipboardList, FaClock, FaEnvelope, FaMagic, FaPhone } from 'react-icons/fa';

import AIDisclaimer from '../ui/AIDisclaimer';
import type { Contract } from '../../../../types/contract';
import { ContractStatus } from '../../../../types/contract';
import PendingSummarizationMessage from '../ui/PendingSummarizationMessage';
import React from 'react';
import SummarizedEmptyState from '../ui/SummarizedEmptyState';
import { getContactTypeLabel } from '../../../../utils/contract';

interface ContactsTabProps {
  contract: Contract;
  summarizeStatus?: Contract['summarizeStatus'];
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ contract, summarizeStatus, isProcessing, isSummarizing, onSummarize }) => {
  const isActiveContract = contract.status === ContractStatus.ACTIVE;

  if (summarizeStatus === 'pending' || summarizeStatus === 'ongoing') {
    return (
      <div className="max-w-7xl mx-auto px-0 sm:px-4">
        <PendingSummarizationMessage status={summarizeStatus} isProcessing={isProcessing} isSummarizing={isSummarizing} onSummarize={onSummarize} canSummarize={isActiveContract} />
        <AIDisclaimer />
      </div>
    );
  }

  const contacts = contract.contacts ?? [];
  const hasSummarizedEmpty = summarizeStatus === 'done' && contacts.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
        <FaPhone className="h-6 w-6 text-[#1e51ab] mr-3" />
        Qui contacter
        <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaClipboardList className="h-5 w-5 text-blue-600 mr-2" />
                {getContactTypeLabel(contact.type)}
              </h4>
              <div className="space-y-4">
                {contact.name && (
                  <div>
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{contact.email}</span>
                  </div>
                )}
                {contact.openingHours && (
                  <div className="flex items-center space-x-3">
                    <FaClock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{contact.openingHours}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : hasSummarizedEmpty ? (
          <div className="col-span-full">
            <SummarizedEmptyState title="Aucun contact identifié" description="Ce contrat ne contient pas de contacts détectés." />
          </div>
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">Aucun contact disponible</div>
        )}
      </div>

      <AIDisclaimer />
    </div>
  );
};

export default ContactsTab;
