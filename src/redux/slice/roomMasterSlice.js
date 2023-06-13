/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    roomsList: [],
}

const roomMsterSlice = createSlice({
    name: "allRooms",
    initialState,
    reducers: {
        ADD_ROOM: (state, actions) => {
            if (state.roomsList) {
                state.roomsList = [...state.roomsList, actions.payload];
            } else {
                state.roomsList = actions.payload;
            }
        },
        EDIT_ROOM: (state, actions) => {
            const findIndex = state.roomsList.findIndex((item) => item.roomuid === actions.payload.roomuid)
            state.roomsList[findIndex] = actions.payload
        },
        DELETE_ROOM: (state, actions) => {
            state.roomsList = state.roomsList.filter((item) => item.roomuid !== actions.payload.roomuid)
        },
        FILL_ROOMS: (state, actions) => {
            state.roomsList = actions.payload;
        },
    }
});

export const { ADD_ROOM, EDIT_ROOM, DELETE_ROOM, FILL_ROOMS } = roomMsterSlice.actions;
export const selectAllRooms = (state) => state.allRooms.roomsList;

export default roomMsterSlice.reducer