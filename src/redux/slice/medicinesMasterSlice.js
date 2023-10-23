/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    medicinesList: [],
    lastMedicines: undefined,
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



            state.medicinesList = actions.payload;
            // }
        },

        FILL_MEDICINES_STOCK: (state, actions) => {
            actions.payload.forEach((newMedicines) => {
                const existingMedicineIndex = state.medicinesList.findIndex(
                    (patient) => patient.medicineuid === newMedicines.medicineuid
                );

                if (existingMedicineIndex !== -1) {
                    // If a patient with the same pid already exists
                    const existingMedicine = state.medicinesList[existingMedicineIndex];

                    // Check if the newMedicines has a 'deleted' field and it is truthy (e.g., true)
                    if (newMedicines.hasOwnProperty('deleted') && newMedicines.deleted) {
                        // If the newMedicines has a 'deleted' field with a truthy value,
                        // we will remove the existing patient from the list
                        state.medicinesList.splice(existingMedicineIndex, 1);
                    } else {
                        // If the newMedicines does not have a 'deleted' field or the 'deleted' field is falsy,
                        // we will update the existing patient with the newMedicines data
                        state.medicinesList.splice(existingMedicineIndex, 1, newMedicines);
                    }
                } else {
                    // If the patient with the same pid doesn't exist, add the new patient to the list
                    if (newMedicines.hasOwnProperty('deleted') && newMedicines.deleted) {
                        // If the newMedicines has a 'deleted' field with a truthy value, skip pushing it to the list
                        return;
                    }
                    state.medicinesList.push(newMedicines);
                }
            });



        },

        ADD_LAST_MEDICINES: (state, actions) => {
            state.lastMedicines = actions.payload
        },

        UPDATE_MEDICINES: (state, actions) => {
            state.medicinesList = actions.payload;
        },

        RESET_MEDICINES: (state, actions) => {
            state.medicinesList = [];
            state.lastMedicines = undefined;
        },
    }
});

export const { ADD_MEDICINES, EDIT_MEDICINES, DELETE_MEDICINES, UPLOAD_MEDICINES, RESET_MEDICINES, UPDATE_MEDICINES, FILL_MEDICINES_STOCK, ADD_LAST_MEDICINES } = medicinesMsterSlice.actions;
export const selectAllMedicines = (state) => state.allmedicines.medicinesList;
export const selectLastMedicine = (state) => state.allmedicines.lastMedicines;

export default medicinesMsterSlice.reducer