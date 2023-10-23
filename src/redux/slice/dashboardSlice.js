/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    admitList: [],
    opdList: [],
    lastAdmitData: undefined,
    lastOPDData: undefined
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {

        FILL_DASHBOARD_INDOOR_PATIENTS: (state, actions) => {
            actions.payload.forEach((newPatient) => {
                const existingPatientIndex = state.admitList.findIndex(
                    (patient) => patient.admituid === newPatient.admituid
                );

                if (existingPatientIndex !== -1) {
                    // If a patient with the same pid already exists
                    const existingPatient = state.admitList[existingPatientIndex];

                    // Check if the newPatient has a 'deleted' field and it is truthy (e.g., true)
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value,
                        // we will remove the existing patient from the list
                        state.admitList.splice(existingPatientIndex, 1);
                    } else {
                        // If the newPatient does not have a 'deleted' field or the 'deleted' field is falsy,
                        // we will update the existing patient with the newPatient data
                        state.admitList.splice(existingPatientIndex, 1, newPatient);
                    }
                } else {
                    // If the patient with the same pid doesn't exist, add the new patient to the list
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value, skip pushing it to the list
                        return;
                    }
                    state.admitList.push(newPatient);
                }
            });
            if (actions.payload.length > 0) {
                state.lastAdmitData = actions.payload[actions.payload.length - 1]
            }
            // state.admitpatientsList = actions.payload;
        },
        FILL_DASHBOARD_OPD_PATIENTS: (state, actions) => {
            actions.payload.forEach((newPatient) => {
                const existingPatientIndex = state.opdList.findIndex(
                    (patient) => patient.opduid === newPatient.opduid
                );

                if (existingPatientIndex !== -1) {
                    // If a patient with the same pid already exists
                    const existingPatient = state.opdList[existingPatientIndex];

                    // Check if the newPatient has a 'deleted' field and it is truthy (e.g., true)
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value,
                        // we will remove the existing patient from the list
                        state.opdList.splice(existingPatientIndex, 1);
                    } else {
                        // If the newPatient does not have a 'deleted' field or the 'deleted' field is falsy,
                        // we will update the existing patient with the newPatient data
                        state.opdList.splice(existingPatientIndex, 1, newPatient);
                    }
                } else {
                    // If the patient with the same pid doesn't exist, add the new patient to the list
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value, skip pushing it to the list
                        return;
                    }
                    state.opdList.push(newPatient);
                }
            });
            if (actions.payload.length > 0) {
                state.lastOPDData = actions.payload[actions.payload.length - 1]
            }
            // state.admitpatientsList = actions.payload;
        },

        RESET_DASHBOARD: (state, actions) => {
            state.admitList = [];
            state.opdList = [];
            state.lastAdmitData = undefined
            state.lastOPDData = undefined

        },
    }
});

export const { RESET_DASHBOARD, FILL_DASHBOARD_INDOOR_PATIENTS, FILL_DASHBOARD_OPD_PATIENTS } = dashboardSlice.actions;
export const selectDashboardAdmitData = (state) => state.dashboard.admitList;
export const selectDashboardopdData = (state) => state.dashboard.opdList;
export const selectDashboardAdmitLastData = (state) => state.dashboard.lastAdmitData;
export const selectDashboardopdLastData = (state) => state.dashboard.lastOPDData;
export default dashboardSlice.reducer