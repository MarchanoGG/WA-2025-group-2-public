// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from './authSlice'
import appointmentsReducer from './appointmentsSlice'
import parentBookingReducer from './parentBookingSlice'
import { injectStore } from '../api/client'

const rootReducer = combineReducers({
	auth: authReducer,
	appointments: appointmentsReducer,
	parentBooking: parentBookingReducer
})

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth'], // alleen auth persist
}

export const store = configureStore({
	reducer: persistReducer(persistConfig, rootReducer),
	middleware: (gdm) => gdm({ serializableCheck: false }),
})

injectStore(store)
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
