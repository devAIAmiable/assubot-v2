import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import chatReducer from './chatSlice';
import { chatsApi } from './chatsApi';
import comparisonsReducer from './comparisonsSlice';
import contractCreationReducer from './contractCreationSlice';
import { contractsApi } from './contractsApi';
import contractsReducer from './contractsSlice';
import { creditPacksApi } from './creditPacksApi';
import { creditTransactionsApi } from './creditTransactionsApi';
import { generalTermsApi } from './generalTermsApi';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';

// Custom persist config for user slice that excludes error and loading states
const userPersistConfig = {
	key: 'user',
	storage,
	whitelist: ['currentUser', 'isAuthenticated', 'loginAttempts', 'lastLoginAt'], // Don't persist error and loading
};

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['chat', 'comparisons'], // Persist chat history and comparisons
};

const rootReducer = combineReducers({
	contracts: contractsReducer,
	contractCreation: contractCreationReducer,
	user: persistReducer(userPersistConfig, userReducer),
	chat: chatReducer,
	comparisons: comparisonsReducer,
	[contractsApi.reducerPath]: contractsApi.reducer,
	[chatsApi.reducerPath]: chatsApi.reducer,
	[creditPacksApi.reducerPath]: creditPacksApi.reducer,
	[creditTransactionsApi.reducerPath]: creditTransactionsApi.reducer,
	[generalTermsApi.reducerPath]: generalTermsApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
			},
		}).concat(
			contractsApi.middleware,
			chatsApi.middleware,
			creditPacksApi.middleware,
			creditTransactionsApi.middleware,
			generalTermsApi.middleware
		),
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof rootReducer>;
export type PersistedRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
