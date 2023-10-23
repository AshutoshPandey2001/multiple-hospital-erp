/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    taxList: [],
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
        EDIT_TAX: (state, actions) => {
            const findIndex = state.taxList.findIndex((item) => item.taxUid === actions.payload.taxUid)
            state.taxList[findIndex] = actions.payload;
        },
        DELETE_TAX: (state, actions) => {
            state.taxList = state.taxList.filter((item) => item.taxName !== actions.payload.taxName)
        },
        FILL_TAXS: (state, actions) => {
            state.taxList = actions.payload;
        },
        RESET_TAX: (state, actions) => {
            state.taxList = [];
        },
    }
});

export const { ADD_TAX, EDIT_TAX, DELETE_TAX, FILL_TAXS, RESET_TAX } = taxMsterSlice.actions;
export const selectAlltax = (state) => state.alltax.taxList;

export default taxMsterSlice.reducer