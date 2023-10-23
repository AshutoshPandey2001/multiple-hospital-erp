/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    rolesList: [],
}

const userRolesMasterslice = createSlice({
    name: "allroles",
    initialState,
    reducers: {
        ADD_ROLE: (state, actions) => {
            if (state.rolesList) {
                state.rolesList = [...state.rolesList, actions.payload];
            } else {
                state.rolesList = actions.payload;
            }
        },
        EDIT_ROLE: (state, actions) => {
            const findIndex = state.rolesList.findIndex((item) => item.roleuid === actions.payload.roleuid)
            state.rolesList[findIndex] = actions.payload;
        },
        DELETE_ROLE: (state, actions) => {
            state.rolesList = state.rolesList.filter((item) => item.roleuid !== actions.payload.roleuid)
        },
        FILL_ROLE: (state, actions) => {
            state.rolesList = actions.payload;
        },
        RESET_ROLE: (state, actions) => {
            state.rolesList = [];
        },
    }
});

export const { ADD_ROLE, EDIT_ROLE, DELETE_ROLE, FILL_ROLE, RESET_ROLE } = userRolesMasterslice.actions;
export const selectAllRoles = (state) => state.allroles.rolesList;

export default userRolesMasterslice.reducer