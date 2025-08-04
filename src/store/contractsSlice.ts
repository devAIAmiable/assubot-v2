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
	documents: {
		generalConditions: {
			name: string;
			url: string;
			uploadDate: string;
			required: true;
		};
		particularConditions: {
			name: string;
			url: string;
			uploadDate: string;
			required: true;
		};
		otherDocs?: {
			name: string;
			url: string;
			uploadDate: string;
			required: false;
		}[];
	};
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
	cancellation: { question: string; answer: string }[];
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

const axaContract: Contract = {
	id: 'axa-ma-sante-2019',
	name: 'Complémentaire santé Ma Santé',
	insurer: 'AXA',
	type: 'sante',
	premium: 780, // example value
	startDate: '2019-01-01',
	endDate: '2024-12-31',
	status: 'active',
	description:
		'Contrat de complémentaire santé proposé par AXA pour le remboursement des soins médicaux, hospitaliers et autres frais de santé.',
	documents: {
		generalConditions: {
			name: 'Conditions Générales AXA Ma Santé.pdf',
			url: '/documents/axa_conditions_generales_ma_sante.pdf',
			uploadDate: '2019-01-01',
			required: true,
		},
		particularConditions: {
			name: 'Conditions Particulières AXA Ma Santé.pdf',
			url: '/documents/axa_conditions_particulieres_ma_sante.pdf',
			uploadDate: '2019-01-01',
			required: true,
		},
		otherDocs: [],
	},
	// --- Mon contrat en un coup d'œil ---
	overview: {
		startDate: '07-23-2025',
		endDate: '07-22-2026',
		annualPremium: '225.00 €',
		hasTacitRenewal: true,
		tacitRenewalDeadline: '05-22-2026',
		planType: 'Essentielle',
		subscribedCoverages: [
			'Hospitalisation',
			'Soins courants',
			'Optique',
			'Dentaire',
			'Transport sanitaire',
			'Cure thermale',
			'Aides auditives',
			'Assistance',
		],
	},
	// --- Territorialité ---
	geographicCoverage: {
		countries: [
			'France métropolitaine',
			'Union Européenne',
			'Suisse (si option activée)',
			'DOM-TOM',
			"Autres pays en cas d'urgence (limité)",
		],
	},
	// --- Exclusions générales ---
	generalExclusions: [
		'Les soins antérieurs à la date d’effet du contrat',
		'Les soins antérieurs de 2 ans à la date de leur présentation',
		'Les frais pour lesquels les justificatifs demandés ne sont pas fournis (facture, prescription, note d’honoraires)',
		'La participation forfaitaire et les franchises sur boîtes de médicaments, actes paramédicaux et transport sanitaire',
		'Les pénalités appliquées par la Sécurité sociale pour non-respect du parcours de soins (majoration du ticket modérateur, augmentation des tarifs conventionnels)',
		'Les frais d’hospitalisation en long séjour : soins réalisés dans des établissements médico-sociaux ou pour personnes en perte d’autonomie nécessitant une surveillance constante (ex. MAS, EHPAD)',
	],
	// --- Garanties (onglet Garanties) ---
	coverages: [
		{
			name: 'Hospitalisation',
			details: [
				{
					service: 'Frais de séjour',
					limit: '1000 €/jour',
					deductible: '1 jour',
					restrictions: 'Non pris en charge en ambulatoire',
					coveredItems: [
						'Hospitalisation médicale, chirurgicale et obstétricale',
						'Chambre particulière',
						'Frais pré- et post-opératoires en lien avec l’intervention',
					],
					excludedItems: [
						'Hospitalisation ambulatoire non incluse dans cette option',
						"Hospitalisation psychiatrique sans délai d'attente dépassé",
					],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
		{
			name: 'Soins courants',
			details: [
				{
					service: 'Consultations & actes médicaux',
					limit: '150 €/an',
					deductible: '0 €',
					restrictions: '',
					coveredItems: [
						'Honoraires médicaux (consultations, visites, radiographies, imagerie)',
						'Médicaments remboursables',
						'Médecine douce non remboursée (ostéopathie, acupuncture, podologue...)',
					],
					excludedItems: [
						'Actes hors nomenclature sans validation médicale',
						'Médecins non inscrits dans RPPS/ADELI',
					],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
		{
			name: 'Optique',
			details: [
				{
					service: 'Lunettes (Classe A ou B)',
					limit: '350 € / 2 ans',
					deductible: '0 €',
					restrictions: 'Plafond règlementaire R871-2 sauf formule 400%',
					coveredItems: [
						'Verres et montures classe A : remboursement 100%',
						'Classe B : forfait selon correction visuelle',
					],
					excludedItems: ['Implants oculaires', 'Équipements hors grille optique'],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
		{
			name: 'Dentaire',
			details: [
				{
					service: 'Soins & prothèses',
					limit: '800 €/an',
					deductible: '50 €',
					restrictions: '',
					coveredItems: [
						'Actes panier 100 % santé',
						'Implantologie si précisé dans Conditions personnelles',
						'Parodontologie et orthodontie selon conditions',
					],
					excludedItems: ['Implants sans devis accepté', 'Actes hors nomenclature'],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
		{
			name: 'Transport sanitaire',
			details: [
				{
					service: 'Transport médical',
					limit: '150 €/trajet',
					deductible: '0 €',
					restrictions: 'Uniquement si prescrit et remboursable SS',
					coveredItems: [
						'Transport vers hôpital ou consultation',
						'Ambulance, VSL ou taxi conventionné',
					],
					excludedItems: ['Transports non prescrits', 'Non remboursables par la Sécurité sociale'],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
		{
			name: 'Cure thermale',
			details: [
				{
					service: 'Forfait thermal',
					limit: '300 €/an',
					deductible: '3 jours',
					restrictions: '',
					coveredItems: ['Cures prescrites à visée thérapeutique', 'Soins dans centres agréés'],
					excludedItems: ['Cures bien-être ou esthétiques', 'Sans prescription médicale'],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
		{
			name: 'Aides auditives',
			details: [
				{
					service: 'Appareils auditifs',
					limit: '600 € par oreille',
					deductible: '0 €',
					restrictions: 'Dans la limite de la LPP',
					coveredItems: ['Appareils prescrits avec devis', 'Classe I remboursée à 100 %'],
					excludedItems: [
						'Équipements hors nomenclature LPP',
						'Accessoires esthétiques non médicaux',
					],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
		{
			name: 'Assistance',
			details: [
				{
					service: 'Aide-ménagère après hospitalisation',
					limit: '40 heures/an',
					deductible: '2 heures min / jour',
					restrictions: '1 intervention / an / assuré après hospitalisation',
					coveredItems: [
						'Hospitalisation > 24h',
						'Intervention après chimiothérapie ou radiothérapie',
					],
					excludedItems: [
						'Demande sans validation d’AXA Assistance',
						'Dépassement de 40 heures/an',
					],
				},
			],
			coveredItems: [],
			excludedItems: [],
		},
	],
	// --- Résiliation ---
	cancellation: [
		{
			question: 'Puis-je résilier mon contrat à l’échéance ?',
			answer:
				'Oui. Vous pouvez résilier à la date d’échéance principale du contrat, avec un préavis de 2 mois. \nModalité : par lettre recommandée. \nJustificatif : aucun n’est nécessaire. \nPrise d’effet : à la date d’échéance.',
		},
		{
			question: 'Puis-je résilier si ma situation change ?',
			answer: `Oui, dans plusieurs cas précis, avec justificatif et lettre recommandée :\n1- Changement de régime obligatoire (ex : passage au régime Alsace-Moselle)\nPreuve : attestation du nouveau régime\nEffet : 1 mois après réception du courrier ou justificatif\n2- Obtention de la CMU-C\nPreuve : attestation CMU-C\nEffet : à la date de prise d’effet de la CMU-C\n3- Obtention de l’ACS (Aide à l'acquisition d'une complémentaire santé)\nPreuve : attestation d’un organisme habilité\nEffet : le 1er jour du 2ᵉ mois suivant\n4- Déménagement à l’étranger hors fiscalité française\nPreuve : justificatif de déménagement\nEffet : 1 mois après réception\n5- Adhésion à un contrat collectif obligatoire par l’employeur\nPreuve : attestation de l’employeur\nEffet : 1 mois après réception`,
		},
		{
			question: 'Que se passe-t-il si j’ai un désaccord sur une augmentation tarifaire ?',
			answer:
				'Vous pouvez résilier en cas de hausse de tarif, sauf si elle découle d’une obligation légale/réglementaire. \nDélai : dans les 30 jours suivant la réception de l’avis de hausse. \nModalité : lettre recommandée, sans justificatif. \nEffet : à la prochaine échéance principale (si respect du délai).',
		},
		{
			question: 'Dans quels autres cas mon contrat peut être résilié ?',
			answer:
				'L’assureur peut résilier si : \n1- Vous ne réglez pas vos cotisations (après une mise en demeure de 40 jours) \n2- Vous avez fait une fausse déclaration ou omission \n3- Vous ne remplissez plus les conditions d’adhésion.',
		},
		{
			question: 'Que se passe-t-il en cas de décès de l’assuré ?',
			answer:
				'Le contrat ou l’adhésion prend fin automatiquement au décès du souscripteur ou de l’adhérent.',
		},
	],
	contacts: {
		contractManagement: {
			name: 'AXA Service Client',
			phone: '01 70 82 28 05',
			email: 'serviceclient@axa.fr',
			hours: 'Lun-Ven 8h-18h',
		},
		assistance: {
			name: 'AXA Assistance',
			phone: '01 55 92 26 92',
			email: 'assistance@axa.fr',
			availability: '24/7',
		},
		emergency: {
			name: 'AXA Assistance',
			phone: '01 55 92 26 92',
			email: 'urgence@axa.fr',
			availability: '24/7',
		},
	},
	obligations: {
		atSubscription: ['Être résident fiscal français', 'Être affilié à un régime obligatoire'],
		duringContract: ['Être à jour des cotisations', 'Transmettre les documents requis'],
		inCaseOfClaim: ['Fournir factures, prescriptions et décomptes'],
	},
};

const initialState: ContractsState = {
	contracts: [
		axaContract,
		{
			id: '1',
			name: 'Assurance Auto Citroën C3',
			insurer: 'MAIF',
			type: 'auto',
			premium: 549.6,
			startDate: '2024-01-15',
			endDate: '2026-01-15',
			status: 'active',
			description: 'Assurance tous risques pour Citroën C3',
			coverageAmount: 20000,
			deductible: 500,
			documents: {
				generalConditions: {
					name: 'Conditions Générales MAIF Auto 2024.pdf',
					url: '/documents/conditions_generales_maif_auto.pdf',
					uploadDate: '2024-01-15',
					required: true,
				},
				particularConditions: {
					name: 'Conditions Particulières Citroën C3.pdf',
					url: '/documents/conditions_particulieres_citroen_c3.pdf',
					uploadDate: '2024-01-15',
					required: true,
				},
				otherDocs: [
					{
						name: "Attestation d'assurance.pdf",
						url: '/documents/attestation_assurance_maif.pdf',
						uploadDate: '2024-01-15',
						required: false,
					},
				],
			},
			overview: {
				startDate: '15/01/2024',
				endDate: '15/01/2025',
				annualPremium: '549,60€',
				hasTacitRenewal: true,
				tacitRenewalDeadline: '15/12/2024',
				planType: 'Tous Risques',
				subscribedCoverages: [
					'Responsabilité civile',
					'Défense et recours',
					'Vol',
					'Incendie',
					'Bris de glace',
					'Assistance 0km',
				],
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
							excludedItems: ['Dommages au conducteur', 'Dommages aux passagers'],
						},
						{
							service: 'Dommages matériels',
							limit: 'Illimité',
							deductible: '0€',
							restrictions: 'Aucune',
							coveredItems: ['Dommages aux véhicules tiers', 'Dommages aux biens tiers'],
							excludedItems: ['Dommages à votre véhicule'],
						},
					],
					coveredItems: ['Dommages causés à des tiers', 'Défense en cas de poursuite'],
					excludedItems: ['Dommages à votre véhicule', 'Dommages au conducteur'],
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
							excludedItems: ["Vol d'objets personnels", 'Vol sans effraction'],
						},
					],
					coveredItems: ['Vol total', 'Incendie', 'Explosion'],
					excludedItems: ['Vol partiel', "Vol d'accessoires non déclarés"],
				},
			],
			generalExclusions: [
				"Conduite en état d'ivresse",
				'Conduite sans permis',
				'Utilisation du véhicule à des fins commerciales non déclarées',
				'Dommages causés intentionnellement',
			],
			geographicCoverage: {
				countries: ['France', 'Union Européenne', 'Suisse', 'Norvège', 'Islande', 'Liechtenstein'],
			},
			obligations: {
				atSubscription: [
					'Déclarer tous les conducteurs',
					'Fournir les informations exactes sur le véhicule',
					'Signer le contrat',
				],
				duringContract: [
					'Payer les primes à échéance',
					'Déclarer tout changement de situation',
					'Maintenir le véhicule en bon état',
				],
				inCaseOfClaim: [
					'Déclarer le sinistre sous 5 jours',
					'Ne pas reconnaître de responsabilité',
					'Conserver les preuves',
				],
			},
			cancellation: [
				{
					question: 'Comment résilier mon contrat auto à l’échéance ?',
					answer: 'Vous pouvez résilier à la date d’échéance annuelle, en envoyant une lettre recommandée au moins 2 mois avant la date. La résiliation prend effet à l’échéance.'
				},
				{
					question: 'Puis-je résilier après la vente de mon véhicule ?',
					answer: 'Oui, la vente du véhicule permet la résiliation immédiate du contrat. Envoyez un justificatif de cession à votre assureur. Le contrat prend fin 10 jours après notification.'
				},
				{
					question: 'Que faire en cas de changement de situation ?',
					answer: 'Un déménagement, un changement de situation matrimoniale ou professionnelle peut justifier une résiliation. Prévenez l’assureur sous 3 mois.'
				},
				{
					question: 'L’assureur peut-il résilier mon contrat ?',
					answer: 'Oui, en cas de non-paiement, sinistre responsable ou fausse déclaration, l’assureur peut résilier le contrat.'
				},
			],
			contacts: {
				contractManagement: {
					name: 'Service Client MAIF',
					phone: '0892 70 70 70',
					email: 'contact@maif.fr',
					hours: 'Lun-Ven 8h-19h, Sam 9h-17h',
				},
				assistance: {
					name: 'Assistance MAIF',
					phone: '0892 70 70 70',
					email: 'assistance@maif.fr',
					availability: '24h/24 et 7j/7',
				},
				emergency: {
					name: 'Urgences MAIF',
					phone: '0800 00 00 00',
					email: 'urgences@maif.fr',
					availability: '24h/24 et 7j/7',
				},
			},
		},
		{
			id: '2',
			name: 'Assurance Habitation',
			insurer: 'Groupama',
			type: 'habitation',
			premium: 390,
			startDate: '2023-06-01',
			endDate: '2026-06-01',
			status: 'active',
			description: 'Assurance multirisque habitation',
			coverageAmount: 50000,
			deductible: 300,
			documents: {
				generalConditions: {
					name: 'Conditions Générales Groupama Habitation.pdf',
					url: '/documents/conditions_generales_groupama_habitation.pdf',
					uploadDate: '2023-06-01',
					required: true,
				},
				particularConditions: {
					name: 'Conditions Particulières Appartement Lyon.pdf',
					url: '/documents/conditions_particulieres_appartement_lyon.pdf',
					uploadDate: '2023-06-01',
					required: true,
				},
				otherDocs: [
					{
						name: 'Inventaire des biens.pdf',
						url: '/documents/inventaire_biens_groupama.pdf',
						uploadDate: '2023-06-01',
						required: false,
					},
				],
			},
			overview: {
				startDate: '01/06/2023',
				endDate: '01/06/2024',
				annualPremium: '390,00€',
				hasTacitRenewal: true,
				tacitRenewalDeadline: '01/05/2024',
				planType: 'Multirisque Habitation',
				subscribedCoverages: [
					'Incendie',
					'Vol',
					'Dégâts des eaux',
					'Catastrophes naturelles',
					'Responsabilité civile',
					'Assistance',
				],
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
							excludedItems: ['Dommages électriques', 'Usure normale'],
						},
					],
					coveredItems: ['Incendie', 'Explosion', 'Foudre', "Chute d'avion"],
					excludedItems: ['Dommages électriques', 'Usure normale', 'Défaut de construction'],
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
							excludedItems: ['Vol sans effraction', 'Objets de valeur non déclarés'],
						},
					],
					coveredItems: ['Vol avec effraction', 'Vandalisme', 'Bris de glace'],
					excludedItems: ['Vol sans effraction', 'Objets de valeur non déclarés'],
				},
			],
			generalExclusions: [
				'Logement inoccupé plus de 30 jours',
				'Activité professionnelle non déclarée',
				'Dommages causés intentionnellement',
				'Non-respect des obligations de sécurité',
			],
			geographicCoverage: {
				countries: ['France métropolitaine', 'Corse', "Départements d'outre-mer"],
			},
			obligations: {
				atSubscription: [
					"Déclarer l'usage du logement",
					'Fournir les informations exactes',
					'Signer le contrat',
				],
				duringContract: [
					'Payer les primes à échéance',
					'Maintenir le logement en bon état',
					'Déclarer tout changement',
				],
				inCaseOfClaim: [
					'Déclarer le sinistre sous 5 jours',
					'Prendre les mesures conservatoires',
					'Conserver les preuves',
				],
			},
			cancellation: [
				{
					question: 'Comment résilier mon assurance habitation ?',
					answer: 'Vous pouvez résilier à l’échéance annuelle avec un préavis de 2 mois par lettre recommandée. La résiliation prend effet à la date d’échéance.'
				},
				{
					question: 'Puis-je résilier en cas de déménagement ?',
					answer: 'Oui, un déménagement permet de résilier le contrat. Prévenez l’assureur dans les 3 mois suivant le changement.'
				},
				{
					question: 'Que faire si je vends mon logement ?',
					answer: 'La vente du bien entraîne la résiliation automatique du contrat. Informez l’assureur avec un justificatif.'
				},
				{
					question: 'L’assureur peut-il résilier ?',
					answer: 'Oui, en cas de non-paiement, sinistre grave ou fausse déclaration.'
				},
			],
			contacts: {
				contractManagement: {
					name: 'Service Client Groupama',
					phone: '0810 810 810',
					email: 'contact@groupama.fr',
					hours: 'Lun-Ven 8h-20h, Sam 9h-17h',
				},
				assistance: {
					name: 'Assistance Groupama',
					phone: '0810 810 810',
					email: 'assistance@groupama.fr',
					availability: '24h/24 et 7j/7',
				},
				emergency: {
					name: 'Urgences Groupama',
					phone: '0800 00 00 00',
					email: 'urgences@groupama.fr',
					availability: '24h/24 et 7j/7',
				},
			},
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
			documents: {
				generalConditions: {
					name: 'Conditions Générales Harmonie Santé.pdf',
					url: '/documents/conditions_generales_harmonie_sante.pdf',
					uploadDate: '2024-03-01',
					required: true,
				},
				particularConditions: {
					name: 'Conditions Particulières Famille Premium.pdf',
					url: '/documents/conditions_particulieres_famille_premium.pdf',
					uploadDate: '2024-03-01',
					required: true,
				},
				otherDocs: [
					{
						name: 'Carte de tiers payant.pdf',
						url: '/documents/carte_tiers_payant_harmonie.pdf',
						uploadDate: '2024-03-01',
						required: false,
					},
					{
						name: 'Guide des remboursements.pdf',
						url: '/documents/guide_remboursements_harmonie.pdf',
						uploadDate: '2024-03-01',
						required: false,
					},
				],
			},
			overview: {
				startDate: '01/03/2024',
				endDate: '01/03/2025',
				annualPremium: '1536,00€',
				hasTacitRenewal: true,
				tacitRenewalDeadline: '01/02/2025',
				planType: 'Famille Premium',
				subscribedCoverages: [
					'Hospitalisation',
					'Consultations',
					'Médicaments',
					'Dentaire',
					'Optique',
					'Auditif',
				],
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
							excludedItems: ['Confort personnel', 'Téléphone'],
						},
					],
					coveredItems: ['Hospitalisation', 'Chirurgie', 'Anesthésie'],
					excludedItems: ['Confort personnel', 'Téléphone', 'Télévision'],
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
							excludedItems: ['Prothèses esthétiques', 'Orthodontie adulte'],
						},
					],
					coveredItems: ['Soins conservateurs', 'Prothèses', 'Orthodontie'],
					excludedItems: ['Prothèses esthétiques', 'Orthodontie adulte'],
				},
			],
			generalExclusions: [
				'Actes non remboursés par la Sécurité sociale',
				'Actes esthétiques non médicaux',
				"Actes réalisés à l'étranger sans accord préalable",
				'Actes non prescrits par un médecin',
			],
			geographicCoverage: {
				countries: ['France métropolitaine', 'Union Européenne', 'Suisse'],
			},
			obligations: {
				atSubscription: [
					'Fournir un questionnaire de santé',
					'Déclarer les antécédents médicaux',
					'Signer le contrat',
				],
				duringContract: [
					'Payer les cotisations',
					'Déclarer tout changement de situation',
					'Respecter le parcours de soins',
				],
				inCaseOfClaim: [
					'Envoyer les feuilles de soins',
					'Respecter les délais de déclaration',
					'Conserver les justificatifs',
				],
			},
			cancellation: [
				{
					question: 'Comment résilier ma mutuelle santé ?',
					answer: 'Vous pouvez résilier à l’échéance annuelle avec un préavis de 2 mois par lettre recommandée. La résiliation prend effet à la date d’échéance.'
				},
				{
					question: 'Puis-je résilier en cas d’adhésion à une mutuelle obligatoire ?',
					answer: 'Oui, l’adhésion à une mutuelle d’entreprise permet de résilier votre contrat individuel. Fournissez l’attestation de l’employeur.'
				},
				{
					question: 'Que faire en cas de changement de situation ?',
					answer: 'Un changement de régime social, déménagement ou mariage peut justifier une résiliation. Prévenez l’assureur sous 3 mois.'
				},
				{
					question: 'L’assureur peut-il résilier ?',
					answer: 'Oui, en cas de non-paiement, fraude ou fausse déclaration.'
				},
			],
			contacts: {
				contractManagement: {
					name: 'Service Client Harmonie',
					phone: '0810 810 810',
					email: 'contact@harmonie-mutuelle.fr',
					hours: 'Lun-Ven 8h-19h, Sam 9h-17h',
				},
				assistance: {
					name: 'Assistance Harmonie',
					phone: '0810 810 810',
					email: 'assistance@harmonie-mutuelle.fr',
					availability: '24h/24 et 7j/7',
				},
				emergency: {
					name: 'Urgences Harmonie',
					phone: '0800 00 00 00',
					email: 'urgences@harmonie-mutuelle.fr',
					availability: '24h/24 et 7j/7',
				},
			},
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
			const index = state.contracts.findIndex((c) => c.id === action.payload.id);
			if (index !== -1) {
				state.contracts[index] = action.payload;
			}
		},

		deleteContract: (state, action: PayloadAction<string>) => {
			state.contracts = state.contracts.filter((c) => c.id !== action.payload);
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
		addDocument: (
			state,
			action: PayloadAction<{
				contractId: string;
				documentType: 'generalConditions' | 'particularConditions' | 'otherDocs';
				document: {
					name: string;
					url: string;
					uploadDate: string;
				};
			}>
		) => {
			const contract = state.contracts.find((c) => c.id === action.payload.contractId);
			if (contract) {
				if (action.payload.documentType === 'otherDocs') {
					if (!contract.documents.otherDocs) {
						contract.documents.otherDocs = [];
					}
					contract.documents.otherDocs.push({
						...action.payload.document,
						required: false,
					});
				} else {
					contract.documents[action.payload.documentType] = {
						...action.payload.document,
						required: true,
					};
				}
			}
		},

		removeDocument: (
			state,
			action: PayloadAction<{
				contractId: string;
				documentType: 'generalConditions' | 'particularConditions' | 'otherDocs';
				documentName?: string;
			}>
		) => {
			const contract = state.contracts.find((c) => c.id === action.payload.contractId);
			if (contract) {
				if (action.payload.documentType === 'otherDocs' && action.payload.documentName) {
					if (contract.documents.otherDocs) {
						contract.documents.otherDocs = contract.documents.otherDocs.filter(
							(doc) => doc.name !== action.payload.documentName
						);
					}
				} else if (action.payload.documentType === 'generalConditions') {
					contract.documents.generalConditions = {
						name: '',
						url: '',
						uploadDate: '',
						required: true,
					};
				} else if (action.payload.documentType === 'particularConditions') {
					contract.documents.particularConditions = {
						name: '',
						url: '',
						uploadDate: '',
						required: true,
					};
				}
			}
		},

		// Clear all contracts
		clearContracts: (state) => {
			state.contracts = [];
			state.searchQuery = '';
			state.selectedType = '';
			state.selectedStatus = '';
			state.loading = false;
			state.error = null;
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
	clearContracts,
} = contractsSlice.actions;

export default contractsSlice.reducer;
