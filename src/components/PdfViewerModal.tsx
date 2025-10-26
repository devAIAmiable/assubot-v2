import { AnimatePresence, motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaChevronLeft, FaChevronRight, FaCompress, FaExpand, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { DocumentReference } from '../types/chat';
import Loader from './ui/Loader';
import { useDocumentDownloadByType } from '../hooks/useDocumentDownloadByType';

// Set up PDF.js worker using local file
if (typeof window !== 'undefined') {
  // Use local worker file for reliability
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentReference: DocumentReference;
  contractId?: string;
  highlightPage?: number;
  highlightCoords?: [number, number, number, number][];
}

interface HighlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose, title, documentReference, contractId, highlightPage, highlightCoords }) => {
  const { downloadDocumentByType, downloadInternalDocument, isDownloading } = useDocumentDownloadByType();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<HighlightRect[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial page when highlightPage is provided
  useEffect(() => {
    if (highlightPage && numPages) {
      if (highlightPage >= 1 && highlightPage <= numPages) {
        setCurrentPage(highlightPage);
      }
    }
  }, [highlightPage, numPages]);

  // Process highlights when coordinates are provided
  useEffect(() => {
    if (highlightCoords && highlightPage) {
      const newHighlights = highlightCoords.map((coords) => ({
        x: coords[0],
        y: coords[1],
        width: coords[2] - coords[0],
        height: coords[3] - coords[1],
        page: highlightPage,
      }));
      setHighlights(newHighlights);
    }
  }, [highlightCoords, highlightPage]);

  const loadPdfDocument = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if this is an internal document (id is null and url is present)
      const isInternalDocument = !documentReference.id && !documentReference.contractId && documentReference.url;

      if (isInternalDocument && documentReference.url) {
        // Use the internal document download API
        const documentData = await downloadInternalDocument(documentReference.url, documentReference.type);
        setPdfUrl(documentData.url);
      } else {
        // Use the contract document download API
        const contractIdToUse = documentReference.contractId || contractId;
        const documentData = await downloadDocumentByType(contractIdToUse!, documentReference.type as 'CP' | 'CG' | 'OTHER');
        setPdfUrl(documentData.url);
      }
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Erreur lors du chargement du document');
    } finally {
      setLoading(false);
    }
  }, [documentReference.id, documentReference.contractId, documentReference.url, documentReference.type, contractId, downloadDocumentByType, downloadInternalDocument]);

  // Load PDF document when modal opens
  useEffect(() => {
    if (isOpen && (contractId || (!documentReference.id && !documentReference.contractId && documentReference.url))) {
      loadPdfDocument();
    }
  }, [isOpen, contractId, documentReference.id, documentReference.contractId, documentReference.url, loadPdfDocument]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);

    // Provide more specific error messages
    if (error.message.includes('worker')) {
      setError('Erreur de configuration du lecteur PDF. Veuillez recharger la page.');
    } else if (error.message.includes('fetch')) {
      setError('Erreur de téléchargement du document. Vérifiez votre connexion internet.');
    } else if (error.message.includes('Invalid PDF')) {
      setError('Format de document non supporté ou document corrompu.');
    } else {
      setError('Erreur lors du chargement du PDF. Veuillez réessayer.');
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (numPages && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevPage();
          break;
        case 'ArrowRight':
          goToNextPage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    },
    [isOpen, currentPage, numPages]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Close modal on escape key
  useEffect(() => {
    if (!isOpen) {
      setPdfUrl(null);
      setNumPages(null);
      setCurrentPage(1);
      setScale(1.0);
      setIsFullscreen(false);
      setHighlights([]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#1e51ab] text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                {title} - Page {currentPage} {numPages && `sur ${numPages}`}
              </h3>
              {highlights.length > 0 && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {highlights.length} référence{highlights.length > 1 ? 's' : ''} surlignée{highlights.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
                <button onClick={zoomOut} disabled={scale <= 0.5} className="p-2 hover:bg-white/20 rounded disabled:opacity-50">
                  <FaMinus className="text-sm" />
                </button>
                <span className="text-xs px-2">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} disabled={scale >= 3.0} className="p-2 hover:bg-white/20 rounded disabled:opacity-50">
                  <FaPlus className="text-sm" />
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded">
                {isFullscreen ? <FaCompress className="text-sm" /> : <FaExpand className="text-sm" />}
              </button>

              {/* Close Button */}
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {loading || isDownloading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader text="Chargement du document..." />
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTimes className="text-red-500 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button onClick={loadPdfDocument} className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-[#1a4599] transition-colors">
                    Réessayer
                  </button>
                </div>
              </div>
            ) : pdfUrl ? (
              <>
                {/* PDF Viewer */}
                <div ref={containerRef} className="flex-1 overflow-auto bg-gray-100 p-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<Loader text="Chargement du PDF..." />}>
                        <Page pageNumber={currentPage} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} className="shadow-lg" />
                      </Document>

                      {/* Highlight overlays */}
                      {highlights
                        .filter((h) => h.page === currentPage)
                        .map((highlight, index) => (
                          <div
                            key={index}
                            className="absolute border border-yellow-400 bg-yellow-300 bg-opacity-20 pointer-events-none"
                            style={{
                              left: `${highlight.x * scale}px`,
                              top: `${highlight.y * scale}px`,
                              width: `${highlight.width * scale}px`,
                              height: `${highlight.height * scale}px`,
                              opacity: 0.2,
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                {numPages && numPages > 1 && (
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage <= 1}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <FaChevronLeft className="text-sm" />
                        Précédent
                      </button>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={numPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value, 10);
                            if (page >= 1 && page <= numPages) {
                              setCurrentPage(page);
                            }
                          }}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e51ab]"
                        />
                        <span className="text-gray-500">sur {numPages}</span>
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage >= numPages}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        Suivant
                        <FaChevronRight className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PdfViewerModal;
