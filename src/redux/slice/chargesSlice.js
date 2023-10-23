/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    chargesList: [],
    lastchargeData: undefined
}

const chargesMasterSlice = createSlice({
    name: "allCharges",
    initialState,
    reducers: {
        ADD_CHARGE: (state, actions) => {

            if (state.chargesList) {

                state.chargesList = [...state.chargesList, actions.payload];
            } else {

                state.chargesList = actions.payload;
            }
        },
        EDIT_CHARGE: (state, actions) => {

            const findIndex = state.chargesList.findIndex((item) => item.chargeuid === actions.payload.chargeuid)
            state.chargesList[findIndex] = actions.payload

        },
        DELETE_CHARGE: (state, actions) => {

            state.chargesList = state.chargesList.filter((item) => item.chargeuid !== actions.payload.chargeuid)
        },
        FILL_CHARGES: (state, actions) => {

            state.chargesList = actions.payload;

        },
        ADD_LAST_CHARGE_DATA: (state, actions) => {
            console.log('last opd query snapshot', actions.payload);
            state.lastchargeData = actions.payload

        },
        RESET_CHARGES: (state, actions) => {
            state.chargesList = [];
            state.lastchargeData = undefined

        },
    }
});

export const { ADD_CHARGE, EDIT_CHARGE, DELETE_CHARGE, FILL_CHARGES, ADD_LAST_CHARGE_DATA, RESET_CHARGES } = chargesMasterSlice.actions;
export const selectAllCharges = (state) => state.allCharges.chargesList;
export const selectlastChargeData = (state) => state.allCharges.lastchargeData;

export default chargesMasterSlice.reducer