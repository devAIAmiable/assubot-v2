import { FaArrowLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import remarkGfm from 'remark-gfm';
import { useGetActiveGeneralTermsQuery } from '../store/generalTermsApi';
import { useNavigate } from 'react-router-dom';

const GeneralTermsPage = () => {
	const navigate = useNavigate();
	const { data, isLoading, error } = useGetActiveGeneralTermsQuery();

	const handleGoBack = () => {
		navigate(-1);
	};

	const renderLoadingState = () => (
		<div className="flex items-center justify-center min-h-96">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab] mx-auto mb-4"></div>
				<p className="text-gray-600">Chargement des conditions générales...</p>
			</div>
		</div>
	);

	const renderErrorState = () => (
		<div className="flex items-center justify-center min-h-96">
			<div className="text-center">
				<div className="h-16 w-16 bg-red-300 rounded-full mx-auto mb-4 flex items-center justify-center">
					<span className="text-red-600 text-2xl">!</span>
				</div>
				<h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
				<p className="text-gray-600 mb-4">
					{error &&
					'data' in error &&
					error.data &&
					typeof error.data === 'object' &&
					'message' in error.data
						? (error.data as { message: string }).message
						: 'Impossible de charger les conditions générales'}
				</p>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-[#1e51ab] text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Réessayer
				</button>
			</div>
		</div>
	);

	const renderGeneralTerms = () => {
		if (!data) return null;

		const terms = data;

		return (
			<div className="max-w-4xl mx-auto">
				{/* Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
				>
					<div className="prose prose-lg max-w-none">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={{
								h1: ({ children }) => (
									<h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
										{children}
									</h1>
								),
								h2: ({ children }) => (
									<h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{children}</h2>
								),
								h3: ({ children }) => (
									<h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h3>
								),
								p: ({ children }) => (
									<p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
								),
								ul: ({ children }) => (
									<ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">{children}</ul>
								),
								ol: ({ children }) => (
									<ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
										{children}
									</ol>
								),
								li: ({ children }) => <li className="text-gray-700 leading-relaxed">{children}</li>,
								strong: ({ children }) => (
									<strong className="font-semibold text-gray-900">{children}</strong>
								),
								em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
								blockquote: ({ children }) => (
									<blockquote className="border-l-4 border-[#1e51ab] pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">
										{children}
									</blockquote>
								),
								code: ({ children }) => (
									<code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
										{children}
									</code>
								),
								pre: ({ children }) => (
									<pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
										{children}
									</pre>
								),
								table: ({ children }) => (
									<div className="overflow-x-auto mb-6">
										<table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
											{children}
										</table>
									</div>
								),
								thead: ({ children }) => (
									<thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
								),
								tbody: ({ children }) => (
									<tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
								),
								tr: ({ children, ...props }) => (
									<tr className="hover:bg-gray-50 transition-colors" {...props}>
										{children}
									</tr>
								),
								th: ({ children }) => (
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{children}
									</th>
								),
								td: ({ children }) => (
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>
								),
							}}
						>
							{terms.content}
						</ReactMarkdown>
					</div>
				</motion.div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<motion.button
						onClick={handleGoBack}
						className="flex items-center space-x-2 text-gray-600 hover:text-[#1e51ab] transition-colors duration-200 mb-6"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
					>
						<FaArrowLeft className="h-4 w-4" />
						<span className="text-sm font-medium">Retour</span>
					</motion.button>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{isLoading ? renderLoadingState() : error ? renderErrorState() : renderGeneralTerms()}
			</div>
		</div>
	);
};

export default GeneralTermsPage;
