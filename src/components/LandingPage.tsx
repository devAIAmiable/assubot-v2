import {
	FaArrowRight,
	FaBars,
	FaBrain,
	FaChartLine,
	FaCheck,
	FaFileContract,
	FaInstagram,
	FaLinkedin,
	FaRobot,
	FaStar,
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import { useGetCreditPacksQuery } from '../store/creditPacksApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LandingPage = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [contactForm, setContactForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		company: '',
		message: '',
	});
	const navigate = useNavigate();

	const navigateToApp = () => {
		navigate('/app');
	};

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Create mailto link with form data
		const subject = encodeURIComponent('Contact depuis le site AssuBot');
		const body = encodeURIComponent(`
Nom: ${contactForm.firstName} ${contactForm.lastName}
Email: ${contactForm.email}
Entreprise: ${contactForm.company || 'Non renseignée'}

Message:
${contactForm.message}
		`);
		const mailtoLink = `mailto:contact@a-lamiable.com?subject=${subject}&body=${body}`;
		window.open(mailtoLink);
	};

	const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setContactForm({
			...contactForm,
			[e.target.name]: e.target.value,
		});
	};

	const features = [
		{
			icon: <FaFileContract className="w-8 h-8" />,
			title: 'Centralisation des contrats',
			description: 'Stockez et organisez tous vos contrats d\'assurance en un seul endroit sécurisé.',
			details: [
				'Extraction intelligente des données clés',
				'Organisation par catégorie et assureur',
				'Historique complet des modifications',
				'Stockage sécurisé et chiffré'
			]
		},
		{
			icon: <FaRobot className="w-8 h-8" />,
			title: 'Assistant IA intelligent',
			description: 'Obtenez des réponses instantanées à vos questions d\'assurance 24h/24.',
			details: [
				'Compréhension du langage naturel',
				'Analyse de vos contrats spécifiques',
				'Conseils personnalisés en temps réel',
				'Traduction des clauses complexes',
			]
		},
		{
			icon: <FaChartLine className="w-8 h-8" />,
			title: 'Dashboard personnalisé',
			description: 'Visualisez votre situation d\'assurance et vos dépenses en temps réel.',
			details: [
				'Vue d\'ensemble de tous vos contrats',
				'Graphiques de dépenses et économies',
				'Alertes de renouvellement automatiques',
				'Rapports personnalisables'
			]
		},
		{
			icon: <FaBrain className="w-8 h-8" />,
			title: 'Comparateur intelligent',
			description: 'Comparez vos contrats avec les meilleures offres du marché.',
			details: [
				'Analyse comparative des garanties',
				'Recommandations personnalisées',
				'Simulation d\'économies potentielles',
				'Évaluation des risques et exclusions',
			]
		}
	];

	const benefits = [
		'Économisez du temps et de l\'argent',
		'Comprenez vos contrats facilement',
		'Ne manquez plus d\'échéances',
		'Obtenez des conseils personnalisés',
	];

	const testimonials = [
		{
			name: 'Marie C.',
			role: 'Consultante',
			content:
				"AssuBot a révolutionné ma gestion d'assurance. Tout est maintenant centralisé et accessible.",
			rating: 5,
		},
		{
			name: 'Jean D.',
			role: "Chef d'entreprise",
			content:
				"Le comparateur m'a fait économiser 400€ par an. L'IA comprend vraiment mes besoins.",
			rating: 5,
		},
		{
			name: 'Sophie M.',
			role: 'Maman de 2 enfants',
			content:
				'Plus jamais de contrats perdus ! Les alertes me rappellent chaque échéance importante.',
			rating: 5,
		},
	];

	// Get credit packs from API
	const { data: creditPacks, isLoading: isLoadingPricing, error: pricingError } = useGetCreditPacksQuery();

	// Transform credit packs to pricing plans format
	const pricingPlans = creditPacks?.map((pack) => ({
		id: pack.id,
		name: pack.name,
		price: `${(pack.priceCents / 100).toFixed(0)}€`,
		period: '/mois',
		description: pack.description,
		features: [
			`${pack.creditAmount} crédits inclus`,
		],
		cta: pack.isFeatured ? 'Choisir ce pack' : 'Commander',
		popular: pack.isFeatured,
		creditAmount: pack.creditAmount,
		priceCents: pack.priceCents
	})) || [];

	return (
		<div className="min-h-screen bg-white">
			{/* Navigation */}
			<nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<img src="/logo.png" alt="AssuBot Logo" className="h-8 w-auto mr-3" />
							<span className="text-xl font-semibold text-gray-900">AssuBot</span>
						</div>

						<div className="hidden md:flex items-center space-x-8">
							<a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
								Fonctionnalités
							</a>
							<a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
								Tarifs
							</a>
							<a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
								Témoignages
							</a>
							<a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
								Contact
							</a>
							<button 
								onClick={() => navigate('/faq')}
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Aide
							</button>
							<button 
								onClick={navigateToApp}
								className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium"
								style={{ backgroundColor: '#1e51ab' }}
							>
								Commencer
							</button>
						</div>

						<div className="md:hidden">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="text-gray-600 hover:text-gray-900"
							>
								<FaBars className="h-6 w-6" />
							</button>
						</div>
					</div>

					{/* Mobile menu */}
					{isMenuOpen && (
						<motion.div
							className="md:hidden border-t border-gray-100"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
						>
							<div className="px-2 pt-2 pb-3 space-y-1">
								<a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
									Fonctionnalités
								</a>
								<a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
									Tarifs
								</a>
								<a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
									Témoignages
								</a>
								<a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
									Contact
								</a>
								<button 
									onClick={() => navigate('/faq')}
									className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
								>
									Aide
								</button>
								<button 
									onClick={navigateToApp}
									className="w-full text-left text-white px-3 py-2 rounded-lg hover:opacity-90 transition-colors font-medium"
									style={{ backgroundColor: '#1e51ab' }}
								>
									Commencer
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
							<motion.h1
						className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Simplifiez vos <span style={{ color: '#1e51ab' }}>assurances</span>, grâce <br /> à
						notre{' '}
						<span style={{ color: '#1e51ab' }}>assistante virtuelle</span>
							</motion.h1>

					<motion.p
						className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						AssuBot centralise tous vos contrats, répond à vos questions et vous aide à faire les
						meilleurs choix d'assurance.
							</motion.p>

							<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
							>
								<button 
									onClick={navigateToApp}
							className="text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-colors shadow-lg flex items-center justify-center"
							style={{ backgroundColor: '#1e51ab' }}
						>
							Commencer gratuitement
							<FaArrowRight className="ml-2 w-4 h-4" />
								</button>
						</motion.div>

					{/* Benefits */}
						<motion.div
						className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						{benefits.map((benefit, index) => (
							<div key={index} className="flex items-center space-x-2">
								<FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
								<span className="text-sm text-gray-600">{benefit}</span>
							</div>
						))}
						</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Une plateforme complète pour tous vos besoins d'assurance
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Découvrez comment AssuBot révolutionne la gestion d'assurance avec des fonctionnalités avancées
						</p>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{features.map((feature, index) => (
							<motion.div
								key={index}
								className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -4 }}
							>
								<div
									className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
									style={{ backgroundColor: '#e6f0ff' }}
								>
									<div style={{ color: '#1e51ab' }}>{feature.icon}</div>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
								<p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
								<ul className="space-y-2">
									{feature.details.map((detail, detailIndex) => (
										<li key={detailIndex} className="flex items-start space-x-2">
											<FaCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
											<span className="text-sm text-gray-600">{detail}</span>
										</li>
									))}
								</ul>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Social Proof */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<p className="text-gray-600 mb-4">Rejoignez des milliers d'utilisateurs satisfaits</p>
						<div className="flex justify-center items-center space-x-8 text-gray-400">
							<div className="flex items-center space-x-1">
								{[...Array(5)].map((_, i) => (
									<FaStar key={i} className="w-5 h-5 text-yellow-400" />
								))}
								<span className="ml-2 text-gray-600 font-medium">4.9/5</span>
							</div>
							<span className="text-gray-400">•</span>
							<span className="text-gray-600">+2,500 utilisateurs</span>
							<span className="text-gray-400">•</span>
							<span className="text-gray-600">98% de satisfaction</span>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Testimonials */}
			<section id="testimonials" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Ce que disent nos utilisateurs
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Découvrez comment AssuBot transforme la gestion d'assurance
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={index}
								className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<div className="flex mb-4">
									{[...Array(testimonial.rating)].map((_, i) => (
										<FaStar key={i} className="w-4 h-4 text-yellow-400" />
									))}
								</div>
								<p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
								<div>
									<p className="font-semibold text-gray-900">{testimonial.name}</p>
									<p className="text-sm text-gray-500">{testimonial.role}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Des tarifs simples et transparents
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Choisissez le plan qui correspond à vos besoins. Pas de frais cachés.
						</p>
					</motion.div>

					{isLoadingPricing ? (
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#1e51ab' }}></div>
						</div>
					) : pricingError ? (
						<div className="text-center py-12">
							<p className="text-red-600 mb-4">Erreur lors du chargement des tarifs</p>
							<button 
								onClick={() => window.location.reload()}
								className="text-blue-600 hover:text-blue-800 underline"
							>
								Réessayer
							</button>
						</div>
					) : pricingPlans.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600">Aucun pack de crédits disponible pour le moment</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{pricingPlans.map((plan, index) => (
								<motion.div
									key={plan.id || index}
									className={`relative bg-white p-8 rounded-xl shadow-sm border-2 transition-all duration-300 ${
										plan.popular
											? 'border-blue-500 shadow-lg scale-105'
											: 'border-gray-100 hover:shadow-md'
									}`}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
								>
									{plan.popular && (
										<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
											<span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
												Populaire
											</span>
										</div>
									)}
									<div className="text-center mb-8">
										<h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
										<div className="flex items-baseline justify-center">
											<span className="text-4xl font-bold text-gray-900">{plan.price}</span>
										</div>
										<p className="text-gray-600 mt-2">{plan.description}</p>
									</div>
									<ul className="space-y-3 mb-8">
										{plan.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-center space-x-3">
												<FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
												<span className="text-gray-600">{feature}</span>
											</li>
										))}
									</ul>
									<button
										onClick={() => navigateToApp()}
										className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
											plan.popular
												? 'text-white hover:opacity-90'
												: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
										}`}
										style={plan.popular ? { backgroundColor: '#1e51ab' } : {}}
									>
										{plan.cta}
									</button>
								</motion.div>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="py-20 bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Contactez-nous
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Une question ? Un projet ? Notre équipe est là pour vous accompagner
						</p>
					</motion.div>

						<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						className="max-w-2xl mx-auto"
						>
							<div className="bg-white p-8 rounded-2xl shadow-lg">
							<h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
									Envoyez-nous un message
								</h3>
							<form onSubmit={handleContactSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
											<input
												type="text"
											name="firstName"
											value={contactForm.firstName}
											onChange={handleContactChange}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
												placeholder="Votre prénom"
											required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
											<input
												type="text"
											name="lastName"
											value={contactForm.lastName}
											onChange={handleContactChange}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
												placeholder="Votre nom"
											required
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
										<input
											type="email"
										name="email"
										value={contactForm.email}
										onChange={handleContactChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
											placeholder="votre.email@exemple.fr"
										required
										/>
									</div>
									<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Entreprise (optionnel)</label>
									<input
										type="text"
										name="company"
										value={contactForm.company}
										onChange={handleContactChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
										placeholder="Nom de votre entreprise"
									/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
										<textarea
										name="message"
										value={contactForm.message}
										onChange={handleContactChange}
											rows={4}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
											placeholder="Décrivez votre demande..."
										required
										></textarea>
									</div>
									<button
										type="submit"
									className="w-full py-3 px-6 rounded-lg font-semibold text-white hover:opacity-90 transition-colors"
									style={{ backgroundColor: '#1e51ab' }}
									>
										Envoyer le message
									</button>
								</form>
							</div>
						</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20" style={{ backgroundColor: '#1e51ab' }}>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<motion.h2
						className="text-3xl font-bold text-white mb-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						Prêt à simplifier vos assurances ?
					</motion.h2>
					<motion.p
						className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						viewport={{ once: true }}
					>
						Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur gestion d'assurance
					</motion.p>
					<motion.button
						onClick={navigateToApp}
						className="bg-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
						style={{ color: '#1e51ab' }}
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Commencer gratuitement
					</motion.button>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-300 py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-5 gap-8">
						<div className="md:col-span-2">
							<div className="flex items-center text-xl font-semibold text-white mb-4">
								<img
									src="/logo.png"
									alt="AssuBot Logo"
									className="h-8 w-auto mr-3 brightness-0 invert"
								/>
								AssuBot
							</div>
							<p className="text-gray-400 text-sm mb-6">
								Développé par À l'amiable - Simplifier les décisions d'assurance grâce à l'IA.
							</p>
							<div className="flex space-x-4">
								<a
									href="https://linkedin.com/company/assubot"
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
								>
									<FaLinkedin className="w-5 h-5" />
								</a>
								<a
									href="https://instagram.com/assubot"
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
								>
									<FaInstagram className="w-5 h-5" />
								</a>
							</div>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Produit</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Fonctionnalités
									</a>
								</li>
								<li>
									<a href="#pricing" className="hover:text-white transition-colors">
										Tarifs
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										API
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Entreprise</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="hover:text-white transition-colors">
										À propos
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Blog
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Carrières
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Support</h3>
							<ul className="space-y-2 text-sm">
														<li>
							<button
								onClick={() => navigate('/faq')}
								className="hover:text-white transition-colors text-left"
							>
										Centre d'aide
							</button>
						</li>
						<li>
							<button
								onClick={() => navigate('/general-terms')}
								className="hover:text-white transition-colors text-left"
							>
										Conditions générales
							</button>
								</li>
								<li>
									<button
										onClick={() => navigate('/general-terms')}
										className="hover:text-white transition-colors text-left"
									>
										Confidentialité
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
						<p>&copy; {new Date().getFullYear()} AssuBot par À l'amiable. Tous droits réservés.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
