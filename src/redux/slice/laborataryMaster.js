/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    parametersList: [],
}

const laboratoryMsterSlice = createSlice({
    name: "allparameters",
    initialState,
    reducers: {
        ADD_PARAMETER: (state, actions) => {

            if (state.parametersList) {
                state.parametersList = [...state.parametersList, actions.payload];
            } else {
                state.parametersList = actions.payload;
            }


        },
        EDIT_PARAMETER: (state, actions) => {
            const findIndex = state.parametersList.findIndex((item) => item.reportuid === actions.payload.reportuid)
            state.parametersList[findIndex] = actions.payload

        },
        DELETE_PARAMETER: (state, actions) => {
            state.parametersList = state.parametersList.filter((item) => item.reportuid !== actions.payload.reportuid)
        },
        FILL_PARAMETERS: (state, actions) => {
            state.parametersList = actions.payload;
        },
        RESET_PARAMETERS: (state, actions) => {
            state.parametersList = [];
        },
    }
});

export const { ADD_PARAMETER, EDIT_PARAMETER, DELETE_PARAMETER, FILL_PARAMETERS, RESET_PARAMETERS } = laboratoryMsterSlice.actions;
export const selectAllparameters = (state) => state.allparameters.parametersList;

export default laboratoryMsterSlice.reducer