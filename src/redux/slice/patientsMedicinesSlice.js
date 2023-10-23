/* eslint-disable prettier/prettier */
/* eslint-disable no-self-assign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    patientsmedicinesList: [],
}

const patientsmedicinesSlice = createSlice({
    name: "patientsmedicines",
    initialState,
    reducers: {
        ADD_PATIENTS_MEDICINES: (state, actions) => {

            if (state.patientsmedicinesList) {
                state.patientsmedicinesList = [...state.patientsmedicinesList, actions.payload];
            } else {
                state.patientsmedicinesList = actions.payload;
            }
        },
        EDIT_PATIENTS_MEDICINES: (state, actions) => {

            const findIndex = state.patientsmedicinesList.findIndex((item) => item.pmeduid === actions.payload.pmeduid)
            state.patientsmedicinesList[findIndex] = actions.payload
        },
        DELETE_PATIENTS_MEDICINES: (state, actions) => {

            state.patientsmedicinesList = state.patientsmedicinesList.filter((item) => item.pmeduid !== actions.payload.pmeduid)
        },

        CHANGE_STATUS_PATIENTS_MEDICINES: (state, actions) => {
            if (actions.payload) {
                state.patientsmedicinesList = actions.payload;
            } else {

                state.patientsmedicinesList = state.patientsmedicinesList;
            }
        },
        FILL_PATIENTS_MEDICINES: (state, actions) => {
            state.patientsmedicinesList = actions.payload;
        },
        RESET_PATIENTS_MEDICINES: (state, actions) => {
            state.patientsmedicinesList = [];
        },
    }
});

export const { ADD_PATIENTS_MEDICINES, EDIT_PATIENTS_MEDICINES, DELETE_PATIENTS_MEDICINES, CHANGE_STATUS_PATIENTS_MEDICINES, RESET_PATIENTS_MEDICINES, FILL_PATIENTS_MEDICINES } = patientsmedicinesSlice.actions;
export const selectAllPatientsMedicines = (state) => state.patientsmedicines.patientsmedicinesList;

export default patientsmedicinesSlice.reducer