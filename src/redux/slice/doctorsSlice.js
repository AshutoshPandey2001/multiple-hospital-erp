/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    doctorList: [],
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

            state.doctorList = actions.payload;

        },

    }
});

export const { ADD_DR, EDIT_DR, DELETE_DR, FILL_DR } = docotrMsterSlice.actions;
export const selectAllDr = (state) => state.allDoctors.doctorList;

export default docotrMsterSlice.reducer