import Button from './ui/Button';
import { FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage = () => {
	const navigate = useNavigate();

	const handleBackToCredits = () => {
		navigate('/app/credits');
	};


	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="max-w-2xl mx-auto px-4 py-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center"
				>
					{/* Cancel Icon */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center"
					>
						<FaTimesCircle className="h-12 w-12 text-red-600" />
					</motion.div>

					{/* Cancel Message */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement annulé</h1>
						<p className="text-lg text-gray-600 mb-8">
							Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
						</p>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="space-y-4"
					>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button onClick={handleBackToCredits} className="flex items-center">
								Retour
							</Button>
						</div>

						{/* Additional Info */}
						<div className="mt-8 text-sm text-gray-500">
							<p>Si vous avez des questions, contactez notre support client.</p>
							<p className="mt-1">Votre session de paiement a été fermée en toute sécurité.</p>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default PaymentCancelPage;
