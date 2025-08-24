import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

import { motion } from 'framer-motion';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (limit: number) => void;
	className?: string;
}

export default function Pagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
	className = '',
}: PaginationProps) {
	// Don't render if there's only one page
	if (totalPages <= 1) return null;

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 7;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage <= 4) {
				// Show first 5 pages + ellipsis + last page
				for (let i = 2; i <= 5; i++) {
					pages.push(i);
				}
				pages.push('...');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 3) {
				// Show first page + ellipsis + last 5 pages
				pages.push('...');
				for (let i = totalPages - 4; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// Show first page + ellipsis + current page ± 1 + ellipsis + last page
				pages.push('...');
				pages.push(currentPage - 1);
				pages.push(currentPage);
				pages.push(currentPage + 1);
				pages.push('...');
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}
		>
			{/* Items per page selector */}
			<div className="flex items-center space-x-2">
				<span className="text-sm text-gray-600">Afficher</span>
				<select
					value={itemsPerPage}
					onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
					className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent"
				>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</select>
				<span className="text-sm text-gray-600">par page</span>
			</div>

			{/* Page info */}
			<div className="text-sm text-gray-600">
				Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
				<span className="font-medium">
					{Math.min(currentPage * itemsPerPage, totalItems)}
				</span>{' '}
				sur <span className="font-medium">{totalItems}</span> résultats
			</div>

			{/* Page navigation */}
			<div className="flex items-center space-x-1">
				{/* Previous button */}
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={`p-2 rounded-lg transition-colors ${
						currentPage === 1
							? 'text-gray-400 cursor-not-allowed'
							: 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-100'
					}`}
					aria-label="Page précédente"
				>
					<FaChevronLeft className="h-4 w-4" />
				</button>

				{/* Page numbers */}
				{pageNumbers.map((page, index) => (
					<div key={index}>
						{page === '...' ? (
							<span className="px-3 py-2 text-gray-400">
								<FaEllipsisH className="h-4 w-4" />
							</span>
						) : (
							<button
								onClick={() => onPageChange(page as number)}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									currentPage === page
										? 'bg-[#1e51ab] text-white'
										: 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-100'
								}`}
								aria-label={`Page ${page}`}
								aria-current={currentPage === page ? 'page' : undefined}
							>
								{page}
							</button>
						)}
					</div>
				))}

				{/* Next button */}
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`p-2 rounded-lg transition-colors ${
						currentPage === totalPages
							? 'text-gray-400 cursor-not-allowed'
							: 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-100'
					}`}
					aria-label="Page suivante"
				>
					<FaChevronRight className="h-4 w-4" />
				</button>
			</div>
		</motion.div>
	);
}
