/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    hospitslLogo: '',
    hospitslName: '',
    hospitalAddress: '',
    contactNumber: '',
    hospitaluid: '',
}

const hospitalProfileSlice = createSlice({
    name: "hospitalProfile",
    initialState,
    reducers: {
        SET_HOSPITAL_PROFILE: (state, actions) => {
            const { hospitslLogo, hospitslName, hospitalAddress, contactNumber, hospitaluid } = actions.payload;
            state.hospitslLogo = hospitslLogo ? hospitslLogo : '';
            state.hospitslName = hospitslName ? hospitslName : '';
            state.hospitalAddress = hospitalAddress ? hospitalAddress : '';
            state.contactNumber = contactNumber ? contactNumber : '';
            state.hospitaluid = hospitaluid ? hospitaluid : '';
        },

        REMOVE_HOSPITAL_PROFILE: (state, actions) => {
            state.hospitslLogo = '';
            state.hospitslName = '';
            state.hospitalAddress = '';
            state.contactNumber = '';
            state.hospitaluid = '';
        },

    }
});

export const { SET_HOSPITAL_PROFILE, REMOVE_HOSPITAL_PROFILE } = hospitalProfileSlice.actions;
export const selectHospitalLogo = (state) => state.hospitalProfile.hospitslLogo;
export const selectHospitalName = (state) => state.hospitalProfile.hospitslName;
export const selectHospitalAddress = (state) => state.hospitalProfile.hospitalAddress;
export const selecthospitalid = (state) => state.hospitalProfile.hospitaluid;
export const selectContactnumber = (state) => state.hospitalProfile.contactNumber;
export default hospitalProfileSlice.reducer;