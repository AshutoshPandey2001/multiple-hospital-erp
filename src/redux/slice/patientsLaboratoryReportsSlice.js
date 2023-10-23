/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    laboratoryReportsList: [],
}

const laboratoryReportSlice = createSlice({
    name: "alllaboratoryReports",
    initialState,
    reducers: {
        ADD_LABORATORY_REPORT: (state, actions) => {

            if (state.laboratoryReportsList) {
                state.laboratoryReportsList = [...state.laboratoryReportsList, actions.payload];
            } else {
                state.laboratoryReportsList = actions.payload;
            }


        },
        EDIT_LABORATORY_REPORT: (state, actions) => {
            const findIndex = state.laboratoryReportsList.findIndex((item) => item.labreportuid === actions.payload.labreportuid)
            state.laboratoryReportsList[findIndex] = actions.payload

        },
        DELETE_LABORATORY_REPORT: (state, actions) => {
            state.laboratoryReportsList = state.laboratoryReportsList.filter((item) => item.labreportuid !== actions.payload.labreportuid)
        },
        FILL_LABORATORY_REPORTS: (state, actions) => {
            state.laboratoryReportsList = actions.payload;
        },
        RESET_LABORATORY_REPORTS: (state, actions) => {
            state.laboratoryReportsList = [];
        },
    }
});

export const { ADD_LABORATORY_REPORT, EDIT_LABORATORY_REPORT, DELETE_LABORATORY_REPORT, FILL_LABORATORY_REPORTS, RESET_LABORATORY_REPORTS } = laboratoryReportSlice.actions;
export const selectAlllaboratoryReports = (state) => state.alllaboratoryReports.laboratoryReportsList;

export default laboratoryReportSlice.reducer