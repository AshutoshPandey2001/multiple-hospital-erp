/* eslint-disable prettier/prettier */
/* eslint-disable no-self-assign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    returnpatientsmedicinesList: [],
}

const returnpatientsmedicinesSlice = createSlice({
    name: "returnpatientsmedicines",
    initialState,
    reducers: {
        ADD_RETURN_PATIENTS_MEDICINES: (state, actions) => {

            if (state.returnpatientsmedicinesList) {
                state.returnpatientsmedicinesList = [...state.returnpatientsmedicinesList, actions.payload];
            } else {
                state.returnpatientsmedicinesList = actions.payload;
            }
        },
        EDIT_RETURN_PATIENTS_MEDICINES: (state, actions) => {

            const findIndex = state.returnpatientsmedicinesList.findIndex((item) => item.pmeduid === actions.payload.pmeduid)
            state.returnpatientsmedicinesList[findIndex] = actions.payload
        },
        DELETE_RETURN_PATIENTS_MEDICINES: (state, actions) => {

            state.returnpatientsmedicinesList = state.returnpatientsmedicinesList.filter((item) => item.pmeduid !== actions.payload.pmeduid)
        },

        FILL_RETURN_PATIENTS_MEDICINES: (state, actions) => {
            state.returnpatientsmedicinesList = actions.payload;
        },
    }
});

export const { ADD_RETURN_PATIENTS_MEDICINES, EDIT_RETURN_PATIENTS_MEDICINES, DELETE_RETURN_PATIENTS_MEDICINES, FILL_RETURN_PATIENTS_MEDICINES } = returnpatientsmedicinesSlice.actions;
export const selectAllreturnPatientsMedicines = (state) => state.returnpatientsmedicines.returnpatientsmedicinesList;

export default returnpatientsmedicinesSlice.reducer