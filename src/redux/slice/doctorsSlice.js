/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    doctorList: [],
    lastDoctorData: undefined

}

const docotrMsterSlice = createSlice({
    name: "allDoctors",
    initialState,
    reducers: {
        ADD_DR: (state, actions) => {

            if (state.doctorList) {

                state.doctorList = [...state.doctorList, actions.payload];
            } else {

                state.doctorList = actions.payload;
            }
        },
        EDIT_DR: (state, actions) => {

            const findIndex = state.doctorList.findIndex((item) => item.druid === actions.payload.druid)
            state.doctorList[findIndex] = actions.payload

        },
        DELETE_DR: (state, actions) => {

            state.doctorList = state.doctorList.filter((item) => item.druid !== actions.payload.druid)
        },
        FILL_DR: (state, actions) => {
            // actions.payload.forEach((newDoctor) => {
            //     const existingDoctorIndex = state.doctorList.findIndex(
            //         (doctor) => doctor.druid === newDoctor.druid
            //     );

            //     if (existingDoctorIndex !== -1) {
            //         // If a patient with the same pid already exists
            //         const existingPatient = state.doctorList[existingDoctorIndex];

            //         // Check if the newDoctor has a 'deleted' field and it is truthy (e.g., true)
            //         if (newDoctor.hasOwnProperty('deleted') && newDoctor.deleted) {
            //             // If the newDoctor has a 'deleted' field with a truthy value,
            //             // we will remove the existing patient from the list
            //             state.doctorList.splice(existingDoctorIndex, 1);
            //         } else {
            //             // If the newDoctor does not have a 'deleted' field or the 'deleted' field is falsy,
            //             // we will update the existing patient with the newDoctor data
            //             state.doctorList.splice(existingDoctorIndex, 1, newDoctor);
            //         }
            //     } else {
            //         // If the patient with the same pid doesn't exist, add the new patient to the list
            //         if (newDoctor.hasOwnProperty('deleted') && newDoctor.deleted) {
            //             // If the newDoctor has a 'deleted' field with a truthy value, skip pushing it to the list
            //             return;
            //         }
            //         state.doctorList.push(newDoctor);
            //     }
            // });
            state.doctorList = actions.payload;

        },
        ADD_LAST_DOCTOR_DATA: (state, actions) => {
            console.log('last opd query snapshot', actions.payload);
            state.lastDoctorData = actions.payload

        },
        RESET_DR: (state, actions) => {
            state.doctorList = [];
            state.lastDoctorData = undefined

        },
    }
});

export const { ADD_DR, EDIT_DR, DELETE_DR, FILL_DR, RESET_DR } = docotrMsterSlice.actions;
export const selectAllDr = (state) => state.allDoctors.doctorList;
export const selectlastDoctorData = (state) => state.allDoctors.lastDoctorData;

export default docotrMsterSlice.reducer