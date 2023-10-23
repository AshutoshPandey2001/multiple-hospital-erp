/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    indoorprevBillNo: undefined,
    opdprevBillNo: undefined,
    medicineprevBillNo: undefined,
    returnmedicineprevBillNo: undefined,
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
        SET_MEDICINEPREVBILL_NO: (state, actions) => {
            const { billNo } = actions.payload;
            state.medicineprevBillNo = billNo

        },
        SET_RETURN_MEDICINEPREVBILL_NO: (state, actions) => {
            const { billNo } = actions.payload;
            state.returnmedicineprevBillNo = billNo
        },
        RESET_PREV_INVOICE_NO: (state, actions) => {
            state.indoorprevBillNo = undefined;
            state.opdprevBillNo = undefined;
            state.medicineprevBillNo = undefined;
            state.returnmedicineprevBillNo = undefined;
        },
    }
});

export const { SET_INDOORPREVBILL_NO, SET_OPDPREVBILL_NO, SET_MEDICINEPREVBILL_NO, SET_RETURN_MEDICINEPREVBILL_NO, RESET_PREV_INVOICE_NO } = prevBillNoSlice.actions;
export const selectindoorprevBillNo = (state) => state.prevBillNo.indoorprevBillNo;
export const selectopdrprevBillNo = (state) => state.prevBillNo.opdprevBillNo;
export const selectmedicinerprevBillNo = (state) => state.prevBillNo.medicineprevBillNo;
export const selectreturnmedicinerprevBillNo = (state) => state.prevBillNo.returnmedicineprevBillNo;

export default prevBillNoSlice.reducer