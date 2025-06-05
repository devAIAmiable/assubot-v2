import './App.css'

import { motion } from 'framer-motion'
import { useState } from 'react'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: "📁",
      title: "Centralisation des contrats",
      subtitle: "Votre coffre-fort d'assurance personnel",
      description: "Téléchargez, stockez et organisez tous vos contrats d'assurance (auto, habitation, santé, etc.) en un seul endroit sécurisé. Extraction automatique des données et alertes de renouvellement."
    },
    {
      icon: "💬",
      title: "Chatbot AssuBot",
      subtitle: "Assistant conversationnel alimenté par l'IA",
      description: "Support 24h/24 et 7j/7 pour répondre à vos questions sur l'assurance. Comprend vos clauses complexes et fournit des recommandations personnalisées en langage naturel."
    },
    {
      icon: "📊",
      title: "Dashboard utilisateur",
      subtitle: "Votre situation d'assurance en un coup d'œil",
      description: "Vue d'ensemble visuelle de tous vos contrats, niveaux de couverture, renouvellements à venir et dépenses. Suivi des KPI et intégration avec tous les modules."
    },
    {
      icon: "🧠",
      title: "Comparateur intelligent",
      subtitle: "Comparaison intelligente adaptée à vos besoins",
      description: "Compare vos contrats existants avec les offres du marché, pas seulement sur le prix, mais sur la profondeur de couverture, les exclusions, les niveaux de service, etc."
    },
    {
      icon: "📣",
      title: "Centre de notifications",
      subtitle: "Ne manquez jamais un événement important",
      description: "Alertes intelligentes pour l'expiration des contrats, de meilleures offres disponibles, et l'exposition aux risques détectée. Notifications configurables multi-canaux."
    },
    {
      icon: "👤",
      title: "Profil utilisateur",
      subtitle: "Expérience personnalisée",
      description: "Stocke vos préférences, votre historique d'assurance et vos informations personnelles pour une expérience vraiment personnalisée dans tous les modules."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
      <motion.nav 
        className="bg-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src="/logo.png" alt="AssuBot Logo" className="h-8 w-auto mr-2" />
                <span className="text-2xl font-bold" style={{ color: '#1e51ab' }}>AssuBot</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#1e51ab] transition-colors">Fonctionnalités</a>
              <a href="#about" className="text-gray-700 hover:text-[#1e51ab] transition-colors">À propos</a>
              <a href="#contact" className="text-gray-700 hover:text-[#1e51ab] transition-colors">Contact</a>
              <button className="bg-[#1e51ab] text-white px-4 py-2 rounded-lg hover:bg-[#163d82] transition-colors">
                Commencer
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#1e51ab]"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-[#1e51ab]">Fonctionnalités</a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#1e51ab]">À propos</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-[#1e51ab]">Contact</a>
                <button className="w-full text-left bg-[#1e51ab] text-white px-3 py-2 rounded-lg hover:bg-[#163d82] transition-colors">
                  Commencer
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                variants={itemVariants}
              >
                Simplifiez vos <span className="text-[#1e51ab]">Assurances</span> avec l'IA
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-3xl"
                variants={itemVariants}
              >
                AssuBot est une plateforme numérique qui vous aide à mieux comprendre, gérer et optimiser 
                votre couverture d'assurance grâce à l'automatisation alimentée par l'IA et des interfaces conviviales.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={itemVariants}
              >
                <button className="bg-[#1e51ab] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#163d82] transition-colors shadow-lg">
                  Commencer la gestion
                </button>
                <button className="border-2 border-[#1e51ab] text-[#1e51ab] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                  Voir la démo
                </button>
              </motion.div>
            </motion.div>
            
            {/* Contract illustration */}
            <motion.div 
              className="relative flex justify-center items-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img 
                src="/illustrations/contract_illustration.svg" 
                alt="Gestion des contrats d'assurance" 
                className="w-full h-auto max-w-lg drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Puissantes pour une Gestion Intelligente
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme modulaire offre tout ce dont vous avez besoin pour prendre le contrôle de votre portefeuille d'assurance
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-[#1e51ab] font-medium mb-3 italic">"{feature.subtitle}"</p>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <motion.section 
        className="py-20 bg-[#1e51ab]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ce Que Nos Clients Disent
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Découvrez comment AssuBot transforme la gestion d'assurance pour des milliers d'utilisateurs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur rounded-xl p-8 text-white"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  MC
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Marie Charretier</h4>
                  <p className="text-blue-200 text-sm">Consultante, Paris</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-blue-100 leading-relaxed">
                "AssuBot a complètement révolutionné ma façon de gérer mes assurances. Le chatbot comprend parfaitement mes questions et me donne des réponses claires. Plus jamais de clauses mystérieuses !"
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur rounded-xl p-8 text-white"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  JD
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Jean Dubois</h4>
                  <p className="text-blue-200 text-sm">Chef d'entreprise, Lyon</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-blue-100 leading-relaxed">
                "Le comparateur intelligent m'a fait économiser 400€ par an sur mes assurances. Il ne compare pas que les prix mais analyse vraiment la qualité des couvertures. Impressionnant !"
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur rounded-xl p-8 text-white"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  SM
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Sophie Martin</h4>
                  <p className="text-blue-200 text-sm">Maman de 2 enfants, Toulouse</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-blue-100 leading-relaxed">
                "Avec 3 assurances différentes, j'étais perdue. AssuBot centralise tout et m'envoie des alertes avant chaque échéance. Je ne rate plus jamais un renouvellement !"
              </p>
            </motion.div>
          </motion.div>

          {/* Additional testimonial highlight */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  AL
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-xl text-white">Antoine Lefebvre</h4>
                  <p className="text-blue-200">Directeur Financier, Bordeaux</p>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>
              <p className="text-blue-100 text-lg leading-relaxed italic">
                "En tant que directeur financier, j'ai testé beaucoup d'outils. AssuBot est de loin la solution la plus intuitive et complète que j'aie utilisée. L'IA comprend vraiment le contexte de l'assurance française."
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Roadmap Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Feuille de Route
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les modules à venir qui révolutionneront encore plus votre expérience d'assurance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚠️", title: "e-Risk", desc: "Scoring de risque personnalisé et conseils" },
              { icon: "📝", title: "e-Souscription", desc: "Souscription ou changement direct de police" },
              { icon: "📈", title: "Analytics & Insights", desc: "Pour les assureurs" },
              { icon: "🔌", title: "Open API", desc: "Pour les courtiers ou clients B2B" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

             {/* About Section */}
       <section id="about" className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             className="text-center mb-16"
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
           >
             <h2 className="text-4xl font-bold text-gray-900 mb-4">
               À Propos d'AssuBot
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Découvrez l'histoire et la vision derrière la révolution de l'assurance numérique
             </p>
           </motion.div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
               <h3 className="text-2xl font-bold text-gray-900 mb-6">
                 Développé par À l'amiable
               </h3>
               <p className="text-gray-600 mb-6 leading-relaxed">
                 AssuBot est né de la frustration de voir tant de personnes perdues dans le labyrinthe 
                 de leurs contrats d'assurance. Chez À l'amiable, nous croyons que la technologie doit 
                 servir à simplifier la vie, pas à la compliquer.
               </p>
               <p className="text-gray-600 mb-6 leading-relaxed">
                 Notre équipe d'experts en assurance et d'ingénieurs en IA a créé une plateforme qui 
                 comprend vraiment vos besoins et parle votre langue. Fini le jargon incompréhensible 
                 et les comparaisons superficielles.
               </p>
               <div className="grid grid-cols-2 gap-6">
                 <div className="text-center p-4 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-[#1e51ab] mb-2">2024</div>
                   <div className="text-gray-600">Année de création</div>
                 </div>
                 <div className="text-center p-4 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-[#1e51ab] mb-2">15+</div>
                   <div className="text-gray-600">Experts dédiés</div>
                 </div>
               </div>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="space-y-6"
             >
               <div className="bg-[#1e51ab] text-white p-6 rounded-xl">
                 <h4 className="text-xl font-semibold mb-3">🎯 Notre Mission</h4>
                 <p>
                   Démocratiser l'accès à une assurance transparente et faire de chaque utilisateur 
                   un expert de sa propre couverture.
                 </p>
               </div>
               <div className="bg-gray-50 p-6 rounded-xl">
                 <h4 className="text-xl font-semibold text-gray-900 mb-3">🚀 Notre Vision</h4>
                 <p className="text-gray-600">
                   Un monde où choisir et gérer ses assurances est aussi simple que commander 
                   un café en ligne.
                 </p>
               </div>
               <div className="bg-blue-50 p-6 rounded-xl">
                 <h4 className="text-xl font-semibold text-gray-900 mb-3">💡 Nos Valeurs</h4>
                 <p className="text-gray-600">
                   Transparence, simplicité et innovation au service de votre tranquillité d'esprit.
                 </p>
               </div>
             </motion.div>
           </div>
         </div>
       </section>

       {/* Contact Section */}
       <section id="contact" className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             className="text-center mb-16"
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
           >
             <h2 className="text-4xl font-bold text-gray-900 mb-4">
               Contactez-Nous
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Une question ? Un projet ? Notre équipe est là pour vous accompagner
             </p>
           </motion.div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="space-y-8"
             >
               <div className="flex items-start space-x-4">
                 <div className="w-12 h-12 bg-[#1e51ab] rounded-lg flex items-center justify-center text-white">
                   📧
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                   <p className="text-gray-600">contact@assubot.fr</p>
                   <p className="text-gray-600">support@assubot.fr</p>
                 </div>
               </div>

               <div className="flex items-start space-x-4">
                 <div className="w-12 h-12 bg-[#1e51ab] rounded-lg flex items-center justify-center text-white">
                   📞
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
                   <p className="text-gray-600">+33 1 23 45 67 89</p>
                   <p className="text-gray-500 text-sm">Lundi - Vendredi, 9h - 18h</p>
                 </div>
               </div>

               <div className="flex items-start space-x-4">
                 <div className="w-12 h-12 bg-[#1e51ab] rounded-lg flex items-center justify-center text-white">
                   📍
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse</h3>
                   <p className="text-gray-600">123 Avenue de l'Innovation</p>
                   <p className="text-gray-600">75001 Paris, France</p>
                 </div>
               </div>

               <div className="bg-[#1e51ab] text-white p-6 rounded-xl">
                 <h3 className="text-lg font-semibold mb-3">🤖 Besoin d'aide immédiate ?</h3>
                 <p className="mb-4">
                   Notre chatbot AssuBot est disponible 24h/24 pour répondre à vos questions.
                 </p>
                 <button className="bg-white text-[#1e51ab] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                   Parler à AssuBot
                 </button>
               </div>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
             >
               <div className="bg-white p-8 rounded-2xl shadow-lg">
                 <h3 className="text-2xl font-semibold text-gray-900 mb-6">Envoyez-nous un message</h3>
                 <form className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                       <input 
                         type="text" 
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
                         placeholder="Votre prénom"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                       <input 
                         type="text" 
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
                         placeholder="Votre nom"
                       />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                     <input 
                       type="email" 
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
                       placeholder="votre.email@exemple.fr"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                     <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors">
                       <option>Question générale</option>
                       <option>Support technique</option>
                       <option>Partenariat</option>
                       <option>Demande de démo</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                     <textarea 
                       rows={4}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e51ab] focus:border-transparent transition-colors"
                       placeholder="Décrivez votre demande..."
                     ></textarea>
                   </div>
                   <button 
                     type="submit"
                     className="w-full bg-[#1e51ab] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#163d82] transition-colors"
                   >
                     Envoyer le message
                   </button>
                 </form>
               </div>
             </motion.div>
           </div>
         </div>
       </section>

       {/* CTA Section */}
       <motion.section 
         className="py-20 bg-gray-900"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ duration: 0.8 }}
         viewport={{ once: true }}
       >
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
              <p className="text-gray-400">
                Développé par À l'amiable - Simplifier les décisions d'assurance grâce à l'IA et à l'automatisation.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Plateforme</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Gestion des Contrats</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chatbot IA</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comparaison Intelligente</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">À Propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'Aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2024 AssuBot par À l'amiable. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
