/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { db } from 'src/firebaseconfig';
import { selectUserId } from './authSlice';

const initialState = {
    patientsList: [],
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
        FILL_PATIENTS: (state, actions) => {

            state.patientsList = actions.payload;

        },

    }
});

export const { ADD_PATIENTS, EDIT_PATIENTS, DELETE_PATIENTS, FILL_PATIENTS } = patientSlice.actions;
export const selectAllPatients = (state) => state.allPatiets.patientsList;

export default patientSlice.reducer