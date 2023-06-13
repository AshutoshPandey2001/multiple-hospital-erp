/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sidebarShow: true,
}

const changestateSlice = createSlice({
    name: "changeState",
    initialState,
    reducers: {
        SET_STATE: (state, actions) => {
            state.sidebarShow = actions.payload;
        },


    }
});

export const { SET_STATE } = changestateSlice.actions;
export const selectChangeState = (state) => state.changeState.sidebarShow;

export default changestateSlice.reducer