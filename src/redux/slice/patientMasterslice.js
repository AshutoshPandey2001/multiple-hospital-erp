/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { db } from 'src/firebaseconfig';
import { selectUserId } from './authSlice';

const initialState = {
    patientsList: [],
    lastPatientsData: undefined

}
const patientSlice = createSlice({
    name: "allPatiets",
    initialState,
    reducers: {

        ADD_PATIENTS: (state, actions) => {

            if (state.patientsList) {

                let obj = [...state.patientsList, actions.payload];
                state.patientsList = obj;
            } else {

                state.patientsList = actions.payload;
            }

        },
        EDIT_PATIENTS: (state, actions) => {

            const findIndex = state.patientsList.findIndex((item) => item.pid === actions.payload.pid)
            state.patientsList[findIndex] = actions.payload


        },
        DELETE_PATIENTS: (state, actions) => {

            state.patientsList = state.patientsList.filter((item) => item.pid !== actions.payload.pid)

        },
        // FILL_PATIENTS: (state, actions) => {
        //     actions.payload.forEach((newPatient) => {
        //         const existingPatientIndex = state.patientsList.findIndex(
        //             (patient) => patient.pid === newPatient.pid
        //         );

        //         if (existingPatientIndex !== -1) {
        //             // If a patient with the same pid already exists, replace it with the new patient
        //             state.patientsList.splice(existingPatientIndex, 1, newPatient);
        //         } else {
        //             // If the patient with the same pid doesn't exist, add the new patient to the list
        //             state.patientsList.push(newPatient);
        //         }
        //     });

        //     // state.patientsList = [...state.patientsList, ...actions.payload];

        // },
        FILL_PATIENTS: (state, actions) => {
            actions.payload.forEach((newPatient) => {
                const existingPatientIndex = state.patientsList.findIndex(
                    (patient) => patient.pid === newPatient.pid
                );

                if (existingPatientIndex !== -1) {
                    // If a patient with the same pid already exists
                    const existingPatient = state.patientsList[existingPatientIndex];

                    // Check if the newPatient has a 'deleted' field and it is truthy (e.g., true)
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value,
                        // we will remove the existing patient from the list
                        state.patientsList.splice(existingPatientIndex, 1);
                    } else {
                        // If the newPatient does not have a 'deleted' field or the 'deleted' field is falsy,
                        // we will update the existing patient with the newPatient data
                        state.patientsList.splice(existingPatientIndex, 1, newPatient);
                    }
                } else {
                    // If the patient with the same pid doesn't exist, add the new patient to the list
                    if (newPatient.hasOwnProperty('deleted') && newPatient.deleted) {
                        // If the newPatient has a 'deleted' field with a truthy value, skip pushing it to the list
                        return;
                    }
                    state.patientsList.push(newPatient);
                }
            });
            // state.lastPatientsData = actions.payload[actions.payload.length - 1] ? actions.payload[actions.payload.length - 1] : state.lastPatientsData
        },

        ADD_LAST_PATIENT_DATA: (state, actions) => {
            state.lastPatientsData = actions.payload
        },
        RESET_PATIENTS: (state, actions) => {
            state.patientsList = [];
            state.lastPatientsData = undefined

        },
    }
});

export const { ADD_PATIENTS, EDIT_PATIENTS, RESET_PATIENTS, DELETE_PATIENTS, FILL_PATIENTS, ADD_LAST_PATIENT_DATA } = patientSlice.actions;
export const selectAllPatients = (state) => state.allPatiets.patientsList;
export const selectlastPatientData = (state) => state.allPatiets.lastPatientsData;
export default patientSlice.reducer