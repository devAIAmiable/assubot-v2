import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import contractsReducer from './contractsSlice';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['contracts', 'user'], // Persist both contracts and user
};

const rootReducer = combineReducers({
	contracts: contractsReducer,
	user: userReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 