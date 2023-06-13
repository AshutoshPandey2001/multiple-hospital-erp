/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    opdpatientsList: [],
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

            state.opdpatientsList = actions.payload;
        },
    }
});

export const { ADD_OPD_PATIENTS, EDIT_OPD_PATIENTS, DELETE_OPD_PATIENTS, FILL_OPD_PATIENTS } = opdpatientSlice.actions;
export const selectOpdPatients = (state) => state.opdPatients.opdpatientsList;

export default opdpatientSlice.reducer