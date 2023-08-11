/* eslint-disable prettier/prettier */
import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import admitPatientsReducer from './slice/admitPatientsSlice';
import authSliceReducer from './slice/authSlice';
import changeStateReducer from './slice/changeStateslice';
import medicinesMasterReducer from './slice/medicinesMasterSlice';
import opdPatientsReducer from './slice/opdPatientsList';
import patientREducer from './slice/patientMasterslice';
import patientsMedicinesReducer from './slice/patientsMedicinesSlice';
import roomMasterReducer from './slice/roomMasterSlice';
import drMasterReducer from './slice/doctorsSlice'
import invoiceReducer from './slice/invoiceSlice';
import dischargePatientReducer from './slice/dischargePatientSlice';
import laborataryMasterReducer from './slice/laborataryMaster';
import patientsLaboratoryReportsReducer from './slice/patientsLaboratoryReportsSlice';
import changeMenustyleReducer from './slice/changeMenustyleSlice';
import returnMedicineReducer from './slice/returnMedicineslice';
import taxReducer from './slice/taxSlice';
import chargesReducer from './slice/chargesSlice';
import hospitalProfileReducer from './slice/hospitalProfileSlice';
import prevBillNoReducer from './slice/prevBillNoSlice';
import dashboardReducer from './slice/dashboardSlice';
const rooReducer = combineReducers({
    changeState: changeStateReducer,
    allPatiets: patientREducer,
    opdPatients: opdPatientsReducer,
    admitPatients: admitPatientsReducer,
    allRooms: roomMasterReducer,
    allmedicines: medicinesMasterReducer,
    patientsmedicines: patientsMedicinesReducer,
    auth: authSliceReducer,
    allDoctors: drMasterReducer,
    invoice: invoiceReducer,
    dischargePatients: dischargePatientReducer,
    allparameters: laborataryMasterReducer,
    alllaboratoryReports: patientsLaboratoryReportsReducer,
    changeMenustyle: changeMenustyleReducer,
    returnpatientsmedicines: returnMedicineReducer,
    alltax: taxReducer,
    allCharges: chargesReducer,
    hospitalProfile: hospitalProfileReducer,
    prevBillNo: prevBillNoReducer,
    dashboard: dashboardReducer
}

)
const persistConfig = {
    key: 'Hospital_Data',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rooReducer)
export const store = configureStore({
    reducer: persistedReducer,
    devTools: false,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
})

export const persistor = persistStore(store)
// export default {store,persistor};