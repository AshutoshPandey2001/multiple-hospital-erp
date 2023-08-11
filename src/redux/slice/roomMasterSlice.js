/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'
import { db } from 'src/firebaseconfig';

const initialState = {
    roomsList: [],
    lastroomData: undefined

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
            // actions.payload.forEach((newRoom) => {
            //     const existingRoomIndex = state.roomsList.findIndex(
            //         (room) => room.roomuid === newRoom.roomuid
            //     );

            //     if (existingRoomIndex !== -1) {
            //         // If a patient with the same pid already exists
            //         const existingPatient = state.roomsList[existingRoomIndex];

            //         // Check if the newRoom has a 'deleted' field and it is truthy (e.g., true)
            //         if (newRoom.hasOwnProperty('deleted') && newRoom.deleted) {
            //             // If the newRoom has a 'deleted' field with a truthy value,
            //             // we will remove the existing patient from the list
            //             state.roomsList.splice(existingRoomIndex, 1);
            //         } else {
            //             // If the newRoom does not have a 'deleted' field or the 'deleted' field is falsy,
            //             // we will update the existing patient with the newRoom data
            //             state.roomsList.splice(existingRoomIndex, 1, newRoom);
            //         }
            //     } else {
            //         // If the patient with the same pid doesn't exist, add the new patient to the list
            //         if (newRoom.hasOwnProperty('deleted') && newRoom.deleted) {
            //             // If the newRoom has a 'deleted' field with a truthy value, skip pushing it to the list
            //             return;
            //         }
            //         state.roomsList.push(newRoom);
            //     }
            // });
            state.roomsList = actions.payload;
        },
        ADD_LAST_ROOM_DATA: (state, actions) => {
            console.log('last opd query snapshot', actions.payload);
            state.lastroomData = actions.payload

        },
    }
});

export const { ADD_ROOM, EDIT_ROOM, DELETE_ROOM, FILL_ROOMS, ADD_LAST_ROOM_DATA } = roomMsterSlice.actions;
export const selectAllRooms = (state) => state.allRooms.roomsList;
export const selectlastRoomData = (state) => state.allRooms.lastroomData;

export default roomMsterSlice.reducer