import { FaBell, FaCheck, FaClock, FaUserShield } from 'react-icons/fa';
import { useCallback, useState } from 'react';

import AdminContractForm from '../components/contract/AdminContractForm';
import AdminGuard from '../components/AdminGuard';
import { adminContractUploadService, type AdminContractUploadData } from '../services/adminContractUploadService';
import { motion } from 'framer-motion';
import Avatar from '../components/ui/Avatar';

const AdminContractUpload: React.FC = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = useCallback(async (data: { insurer: string; insuranceType: string; version: string; cgFile: File | null }) => {
    try {
      if (!data.cgFile) {
        throw new Error('Fichier des Conditions Générales requis');
      }

      // Créer les données pour le service admin
      const adminUploadData: AdminContractUploadData = {
        insurerId: data.insurer,
        version: data.version,
        category: data.insuranceType as 'auto' | 'health' | 'home' | 'moto' | 'electronic_devices' | 'other',
        cgFile: data.cgFile,
      };

      const result = await adminContractUploadService.uploadAdminContract(adminUploadData);

      if (result.success) {
        setShowSuccessMessage(true);
      } else {
        throw new Error(result.error || 'Échec de la création du contrat');
      }
    } catch (error) {
      console.error('Admin contract creation failed:', error);
      throw error;
    }
  }, []);

  const closeSuccessMessage = useCallback(() => {
    setShowSuccessMessage(false);
  }, []);

  // Afficher le message de succès
  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-8">
          <div className="text-center">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaCheck className="text-4xl text-white" />
            </motion.div>
            <h4 className="text-2xl font-semibold text-green-600 mt-4">Contrat téléchargé avec succès !</h4>
            <div className="text-left mb-4">
              <p className="text-lg font-medium text-gray-800 mb-4 text-center">Votre contrat est en cours de traitement.</p>
              <div className="bg-gray-50 rounded-lg px-2 py-4 space-y-4">
                <div className="flex items-center space-x-3 py-2">
                  <FaClock className="text-xl text-blue-500 w-5 flex-shrink-0 mx-2" />
                  <span className="text-gray-700">
                    Temps de traitement moyen: <strong className="text-gray-900">3 minutes</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <FaBell className="text-xl text-blue-500 w-5 flex-shrink-0 mx-2" />
                  <span className="text-gray-700">Vous serez notifié dès que votre contrat sera disponible</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar isAssistant size="md" />
                  <span className="text-gray-700">AssuBot analysera automatiquement vos documents</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Une fois le traitement terminé, votre contrat apparaîtra dans votre tableau de bord et vous pourrez commencer à poser des questions à AssuBot à son sujet.
              </p>
            </div>
            <button
              className="bg-[#1e51ab] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center space-x-2 mx-auto mt-6"
              onClick={closeSuccessMessage}
            >
              <FaCheck />
              <span>Compris</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Administration - Importer un contrat</h2>
                  <p className="text-gray-600 mt-1">Interface réservée aux administrateurs</p>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <FaUserShield className="h-5 w-5" />
                  <span className="text-sm font-medium">Admin</span>
                </div>
              </div>

              {/* Contenu du formulaire */}
              <div className="min-h-[500px]">
                <AdminContractForm onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminContractUpload;
