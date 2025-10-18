// import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

// {/* <div className="p-4">
// {garantie.details && Array.isArray(garantie.details) && garantie.details.length > 0 ? (
//   <div className="space-y-4">
//     {garantie.details.map((detail, detailIndex) => (
//       <div key={detailIndex} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
//         {/* Service Title */}
//         {detail.service && detail.service.trim() !== '' && (
//           <div className="mb-3">
//             <h4 className="text-base font-medium text-gray-900 mb-1">{detail.service}</h4>
//           </div>
//         )}

//         {/* Financial Info Cards */}
//         {(detail.plafond || detail.franchise || detail.limit) && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
//             {/* Plafond */}
//             {detail.plafond && detail.plafond.trim() !== '' && (
//               <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                 <div className="flex items-center space-x-2 mb-1">
//                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
//                   <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Plafond</span>
//                 </div>
//                 <p className="text-sm font-semibold text-blue-900">
//                   {!isNaN(parseFloat(detail.plafond)) ? `${parseFloat(detail.plafond).toLocaleString('fr-FR')} €` : detail.plafond}
//                 </p>
//               </div>
//             )}

//             {/* Franchise */}
//             {detail.franchise && detail.franchise.trim() !== '' && (
//               <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
//                 <div className="flex items-center space-x-2 mb-1">
//                   <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
//                   <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Franchise</span>
//                 </div>
//                 <p className="text-sm font-semibold text-purple-900">
//                   {!isNaN(parseFloat(detail.franchise)) ? `${parseFloat(detail.franchise).toLocaleString('fr-FR')} €` : detail.franchise}
//                 </p>
//               </div>
//             )}
//             {/* Franchise */}
//             {detail.deductible && detail.deductible.trim() !== '' && (
//               <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
//                 <div className="flex items-center space-x-2 mb-1">
//                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
//                   <span className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Franchise</span>
//                 </div>
//                 <p className="text-sm font-semibold text-indigo-900">{detail.deductible}</p>
//               </div>
//             )}

//             {/* Plafond */}
//             {detail.limit && detail.limit.trim() !== '' && (
//               <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
//                 <div className="flex items-center space-x-2 mb-1">
//                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
//                   <span className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Plafond</span>
//                 </div>
//                 <p className="text-sm font-semibold text-indigo-900">{detail.limit}</p>
//               </div>
//             )}
//             {/* Limitation */}
//             {detail.limitation && detail.limitation.trim() !== '' && (
//               <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
//                 <div className="flex items-center space-x-2 mb-1">
//                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
//                   <span className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Limite(s)</span>
//                 </div>
//                 <p className="text-sm font-semibold text-indigo-900">{detail.limitation}</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Coverages */}
//         {detail.coverages && detail.coverages.length > 0 && (
//           <div className="space-y-2">
//             {/* Included Coverages */}
//             {detail.coverages.filter((c) => c.type === 'covered').length > 0 && (
//               <div>
//                 <h5 className="text-xs font-medium text-green-700 mb-2 flex items-center">
//                   <FaCheck className="h-3 w-3 mr-1" />
//                   Inclus ({detail.coverages.filter((c) => c.type === 'covered').length})
//                 </h5>
//                 <div className="space-y-1">
//                   {detail.coverages
//                     .filter((coverage) => coverage.type === 'covered')
//                     .map((coverage, coverageIndex) => (
//                       <div key={coverageIndex} className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
//                         <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <FaCheck className="h-2 w-2 text-white" />
//                         </div>
//                         <p className="text-xs text-green-800 leading-relaxed">{coverage.description}</p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {/* Excluded Coverages */}
//             {detail.coverages.filter((c) => c.type === 'not_covered').length > 0 && (
//               <div>
//                 <h5 className="text-xs font-medium text-red-700 mb-2 flex items-center">
//                   <FaTimes className="h-3 w-3 mr-1" />
//                   Exclu ({detail.coverages.filter((c) => c.type === 'not_covered').length})
//                 </h5>
//                 <div className="space-y-1">
//                   {detail.coverages
//                     .filter((coverage) => coverage.type === 'not_covered')
//                     .map((coverage, coverageIndex) => (
//                       <div key={coverageIndex} className="flex items-start space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
//                         <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <FaTimes className="h-2 w-2 text-white" />
//                         </div>
//                         <p className="text-xs text-red-800 leading-relaxed">{coverage.description}</p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// ) : (
//   <div className="text-center py-6">
//     <FaShieldAlt className="h-8 w-8 text-gray-300 mx-auto mb-3" />
//     <p className="text-sm text-gray-500">Aucun détail disponible pour cette garantie</p>
//   </div>
// )}
// </div> */}
