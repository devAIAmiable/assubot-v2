import type { ChatResponse } from '../types';

// Mock responses for the insurance chatbot
const mockResponses: { [key: string]: ChatResponse[] } = {
	greeting: [
		{
			message: "Bonjour ! Je suis AssuBot, votre assistant virtuel pour toutes vos questions d'assurance. Comment puis-je vous aider aujourd'hui ?",
			quickReplies: [
				{ id: '1', text: '🚗 Assurance auto', payload: 'auto_insurance' },
				{ id: '2', text: '🏠 Assurance habitation', payload: 'home_insurance' },
				{ id: '3', text: '🏥 Assurance santé', payload: 'health_insurance' },
				{ id: '4', text: '💰 Comparer les prix', payload: 'compare_prices' }
			]
		}
	],
	auto_insurance: [
		{
			message: "L'assurance auto est obligatoire en France. Je peux vous aider à comprendre les différents types de couverture : responsabilité civile, tous risques, ou au tiers étendu. Que souhaitez-vous savoir ?",
			quickReplies: [
				{ id: '1', text: 'Types de couverture', payload: 'coverage_types' },
				{ id: '2', text: 'Tarifs moyens', payload: 'average_prices' },
				{ id: '3', text: 'Documents nécessaires', payload: 'required_docs' }
			]
		}
	],
	home_insurance: [
		{
			message: "L'assurance habitation protège votre logement et vos biens. Elle couvre généralement les dégâts des eaux, incendies, vols et catastrophes naturelles. Êtes-vous propriétaire ou locataire ?",
			quickReplies: [
				{ id: '1', text: 'Propriétaire', payload: 'owner' },
				{ id: '2', text: 'Locataire', payload: 'tenant' },
				{ id: '3', text: 'Que couvre-t-elle ?', payload: 'home_coverage' }
			]
		}
	],
	health_insurance: [
		{
			message: "L'assurance santé complémentaire (mutuelle) complète les remboursements de la Sécurité sociale. Elle peut couvrir les consultations, médicaments, hospitalisation et soins dentaires. Avez-vous des besoins spécifiques ?",
			quickReplies: [
				{ id: '1', text: 'Soins dentaires', payload: 'dental_care' },
				{ id: '2', text: 'Optique', payload: 'optical_care' },
				{ id: '3', text: 'Hospitalisation', payload: 'hospital_care' }
			]
		}
	],
	coverage_types: [
		{
			message: "Voici les principales couvertures auto :\n\n🔸 **Au tiers** : Responsabilité civile obligatoire (dommages causés aux autres)\n🔸 **Tiers étendu** : + vol, incendie, bris de glace\n🔸 **Tous risques** : Couverture complète incluant vos propres dommages\n\nLe choix dépend de l'âge et la valeur de votre véhicule."
		}
	],
	compare_prices: [
		{
			message: "Pour comparer les prix d'assurance, je peux vous aider ! Les tarifs varient selon votre profil, votre véhicule et vos besoins. Voulez-vous une estimation ?",
			quickReplies: [
				{ id: '1', text: 'Oui, faire une simulation', payload: 'simulation' },
				{ id: '2', text: 'Conseils pour économiser', payload: 'save_money' }
			]
		}
	],
	save_money: [
		{
			message: "Voici mes conseils pour réduire votre prime d'assurance :\n\n💡 **Comparez** plusieurs devis chaque année\n💡 **Augmentez** votre franchise\n💡 **Regroupez** vos contrats chez le même assureur\n💡 **Installez** des dispositifs de sécurité\n💡 **Conduisez** moins (assurance au km)\n\nCertaines de ces options vous intéressent-elles ?"
		}
	],
	default: [
		{
			message: "Je comprends votre question sur l'assurance. Pouvez-vous être plus spécifique ? Je peux vous aider avec l'assurance auto, habitation, santé, ou la comparaison de prix.",
			quickReplies: [
				{ id: '1', text: 'Assurance auto', payload: 'auto_insurance' },
				{ id: '2', text: 'Assurance habitation', payload: 'home_insurance' },
				{ id: '3', text: 'Parler à un conseiller', payload: 'human_agent' }
			]
		},
		{
			message: "C'est une excellente question ! En matière d'assurance, il y a souvent plusieurs options à considérer. Laissez-moi vous expliquer les points essentiels.",
		},
		{
			message: "Merci pour votre question. L'assurance peut sembler complexe, mais je suis là pour vous simplifier les choses. Que souhaitez-vous savoir exactement ?",
			quickReplies: [
				{ id: '1', text: 'Les bases', payload: 'insurance_basics' },
				{ id: '2', text: 'Mon cas spécifique', payload: 'specific_case' }
			]
		}
	],
	human_agent: [
		{
			message: "Je vais vous mettre en relation avec un de nos conseillers. Vous pouvez nous contacter au 📞 01 23 45 67 89 du lundi au vendredi de 9h à 18h, ou par email à contact@assubot.fr",
			quickReplies: [
				{ id: '1', text: 'Autres questions', payload: 'greeting' },
				{ id: '2', text: 'Prendre RDV', payload: 'appointment' }
			]
		}
	]
};

// Function to get a random response from an array
const getRandomResponse = (responses: ChatResponse[]): ChatResponse => {
	return responses[Math.floor(Math.random() * responses.length)];
};

// Function to check if user input matches certain keywords
const getResponseKey = (message: string): string => {
	const lowerMessage = message.toLowerCase();
	
	// Check for specific keywords
	if (lowerMessage.includes('auto') || lowerMessage.includes('voiture') || lowerMessage.includes('véhicule')) {
		return 'auto_insurance';
	}
	if (lowerMessage.includes('habitation') || lowerMessage.includes('logement') || lowerMessage.includes('maison')) {
		return 'home_insurance';
	}
	if (lowerMessage.includes('santé') || lowerMessage.includes('mutuelle') || lowerMessage.includes('médical')) {
		return 'health_insurance';
	}
	if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût') || lowerMessage.includes('comparer')) {
		return 'compare_prices';
	}
	if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
		return 'greeting';
	}
	if (lowerMessage.includes('économiser') || lowerMessage.includes('réduire') || lowerMessage.includes('moins cher')) {
		return 'save_money';
	}
	if (lowerMessage.includes('conseiller') || lowerMessage.includes('humain') || lowerMessage.includes('personne')) {
		return 'human_agent';
	}
	
	return 'default';
};

// Main chat service class
export class ChatService {
	private static instance: ChatService;
	
	private constructor() {}
	
	public static getInstance(): ChatService {
		if (!ChatService.instance) {
			ChatService.instance = new ChatService();
		}
		return ChatService.instance;
	}
	
	// Simulate API call with random delay
	public async sendMessage(message: string, payload?: string, contractIds?: string[]): Promise<ChatResponse> {
		// Simulate network delay (500ms to 2s)
		const delay = Math.random() * 1500 + 500;
		await new Promise(resolve => setTimeout(resolve, delay));
		
		// Simulate occasional API errors (5% chance)
		if (Math.random() < 0.05) {
			throw new Error('Erreur de connexion. Veuillez réessayer.');
		}
		
		// Determine response based on payload or message content
		const responseKey = payload || getResponseKey(message);
		let responses = mockResponses[responseKey] || mockResponses.default;
		
		// If contracts are selected, provide context-aware responses
		if (contractIds && contractIds.length > 0) {
			responses = this.getContractContextualResponse(message, contractIds, responseKey);
		}
		
		return getRandomResponse(responses);
	}
	
	// Get contextual responses based on selected contracts
	private getContractContextualResponse(message: string, contractIds: string[], responseKey: string): ChatResponse[] {
		const contractCount = contractIds.length;
		const contractText = contractCount === 1 ? 'contrat sélectionné' : 'contrats sélectionnés';
		const userQuestion = message.length > 50 ? message.substring(0, 50) + '...' : message;
		
		// Add contract-specific context to responses
		const contextualResponses: ChatResponse[] = [
			{
				message: `Concernant "${userQuestion}", et basé sur ${contractCount === 1 ? 'le' : 'les'} ${contractCount} ${contractText}, voici ce que je peux vous dire : ${getRandomResponse(mockResponses[responseKey] || mockResponses.default).message}`,
				quickReplies: [
					{ id: '1', text: 'Modifier ma sélection', payload: 'change_contracts' },
					{ id: '2', text: 'Détails du contrat', payload: 'contract_details' },
					{ id: '3', text: 'Optimiser ma couverture', payload: 'optimize_coverage' }
				]
			},
			{
				message: `En analysant ${contractCount === 1 ? 'votre contrat' : 'vos contrats'}, je remarque que vous pourriez bénéficier d'une optimisation. Voulez-vous que j'analyse plus en détail ?`,
				quickReplies: [
					{ id: '1', text: 'Oui, analyser', payload: 'analyze_contracts' },
					{ id: '2', text: 'Comparer les prix', payload: 'compare_prices' },
					{ id: '3', text: 'Autre question', payload: 'other_question' }
				]
			}
		];
		
		return contextualResponses;
	}
	
	// Get initial greeting message
	public async getGreeting(): Promise<ChatResponse> {
		await new Promise(resolve => setTimeout(resolve, 800));
		return getRandomResponse(mockResponses.greeting);
	}
	
	// Simulate typing indicator
	public simulateTyping(): Promise<void> {
		const typingTime = Math.random() * 1000 + 500;
		return new Promise(resolve => setTimeout(resolve, typingTime));
	}
}

export default ChatService.getInstance(); 