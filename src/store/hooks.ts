import type { AppDispatch, PersistedRootState } from './index';
import { useDispatch, useSelector } from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<PersistedRootState> = useSelector;

// Re-export the selectors for convenience
export { 
	selectContracts, 
	selectUser, 
	selectCurrentUser, 
	selectIsAuthenticated, 
	selectContractsList 
} from '../types/store'; 