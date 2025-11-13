import { FaList, FaUpload, FaUserShield } from 'react-icons/fa';
import React, { useState } from 'react';

import AdminContractUpload from './AdminContractUpload';
import AdminContractsTable from '../components/admin/AdminContractsTable';
import AdminGuard from '../components/AdminGuard';
import BatchCreateUsersModal from '../components/admin/BatchCreateUsersModal';
import { motion } from 'framer-motion';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'contracts'>('contracts');
  const [openBatchModal, setOpenBatchModal] = useState(false);

  const tabs = [
    {
      id: 'contracts' as const,
      label: 'Gérer les contrats',
      icon: FaList,
      description: 'Voir et gérer les contrats existants',
    },
    {
      id: 'upload' as const,
      label: 'Importer un contrat',
      icon: FaUpload,
      description: 'Télécharger de nouveaux contrats',
    },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaUserShield className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Panneau d'administration</h1>
                    <p className="text-gray-600">Gérez les contrats et l'importation</p>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-3">
                  <button
                    className="inline-flex items-center gap-2 bg-[#1e51ab] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                    onClick={() => setOpenBatchModal(true)}
                  >
                    <FaUsers />
                    <span>Créer des utilisateurs en lot</span>
                  </button>
                  <div className="flex items-center space-x-2 text-green-600">
                    <FaCog className="h-5 w-5" />
                    <span className="text-sm font-medium">Admin</span>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-xl">
            {activeTab === 'upload' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{tabs.find((t) => t.id === 'upload')?.label}</h2>
                  <p className="text-gray-600">{tabs.find((t) => t.id === 'upload')?.description}</p>
                </div>
                <AdminContractUpload />
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{tabs.find((t) => t.id === 'contracts')?.label}</h2>
                  <p className="text-gray-600">{tabs.find((t) => t.id === 'contracts')?.description}</p>
                </div>
                <AdminContractsTable />
              </div>
            )}
          </motion.div>
          <BatchCreateUsersModal open={openBatchModal} onClose={() => setOpenBatchModal(false)} />
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminPanel;
