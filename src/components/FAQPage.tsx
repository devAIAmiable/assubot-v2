import { AnimatePresence, motion } from 'framer-motion';
import {
	FaArrowLeft,
	FaChevronDown,
	FaCog,
	FaCreditCard,
	FaLightbulb,
	FaQuestionCircle,
	FaSearch,
	FaShieldAlt,
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface FAQQuestion {
	id: number;
	category: string;
	question: string;
	answer: string;
	keywords: string[];
	icon?: React.ReactNode;
}

interface FAQCategory {
	id: string;
	name: string;
	icon: React.ReactNode;
	description: string;
}

const FAQPage = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [openQuestions, setOpenQuestions] = useState<number[]>([]);
	const [activeTab, setActiveTab] = useState('all');

	const handleGoBack = () => {
		navigate(-1);
	};

	const categories: FAQCategory[] = [
		{
			id: 'all',
			name: 'Toutes les questions',
			icon: <FaQuestionCircle className="h-4 w-4" />,
			description: 'Découvrez toutes nos réponses',
		},
		{
			id: 'general',
			name: 'Général',
			icon: <FaLightbulb className="h-4 w-4" />,
			description: 'Présentation et fonctionnement',
		},
		{
			id: 'pricing',
			name: 'Tarification',
			icon: <FaCreditCard className="h-4 w-4" />,
			description: 'Système de crédits et paiements',
		},
		{
			id: 'technical',
			name: 'Technique',
			icon: <FaCog className="h-4 w-4" />,
			description: 'Utilisation et fonctionnalités',
		},
		{
			id: 'security',
			name: 'Sécurité',
			icon: <FaShieldAlt className="h-4 w-4" />,
			description: 'Protection des données',
		},
	];

	const questions: FAQQuestion[] = [
		{
			id: 1,
			category: 'general',
			question: "Qu'est-ce qu'AssuBot ?",
			answer:
				"AssuBot est votre assistant virtuel spécialisé dans l'assurance. Il vous aide à comprendre vos contrats, gérer vos polices d'assurance et optimiser vos couvertures grâce à l'intelligence artificielle. Notre plateforme centralise tous vos documents d'assurance et vous offre des insights personnalisés pour prendre les meilleures décisions.",
			keywords: ['assubot', 'assistant', 'virtuel', 'présentation'],
		},
		{
			id: 2,
			category: 'pricing',
			question: 'Comment fonctionne le système de crédits ?',
			answer:
				"Le système de crédits vous permet d'utiliser nos services de manière flexible. Chaque interaction avec AssuBot (analyse de contrat, question au chatbot, comparaison) consomme un crédit. Vous pouvez acheter des packs de crédits selon vos besoins : pack découverte (10 crédits), pack standard (50 crédits) ou pack premium (200 crédits).",
			keywords: ['credits', 'tarifs', 'paiement', 'coût'],
		},
		{
			id: 3,
			category: 'technical',
			question: "Comment puis-je télécharger mes contrats d'assurance ?",
			answer:
				"Vous pouvez télécharger vos contrats d'assurance directement depuis votre espace personnel. Allez dans la section 'Contrats' et cliquez sur 'Ajouter un contrat'. Nous acceptons les fichiers PDF. Une fois téléchargé, AssuBot analysera automatiquement votre contrat et extraira les informations importantes.",
			keywords: ['téléchargement', 'contrats', 'documents', 'upload'],
		},
		{
			id: 4,
			category: 'security',
			question: 'Comment mes données sont-elles protégées ?',
			answer:
				"Vos données sont stockées de manière sécurisée avec un chiffrement de niveau bancaire. Nous respectons strictement le RGPD et n'utilisons vos informations que pour améliorer nos services. Vos documents ne sont jamais partagés avec des tiers et vous gardez le contrôle total de vos données.",
			keywords: ['sécurité', 'données', 'protection', 'confidentialité'],
		},
		{
			id: 5,
			category: 'general',
			question: 'Comment fonctionne le chatbot AssuBot ?',
			answer:
				"Le chatbot AssuBot utilise l'intelligence artificielle avancée pour comprendre vos questions en langage naturel. Il analyse vos contrats téléchargés et peut répondre à des questions complexes sur vos couvertures, exclusions, franchises et conditions. Il s'améliore constamment grâce à l'apprentissage automatique.",
			keywords: ['chatbot', 'ia', 'intelligence artificielle', 'conversation'],
		},
		{
			id: 6,
			category: 'technical',
			question: 'Quels formats de fichiers sont acceptés ?',
			answer:
				"Nous acceptons actuellement les fichiers PDF pour vos contrats d'assurance. Nous travaillons sur l'ajout d'autres formats (JPG, PNG) pour les photos de contrats. La taille maximale par fichier est de 10MB. Nous recommandons des PDF de bonne qualité pour une analyse optimale.",
			keywords: ['formats', 'pdf', 'fichiers', 'support'],
		},
		{
			id: 7,
			category: 'pricing',
			question: "Combien coûte l'utilisation d'AssuBot ?",
			answer:
				"AssuBot fonctionne avec un système de crédits transparent. Chaque interaction coûte 1 crédit. Nos tarifs : Pack Découverte (10 crédits) : 9€, Pack Standard (50 crédits) : 35€, Pack Premium (200 crédits) : 120€. Pas d'abonnement, vous payez seulement ce que vous utilisez.",
			keywords: ['coût', 'prix', 'tarification', 'packs'],
		},
		{
			id: 8,
			category: 'security',
			question: 'Mes informations sont-elles partagées avec des tiers ?',
			answer:
				"Non, vos informations personnelles ne sont jamais partagées avec des tiers. Nous respectons strictement votre vie privée et la confidentialité de vos données. AssuBot fonctionne en local pour l'analyse de vos contrats et nous ne vendons jamais vos données à des assureurs ou autres entreprises.",
			keywords: ['partage', 'tiers', 'confidentialité', 'vie privée'],
		},
		{
			id: 9,
			category: 'technical',
			question: "Comment fonctionne la comparaison d'assurances ?",
			answer:
				'Notre comparateur intelligent analyse vos contrats existants et les compare avec les offres du marché. Il prend en compte vos besoins spécifiques, votre profil et vous propose les meilleures options avec des économies potentielles. Vous recevez des recommandations personnalisées avec des explications détaillées.',
			keywords: ['comparaison', 'analyse', 'recommandations', 'économies'],
		},
		{
			id: 10,
			category: 'general',
			question: "AssuBot peut-il m'aider à négocier mes contrats ?",
			answer:
				'Oui ! AssuBot analyse vos contrats et vous fournit des arguments de négociation basés sur les conditions de marché et les meilleures pratiques. Il vous aide à identifier les clauses défavorables et vous suggère des points de négociation pour obtenir de meilleures conditions.',
			keywords: ['négociation', 'arguments', 'clauses', 'conditions'],
		},
	];

	const filteredQuestions = questions.filter((question) => {
		if (selectedCategory !== 'all' && question.category !== selectedCategory) {
			return false;
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			return (
				question.question.toLowerCase().includes(query) ||
				question.answer.toLowerCase().includes(query) ||
				question.keywords.some((keyword) => keyword.toLowerCase().includes(query))
			);
		}

		return true;
	});

	const selectCategory = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setActiveTab(categoryId);
	};

	const toggleQuestion = (questionId: number) => {
		setOpenQuestions((prev) =>
			prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
		);
	};

	const handleSearch = () => {
		setSelectedCategory('all');
		setActiveTab('all');
	};

	const getCategoryStats = (categoryId: string) => {
		return questions.filter((q) => (categoryId === 'all' ? true : q.category === categoryId))
			.length;
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Section */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Return Button */}
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

					<motion.div
						className="text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Centre d'Aide</h1>
						<p className="text-gray-600">Trouvez rapidement les réponses à vos questions</p>
					</motion.div>

					{/* Search Bar */}
					<motion.div
						className="max-w-2xl mx-auto mt-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FaSearch className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									handleSearch();
								}}
								placeholder="Rechercher une question..."
								className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#1e51ab] focus:border-[#1e51ab] transition-colors duration-200"
							/>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Categories */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<motion.div
					className="flex flex-wrap gap-2 justify-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => selectCategory(category.id)}
							className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
								activeTab === category.id
									? 'bg-[#1e51ab] text-white border-[#1e51ab]'
									: 'bg-white text-gray-700 border-gray-300 hover:border-[#1e51ab] hover:text-[#1e51ab]'
							}`}
						>
							{category.icon}
							<span className="text-sm font-medium">{category.name}</span>
							<span className="text-xs opacity-75">({getCategoryStats(category.id)})</span>
						</button>
					))}
				</motion.div>
			</div>

			{/* FAQ Content */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<motion.div
					className="space-y-3"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
				>
					<AnimatePresence mode="wait">
						{filteredQuestions.length === 0 ? (
							<motion.div
								key="no-results"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="text-center py-12"
							>
								<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaSearch className="h-6 w-6 text-gray-400" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Aucune question trouvée
								</h3>
								<p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
							</motion.div>
						) : (
							<motion.div
								key="questions"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-3"
							>
								{filteredQuestions.map((question, index) => (
									<motion.div
										key={question.id}
										className="bg-white border border-gray-200 rounded-lg overflow-hidden"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
									>
										<button
											onClick={() => toggleQuestion(question.id)}
											className="w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
										>
											<div className="flex-1">
												<h3 className="text-base font-medium text-gray-900 mb-1">
													{question.question}
												</h3>
												<div className="flex items-center space-x-2">
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
														{categories.find((c) => c.id === question.category)?.name}
													</span>
												</div>
											</div>
											<FaChevronDown
												className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
													openQuestions.includes(question.id) ? 'rotate-180' : ''
												}`}
											/>
										</button>
										<AnimatePresence>
											{openQuestions.includes(question.id) && (
												<motion.div
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: 'auto' }}
													exit={{ opacity: 0, height: 0 }}
													transition={{ duration: 0.3 }}
													className="border-t border-gray-100"
												>
													<div className="px-4 py-4">
														<p className="text-gray-700 leading-relaxed text-sm">
															{question.answer}
														</p>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>

			{/* Contact Section */}
			<motion.div
				className="bg-white border-t border-gray-200 py-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.8 }}
			>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Vous ne trouvez pas votre réponse ?
					</h2>
					<p className="text-gray-600 mb-4">Notre équipe est là pour vous aider</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<button className="bg-[#1e51ab] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#163d82] transition-colors duration-200">
							Contactez-nous
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default FAQPage;
