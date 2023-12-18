/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    taxList: [],
    medicaltax: [],
}

const taxMsterSlice = createSlice({
    name: "alltax",
    initialState,
    reducers: {
        ADD_TAX: (state, actions) => {
            if (state.taxList) {
                state.taxList = [...state.taxList, actions.payload];
            } else {
                state.taxList = actions.payload;
            }
        },
        ADD_MEDICAL_TAX: (state, actions) => {
            if (state.medicaltax) {
                state.medicaltax = [...state.medicaltax, actions.payload];
            } else {
                state.medicaltax = actions.payload;
            }
        },
        EDIT_TAX: (state, actions) => {
            const findIndex = state.taxList.findIndex((item) => item.taxUid === actions.payload.taxUid)
            state.taxList[findIndex] = actions.payload;
        },
        EDIT_MEDICAL_TAX: (state, actions) => {
            const findIndex = state.medicaltax.findIndex((item) => item.taxUid === actions.payload.taxUid)
            state.medicaltax[findIndex] = actions.payload;
        },
        DELETE_TAX: (state, actions) => {
            state.taxList = state.taxList.filter((item) => item.taxUid !== actions.payload.taxUid)
        },
        DELETE_MEDICAL_TAX: (state, actions) => {
            state.medicaltax = state.medicaltax.filter((item) => item.taxUid !== actions.payload.taxUid)
        },
        FILL_TAXS: (state, actions) => {
            state.taxList = actions.payload;
        },
        FILL_MEDICAL_TAXS: (state, actions) => {
            state.medicaltax = actions.payload;
        },
        RESET_TAX: (state, actions) => {
            state.taxList = [];
            state.medicaltax = [];
        },
    }
});

export const { ADD_TAX, EDIT_TAX, DELETE_TAX, FILL_TAXS, ADD_MEDICAL_TAX, EDIT_MEDICAL_TAX, DELETE_MEDICAL_TAX, FILL_MEDICAL_TAXS, RESET_TAX } = taxMsterSlice.actions;
export const selectAlltax = (state) => state.alltax.taxList;
export const selectMedicalax = (state) => state.alltax.medicaltax;

export default taxMsterSlice.reducer