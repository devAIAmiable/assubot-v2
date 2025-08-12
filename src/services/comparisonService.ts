import type { FormData } from '../types/formTypes';
import type { InsuranceType } from '../types';

export interface ComparisonOffer {
	id: string;
	insurer: string;
	price: { monthly: number; yearly: number };
	rating: number;
	coverages: { [key: string]: { included: boolean; value?: string } };
	pros: string[];
	cons: string[];
	score: number;
	recommended?: boolean;
	isCurrentContract?: boolean;
}

// Mock data for different insurance types
const mockData: Record<InsuranceType, ComparisonOffer[]> = {
	auto: [
		{
			id: '1',
			insurer: 'Direct Assurance',
			price: { monthly: 32, yearly: 384 },
			rating: 4.2,
			score: 95,
			coverages: {
				'Responsabilité civile': { included: true },
				Vol: { included: true },
				'Bris de glace': { included: true },
				'Assistance 0km': { included: true },
			},
			pros: ['Prix attractif', 'Assistance étendue', 'Devis en ligne'],
			cons: ['Réseau limité'],
			recommended: true,
		},
		{
			id: '2',
			insurer: 'Allianz',
			price: { monthly: 45, yearly: 540 },
			rating: 4.5,
			score: 88,
			coverages: {
				'Responsabilité civile': { included: true },
				Vol: { included: true },
				'Bris de glace': { included: true },
				'Assistance 0km': { included: true },
			},
			pros: ['Service excellent', 'Réseau étendu'],
			cons: ['Prix élevé'],
		},
		{
			id: '3',
			insurer: 'MAIF',
			price: { monthly: 38, yearly: 456 },
			rating: 4.3,
			score: 82,
			coverages: {
				'Responsabilité civile': { included: true },
				Vol: { included: true },
				'Bris de glace': { included: false },
				'Assistance 0km': { included: true },
			},
			pros: ['Mutuelle reconnue', 'Bonus écologique'],
			cons: ['Couverture limitée'],
		},
		{
			id: '4',
			insurer: 'AXA',
			price: { monthly: 42, yearly: 504 },
			rating: 4.1,
			score: 80,
			coverages: {
				'Responsabilité civile': { included: true },
				Vol: { included: true },
				'Bris de glace': { included: true },
				'Assistance 0km': { included: false },
			},
			pros: ['Réseau étendu', 'Application mobile'],
			cons: ['Service moyen'],
		},
	],
	habitation: [
		{
			id: '1',
			insurer: 'MAIF',
			price: { monthly: 28, yearly: 336 },
			rating: 4.4,
			score: 92,
			coverages: {
				Incendie: { included: true },
				'Dégâts des eaux': { included: true },
				Vol: { included: true },
				'Responsabilité civile': { included: true },
			},
			pros: ['Mutuelle spécialisée', 'Bon rapport qualité-prix', 'Service réactif'],
			cons: ['Franchise élevée'],
			recommended: true,
		},
		{
			id: '2',
			insurer: 'Groupama',
			price: { monthly: 35, yearly: 420 },
			rating: 4.2,
			score: 85,
			coverages: {
				Incendie: { included: true },
				'Dégâts des eaux': { included: true },
				Vol: { included: true },
				'Responsabilité civile': { included: true },
			},
			pros: ['Assurance locale', 'Conseiller dédié'],
			cons: ['Prix plus élevé'],
		},
		{
			id: '3',
			insurer: 'Allianz',
			price: { monthly: 32, yearly: 384 },
			rating: 4.3,
			score: 88,
			coverages: {
				Incendie: { included: true },
				'Dégâts des eaux': { included: true },
				Vol: { included: false },
				'Responsabilité civile': { included: true },
			},
			pros: ['Grande compagnie', 'Services numériques'],
			cons: ['Vol en option'],
		},
		{
			id: '4',
			insurer: 'AXA',
			price: { monthly: 30, yearly: 360 },
			rating: 4.0,
			score: 78,
			coverages: {
				Incendie: { included: true },
				'Dégâts des eaux': { included: true },
				Vol: { included: true },
				'Responsabilité civile': { included: true },
			},
			pros: ['Prix compétitif', 'Réseau important'],
			cons: ['Service client perfectible'],
		},
	],
	sante: [
		{
			id: '1',
			insurer: 'MAIF',
			price: { monthly: 45, yearly: 540 },
			rating: 4.5,
			score: 93,
			coverages: {
				'Soins courants': { included: true, value: '100%' },
				Hospitalisation: { included: true, value: '100%' },
				Dentaire: { included: true, value: '150%' },
				Optique: { included: true, value: '200€' },
			},
			pros: ['Excellent remboursement', 'Tiers payant étendu', 'Médecines douces'],
			cons: ['Prix élevé'],
			recommended: true,
		},
		{
			id: '2',
			insurer: 'Allianz',
			price: { monthly: 38, yearly: 456 },
			rating: 4.2,
			score: 85,
			coverages: {
				'Soins courants': { included: true, value: '100%' },
				Hospitalisation: { included: true, value: '100%' },
				Dentaire: { included: true, value: '125%' },
				Optique: { included: true, value: '150€' },
			},
			pros: ['Bon rapport qualité-prix', 'Réseau de soins'],
			cons: ['Délais de carence'],
		},
		{
			id: '3',
			insurer: 'Generali',
			price: { monthly: 42, yearly: 504 },
			rating: 4.1,
			score: 80,
			coverages: {
				'Soins courants': { included: true, value: '100%' },
				Hospitalisation: { included: true, value: '100%' },
				Dentaire: { included: true, value: '130%' },
				Optique: { included: true, value: '180€' },
			},
			pros: ['Couverture dentaire', 'Prévention incluse'],
			cons: ['Réseau limité'],
		},
	],
	motorcycle: [
		{
			id: '1',
			insurer: 'Direct Assurance',
			price: { monthly: 24, yearly: 288 },
			rating: 4.3,
			score: 90,
			coverages: {
				'Responsabilité civile': { included: true },
				Vol: { included: true },
				Incendie: { included: true },
				Équipements: { included: true },
			},
			pros: ['Prix imbattable', 'Assurance équipements', 'Devis rapide'],
			cons: ['Assistance limitée'],
			recommended: true,
		},
		{
			id: '2',
			insurer: 'MAIF',
			price: { monthly: 35, yearly: 420 },
			rating: 4.4,
			score: 88,
			coverages: {
				'Responsabilité civile': { included: true },
				Vol: { included: true },
				Incendie: { included: true },
				Équipements: { included: false },
			},
			pros: ['Service de qualité', 'Bonus fidélité'],
			cons: ['Prix plus élevé', 'Équipements en option'],
		},
		{
			id: '3',
			insurer: 'Allianz',
			price: { monthly: 28, yearly: 336 },
			rating: 4.2,
			score: 85,
			coverages: {
				'Responsabilité civile': { included: true },
				Vol: { included: true },
				Incendie: { included: true },
				Équipements: { included: true },
			},
			pros: ['Couverture complète', 'Assistance 24h/24'],
			cons: ['Franchise élevée'],
		},
	],
};

export class ComparisonService {
	// Simulate API delay
	private static delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Convert a contract to a ComparisonOffer format
	private static contractToOffer(
		contract: { id: string; insurer: string; premium: number },
		insuranceType: InsuranceType
	): ComparisonOffer {
		// Generate basic coverages based on insurance type
		let coverages: { [key: string]: { included: boolean; value?: string } } = {};

		switch (insuranceType) {
			case 'auto':
				coverages = {
					'Responsabilité civile': { included: true },
					Vol: { included: true },
					'Bris de glace': { included: true },
					'Assistance 0km': { included: true },
				};
				break;
			case 'habitation':
				coverages = {
					Incendie: { included: true },
					'Dégâts des eaux': { included: true },
					Vol: { included: true },
					'Responsabilité civile': { included: true },
				};
				break;
			case 'sante':
				coverages = {
					'Soins courants': { included: true, value: '100%' },
					Hospitalisation: { included: true, value: '100%' },
					Dentaire: { included: true, value: '125%' },
					Optique: { included: true, value: '150€' },
				};
				break;
			case 'motorcycle':
				coverages = {
					'Responsabilité civile': { included: true },
					Vol: { included: true },
					Incendie: { included: true },
					Équipements: { included: true },
				};
				break;
		}

		return {
			id: `current-${contract.id}`,
			insurer: contract.insurer,
			price: {
				monthly: Math.round(contract.premium / 12),
				yearly: contract.premium,
			},
			rating: 4.0, // Default rating for existing contracts
			coverages,
			pros: ['Votre contrat actuel', 'Familier avec les conditions'],
			cons: [], // Will be determined by comparison
			score: 70, // Base score for current contract
			isCurrentContract: true,
		};
	}

	// Get comparison results for a specific insurance type
	static async getComparisons(
		insuranceType: InsuranceType,
		formData: FormData,
		existingContract?: { id: string; insurer: string; premium: number }
	): Promise<ComparisonOffer[]> {
		// Simulate API call delay
		await this.delay(1500 + Math.random() * 1000);

		let results = [...mockData[insuranceType]];

		// Add existing contract to comparison if provided
		if (existingContract) {
			const contractOffer = this.contractToOffer(existingContract, insuranceType);
			results.unshift(contractOffer); // Add at the beginning
		}

		// Apply some basic filtering/scoring based on form data
		const budget = parseInt(formData.monthlyBudget) || 100;

		// Adjust prices based on comprehensive form data
		results = results.map((offer) => {
			let priceMultiplier = 1;
			let scoreBonus = 0;

			// Age factor (younger = higher prices for auto/motorcycle)
			const age = parseInt(formData.age) || 25;
			if (insuranceType === 'auto' || insuranceType === 'motorcycle') {
				if (age < 25) priceMultiplier *= 1.3;
				else if (age > 50) priceMultiplier *= 0.9;
			}

			// Location factor (Paris = higher prices)
			if (formData.location.toLowerCase().includes('paris')) {
				priceMultiplier *= 1.2;
			}

			// Profession factor
			if (formData.profession === 'Étudiant') {
				priceMultiplier *= 0.9;
			} else if (formData.profession === 'Cadre') {
				priceMultiplier *= 1.1;
			}

			// Insurance type specific adjustments
			if (insuranceType === 'auto' && 'vehicleType' in formData) {
				// Vehicle type factor
				if (formData.vehicleType === 'motorcycle') priceMultiplier *= 1.2;
				if (formData.vehicleType === 'van') priceMultiplier *= 1.1;

				// Energy type factor
				if (formData.energyType === 'electric') {
					priceMultiplier *= 0.9;
					scoreBonus += 10; // Electric vehicles often get better offers
				}

				// Parking security
				if (formData.parkingLocation === 'private_garage') {
					priceMultiplier *= 0.95;
					scoreBonus += 5;
				} else if (formData.parkingLocation === 'public_street') {
					priceMultiplier *= 1.05;
				}

				// Claims history
				if (formData.claimsHistory === 'none') {
					priceMultiplier *= 0.9;
					scoreBonus += 10;
				} else if (formData.claimsHistory === '3_plus_claims') {
					priceMultiplier *= 1.4;
				}
			}

			if (insuranceType === 'habitation' && 'propertyType' in formData) {
				// Property type factor
				if (formData.propertyType === 'house') priceMultiplier *= 1.1;
				if (
					formData.propertyType === 'apartment' &&
					formData.floorLevel &&
					parseInt(formData.floorLevel) > 3
				) {
					priceMultiplier *= 0.95; // Higher floors = less theft risk
				}

				// Security features
				if (formData.hasAlarm) scoreBonus += 5;
				if (formData.securityLevel === 'advanced') {
					priceMultiplier *= 0.9;
					scoreBonus += 10;
				}
			}

			if (insuranceType === 'motorcycle' && 'motorcycleType' in formData) {
				// Motorcycle type factor
				if (formData.motorcycleType === 'sport') priceMultiplier *= 1.3;
				if (formData.motorcycleType === 'scooter') priceMultiplier *= 0.9;

				// Engine size factor
				const engineSize = parseInt(formData.engineSize) || 125;
				if (engineSize > 600) priceMultiplier *= 1.2;
				if (engineSize <= 125) priceMultiplier *= 0.8;

				// Anti-theft
				if (formData.hasAntiTheft) {
					priceMultiplier *= 0.95;
					scoreBonus += 5;
				}
			}

			if (insuranceType === 'sante' && 'familyStatus' in formData) {
				// Family status factor
				if (formData.familyStatus === 'family') priceMultiplier *= 1.2;

				// Health habits
				if (formData.practicesSport) scoreBonus += 5;
				if (formData.hasChronicCondition) priceMultiplier *= 1.1;
			}

			const adjustedMonthly = Math.round(offer.price.monthly * priceMultiplier);

			return {
				...offer,
				price: {
					monthly: adjustedMonthly,
					yearly: adjustedMonthly * 12,
				},
				// Adjust score based on how close to budget + bonuses
				score:
					budget > 0
						? Math.max(50, offer.score - Math.abs(adjustedMonthly - budget) * 2 + scoreBonus)
						: offer.score + scoreBonus,
			};
		});

		// Sort by score (highest first)
		results.sort((a, b) => b.score - a.score);

		// Mark the best offer as recommended
		if (results.length > 0) {
			results = results.map((offer, index) => ({
				...offer,
				recommended: index === 0,
			}));
		}

		return results;
	}

	// Get available insurance types
	static getAvailableTypes(): InsuranceType[] {
		return Object.keys(mockData) as InsuranceType[];
	}

	// Get sample offer for a type (for previews)
	static getSampleOffer(insuranceType: InsuranceType): ComparisonOffer | null {
		const offers = mockData[insuranceType];
		return offers.length > 0 ? offers[0] : null;
	}
}
