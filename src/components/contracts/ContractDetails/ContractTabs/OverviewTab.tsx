import { FaCheck, FaFilePdf, FaMagic, FaShieldAlt } from 'react-icons/fa';
import React from 'react';

import type { Contract, DocumentType } from '../../../../types/contract';
import AIDisclaimer from '../ui/AIDisclaimer';
import { capitalizeFirst } from '../../../../utils/text';
import { formatDateForDisplayFR } from '../../../../utils/dateHelpers';

interface OverviewTabProps {
  contract: Contract;
  onDownloadDocument: (type: DocumentType) => void;
  isGeneratingDocument: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ contract, onDownloadDocument, isGeneratingDocument }) => {
  return (
    <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-0">
      {/* Mon contrat en un coup d'œil */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-2xl border border-blue-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <FaShieldAlt className="h-5 w-5 sm:h-6 sm:w-6 text-[#1e51ab] mr-2 sm:mr-3" />
            Mon contrat en un coup d'œil
            <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-blue-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">Bien(s)/Bénéficiaire(s)</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.subject}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-blue-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">Formule</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.formula ? capitalizeFirst(contract.formula) : 'Non spécifiée'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-blue-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">Prime annuelle</span>
                <span className="text-sm sm:text-base font-semibold text-[#1e51ab]">{(contract.annualPremiumCents / 100).toFixed(2)} €</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-blue-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">Renouvellement tacite</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.tacitRenewal ? 'Oui' : 'Non'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-blue-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">Début de contrat</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.startDate ? formatDateForDisplayFR(contract.startDate) : '-'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-blue-200">
                <span className="text-sm sm:text-base text-gray-600 font-medium">Fin de contrat</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">{contract.endDate ? formatDateForDisplayFR(contract.endDate) : '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Garanties souscrites + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Garanties souscrites (2/3) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              Garanties souscrites
              <FaMagic className="h-4 w-4 text-blue-500 ml-2" title="Généré par IA" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {contract.guarantees && contract.guarantees.length > 0 ? (
                contract.guarantees.map((garantie) => (
                  <div key={garantie.id} className="flex items-center space-x-3 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-100">
                    <FaCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{capitalizeFirst(garantie.title)}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 py-4">Aucune garantie spécifiée</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-4 sm:space-y-6">
          {/* Documents */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-2">
              {contract.documents && contract.documents.length > 0 ? (
                contract.documents.map((doc) => (
                  <div key={doc.id} className="bg-white border border-blue-100 rounded-lg">
                    <div className="flex items-center justify-between p-3 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-600 text-lg flex-shrink-0" />
                        <div>
                          <h4 className="text-sm sm:text-base font-medium text-gray-900">{doc.type}</h4>
                          <p className="text-xs sm:text-sm text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDownloadDocument(doc.type)}
                        disabled={isGeneratingDocument}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDocument ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" /> : 'Ouvrir'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">Aucun document disponible</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
};

export default OverviewTab;
