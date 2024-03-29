/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    menuStyle: 'sideMenu',
}

const menuStyleSlice = createSlice({
    name: "changeMenustyle",
    initialState,
    reducers: {
        SET_MENU_STYLE: (state, actions) => {
            state.menuStyle = actions.payload;
        },

        RESET_MENU_STYLE: (state, actions) => {
            state.menuStyle = 'sideMenu';
        },
    }
});

export const { SET_MENU_STYLE, RESET_MENU_STYLE } = menuStyleSlice.actions;
export const selectmenuStyle = (state) => state.changeMenustyle.menuStyle;

export default menuStyleSlice.reducer