/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cgstValue: 0,
    sgstValue: 0,
    totalRoom: 0,
    // totalMedicine: 0,
    totalOflabReports: 0,
    totalofOpd: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    nursingunit: 0,
    nursingRate: 0,
    totalnursingCharge: 0,
    otunits: 0,
    otRate: 0,
    totalotCharge: 0,
    icuunits: 0,
    icuRate: 0,
    totalicuCharges: 0,
    subTotalamount: 0,
    totalBillingAmount: 0,
    totalPayableAmount: 0,
    hospitalCharges: 0,
    totaladvance: 0,
    totalExtracharges: 0,
    discount: 0,

}

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        SET_INVOICE: (state, actions) => {

            const { cgstpercentage, sgstpercentage, totalRoom, advance, totalOflabReports } = actions.payload
            state.cgstValue = cgstpercentage;
            state.sgstValue = sgstpercentage;
            state.totalRoom = totalRoom;
            state.totaladvance = advance;
            state.totalOflabReports = totalOflabReports;
            let total = totalRoom + totalOflabReports;
            state.cgstAmount = cgstpercentage / 100 * total;
            state.sgstAmount = sgstpercentage / 100 * total;
            state.subTotalamount = total;
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + total;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance

        },
        SET_SAVE_PENDING_INVOICE: (state, actions) => {

            const { cgstpercentage, sgstpercentage, totalRoom, advance, totalOflabReports, discount, extraCharges } = actions.payload

            // cgstpercentage: state.cgstValue,
            // sgstpercentage: state.sgstValue,
            // totalRoom: state.allprevRooms.reduce((total, item) => total + item.totalRoomrent, 0),
            // totalOflabReports: totalOflabReports,
            // advance: state.deposit,
            // discount: state.discount,
            // extraCharges: state.extraCharges.reduce((price, item) => price + item.rate * item.qty, 0),


            state.cgstValue = cgstpercentage;
            state.sgstValue = sgstpercentage;
            state.totalRoom = totalRoom;
            state.totaladvance = advance;
            state.discount = discount;
            state.totalOflabReports = totalOflabReports;
            state.totalExtracharges = extraCharges;
            let total = totalRoom + totalOflabReports + extraCharges;
            state.cgstAmount = cgstpercentage / 100 * total;
            state.sgstAmount = sgstpercentage / 100 * total;
            state.subTotalamount = total;
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + total;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance - state.discount

        },
        SET_NURSINGCHARGE: (state, actions) => {
            const { nursingCharges } = actions.payload
            state.nursingRate = nursingCharges
            state.totalnursingCharge = state.nursingunit * nursingCharges;
            state.subTotalamount = state.totalRoom + state.totalMedicine + state.totalnursingCharge + state.totalicuCharges + state.totalotCharge + state.totalOflabReports + state.totalExtracharges + state.totalofOpd + state.hospitalCharges
            state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
            state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance
        },
        SET_NURSINGUNIT: (state, actions) => {
            const { nursingUnit } = actions.payload
            state.nursingunit = nursingUnit
            state.totalnursingCharge = state.nursingRate * nursingUnit;
            state.subTotalamount = state.totalRoom + state.totalMedicine + state.totalnursingCharge + state.totalicuCharges + state.totalotCharge + state.totalOflabReports + state.totalofOpd + state.totalExtracharges + state.hospitalCharges
            state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
            state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance
        },
        SET_OTCHARGE: (state, actions) => {
            const { otCharges } = actions.payload
            state.otRate = otCharges
            state.totalotCharge = state.otunits * otCharges;
            state.subTotalamount = state.totalRoom + state.totalMedicine + state.totalnursingCharge + state.totalicuCharges + state.totalotCharge + state.totalOflabReports + state.totalofOpd + state.totalExtracharges + state.hospitalCharges
            state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
            state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance
        },
        SET_OTUNIT: (state, actions) => {
            const { otUnit } = actions.payload
            state.otunits = otUnit
            state.totalotCharge = state.otRate * otUnit;
            state.subTotalamount = state.totalRoom + state.totalMedicine + state.totalnursingCharge + state.totalicuCharges + state.totalotCharge + state.totalOflabReports + state.totalofOpd + state.totalExtracharges + state.hospitalCharges
            state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
            state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance

        },
        SET_ICUCHARGE: (state, actions) => {
            const { icuCharges } = actions.payload
            state.icuRate = icuCharges
            state.totalicuCharges = state.icuunits * icuCharges;
            state.subTotalamount = state.totalRoom + state.totalMedicine + state.totalnursingCharge + state.totalicuCharges + state.totalotCharge + state.totalOflabReports + state.totalExtracharges + state.totalofOpd + state.hospitalCharges
            state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
            state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance
        },
        SET_ICUUNIT: (state, actions) => {
            const { icuUnit } = actions.payload
            state.icuunits = icuUnit
            state.totalicuCharges = state.icuRate * icuUnit;
            state.subTotalamount = state.totalRoom + state.totalMedicine + state.totalnursingCharge + state.totalicuCharges + state.totalotCharge + state.totalOflabReports + state.totalExtracharges + state.totalofOpd + state.hospitalCharges
            state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
            state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance
        },
        SET_ADVANCE: (state, action) => {
            const { advance } = action.payload;
            state.totaladvance = advance
            state.totalPayableAmount = state.totalBillingAmount - advance

        },

        SET_HOSPITAL_CHARGES: (state, action) => {
            const { hospitalCharge } = action.payload;
            state.hospitalCharges = hospitalCharge
            state.subTotalamount = state.totalRoom + state.totalnursingCharge + state.totalicuCharges + state.totalotCharge + state.totalOflabReports + state.totalExtracharges + hospitalCharge
            state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
            state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
            state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance
        },

        SET_EXTRACHARGES_CHARGES: (state, action) => {
            const { extracharges } = action.payload;
            if (isNaN(extracharges) || extracharges === null || extracharges === undefined) {
                // Do nothing
            } else {
                state.totalExtracharges = extracharges
                state.subTotalamount = state.totalRoom + state.totalOflabReports + state.totalExtracharges;
                state.cgstAmount = state.cgstValue / 100 * state.subTotalamount
                state.sgstAmount = state.sgstValue / 100 * state.subTotalamount
                state.totalBillingAmount = state.cgstAmount + state.sgstAmount + state.subTotalamount;
                state.totalPayableAmount = state.totalBillingAmount - state.totaladvance - state.discount
            }

        },
        SET_DISCOUNT: (state, action) => {
            const { discount } = action.payload;
            state.discount = discount
            state.totalPayableAmount = state.totalBillingAmount - state.totaladvance - state.discount
        },
        CLEAR_FIELD: (state, action) => {
            state.cgstValue = 0;
            state.sgstValue = 0;
            state.totalRoom = 0;
            // state.totalMedicine = 0;
            state.totalOflabReports = 0;
            // state.totalofOpd = 0;
            state.cgstAmount = 0;
            state.sgstAmount = 0;
            state.nursingunit = 0;
            state.nursingRate = 0;
            state.totalnursingCharge = 0;
            state.otunits = 0;
            state.otRate = 0;
            state.totalotCharge = 0;
            state.icuunits = 0;
            state.icuRate = 0;
            state.totalicuCharges = 0;
            state.subTotalamount = 0;
            state.totalBillingAmount = 0;
            state.totalPayableAmount = 0;
            state.totaladvance = 0;
            state.hospitalCharges = 0;
            state.totalExtracharges = 0;
            state.discount = 0;

        }
    }
});

export const { SET_HOSPITAL_CHARGES, SET_INVOICE, SET_SAVE_PENDING_INVOICE, SET_NURSINGCHARGE, SET_DISCOUNT, SET_EXTRACHARGES_CHARGES, SET_NURSINGUNIT, SET_OTCHARGE, SET_OTUNIT, SET_ICUCHARGE, SET_ICUUNIT, SET_ADVANCE, CLEAR_FIELD } = invoiceSlice.actions;
export const selectcgstValue = (state) => state.invoice.cgstValue
export const selectsgstValue = (state) => state.invoice.sgstValue
export const selectcgstamount = (state) => state.invoice.cgstAmount
export const selectsgstamount = (state) => state.invoice.sgstAmount
export const selecttotalMedicine = (state) => state.invoice.totalMedicine
export const selecttotalOflabReports = (state) => state.invoice.totalOflabReports
export const selectsubTotalamount = (state) => state.invoice.subTotalamount
export const selectTotalBillingAmount = (state) => state.invoice.totalBillingAmount
export const selectTotalpyableAmount = (state) => state.invoice.totalPayableAmount
export const selectnursingCharge = (state) => state.invoice.nursingRate
export const selectnursingUnit = (state) => state.invoice.nursingunit
export const selectTotalNursingCharges = (state) => state.invoice.totalnursingCharge
export const selectotCharge = (state) => state.invoice.otRate
export const selectotUnit = (state) => state.invoice.otunits
export const selectTotalotCharges = (state) => state.invoice.totalotCharge
export const selecticuCharge = (state) => state.invoice.icuRate
export const selecticuUnit = (state) => state.invoice.icuunits
export const selectTotalicuCharges = (state) => state.invoice.totalicuCharges
export const selectAdvance = (state) => state.invoice.totaladvance
export const selecthospitalcharges = (state) => state.invoice.hospitalCharges
export const selectdiscount = (state) => state.invoice.discount


export default invoiceSlice.reducer;