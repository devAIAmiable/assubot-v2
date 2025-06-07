import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import chatReducer from './chatSlice';
import contractsReducer from './contractsSlice';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['contracts', 'user', 'chat'], // Persist contracts, user, and chat history
};

const rootReducer = combineReducers({
	contracts: contractsReducer,
	user: userReducer,
	chat: chatReducer,
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