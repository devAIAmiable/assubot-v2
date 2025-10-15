import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt, FaEye, FaFilePdf } from 'react-icons/fa';
import React, { useState } from 'react';

import type { DocumentReference } from '../types/chat';
import PdfViewerModal from './PdfViewerModal';

interface DocumentReferencesProps {
  references: DocumentReference[];
  className?: string;
}

const DocumentReferences: React.FC<DocumentReferencesProps> = ({ references, className = '' }) => {
  const [expandedRefs, setExpandedRefs] = useState<Record<string, boolean>>({});
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean;
    documentRef: DocumentReference | null;
    highlightPage?: number;
    highlightCoords?: [number, number, number, number];
  }>({
    isOpen: false,
    documentRef: null,
  });

  if (!references || references.length === 0) {
    return null;
  }

  const toggleExpanded = (documentId: string) => {
    setExpandedRefs((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const openPdfViewer = (documentRef: DocumentReference, page?: number, coords?: [number, number, number, number]) => {
    setPdfViewer({
      isOpen: true,
      documentRef: documentRef,
      highlightPage: page,
      highlightCoords: coords,
    });
  };

  const closePdfViewer = () => {
    setPdfViewer({
      isOpen: false,
      documentRef: null,
    });
  };

  const getDocumentName = (documentType: string) => {
    // Use document type as the primary identifier
    const typeMap: Record<string, string> = {
      CP: 'Conditions Particulières',
      CG: 'Conditions Générales',
      AA: 'Annexe Assurance',
      OTHER: 'Document',
    };

    const typeName = typeMap[documentType] || documentType;

    return typeName;
  };

  const getPageDisplayText = (pageNumber: number) => {
    return `Page ${pageNumber}`;
  };

  const getReferenceCount = (documentRef: DocumentReference) => {
    return documentRef.pages?.length || 0;
  };

  // Filter out documents with no pages
  const allDocuments = references.filter((doc) => doc.pages && doc.pages.length > 0);

  const totalReferences = allDocuments.reduce((sum, doc) => sum + getReferenceCount(doc), 0);

  // If no documents with references, don't render anything
  if (allDocuments.length === 0 || totalReferences === 0) {
    return null;
  }

  return (
    <>
      <div className={`mt-3 ${className}`}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <FaFilePdf className="text-blue-600 text-sm" />
            <span className="text-sm font-medium text-blue-900">
              Sources documentaires ({totalReferences} référence{totalReferences > 1 ? 's' : ''} dans {allDocuments.length} document{allDocuments.length > 1 ? 's' : ''})
            </span>
          </div>

          <div className="space-y-2">
            {allDocuments.map((documentRef) => {
              const isExpanded = expandedRefs[documentRef.id] || false;
              const referenceCount = getReferenceCount(documentRef);

              // Skip documents with no references
              if (referenceCount === 0) return null;

              return (
                <div key={documentRef.id} className="bg-white border border-blue-100 rounded-lg">
                  {/* Document Header */}
                  <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => toggleExpanded(documentRef.id)}>
                    <div className="flex items-center gap-3">
                      <FaFilePdf className="text-red-600 text-sm flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 truncate">{getDocumentName(documentRef.type)}</h4>
                        <p className="text-xs text-gray-500">
                          {referenceCount} référence{referenceCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPdfViewer(documentRef);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <FaEye className="text-xs" />
                        Ouvrir
                      </button>

                      <div className="text-gray-400">{isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}</div>
                    </div>
                  </div>

                  {/* Expanded References */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-blue-100 p-3 bg-blue-25">
                          <div className="space-y-2">
                            {documentRef.pages?.map((ref, refIndex) => (
                              <div
                                key={`${documentRef.id}-${refIndex}`}
                                className="flex items-center justify-between p-2 bg-white border border-blue-100 rounded hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-medium text-blue-700">{refIndex + 1}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-700">{getPageDisplayText(ref.page)}</span>
                                    {ref.coordinates && <span className="text-xs text-gray-500 ml-2">Zone surlignée</span>}
                                  </div>
                                </div>

                                <button
                                  onClick={() =>
                                    openPdfViewer(documentRef, ref.page, [
                                      parseFloat(ref.coordinates.x0),
                                      parseFloat(ref.coordinates.y0),
                                      parseFloat(ref.coordinates.x1),
                                      parseFloat(ref.coordinates.y1),
                                    ])
                                  }
                                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  <FaExternalLinkAlt className="text-xs" />
                                  Voir
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-blue-200">
            <p className="text-xs text-blue-700">💡 Cliquez sur une référence pour voir le document PDF avec le texte surligné</p>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {pdfViewer.isOpen && pdfViewer.documentRef && (
        <PdfViewerModal
          isOpen={pdfViewer.isOpen}
          onClose={closePdfViewer}
          title={getDocumentName(pdfViewer.documentRef.type)}
          documentReference={pdfViewer.documentRef}
          contractId={pdfViewer.documentRef.contractId}
          highlightPage={pdfViewer.highlightPage}
          highlightCoords={pdfViewer.highlightCoords}
        />
      )}
    </>
  );
};

export default DocumentReferences;
