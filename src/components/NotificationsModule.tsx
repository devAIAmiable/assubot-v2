import { getUser } from '../utils/stateHelpers';
import { useAppSelector } from '../store/hooks';

const NotificationsModule = () => {
	const user = useAppSelector(getUser);

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold text-gray-900 mb-2">Centre de notifications</h1>
			<p className="text-gray-600">
				{user?.first_name 
					? `${user.first_name}, restez informé de tous vos événements d'assurance importants.` 
					: 'Module en cours de développement...'
				}
			</p>
		</div>
	);
};

export default NotificationsModule; 