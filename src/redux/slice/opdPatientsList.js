/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    opdpatientsList: [],
    lastOpdData: undefined
}

const opdpatientSlice = createSlice({
    name: "opdPatients",
    initialState,
    reducers: {
        ADD_OPD_PATIENTS: (state, actions) => {

            if (state.opdpatientsList) {

                state.opdpatientsList = [...state.opdpatientsList, actions.payload];
            } else {

                state.opdpatientsList = actions.payload;
            }

        },
        EDIT_OPD_PATIENTS: (state, actions) => {

            const findIndex = state.opdpatientsList.findIndex((item) => item.opduid === actions.payload.opduid)
            state.opdpatientsList[findIndex] = actions.payload


        },
        DELETE_OPD_PATIENTS: (state, actions) => {

            state.opdpatientsList = state.opdpatientsList.filter((item) => item.opduid !== actions.payload.opduid)

        },

        FILL_OPD_PATIENTS: (state, actions) => {
            actions.payload.forEach((newPatient) => {
                const existingPatientIndex = state.opdpatientsList.findIndex(
                    (patient) => patient.opduid === newPatient.opduid
                );

                if (existingPatientIndex !== -1) {
                    // If a patient with the same pid already exists
                    const existingPatient = state.opdpatientsList[existingPatientIndex];

                    // Check if the newPatient has a 'deleted' field and it is truthy (e.g., true)
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value,
                        // we will remove the existing patient from the list
                        state.opdpatientsList.splice(existingPatientIndex, 1);
                    } else {
                        // If the newPatient does not have a 'deleted' field or the 'deleted' field is falsy,
                        // we will update the existing patient with the newPatient data
                        state.opdpatientsList.splice(existingPatientIndex, 1, newPatient);
                    }
                } else {
                    // If the patient with the same pid doesn't exist, add the new patient to the list
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value, skip pushing it to the list
                        return;
                    }
                    state.opdpatientsList.push(newPatient);
                }
            });
            // state.opdpatientsList = [...state.opdpatientsList, ...actions.payload];
        },
        UPDATE_MULTI_OPD_PATIENTS: (state, actions) => {

            // const findIndex = state.admitpatientsList.findIndex((item) => item.admituid === actions.payload.admituid)
            // state.admitpatientsList[findIndex] = actions.payload
            const { obj, data } = actions.payload
            // console.log('for updating multiple object', obj, data);
            state.opdpatientsList = state.opdpatientsList?.map((item) => {
                if (item.pid === data.pid && item.paymentStatus === "Pending") {
                    return { ...item, ...obj }
                } else {
                    return item
                }
            })

        },
        ADD_LAST_OPD_DATA: (state, actions) => {
            console.log('last opd query snapshot', actions.payload);
            state.lastOpdData = actions.payload

        },
        RESET_OPD: (state, actions) => {
            state.opdpatientsList = [];
            state.lastOpdData = undefined

        },
    }
});

export const { ADD_OPD_PATIENTS, EDIT_OPD_PATIENTS, DELETE_OPD_PATIENTS, RESET_OPD, FILL_OPD_PATIENTS, UPDATE_MULTI_OPD_PATIENTS, ADD_LAST_OPD_DATA } = opdpatientSlice.actions;
export const selectOpdPatients = (state) => state.opdPatients.opdpatientsList;
export const selectlastOpdData = (state) => state.opdPatients.lastOpdData;

export default opdpatientSlice.reducer