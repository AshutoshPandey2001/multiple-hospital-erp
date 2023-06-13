/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggesIn: false,
    email: null,
    userName: null,
    userId: null,
    userType: null,
    mobileNo: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_ACTIVE_USER: (state, actions) => {

            const { email, userName, userID, userType, mobileNo } = actions.payload;

            state.isLoggesIn = true;
            state.email = email;
            state.userName = userName;
            state.userId = userID;
            state.userType = userType;
            state.mobileNo = mobileNo;
        },

        REMOVE_ACTIVE_USER: (state, actions) => {

            state.isLoggesIn = false;
            state.email = null;
            state.userName = null;
            state.userId = null;
            state.userType = null;
            state.mobileNo = null;
        },

    }
});

export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } = authSlice.actions;
export const selectIsLoggedIn = (state) => state.auth.isLoggesIn;
export const selectUserName = (state) => state.auth.userName;
export const selectEmail = (state) => state.auth.email;
export const selectUserId = (state) => state.auth.userId;
export const selectUsertype = (state) => state.auth.userType;
export const selectMobileNo = (state) => state.auth.mobileNo;
export default authSlice.reducer;