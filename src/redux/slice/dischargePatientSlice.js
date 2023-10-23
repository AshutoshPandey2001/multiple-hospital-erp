/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    dischargepatientsList: [],
}

const dischargepatientSlice = createSlice({
    name: "dischargePatients",
    initialState,
    reducers: {
        ADD_DISCHARGE_PATIENTS: (state, actions) => {

            if (state.dischargepatientsList) {

                state.dischargepatientsList = [...state.dischargepatientsList, actions.payload];
            } else {

                state.dischargepatientsList = actions.payload;
            }
        },
        EDIT_DISCHARGE_PATIENTS: (state, actions) => {

            const findIndex = state.dischargepatientsList.findIndex((item) => item.admituid === actions.payload.admituid)
            state.dischargepatientsList[findIndex] = actions.payload

        },
        DELETE_DISCHARGE_PATIENTS: (state, actions) => {

            state.dischargepatientsList = state.dischargepatientsList.filter((item) => item.admituid !== actions.payload.admituid)
        },
        FILL_DISCHARGE_PATIENTS: (state, actions) => {
            state.dischargepatientsList = actions.payload;
        },

        RESET_DISCHARGE_PATIENTS: (state, actions) => {
            state.dischargepatientsList = [];

        },
    }
});

export const { ADD_DISCHARGE_PATIENTS, EDIT_DISCHARGE_PATIENTS, DELETE_DISCHARGE_PATIENTS, FILL_DISCHARGE_PATIENTS, RESET_DISCHARGE_PATIENTS } = dischargepatientSlice.actions;
export const selectdischargePatients = (state) => state.dischargePatients.dischargepatientsList;

export default dischargepatientSlice.reducer