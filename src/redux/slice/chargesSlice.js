/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    chargesList: [],
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

    }
});

export const { ADD_CHARGE, EDIT_CHARGE, DELETE_CHARGE, FILL_CHARGES } = chargesMasterSlice.actions;
export const selectAllCharges = (state) => state.allCharges.chargesList;

export default chargesMasterSlice.reducer