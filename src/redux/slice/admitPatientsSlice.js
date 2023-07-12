/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    admitpatientsList: [],
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
    }
});

export const { ADD_ADMIT_PATIENTS, EDIT_ADMIT_PATIENTS, DELETE_ADMIT_PATIENTS, FILL_ADMIT_PATIENTS, UPDATE_MULTI_ADMIT_PATIENTS } = admitpatientSlice.actions;
export const selectAdmitPatients = (state) => state.admitPatients.admitpatientsList;

export default admitpatientSlice.reducer