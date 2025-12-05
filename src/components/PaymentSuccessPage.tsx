import { FaCheckCircle, FaCoins } from 'react-icons/fa';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from './ui/Button';
import type { CreditPack } from '../services/creditService';
import { motion } from 'framer-motion';
import { trackCreditPackPurchase } from '@/services/analytics';
import { updateCredits } from '../store/userSlice';
import { useAppDispatch } from '../store/hooks';
import { useGetCreditPacksQuery } from '../store/creditPacksApi';
import { userService } from '../services/coreApi';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get('session_id');
  const creditPackId = sessionStorage.getItem('selectedCreditPackId');

  const { data: creditPacks = [] } = useGetCreditPacksQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number>(0);

  const trackPurchaseOutcome = useCallback(
    (status: 'success' | 'error', pack?: CreditPack | null) => {
      trackCreditPackPurchase({
        packId: pack?.id ?? creditPackId ?? 'unknown',
        packName: pack?.name ?? 'unknown',
        creditAmount: pack?.creditAmount ?? 0,
        priceEur: pack ? pack.priceCents / 100 : 0,
        paymentStatus: status,
      });
    },
    [creditPackId]
  );

  useEffect(() => {
    const processPurchase = async () => {
      if (!sessionId) {
        trackPurchaseOutcome('error');
        setError('Session ID manquant');
        setLoading(false);
        return;
      }

      if (!creditPackId) {
        trackPurchaseOutcome('error');
        setLoading(false);
        setTimeout(() => {
          navigate('/app/credits');
        }, 2000);
        return;
      }

      const purchasedPack = creditPacks.find((pack) => pack.id === creditPackId) ?? null;

      if (!purchasedPack) {
        trackPurchaseOutcome('error');
        setLoading(false);
        setTimeout(() => {
          navigate('/app/credits');
        }, 2000);
        return;
      }

      try {
        setLoading(true);

        // Fetch the latest credit balance from the backend
        const creditsResponse = await userService.getCredits();

        if (creditsResponse.success && creditsResponse.data !== undefined && creditsResponse.data !== null) {
          // Update the credits in Redux with the latest balance from the backend
          dispatch(updateCredits(creditsResponse.data));
        }

        setCreditsAdded(purchasedPack.creditAmount);
        trackPurchaseOutcome('success', purchasedPack);
        sessionStorage.removeItem('selectedCreditPackId');
      } catch {
        trackPurchaseOutcome('error', purchasedPack);
        setError('Erreur lors de la mise à jour des crédits');
      } finally {
        setLoading(false);
      }
    };

    processPurchase();
  }, [sessionId, creditPackId, creditPacks, dispatch, navigate, trackPurchaseOutcome]);

  const handleBackToCredits = () => {
    navigate('/app/credits');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaCheckCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleBackToCredits} className="mr-3">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center"
          >
            <FaCheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement réussi !</h1>
            <p className="text-lg text-gray-600 mb-8">Merci pour votre achat. Vos crédits ont été ajoutés à votre compte.</p>
          </motion.div>

          {/* Credits Added */}
          {creditsAdded > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <FaCoins className="h-6 w-6 text-[#1e51ab]" />
                <span className="text-2xl font-bold text-[#1e51ab]">+{creditsAdded} crédits</span>
              </div>
              <p className="text-gray-600">Vos crédits sont maintenant disponibles pour utiliser les fonctionnalités premium.</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleBackToCredits} className="flex items-center">
                {creditsAdded > 0 ? 'Voir mes crédits' : 'Retour aux crédits'}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-sm text-gray-500">
              <p>Un email de confirmation a été envoyé à votre adresse email.</p>
              {!creditsAdded && <p className="mt-1">Vos crédits sont disponibles dans votre compte.</p>}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
