/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    indoorprevBillNo: undefined,
    opdprevBillNo: undefined,
}

const prevBillNoSlice = createSlice({
    name: "prevBillNo",
    initialState,
    reducers: {
        SET_INDOORPREVBILL_NO: (state, actions) => {
            const { billNo } = actions.payload;
            state.indoorprevBillNo = billNo
        },
        SET_OPDPREVBILL_NO: (state, actions) => {
            const { billNo } = actions.payload;
            state.opdprevBillNo = billNo

        },

    }
});

export const { SET_INDOORPREVBILL_NO, SET_OPDPREVBILL_NO } = prevBillNoSlice.actions;
export const selectindoorprevBillNo = (state) => state.prevBillNo.indoorprevBillNo;
export const selectopdrprevBillNo = (state) => state.prevBillNo.opdprevBillNo;

export default prevBillNoSlice.reducer