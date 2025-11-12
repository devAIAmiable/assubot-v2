import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import clsx from 'clsx';
import { FaBars, FaTimes } from 'react-icons/fa';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { BackendContractGuarantee } from '../../../../types/contract';
import GuaranteeOverview from '../../../contract/GuaranteeOverview';
import GuaranteeServiceAccordion from '../../../contract/GuaranteeServiceAccordion';
import GuaranteeSidebar from '../../../contract/GuaranteeSidebar';
import { useScrollSpy } from '../../../../hooks/useScrollSpy';

interface GuaranteeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guarantee: BackendContractGuarantee;
}

const GuaranteeDetailModal: React.FC<GuaranteeDetailModalProps> = ({ isOpen, onClose, guarantee }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedServiceIndex, setExpandedServiceIndex] = useState<number | null>(guarantee.details && guarantee.details.length > 0 ? 0 : null);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const manualTargetRef = useRef<string | null>(null);
  const manualTimeoutRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const sectionIds = useMemo(() => ['overview', ...(guarantee.details?.map((_, index) => `prestation-${index}`) || [])], [guarantee.details]);

  useEffect(() => {
    setActiveSection('overview');
    setExpandedServiceIndex(guarantee.details && guarantee.details.length > 0 ? 0 : null);
    setIsManualSelection(false);
    manualTargetRef.current = null;
    if (manualTimeoutRef.current) {
      window.clearTimeout(manualTimeoutRef.current);
      manualTimeoutRef.current = null;
    }
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0 });
    }
  }, [guarantee.id, guarantee.details]);

  useEffect(() => {
    return () => {
      if (manualTimeoutRef.current) {
        window.clearTimeout(manualTimeoutRef.current);
        manualTimeoutRef.current = null;
      }
    };
  }, []);

  const scrollContainer = contentRef.current;
  const scrollSpyOptions = useMemo(() => ({ threshold: 0.25, rootMargin: '-15% 0px -55% 0px', root: scrollContainer }), [scrollContainer]);
  const activeScrollSection = useScrollSpy(sectionIds, scrollSpyOptions);

  useEffect(() => {
    if (!activeScrollSection) {
      return;
    }

    // Ignore all scroll spy updates during manual selection
    if (isManualSelection) {
      return;
    }

    // Only update if we've reached the manual target or if there's no manual target
    if (manualTargetRef.current && manualTargetRef.current !== activeScrollSection) {
      return;
    }

    // Clear manual target if we've reached it
    if (manualTargetRef.current === activeScrollSection) {
      manualTargetRef.current = null;
      if (manualTimeoutRef.current) {
        window.clearTimeout(manualTimeoutRef.current);
        manualTimeoutRef.current = null;
      }
    }

    setActiveSection(activeScrollSection);
    if (activeScrollSection.startsWith('prestation-')) {
      const idx = Number(activeScrollSection.replace('prestation-', ''));
      if (!Number.isNaN(idx)) {
        setExpandedServiceIndex(idx);
      }
    } else {
      setExpandedServiceIndex(null);
    }
  }, [activeScrollSection, isManualSelection]);

  const handleSectionChange = useCallback((section: string) => {
    manualTargetRef.current = section;
    setIsManualSelection(true);
    if (manualTimeoutRef.current) {
      window.clearTimeout(manualTimeoutRef.current);
    }
    manualTimeoutRef.current = window.setTimeout(() => {
      setIsManualSelection(false);
      manualTargetRef.current = null;
      manualTimeoutRef.current = null;
    }, 1200);

    setActiveSection(section);
    if (section.startsWith('prestation-')) {
      const idx = Number(section.replace('prestation-', ''));
      if (!Number.isNaN(idx)) {
        setExpandedServiceIndex(idx);
      }
    } else {
      setExpandedServiceIndex(null);
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-hidden" onClose={onClose}>
        {sidebarOpen && (
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-black/50 lg:hidden" aria-hidden="true" onClick={() => setSidebarOpen(false)} />
          </TransitionChild>
        )}

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
                  <button
                    onClick={onClose}
                    aria-label="Fermer la fenêtre de détail de la garantie"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <FaTimes className="text-gray-600 text-sm" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex overflow-hidden">
                {sidebarOpen && (
                  <div
                    className={clsx(
                      'fixed inset-y-0 left-0 z-50 w-80 bg-gray-50 border-r border-gray-200 transition-transform duration-300',
                      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                      'lg:static lg:translate-x-0 lg:block'
                    )}
                  >
                    <GuaranteeSidebar guarantee={guarantee} activeSection={activeSection} onSectionChange={handleSectionChange} />
                  </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div ref={contentRef} className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                      <div id="overview" className="mb-8">
                        <GuaranteeOverview guarantee={guarantee} />
                      </div>
                      {guarantee.details?.length
                        ? guarantee.details.map((detail, index) => (
                            <div key={`prestation-${index}`} id={`prestation-${index}`} className="mb-8">
                              <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <GuaranteeServiceAccordion
                                  detail={detail}
                                  index={index}
                                  forceExpand={expandedServiceIndex === index}
                                  onToggle={(expanded) => setExpandedServiceIndex(expanded ? index : null)}
                                />
                              </div>
                            </div>
                          ))
                        : null}
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
