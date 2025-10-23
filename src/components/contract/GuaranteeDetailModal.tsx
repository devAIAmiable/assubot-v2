import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

import type { BackendContractGuarantee } from '../../types/contract';
import GuaranteeOverview from './GuaranteeOverview';
import GuaranteeServiceAccordion from './GuaranteeServiceAccordion';
import GuaranteeSidebar from './GuaranteeSidebar';
import { useScrollSpy } from '../../hooks/useScrollSpy';

interface GuaranteeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guarantee: BackendContractGuarantee;
}

const GuaranteeDetailModal: React.FC<GuaranteeDetailModalProps> = ({ isOpen, onClose, guarantee }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sectionIds = ['overview', ...(guarantee.details?.map((_, index) => `prestation-${index}`) || [])];

  const activeScrollSection = useScrollSpy(sectionIds);

  // Update active section based on scroll
  useEffect(() => {
    if (activeScrollSection) {
      setActiveSection(activeScrollSection);
    }
  }, [activeScrollSection]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-hidden" onClose={onClose}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        <div className="fixed inset-0 flex">
          <TransitionChild
            as={React.Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="relative flex-1 flex flex-col bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
                    <FaBars className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        {guarantee.title}
                      </Dialog.Title>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <FaTimes className="text-gray-600 text-sm" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Desktop */}
                {sidebarOpen && (
                  <div className="hidden lg:block w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                    <GuaranteeSidebar guarantee={guarantee} activeSection={activeSection} onSectionChange={handleSectionChange} />
                  </div>
                )}

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                  <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed left-0 top-0 h-full w-80 bg-gray-50 border-r border-gray-200">
                      <GuaranteeSidebar guarantee={guarantee} activeSection={activeSection} onSectionChange={handleSectionChange} />
                    </div>
                  </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                      <div id="overview" className="mb-8">
                        <GuaranteeOverview guarantee={guarantee} />
                      </div>
                      {guarantee.details?.map((detail, index) => (
                        <div key={`prestation-${index}`} id={`prestation-${index}`} className="mb-8">
                          <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <GuaranteeServiceAccordion detail={detail} index={index} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GuaranteeDetailModal;
