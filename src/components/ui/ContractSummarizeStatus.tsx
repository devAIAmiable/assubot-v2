import { FaCheckCircle, FaHourglassHalf, FaRobot, FaSpinner, FaTimesCircle } from 'react-icons/fa';

interface ContractSummarizeStatusProps {
  summarizeStatus?: 'pending' | 'ongoing' | 'done' | 'failed';
  summarizedAt?: Date;
  compact?: boolean;
  className?: string;
}

export const ContractSummarizeStatus: React.FC<ContractSummarizeStatusProps> = ({ summarizeStatus, summarizedAt, compact = false, className = '' }) => {
  // Don't render anything if no status
  if (!summarizeStatus) {
    return null;
  }

  const getStatusIcon = () => {
    switch (summarizeStatus) {
      case 'pending':
        return <FaHourglassHalf className="h-3 w-3 text-gray-500" />;
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
        return 'En attente';
      case 'ongoing':
        return 'Génération...';
      case 'done':
        return 'Résumé disponible';
      case 'failed':
        return 'Échec';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (summarizeStatus) {
      case 'pending':
        return 'text-gray-600';
      case 'ongoing':
        return 'text-blue-600';
      case 'done':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {getStatusIcon()}
        <span className={`text-xs ${getStatusColor()}`}>{getStatusText()}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <FaRobot className="h-4 w-4 text-gray-500" />
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
      {summarizeStatus === 'done' && summarizedAt && <span className="text-xs text-gray-500">le {summarizedAt.toLocaleDateString('fr-FR')}</span>}
    </div>
  );
};

export default ContractSummarizeStatus;
