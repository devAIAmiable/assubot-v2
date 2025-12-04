import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { FaArrowRight, FaBell, FaBrain, FaCalendarAlt, FaChartLine, FaChartPie, FaExclamationTriangle, FaFileContract, FaLightbulb } from 'react-icons/fa';
import { StatCard, StatsGrid } from './ui';
import { getContractPremium, getContractType } from '../utils/contractAdapters';

import type { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { SmartSuggestionCard } from './suggestions/SmartSuggestionCard';
import { VscRobot } from 'react-icons/vsc';
import { getProfessionalCategoryLabel } from '../utils/user';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Category configuration for insurance types
const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  auto: { label: 'Automobile', color: '#3b82f6' },
  health: { label: 'Santé', color: '#ef4444' },
  home: { label: 'Habitation', color: '#10b981' },
  moto: { label: 'Moto', color: '#f59e0b' },
  electronic_devices: { label: 'Appareils électroniques', color: '#8b5cf6' },
  loan: { label: 'Prêt', color: '#ec4899' },
  travel: { label: 'Voyage', color: '#06b6d4' },
  life: { label: 'Vie', color: '#14b8a6' },
  professional: { label: 'Professionnelle', color: '#6366f1' },
  legal: { label: 'Juridique', color: '#a855f7' },
  agriculture: { label: 'Agricole', color: '#84cc16' },
  event: { label: 'Événement', color: '#f97316' },
  pet: { label: 'Animaux', color: '#fb923c' },
  other: { label: 'Autre', color: '#6b7280' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const contracts = useAppSelector((state) => state.contracts?.contracts || []);
  const user = useAppSelector((state) => state.user?.currentUser);
  const { dashboardStats, isLoading, error } = useDashboardStats();
  const isAdmin = useIsAdmin() && user?.email === 'mario.gbokede@a-lamiable.com';

  const handleNavigateToModule = (module: string) => {
    navigate(`/app/${module}`);
  };

  // Use dashboard stats from API if available, fallback to local calculation
  const contractStats = {
    active: dashboardStats?.availableContracts || contracts.filter((c) => c.status === 'active').length,
    total: contracts.length,
    expiring:
      dashboardStats?.expiringSoonContracts ||
      contracts.filter((c) => {
        if (!c.endDate) return false;
        const endDate = new Date(c.endDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
      }).length,
    monthlyPremium: dashboardStats?.monthlyPremiumCents
      ? dashboardStats.monthlyPremiumCents / 100
      : contracts.filter((c) => c.status === 'active').reduce((sum: number, c) => sum + getContractPremium(c) / 12, 0),
  };

  // Calculate insurance budget from API data if available, otherwise from Redux contracts data
  const insuranceBudget = dashboardStats?.categoryBreakdown
    ? Object.entries(dashboardStats.categoryBreakdown).map(([category, data]) => {
        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
        return {
          type: config.label,
          amount: data.totalAnnualCostCents / 100,
          color: config.color,
          percentage: data.percentage,
        };
      })
    : [
        {
          type: 'Santé',
          amount: contracts.filter((c) => getContractType(c) === 'sante' && c.status === 'active').reduce((sum: number, c) => sum + getContractPremium(c), 0),
          color: '#ef4444',
          percentage: 0,
        },
        {
          type: 'Automobile',
          amount: contracts.filter((c) => getContractType(c) === 'auto' && c.status === 'active').reduce((sum: number, c) => sum + getContractPremium(c), 0),
          color: '#3b82f6',
          percentage: 0,
        },
        {
          type: 'Habitation',
          amount: contracts.filter((c) => getContractType(c) === 'habitation' && c.status === 'active').reduce((sum: number, c) => sum + getContractPremium(c), 0),
          color: '#10b981',
          percentage: 0,
        },
      ];

  const totalAnnual = dashboardStats?.totalAnnualCostCents ? dashboardStats.totalAnnualCostCents / 100 : insuranceBudget.reduce((sum, item) => sum + item.amount, 0);

  // Calculate percentages if not provided by API
  if (!dashboardStats?.categoryBreakdown) {
    insuranceBudget.forEach((item) => {
      item.percentage = totalAnnual > 0 ? Math.round((item.amount / totalAnnual) * 100) : 0;
    });
  }

  // Chart.js data configuration
  const chartData = {
    labels: insuranceBudget.map((item) => item.type),
    datasets: [
      {
        data: insuranceBudget.map((item) => item.amount),
        backgroundColor: insuranceBudget.map((item) => item.color),
        borderColor: insuranceBudget.map((item) => item.color),
        borderWidth: 2,
        hoverOffset: 8,
        hoverBorderWidth: 3,
      },
    ],
  };

  // Chart.js options
  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = totalAnnual > 0 ? ((value / totalAnnual) * 100).toFixed(1) : '0';
            return `${label}: ${value.toLocaleString()}€ (${percentage}%)`;
          },
        },
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'point',
    },
  };

  const quickActions = [
    {
      title: 'Gérer mes contrats',
      description: "Centralisez et organisez tous vos contrats d'assurance",
      icon: FaFileContract,
      module: 'contracts',
      color: 'bg-blue-50 text-[#1e51ab]',
      borderColor: 'border-blue-200',
    },
    {
      title: "Parler à AI'A",
      description: "Posez vos questions sur l'assurance",
      icon: VscRobot,
      module: 'chatbot',
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Comparer les offres',
      description: 'Trouvez les meilleures offres adaptées à vos besoins',
      icon: FaBrain,
      module: 'comparateur',
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Voir les notifications',
      description: 'Restez informé des échéances et opportunités',
      icon: FaBell,
      module: 'notifications',
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-200',
    },
  ];

  // Calculate dashboard stats from contracts
  // const contractStats = useDashboardStats(); // This line is removed as per the edit hint

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          {(() => {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
            return `${greeting} ${user?.firstName || 'Utilisateur'} ! Voici un aperçu de votre situation d'assurance.`;
          })()}
        </p>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des statistiques...</p>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Réessayer
          </button>
        </motion.div>
      )}

      {/* Dashboard Content - Only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Stats Cards */}
          <StatsGrid>
            <StatCard label="Total des contrats" value={contractStats.active} type="total-contracts" />
            <StatCard label="Dépenses mensuelles" value={`${contractStats.monthlyPremium.toFixed(0)}€`} type="monthly-premium" />
            <StatCard label="Dépenses annuelles" value={`${totalAnnual.toLocaleString()}€`} type="annual-premium" />
            <StatCard
              label="Expire Bientôt"
              value={contractStats.expiring}
              type="expiring-contracts"
              valueColor="text-amber-600"
              footer={
                <div className="flex items-center text-sm">
                  <FaCalendarAlt className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-amber-600 font-medium">Dans moins de 60 jours</span>
                </div>
              }
            />
          </StatsGrid>

          {/* Insurance Budget Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Répartition du budget assurance</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-2xl font-bold text-gray-900">{totalAnnual.toLocaleString()}€</p>
                    <p className="text-gray-600">Budget annuel total</p>
                  </div>

                  {/* Chart.js Pie Chart */}
                  <div className="h-80 flex items-center justify-center">
                    {totalAnnual > 0 ? (
                      <Pie data={chartData} options={chartOptions} />
                    ) : (
                      <div className="text-center text-gray-500">
                        <FaChartPie className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p>Aucune donnée de budget disponible</p>
                      </div>
                    )}
                  </div>

                  {/* Custom Legend */}
                  {totalAnnual > 0 && (
                    <div className="flex justify-center space-x-6 mt-4">
                      {insuranceBudget
                        .filter((item) => item.amount > 0)
                        .map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm font-medium text-gray-700">{item.type}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Legend and Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Par produit d'assurance</h3>
                  {insuranceBudget
                    .filter((item) => item.amount > 0)
                    .map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                          <div>
                            <p className="font-medium text-gray-900">{item.type}</p>
                            <p className="text-sm text-gray-600">{(item.amount / 12).toFixed(2)}€/mois</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{item.amount.toLocaleString()}€</p>
                          <p className="text-sm text-gray-600">{item.percentage}% du total</p>
                        </div>
                      </motion.div>
                    ))}

                  {totalAnnual === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>Aucun contrat actif trouvé</p>
                      <button onClick={() => handleNavigateToModule('contracts')} className="mt-4 text-[#1e51ab] hover:text-[#163d82] font-medium">
                        Ajouter vos premiers contrats
                      </button>
                    </div>
                  )}

                  {/* {totalAnnual > 0 && (
								<motion.div
									className="mt-6 p-4 bg-blue-50 rounded-xl"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 1 }}
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-900">Potentiel d'économie</p>
											<p className="text-sm text-gray-600">Avec une optimisation des contrats</p>
										</div>
										<div className="text-right">
											<p className="font-bold text-green-600">-324€</p>
											<p className="text-sm text-gray-600">par an</p>
										</div>
									</div>
								</motion.div>
							)} */}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Smart Suggestions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaLightbulb className="h-6 w-6 text-yellow-500 mr-3" />
                Suggestions intelligentes
              </h2>
              <span className="text-sm text-gray-500">
                Adaptées à ton profil
                {user?.professionalCategory ? ` (${getProfessionalCategoryLabel(user.professionalCategory)})` : ''}
              </span>
            </div>
            {isAdmin ? (
              <SmartSuggestionCard
                title="Optimiser l’assurance Auto"
                description='Doublon détecté : Vous êtes assuré deux fois pour le même véhicule en tant que conducteur principal dans le contrat "Mon Auto 1" et secondaire dans "Mon Auto 2". Vous pourriez conserver "Mon Auto 2" si vous êtes deux utilisateurs du même véhicule.'
                ctaLabel="Conserver Mon Auto 2"
                onCtaClick={() => handleNavigateToModule('contracts')}
                badgeLabel="Suggestion intelligente"
                Icon={FaExclamationTriangle}
                accentColor="#f59e0b"
              />
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <FaLightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune suggestion pour le moment</h3>
                <p className="text-gray-500 mb-6">AI'A analyse ton profil pour te proposer des recommandations personnalisées</p>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.module}
                    onClick={() => handleNavigateToModule(action.module)}
                    className={`text-left p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white ${action.borderColor}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{action.description}</p>
                    <div className="flex items-center text-[#1e51ab] text-sm font-medium">
                      <span>Accéder</span>
                      <FaArrowRight className="h-3 w-3 ml-2" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité récente</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="text-center py-12">
                <FaChartLine className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune activité récente</h3>
                <p className="text-sm text-gray-500">Vos dernières activités apparaîtront ici</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => handleNavigateToModule('notifications')} className="w-full text-center text-[#1e51ab] hover:text-[#163d82] font-medium text-sm">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
