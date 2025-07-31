import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import chatReducer from './chatSlice';
import comparisonsReducer from './comparisonsSlice';
import contractsReducer from './contractsSlice';
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
	user: persistReducer(userPersistConfig, userReducer),
	chat: chatReducer,
	comparisons: comparisonsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
			},
		}),
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof rootReducer>;
export type PersistedRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
