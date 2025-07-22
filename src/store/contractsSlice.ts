import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface Contract {
	id: string;
	name: string;
	insurer: string;
	type: 'auto' | 'habitation' | 'sante' | 'autre';
	premium: number;
	startDate: string;
	endDate: string;
	status: 'active' | 'expired' | 'pending';
	description?: string;
	coverageAmount?: number;
	deductible?: number;
	documents?: {
		name: string;
		url: string;
		uploadDate: string;
	}[];
	// Contract overview and basic details
	overview: {
		startDate: string;
		endDate: string;
		annualPremium: string;
		hasTacitRenewal: boolean;
		tacitRenewalDeadline: string;
		planType: string;
		subscribedCoverages: string[];
	};
	// Detailed coverage information
	coverages: {
		name: string;
		details: {
			service: string;
			limit: string;
			deductible: string;
			restrictions: string;
			coveredItems: string[];
			excludedItems: string[];
		}[];
		coveredItems: string[];
		excludedItems: string[];
	}[];
	// General exclusions
	generalExclusions: string[];
	// Geographic coverage
	geographicCoverage: {
		countries: string[];
	};
	// Policyholder obligations
	obligations: {
		atSubscription: string[];
		duringContract: string[];
		inCaseOfClaim: string[];
	};
	// Cancellation information
	cancellation: {
		procedures: string;
		deadlines: string;
		usefulContacts: string[];
	};
	// Contact information
	contacts: {
		contractManagement: {
			name: string;
			phone: string;
			email: string;
			hours: string;
		};
		assistance: {
			name: string;
			phone: string;
			email: string;
			availability: string;
		};
		emergency: {
			name: string;
			phone: string;
			email: string;
			availability: string;
		};
	};
}

interface ContractsState {
	contracts: Contract[];
	loading: boolean;
	error: string | null;
	searchQuery: string;
	selectedType: string;
	selectedStatus: string;
}

const initialState: ContractsState = {
	contracts: [
		{
			id: '1',
			name: 'Assurance Auto Citroën C3',
			insurer: 'MAIF',
			type: 'auto',
			premium: 549.6,
			startDate: '2024-01-15',
			endDate: '2025-01-15',
			status: 'active',
			description: 'Assurance tous risques pour Citroën C3',
			coverageAmount: 20000,
			deductible: 500,
			documents: [
				{
					name: 'Contrat_Auto_MAIF_2024.pdf',
					url: '/documents/contrat_auto_maif.pdf',
					uploadDate: '2024-01-15',
				},
			],
			overview: {
				startDate: '15/01/2024',
				endDate: '15/01/2025',
				annualPremium: '549,60€',
				hasTacitRenewal: true,
				tacitRenewalDeadline: '15/12/2024',
				planType: 'Tous Risques',
				subscribedCoverages: ['Responsabilité civile', 'Défense et recours', 'Vol', 'Incendie', 'Bris de glace', 'Assistance 0km']
			},
			coverages: [
				{
					name: 'Responsabilité civile',
					details: [
						{
							service: 'Dommages corporels',
							limit: 'Illimité',
							deductible: '0€',
							restrictions: 'Aucune',
							coveredItems: ['Blessures causées à des tiers', 'Décès causés à des tiers'],
							excludedItems: ['Dommages au conducteur', 'Dommages aux passagers']
						},
						{
							service: 'Dommages matériels',
							limit: 'Illimité',
							deductible: '0€',
							restrictions: 'Aucune',
							coveredItems: ['Dommages aux véhicules tiers', 'Dommages aux biens tiers'],
							excludedItems: ['Dommages à votre véhicule']
						}
					],
					coveredItems: ['Dommages causés à des tiers', 'Défense en cas de poursuite'],
					excludedItems: ['Dommages à votre véhicule', 'Dommages au conducteur']
				},
				{
					name: 'Vol et incendie',
					details: [
						{
							service: 'Vol du véhicule',
							limit: 'Valeur à neuf',
							deductible: '500€',
							restrictions: 'Valeur du véhicule',
							coveredItems: ['Vol total du véhicule', 'Vol des accessoires'],
							excludedItems: ['Vol d\'objets personnels', 'Vol sans effraction']
						}
					],
					coveredItems: ['Vol total', 'Incendie', 'Explosion'],
					excludedItems: ['Vol partiel', 'Vol d\'accessoires non déclarés']
				}
			],
			generalExclusions: [
				'Conduite en état d\'ivresse',
				'Conduite sans permis',
				'Utilisation du véhicule à des fins commerciales non déclarées',
				'Dommages causés intentionnellement'
			],
			geographicCoverage: {
				countries: ['France', 'Union Européenne', 'Suisse', 'Norvège', 'Islande', 'Liechtenstein']
			},
			obligations: {
				atSubscription: [
					'Déclarer tous les conducteurs',
					'Fournir les informations exactes sur le véhicule',
					'Signer le contrat'
				],
				duringContract: [
					'Payer les primes à échéance',
					'Déclarer tout changement de situation',
					'Maintenir le véhicule en bon état'
				],
				inCaseOfClaim: [
					'Déclarer le sinistre sous 5 jours',
					'Ne pas reconnaître de responsabilité',
					'Conserver les preuves'
				]
			},
			cancellation: {
				procedures: 'Lettre recommandée avec AR ou en ligne sur le site MAIF',
				deadlines: '2 mois avant la date d\'échéance',
				usefulContacts: ['Service client MAIF', 'Agence locale', 'Site web MAIF']
			},
			contacts: {
				contractManagement: {
					name: 'Service Client MAIF',
					phone: '0892 70 70 70',
					email: 'contact@maif.fr',
					hours: 'Lun-Ven 8h-19h, Sam 9h-17h'
				},
				assistance: {
					name: 'Assistance MAIF',
					phone: '0892 70 70 70',
					email: 'assistance@maif.fr',
					availability: '24h/24 et 7j/7'
				},
				emergency: {
					name: 'Urgences MAIF',
					phone: '0800 00 00 00',
					email: 'urgences@maif.fr',
					availability: '24h/24 et 7j/7'
				}
			}
		},
		{
			id: '2',
			name: 'Assurance Habitation',
			insurer: 'Groupama',
			type: 'habitation',
			premium: 390,
			startDate: '2023-06-01',
			endDate: '2024-06-01',
			status: 'active',
			description: 'Assurance multirisque habitation',
			coverageAmount: 50000,
			deductible: 300,
			documents: [
				{
					name: 'Contrat_Habitation_Groupama.pdf',
					url: '/documents/contrat_habitation_groupama.pdf',
					uploadDate: '2023-06-01',
				},
			],
			overview: {
				startDate: '01/06/2023',
				endDate: '01/06/2024',
				annualPremium: '390,00€',
				hasTacitRenewal: true,
				tacitRenewalDeadline: '01/05/2024',
				planType: 'Multirisque Habitation',
				subscribedCoverages: ['Incendie', 'Vol', 'Dégâts des eaux', 'Catastrophes naturelles', 'Responsabilité civile', 'Assistance']
			},
			coverages: [
				{
					name: 'Incendie et événements assimilés',
					details: [
						{
							service: 'Dommages incendie',
							limit: 'Valeur de reconstruction',
							deductible: '300€',
							restrictions: 'Valeur assurée',
							coveredItems: ['Incendie', 'Explosion', 'Foudre'],
							excludedItems: ['Dommages électriques', 'Usure normale']
						}
					],
					coveredItems: ['Incendie', 'Explosion', 'Foudre', 'Chute d\'avion'],
					excludedItems: ['Dommages électriques', 'Usure normale', 'Défaut de construction']
				},
				{
					name: 'Vol et vandalisme',
					details: [
						{
							service: 'Vol avec effraction',
							limit: '5000€ par objet',
							deductible: '300€',
							restrictions: 'Valeur des biens',
							coveredItems: ['Vol avec effraction', 'Vandalisme consécutif'],
							excludedItems: ['Vol sans effraction', 'Objets de valeur non déclarés']
						}
					],
					coveredItems: ['Vol avec effraction', 'Vandalisme', 'Bris de glace'],
					excludedItems: ['Vol sans effraction', 'Objets de valeur non déclarés']
				}
			],
			generalExclusions: [
				'Logement inoccupé plus de 30 jours',
				'Activité professionnelle non déclarée',
				'Dommages causés intentionnellement',
				'Non-respect des obligations de sécurité'
			],
			geographicCoverage: {
				countries: ['France métropolitaine', 'Corse', 'Départements d\'outre-mer']
			},
			obligations: {
				atSubscription: [
					'Déclarer l\'usage du logement',
					'Fournir les informations exactes',
					'Signer le contrat'
				],
				duringContract: [
					'Payer les primes à échéance',
					'Maintenir le logement en bon état',
					'Déclarer tout changement'
				],
				inCaseOfClaim: [
					'Déclarer le sinistre sous 5 jours',
					'Prendre les mesures conservatoires',
					'Conserver les preuves'
				]
			},
			cancellation: {
				procedures: 'Lettre recommandée avec AR ou en ligne',
				deadlines: '2 mois avant la date d\'échéance',
				usefulContacts: ['Service client Groupama', 'Agence locale', 'Site web Groupama']
			},
			contacts: {
				contractManagement: {
					name: 'Service Client Groupama',
					phone: '0810 810 810',
					email: 'contact@groupama.fr',
					hours: 'Lun-Ven 8h-20h, Sam 9h-17h'
				},
				assistance: {
					name: 'Assistance Groupama',
					phone: '0810 810 810',
					email: 'assistance@groupama.fr',
					availability: '24h/24 et 7j/7'
				},
				emergency: {
					name: 'Urgences Groupama',
					phone: '0800 00 00 00',
					email: 'urgences@groupama.fr',
					availability: '24h/24 et 7j/7'
				}
			}
		},
		{
			id: '3',
			name: 'Mutuelle Santé',
			insurer: 'Harmonie Mutuelle',
			type: 'sante',
			premium: 1536,
			startDate: '2024-03-01',
			endDate: '2025-03-01',
			status: 'active',
			description: 'Complémentaire santé famille',
			coverageAmount: 0,
			deductible: 0,
			documents: [
				{
					name: 'Contrat_Sante_Harmonie.pdf',
					url: '/documents/contrat_sante_harmonie.pdf',
					uploadDate: '2024-03-01',
				},
			],
			overview: {
				startDate: '01/03/2024',
				endDate: '01/03/2025',
				annualPremium: '1536,00€',
				hasTacitRenewal: true,
				tacitRenewalDeadline: '01/02/2025',
				planType: 'Famille Premium',
				subscribedCoverages: ['Hospitalisation', 'Consultations', 'Médicaments', 'Dentaire', 'Optique', 'Auditif']
			},
			coverages: [
				{
					name: 'Hospitalisation',
					details: [
						{
							service: 'Chambre particulière',
							limit: '100%',
							deductible: '0€',
							restrictions: 'Aucune',
							coveredItems: ['Chambre particulière', 'Surveillance continue'],
							excludedItems: ['Confort personnel', 'Téléphone']
						}
					],
					coveredItems: ['Hospitalisation', 'Chirurgie', 'Anesthésie'],
					excludedItems: ['Confort personnel', 'Téléphone', 'Télévision']
				},
				{
					name: 'Dentaire',
					details: [
						{
							service: 'Soins conservateurs',
							limit: '100%',
							deductible: '0€',
							restrictions: 'Aucune',
							coveredItems: ['Caries', 'Détartrage', 'Dévitalisation'],
							excludedItems: ['Prothèses esthétiques', 'Orthodontie adulte']
						}
					],
					coveredItems: ['Soins conservateurs', 'Prothèses', 'Orthodontie'],
					excludedItems: ['Prothèses esthétiques', 'Orthodontie adulte']
				}
			],
			generalExclusions: [
				'Actes non remboursés par la Sécurité sociale',
				'Actes esthétiques non médicaux',
				'Actes réalisés à l\'étranger sans accord préalable',
				'Actes non prescrits par un médecin'
			],
			geographicCoverage: {
				countries: ['France métropolitaine', 'Union Européenne', 'Suisse']
			},
			obligations: {
				atSubscription: [
					'Fournir un questionnaire de santé',
					'Déclarer les antécédents médicaux',
					'Signer le contrat'
				],
				duringContract: [
					'Payer les cotisations',
					'Déclarer tout changement de situation',
					'Respecter le parcours de soins'
				],
				inCaseOfClaim: [
					'Envoyer les feuilles de soins',
					'Respecter les délais de déclaration',
					'Conserver les justificatifs'
				]
			},
			cancellation: {
				procedures: 'Lettre recommandée avec AR ou en ligne',
				deadlines: '2 mois avant la date d\'échéance',
				usefulContacts: ['Service client Harmonie', 'Agence locale', 'Site web Harmonie']
			},
			contacts: {
				contractManagement: {
					name: 'Service Client Harmonie',
					phone: '0810 810 810',
					email: 'contact@harmonie-mutuelle.fr',
					hours: 'Lun-Ven 8h-19h, Sam 9h-17h'
				},
				assistance: {
					name: 'Assistance Harmonie',
					phone: '0810 810 810',
					email: 'assistance@harmonie-mutuelle.fr',
					availability: '24h/24 et 7j/7'
				},
				emergency: {
					name: 'Urgences Harmonie',
					phone: '0800 00 00 00',
					email: 'urgences@harmonie-mutuelle.fr',
					availability: '24h/24 et 7j/7'
				}
			}
		},
	],
	loading: false,
	error: null,
	searchQuery: '',
	selectedType: 'all',
	selectedStatus: 'all',
};

const contractsSlice = createSlice({
	name: 'contracts',
	initialState,
	reducers: {
		// Contract CRUD operations
		addContract: (state, action: PayloadAction<Omit<Contract, 'id'>>) => {
			const newContract: Contract = {
				...action.payload,
				id: Date.now().toString(),
			};
			state.contracts.push(newContract);
		},
		
		updateContract: (state, action: PayloadAction<Contract>) => {
			const index = state.contracts.findIndex(c => c.id === action.payload.id);
			if (index !== -1) {
				state.contracts[index] = action.payload;
			}
		},
		
		deleteContract: (state, action: PayloadAction<string>) => {
			state.contracts = state.contracts.filter(c => c.id !== action.payload);
		},
		
		// Filter and search operations
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		},
		
		setSelectedType: (state, action: PayloadAction<string>) => {
			state.selectedType = action.payload;
		},
		
		setSelectedStatus: (state, action: PayloadAction<string>) => {
			state.selectedStatus = action.payload;
		},
		
		// Loading and error states
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		
		// Document management
		addDocument: (state, action: PayloadAction<{
			contractId: string;
			document: {
				name: string;
				url: string;
				uploadDate: string;
			};
		}>) => {
			const contract = state.contracts.find(c => c.id === action.payload.contractId);
			if (contract) {
				if (!contract.documents) {
					contract.documents = [];
				}
				contract.documents.push(action.payload.document);
			}
		},
		
		removeDocument: (state, action: PayloadAction<{
			contractId: string;
			documentName: string;
		}>) => {
			const contract = state.contracts.find(c => c.id === action.payload.contractId);
			if (contract && contract.documents) {
				contract.documents = contract.documents.filter(
					doc => doc.name !== action.payload.documentName
				);
			}
		},
	},
});

export const {
	addContract,
	updateContract,
	deleteContract,
	setSearchQuery,
	setSelectedType,
	setSelectedStatus,
	setLoading,
	setError,
	addDocument,
	removeDocument,
} = contractsSlice.actions;

export default contractsSlice.reducer; 