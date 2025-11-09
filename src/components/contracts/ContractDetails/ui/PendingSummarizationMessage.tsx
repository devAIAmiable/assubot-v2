import Avatar from '../../../ui/Avatar';
import { FaCheck } from 'react-icons/fa';
import React from 'react';

interface PendingSummarizationMessageProps {
  status?: 'pending' | 'ongoing' | 'done' | 'failed';
  isProcessing: boolean;
  isSummarizing: boolean;
  onSummarize: () => void;
}

const PendingSummarizationMessage: React.FC<PendingSummarizationMessageProps> = ({ status, isProcessing, isSummarizing, onSummarize }) => {
  if (status === 'ongoing' || isProcessing) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 shadow-lg">
          <div className="relative mb-6">
            <Avatar isAssistant size="xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-25 w-25 border-t-2 border-b-2 border-[#1e51ab]" />
            </div>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">Analyse en cours</h4>
          <p className="text-gray-600 leading-relaxed">Un peu de patience, je reviens vers toi avec la synthèse du contrat.</p>
        </div>
      </div>
    );
  }

  if (status === 'pending' || status === 'failed') {
    const isFailed = status === 'failed';
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 shadow-lg">
          <Avatar isAssistant />
          <h4 className="text-lg font-semibold text-gray-900 mb-3">{isFailed ? 'Analyse échouée' : 'Analyse en attente'}</h4>
          <p className="text-gray-600 leading-relaxed mb-6">
            {isFailed ? "L'analyse du contrat a échoué. Clique sur « Réessayer » pour relancer l'analyse." : 'Un peu de patience, je reviens vers toi avec la synthèse du contrat.'}
          </p>
          <button
            onClick={onSummarize}
            disabled={isSummarizing}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1e51ab] text-white font-medium rounded-lg hover:bg-[#163d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSummarizing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Démarrage...</span>
              </>
            ) : (
              <>
                <FaCheck className="h-4 w-4" />
                <span>{isFailed ? 'Réessayer' : "Lancer l'analyse"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PendingSummarizationMessage;
