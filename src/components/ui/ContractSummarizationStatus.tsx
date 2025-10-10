import { FaCheckCircle, FaClock, FaSpinner, FaTimesCircle } from 'react-icons/fa';

interface ContractSummarizationStatusProps {
  summarizeStatus?: 'pending' | 'ongoing' | 'done' | 'failed';
  className?: string;
}

export const ContractSummarizationStatus: React.FC<ContractSummarizationStatusProps> = ({ summarizeStatus, className = '' }) => {
  // Don't render anything if no status
  if (!summarizeStatus) {
    return null;
  }

  const getStatusIcon = () => {
    switch (summarizeStatus) {
      case 'pending':
        return <FaClock className="h-3 w-3 text-gray-400" />;
      case 'ongoing':
        return <FaSpinner className="animate-spin h-3 w-3 text-blue-500" />;
      case 'done':
        return <FaCheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <FaTimesCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (summarizeStatus) {
      case 'pending':
        return 'Résumé en attente';
      case 'ongoing':
        return 'Génération du résumé...';
      case 'done':
        return 'Résumé disponible';
      case 'failed':
        return 'Échec du résumé';
      default:
        return '';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {getStatusIcon()}
      <span className="text-xs text-gray-600">{getStatusText()}</span>
    </div>
  );
};

export default ContractSummarizationStatus;
