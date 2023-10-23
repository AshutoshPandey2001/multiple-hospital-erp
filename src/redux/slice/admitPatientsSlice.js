/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    admitpatientsList: [],
    lastAdmitData: undefined
}

const admitpatientSlice = createSlice({
    name: "admitPatients",
    initialState,
    reducers: {
        ADD_ADMIT_PATIENTS: (state, actions) => {

            if (state.admitpatientsList) {

                state.admitpatientsList = [...state.admitpatientsList, actions.payload];
            } else {

                state.admitpatientsList = actions.payload;
            }
        },
        EDIT_ADMIT_PATIENTS: (state, actions) => {

            const findIndex = state.admitpatientsList.findIndex((item) => item.admituid === actions.payload.admituid)
            state.admitpatientsList[findIndex] = actions.payload

        },
        DELETE_ADMIT_PATIENTS: (state, actions) => {

            state.admitpatientsList = state.admitpatientsList.filter((item) => item.admituid !== actions.payload.admituid)
        },
        FILL_ADMIT_PATIENTS: (state, actions) => {

            state.admitpatientsList = actions.payload;
        },

        UPDATE_MULTI_ADMIT_PATIENTS: (state, actions) => {

            // const findIndex = state.admitpatientsList.findIndex((item) => item.admituid === actions.payload.admituid)
            // state.admitpatientsList[findIndex] = actions.payload
            const { obj, data } = actions.payload
            console.log('for updating multiple object', obj, data);
            state.admitpatientsList = state.admitpatientsList?.map((item) => {
                if (item.pid === data.pid && item.paymentStatus === "Pending" && item.dischargeDate) {
                    return { ...item, ...obj }
                } else {
                    return item
                }
            })

        },
        ADD_LAST_ADMIT_DATA: (state, actions) => {
            console.log('last opd query snapshot', actions.payload);
            state.lastAdmitData = actions.payload

        },
        RESET_INDOOR: (state, actions) => {
            state.admitpatientsList = [];
            state.lastAdmitData = undefined

        },
    }
});

export const { ADD_ADMIT_PATIENTS, EDIT_ADMIT_PATIENTS, DELETE_ADMIT_PATIENTS, RESET_INDOOR, FILL_ADMIT_PATIENTS, UPDATE_MULTI_ADMIT_PATIENTS, ADD_LAST_ADMIT_DATA } = admitpatientSlice.actions;
export const selectAdmitPatients = (state) => state.admitPatients.admitpatientsList;
export const selectlastAdmitData = (state) => state.admitPatients.lastAdmitData;
export default admitpatientSlice.reducer