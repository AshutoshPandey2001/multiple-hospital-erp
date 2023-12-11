/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    medicalLogo: '',
    medicalName: '',
    medicallAddress: '',
    contactNumber: '',
    hospitaluid: '',
    licenceNumber: '',
}

const medicalProfileSlice = createSlice({
    name: "medicalProfile",
    initialState,
    reducers: {
        SET_MEDICAL_PROFILE: (state, actions) => {
            const { medicalLogo, medicalName, medicallAddress, contactNumber, hospitaluid, licenceNumber } = actions.payload;
            state.medicalLogo = medicalLogo ? medicalLogo : '';
            state.medicalName = medicalName ? medicalName : '';
            state.medicallAddress = medicallAddress ? medicallAddress : '';
            state.contactNumber = contactNumber ? contactNumber : '';
            state.hospitaluid = hospitaluid ? hospitaluid : '';
            state.licenceNumber = licenceNumber ? licenceNumber : '';
        },

        REMOVE_MEDICAL_PROFILE: (state, actions) => {
            state.medicalLogo = '';
            state.medicalName = '';
            state.medicallAddress = '';
            state.contactNumber = '';
            state.hospitaluid = '';
            state.licenceNumber = '';
        },

    }
});

export const { SET_MEDICAL_PROFILE, REMOVE_MEDICAL_PROFILE } = medicalProfileSlice.actions;
export const selectMedicalLogo = (state) => state.medicalProfile.medicalLogo;
export const selectMedicalName = (state) => state.medicalProfile.medicalName;
export const selectMedicalAddress = (state) => state.medicalProfile.medicallAddress;
export const selectMedicalContactnumber = (state) => state.medicalProfile.contactNumber;
export const selectLicenceNumber = (state) => state.medicalProfile.licenceNumber;
export default medicalProfileSlice.reducer;