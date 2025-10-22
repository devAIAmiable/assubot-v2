import {
  VscBell,
  VscCheck,
  VscFile,
  VscFolder,
  VscGraph,
  VscLightbulb,
  VscLocation,
  VscMail,
  VscMenu,
  VscOrganization,
  VscPieChart,
  VscPlug,
  VscRocket,
  VscShield,
  VscSymbolColor,
  VscTarget,
  VscWarning,
} from 'react-icons/vsc';

// Import new components
import AnimatedHero from './landing/Hero/AnimatedHero';
import InteractiveDemo from './landing/Demo/InteractiveDemo';
import StatsCounter from './landing/Stats/StatsCounter';
import TestimonialCarousel from './landing/Testimonials/TestimonialCarousel';
import { VscRobot } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import { useGetCreditPacksQuery } from '../store/creditPacksApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: creditPacks, isLoading: isLoadingPricing, error: pricingError } = useGetCreditPacksQuery();

  const navigateToApp = () => {
    navigate('/app');
  };

  const features = [
    {
      icon: <VscFolder className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Centralisation des contrats',
      subtitle: "Votre coffre-fort d'assurance personnel",
      description:
        "Téléchargez, stockez et organisez tous vos contrats d'assurance (auto, habitation, santé, etc.) en un seul endroit sécurisé. Extraction automatique des données et alertes de renouvellement.",
    },
    {
      icon: <VscRobot className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Chatbot AssuBot',
      subtitle: "Assistant conversationnel alimenté par l'IA",
      description:
        "Support 24h/24 et 7j/7 pour répondre à vos questions sur l'assurance. Comprend vos clauses complexes et fournit des recommandations personnalisées en langage naturel.",
    },
    {
      icon: <VscGraph className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Dashboard utilisateur',
      subtitle: "Votre situation d'assurance en un coup d'œil",
      description: "Vue d'ensemble visuelle de tous vos contrats, niveaux de couverture, renouvellements à venir et dépenses. Suivi des KPI et intégration avec tous les modules.",
    },
    {
      icon: <VscTarget className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Comparateur intelligent',
      subtitle: 'Comparaison intelligente adaptée à vos besoins',
      description:
        'Compare vos contrats existants avec les offres du marché, pas seulement sur le prix, mais sur la profondeur de couverture, les exclusions, les niveaux de service, etc.',
    },
    {
      icon: <VscBell className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Centre de notifications',
      subtitle: 'Ne manquez jamais un événement important',
      description:
        "Alertes intelligentes pour l'expiration des contrats, de meilleures offres disponibles, et l'exposition aux risques détectée. Notifications configurables multi-canaux.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
      <motion.nav className="bg-white shadow-lg sticky top-0 z-50" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src="/logo.png" alt="AssuBot Logo" className="h-8 w-auto mr-2" />
                <span className="text-2xl font-bold" style={{ color: '#1e51ab' }}>
                  AssuBot
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#1e51ab] transition-colors">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-[#1e51ab] transition-colors">
                Tarifs
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#1e51ab] transition-colors">
                À propos
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[#1e51ab] transition-colors">
                Contact
              </a>
              <button onClick={() => navigate('/faq')} className="text-gray-700 hover:text-[#1e51ab] transition-colors">
                FAQ
              </button>
              <button className="bg-[#1e51ab] text-white px-4 py-2 rounded-lg hover:bg-[#163d82] transition-colors" onClick={navigateToApp}>
                Commencer
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-[#1e51ab]">
                <VscMenu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div className="md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-[#1e51ab]">
                  Fonctionnalités
                </a>
                <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-[#1e51ab]">
                  Tarifs
                </a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#1e51ab]">
                  À propos
                </a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-[#1e51ab]">
                  Contact
                </a>
                <button onClick={() => navigate('/faq')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#1e51ab]">
                  Aide
                </button>
                <button className="w-full text-left bg-[#1e51ab] text-white px-3 py-2 rounded-lg hover:bg-[#163d82] transition-colors" onClick={navigateToApp}>
                  Commencer
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <AnimatedHero navigateToApp={navigateToApp} />

      {/* Features Section - Simple & Clean */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités <span className="text-[#1e51ab]">essentielles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Tout ce dont vous avez besoin pour gérer vos assurances en toute simplicité</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-[#1e51ab] text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>

                <p className="text-[#1e51ab] font-medium mb-4 italic">"{feature.subtitle}"</p>

                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-[#1e51ab] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#163d82] transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateToApp}
            >
              Découvrir toutes les fonctionnalités
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsCounter
        stats={[
          {
            value: 10000,
            suffix: '+',
            label: 'Utilisateurs actifs',
            icon: <VscOrganization />,
            color: 'text-blue-500',
          },
          {
            value: 50000,
            suffix: '+',
            label: 'Contrats analysés',
            icon: <VscShield />,
            color: 'text-green-500',
          },
          {
            value: 2000000,
            suffix: '€',
            label: 'Économies générées',
            icon: <VscSymbolColor />,
            color: 'text-purple-500',
          },
          {
            value: 98,
            suffix: '%',
            label: 'Satisfaction client',
            icon: <VscPieChart />,
            color: 'text-orange-500',
          },
        ]}
      />

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Pricing Section */}
      <motion.section
        id="pricing"
        className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-100 rounded-full opacity-20 blur-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Des tarifs qui ont du sens</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pas de frais cachés, pas de surprises. Vous payez seulement pour ce que vous utilisez, c'est aussi simple que ça.
            </p>
          </motion.div>

          {isLoadingPricing ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab]"></div>
            </div>
          ) : pricingError ? (
            <div className="text-center py-12">
              <p className="text-red-600">Erreur lors du chargement des tarifs</p>
            </div>
          ) : creditPacks && creditPacks.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {creditPacks
                .filter((pack) => pack.isActive)
                .sort((a, b) => a.creditAmount - b.creditAmount)
                .map((pack) => {
                  const price = (pack.priceCents / 100).toFixed(2);
                  const pricePerCredit = (pack.priceCents / pack.creditAmount / 100).toFixed(3);
                  const isFeatured = pack.isFeatured;

                  return (
                    <motion.div
                      key={pack.id}
                      className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                        isFeatured ? 'border-[#1e51ab] scale-105' : 'border-gray-200 hover:border-[#1e51ab]'
                      }`}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      {isFeatured && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-[#1e51ab] text-white px-6 py-2 rounded-full text-sm font-semibold">Populaire</span>
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pack.name}</h3>
                        <p className="text-gray-600 mb-6">{pack.description}</p>

                        <div className="mb-6">
                          <div className="text-4xl font-bold text-[#1e51ab] mb-2">{price}€</div>
                          <div className="text-sm text-gray-500">{pricePerCredit}€ par crédit</div>
                        </div>

                        <div className="mb-8">
                          <div className="text-3xl font-bold text-gray-900 mb-2">{pack.creditAmount}</div>
                          <div className="text-gray-600">Crédits inclus</div>
                        </div>

                        <div className="space-y-3 mb-8 text-left">
                          <div className="flex items-center">
                            <VscCheck className="text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">Accès complet à AssuBot</span>
                          </div>
                          <div className="flex items-center">
                            <VscCheck className="text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">Comparaisons illimitées</span>
                          </div>
                          <div className="flex items-center">
                            <VscCheck className="text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">Support 24/7</span>
                          </div>
                          <div className="flex items-center">
                            <VscCheck className="text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">Stockage sécurisé</span>
                          </div>
                          {pack.creditAmount >= 100 && (
                            <div className="flex items-center">
                              <VscCheck className="text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">Analyses avancées</span>
                            </div>
                          )}
                        </div>

                        <button
                          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                            isFeatured ? 'bg-[#1e51ab] text-white hover:bg-[#163d82]' : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                          onClick={navigateToApp}
                        >
                          Commencer maintenant
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun pack de crédits disponible</p>
            </div>
          )}

          {/* Additional pricing info */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl p-8 shadow-md max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Comment ça marche ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#1e51ab] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Choisissez votre pack</h4>
                  <p className="text-gray-600 text-sm">Sélectionnez le nombre de crédits adapté à vos besoins</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#1e51ab] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Utilisez vos crédits</h4>
                  <p className="text-gray-600 text-sm">Chaque action consomme des crédits selon sa complexité</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#1e51ab] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rechargez si nécessaire</h4>
                  <p className="text-gray-600 text-sm">Achetez de nouveaux crédits à tout moment</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section className="py-20 bg-[#1e51ab]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-4">Ce Que Nos Clients Disent</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">Découvrez comment AssuBot transforme la gestion d'assurance pour des milliers d'utilisateurs</p>
          </motion.div>

          <TestimonialCarousel
            testimonials={[
              {
                id: 1,
                name: 'Marie Charretier',
                role: 'Consultante',
                company: 'Paris',
                avatar: 'MC',
                rating: 5,
                content:
                  'AssuBot a complètement révolutionné ma façon de gérer mes assurances. Le chatbot comprend parfaitement mes questions et me donne des réponses claires. Plus jamais de clauses mystérieuses !',
                color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
              },
              {
                id: 2,
                name: 'Jean Dubois',
                role: "Chef d'entreprise",
                company: 'Lyon',
                avatar: 'JD',
                rating: 5,
                content:
                  "Le comparateur intelligent m'a fait économiser 400€ par an sur mes assurances. Il ne compare pas que les prix mais analyse vraiment la qualité des couvertures. Impressionnant !",
                color: 'bg-gradient-to-br from-green-400 to-blue-500',
              },
              {
                id: 3,
                name: 'Sophie Martin',
                role: 'Maman de 2 enfants',
                company: 'Toulouse',
                avatar: 'SM',
                rating: 5,
                content:
                  "Avec 3 assurances différentes, j'étais perdue. AssuBot centralise tout et m'envoie des alertes avant chaque échéance. Je ne rate plus jamais un renouvellement !",
                color: 'bg-gradient-to-br from-purple-400 to-pink-500',
              },
              {
                id: 4,
                name: 'Antoine Lefebvre',
                role: 'Directeur Financier',
                company: 'Bordeaux',
                avatar: 'AL',
                rating: 5,
                content:
                  "En tant que directeur financier, j'ai testé beaucoup d'outils. AssuBot est de loin la solution la plus intuitive et complète que j'aie utilisée. L'IA comprend vraiment le contexte de l'assurance française.",
                color: 'bg-gradient-to-br from-blue-400 to-indigo-600',
              },
            ]}
          />
        </div>
      </motion.section>

      {/* Roadmap Section */}
      <motion.section
        className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-white/10" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Feuille de route 2024-2025
            </motion.div>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              L'avenir de l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">assurance</span> vous attend
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">Découvrez les modules à venir qui révolutionneront encore plus votre expérience d'assurance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <VscWarning className="text-4xl mb-4 text-yellow-400" />,
                title: 'e-Risk',
                desc: 'Scoring de risque personnalisé et conseils',
                status: 'Q2 2024',
                gradient: 'from-yellow-500/20 to-orange-500/20',
                borderColor: 'border-yellow-400/30',
              },
              {
                icon: <VscFile className="text-4xl mb-4 text-green-400" />,
                title: 'e-Souscription',
                desc: 'Souscription ou changement direct de police',
                status: 'Q3 2024',
                gradient: 'from-green-500/20 to-emerald-500/20',
                borderColor: 'border-green-400/30',
              },
              {
                icon: <VscGraph className="text-4xl mb-4 text-blue-400" />,
                title: 'Analytics & Insights',
                desc: 'Pour les assureurs',
                status: 'Q4 2024',
                gradient: 'from-blue-500/20 to-cyan-500/20',
                borderColor: 'border-blue-400/30',
              },
              {
                icon: <VscPlug className="text-4xl mb-4 text-purple-400" />,
                title: 'Open API',
                desc: 'Pour les courtiers ou clients B2B',
                status: 'Q1 2025',
                gradient: 'from-purple-500/20 to-pink-500/20',
                borderColor: 'border-purple-400/30',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border ${item.borderColor} hover:bg-white/20 transition-all duration-300 group`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <motion.div className="mb-6" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    {item.icon}
                  </motion.div>

                  <div className="mb-4">
                    <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">{item.status}</span>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  </div>

                  <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>

                  {/* Progress indicator */}
                  <div className="mt-6">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${item.gradient}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(index + 1) * 25}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>

          {/* Timeline connector */}
          <motion.div
            className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            viewport={{ once: true }}
          />
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-white via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: '3s' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <motion.div
              className="inline-flex items-center gap-2 bg-[#1e51ab] text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Notre histoire
            </motion.div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              À Propos d'<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e51ab] to-purple-600">AssuBot</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">Découvrez l'histoire et la vision derrière la révolution de l'assurance numérique</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Développé par À l'amiable</h3>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    AssuBot est né de la frustration de voir tant de personnes perdues dans le labyrinthe de leurs contrats d'assurance. Chez À l'amiable, nous croyons que la
                    technologie doit servir à simplifier la vie, pas à la compliquer.
                  </p>
                  <p className="text-lg">
                    Notre équipe d'experts en assurance et d'ingénieurs en IA a créé une plateforme qui comprend vraiment vos besoins et parle votre langue. Fini le jargon
                    incompréhensible et les comparaisons superficielles.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-[#1e51ab] mb-2">2024</div>
                  <div className="text-gray-600 font-medium">Année de création</div>
                </motion.div>
                <motion.div
                  className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold text-[#1e51ab] mb-2">15+</div>
                  <div className="text-gray-600 font-medium">Experts dédiés</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-8">
              <motion.div
                className="bg-gradient-to-br from-[#1e51ab] to-blue-600 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold mb-4 flex items-center">
                    <VscTarget className="mr-3 text-yellow-400" /> Notre Mission
                  </h4>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Démocratiser l'accès à une assurance transparente et faire de chaque utilisateur un expert de sa propre couverture.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-full -translate-y-12 translate-x-12 opacity-30" />
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <VscRocket className="mr-3 text-[#1e51ab]" /> Notre Vision
                  </h4>
                  <p className="text-gray-600 text-lg leading-relaxed">Un monde où choisir et gérer ses assurances est aussi simple que commander un café en ligne.</p>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-3xl shadow-xl border border-blue-200 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full -translate-y-10 translate-x-10 opacity-40" />
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <VscLightbulb className="mr-3 text-[#1e51ab]" /> Nos Valeurs
                  </h4>
                  <p className="text-gray-600 text-lg leading-relaxed">Transparence, simplicité et innovation au service de votre tranquillité d'esprit.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-white/10" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Nous sommes là pour vous
            </motion.div>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Contactez-nous</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Une question ? Un projet ? Notre équipe est là pour vous accompagner dans votre transformation digitale
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-8">
              {/* Contact methods */}
              <div className="space-y-6">
                <motion.div
                  className="flex items-start space-x-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl">
                    <VscMail />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Email</h3>
                    <p className="text-blue-100 mb-1">contact@assubot.fr</p>
                    <p className="text-blue-100">support@assubot.fr</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl">
                    <span className="text-lg font-bold">📞</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Téléphone</h3>
                    <p className="text-blue-100 mb-1">+33 1 23 45 67 89</p>
                    <p className="text-blue-200 text-sm">Lundi - Vendredi, 9h - 18h</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-xl">
                    <VscLocation />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Adresse</h3>
                    <p className="text-blue-100 mb-1">123 Avenue de l'Innovation</p>
                    <p className="text-blue-100">75001 Paris, France</p>
                  </div>
                </motion.div>
              </div>

              {/* Chatbot CTA */}
              <motion.div
                className="bg-gradient-to-br from-[#1e51ab] to-blue-600 text-white p-8 rounded-3xl relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <VscRobot className="mr-3 text-yellow-400" /> Besoin d'aide immédiate ?
                  </h3>
                  <p className="text-blue-100 mb-6 text-lg leading-relaxed">Notre chatbot AssuBot est disponible 24h/24 pour répondre à vos questions.</p>
                  <motion.button
                    className="bg-white text-[#1e51ab] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Parler à AssuBot
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full -translate-y-12 translate-x-12 opacity-20" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-8">Envoyez-nous un message</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">Prénom</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">Nom</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                        placeholder="votre.email@exemple.fr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-2">Sujet</label>
                      <select className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors">
                        <option>Question générale</option>
                        <option>Support technique</option>
                        <option>Partenariat</option>
                        <option>Demande de démo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-2">Message</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                        placeholder="Décrivez votre demande..."
                      ></textarea>
                    </div>
                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#1e51ab] to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Envoyer le message
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section className="py-20 bg-gray-900" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Prêt à Transformer Votre Expérience d'Assurance ?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Rejoignez des milliers d'utilisateurs qui ont déjà simplifié leur gestion d'assurance avec AssuBot
          </motion.p>
          <motion.button
            className="bg-[#1e51ab] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#163d82] transition-colors shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateToApp}
          >
            Commencer Aujourd'hui
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center text-2xl font-bold text-white mb-4">
                <img src="/logo.png" alt="AssuBot Logo" className="h-8 w-auto mr-2 brightness-0 invert" />
                AssuBot
              </div>
              <p className="text-gray-400">Développé par À l'amiable - Simplifier les décisions d'assurance grâce à l'IA et à l'automatisation.</p>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/company/assubot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span className="text-sm font-bold">in</span>
                </a>
                <a
                  href="https://instagram.com/assubot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span className="text-sm font-bold">ig</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Plateforme</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Gestion des Contrats
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chatbot IA
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Comparaison Intelligente
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    À Propos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carrières
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors text-left">
                    Centre d'Aide
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/general-terms')} className="hover:text-white transition-colors text-left">
                    Conditions Générales
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation API
                  </a>
                </li>
                <li>
                  <button onClick={() => navigate('/general-terms')} className="hover:text-white transition-colors text-left">
                    Politique de Confidentialité
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2024 AssuBot par À l'amiable. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
