/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    medicinesList: [],
}

const medicinesMsterSlice = createSlice({
    name: "allmedicines",
    initialState,
    reducers: {
        ADD_MEDICINES: (state, actions) => {

            if (state.medicinesList) {
                const findIndex = state.medicinesList.findIndex((item) => item.medicineuid === actions.payload.medicineuid)
                if (findIndex >= 0) {
                    let totalStock = state.medicinesList[findIndex].availableStock + actions.payload.availableStock;
                    let newObj = { ...state.medicinesList[findIndex], availableStock: totalStock }
                    state.medicinesList[findIndex] = newObj
                } else {

                    state.medicinesList = [...state.medicinesList, actions.payload];
                }
            } else {

                state.medicinesList = actions.payload;
            }
        },
        EDIT_MEDICINES: (state, actions) => {

            const findIndex = state.medicinesList.findIndex((item) => item.medicineuid === actions.payload.medicineuid)
            state.medicinesList[findIndex] = actions.payload


        },
        DELETE_MEDICINES: (state, actions) => {

            state.medicinesList = state.medicinesList.filter((item) => item.medicineuid !== actions.payload.medicineuid)

        },
        UPLOAD_MEDICINES: (state, actions) => {

            // if (state.medicinesList) {
            //     
            //     state.medicinesList = [...state.medicinesList, ...actions.payload];
            // } else {

            state.medicinesList = actions.payload;
            // }
        },

        UPDATE_MEDICINES: (state, actions) => {


            state.medicinesList = actions.payload;

        },


    }
});

export const { ADD_MEDICINES, EDIT_MEDICINES, DELETE_MEDICINES, UPLOAD_MEDICINES, UPDATE_MEDICINES } = medicinesMsterSlice.actions;
export const selectAllMedicines = (state) => state.allmedicines.medicinesList;

export default medicinesMsterSlice.reducer