import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';

interface ContractSummarizationStatusProps {
  contractId: string;
  onStatusChange?: (status: 'processing' | 'completed' | 'failed') => void;
  showDetails?: boolean;
  className?: string;
}

type SummarizationStatus = 'idle' | 'processing' | 'completed' | 'failed';

export const ContractSummarizationStatus: React.FC<ContractSummarizationStatusProps> = ({ contractId, onStatusChange, showDetails = false, className = '' }) => {
  const [status, setStatus] = useState<SummarizationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const { getContractProcessingStatus, clearContractProcessing } = useRealtimeUpdates();

  // Check initial status
  useEffect(() => {
    const currentStatus = getContractProcessingStatus(contractId);
    if (currentStatus) {
      setStatus(currentStatus);
    }
  }, [contractId, getContractProcessingStatus]);

  // Listen for real-time updates
  useEffect(() => {
    const checkStatus = () => {
      const currentStatus = getContractProcessingStatus(contractId);
      if (currentStatus) {
        setStatus(currentStatus);

        onStatusChange?.(currentStatus);

        // Clear processing state after completion or failure
        if (currentStatus === 'completed' || currentStatus === 'failed') {
          setTimeout(() => {
            clearContractProcessing(contractId);
            setStatus('idle');
            setError(null);
          }, 3000); // Clear after 3 seconds
        }
      }
    };

    // Check status every second while processing
    const interval = setInterval(checkStatus, 1000);
    checkStatus();

    return () => clearInterval(interval);
  }, [contractId, getContractProcessingStatus, onStatusChange, clearContractProcessing]);

  // Don't render anything if idle and not showing details
  if (status === 'idle' && !showDetails) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <FaSpinner className="animate-spin h-3 w-3 text-blue-500" />;
      case 'completed':
        return <FaCheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <FaTimesCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Génération...';
      case 'completed':
        return 'Terminé';
      case 'failed':
        return 'Erreur';
      default:
        return '';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {getStatusIcon()}
      <span className="text-xs text-gray-600">{getStatusText()}</span>
      {showDetails && error && (
        <span className="text-xs text-red-600 ml-1" title={error}>
          ({error})
        </span>
      )}
    </div>
  );
};

// Compact version for inline display
export const ContractSummarizationStatusCompact: React.FC<{
  contractId: string;
  className?: string;
}> = ({ contractId, className = '' }) => {
  return <ContractSummarizationStatus contractId={contractId} showDetails={false} className={className} />;
};

// Full version with details
export const ContractSummarizationStatusFull: React.FC<{
  contractId: string;
  onStatusChange?: (status: 'processing' | 'completed' | 'failed') => void;
  className?: string;
}> = ({ contractId, onStatusChange, className = '' }) => {
  return <ContractSummarizationStatus contractId={contractId} onStatusChange={onStatusChange} showDetails={true} className={className} />;
};

export default ContractSummarizationStatus;
