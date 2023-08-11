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
            // actions.payload.forEach((newCharge) => {
            //     const existingChargeIndex = state.chargesList.findIndex(
            //         (charge) => charge.chargeuid === newCharge.chargeuid
            //     );

            //     if (existingChargeIndex !== -1) {
            //         // If a patient with the same pid already exists
            //         const existingPatient = state.chargesList[existingChargeIndex];

            //         // Check if the newCharge has a 'deleted' field and it is truthy (e.g., true)
            //         if (newCharge.hasOwnProperty('deleted') && newCharge.deleted) {
            //             // If the newCharge has a 'deleted' field with a truthy value,
            //             // we will remove the existing patient from the list
            //             state.chargesList.splice(existingChargeIndex, 1);
            //         } else {
            //             // If the newCharge does not have a 'deleted' field or the 'deleted' field is falsy,
            //             // we will update the existing patient with the newCharge data
            //             state.chargesList.splice(existingChargeIndex, 1, newCharge);
            //         }
            //     } else {
            //         // If the patient with the same pid doesn't exist, add the new patient to the list
            //         if (newCharge.hasOwnProperty('deleted') && newCharge.deleted) {
            //             // If the newCharge has a 'deleted' field with a truthy value, skip pushing it to the list
            //             return;
            //         }
            //         state.chargesList.push(newCharge);
            //     }
            // });
            state.chargesList = actions.payload;

        },
        ADD_LAST_CHARGE_DATA: (state, actions) => {
            console.log('last opd query snapshot', actions.payload);
            state.lastchargeData = actions.payload

        },
    }
});

export const { ADD_CHARGE, EDIT_CHARGE, DELETE_CHARGE, FILL_CHARGES, ADD_LAST_CHARGE_DATA } = chargesMasterSlice.actions;
export const selectAllCharges = (state) => state.allCharges.chargesList;
export const selectlastChargeData = (state) => state.allCharges.lastchargeData;

export default chargesMasterSlice.reducer