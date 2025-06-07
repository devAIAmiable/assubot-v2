import { getUser } from '../utils/stateHelpers';
import { useAppSelector } from '../store/hooks';

const ChatbotModule = () => {
	const user = useAppSelector(getUser);

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold text-gray-900 mb-2">Chatbot AssuBot</h1>
			<p className="text-gray-600">
				{user?.first_name 
					? `Salut ${user.first_name} ! Posez-moi toutes vos questions sur l'assurance.` 
					: 'Module en cours de développement...'
				}
			</p>
		</div>
	);
};

export default ChatbotModule; 