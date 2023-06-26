/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAllRooms } from 'src/redux/slice/roomMasterSlice'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ShowRoomcomponent from './ShowRoomcomponent';
import AdmitModel from 'src/comman/commanAdmitModel.js/AdmitModel';



const Home = () => {
    const allRooms = useSelector(selectAllRooms)
    const [room, setRoom] = useState([])
    const [selectedRoom, setSelectedRoom] = useState()
    const [show, setShow] = useState(false);
    const [roomDetails, setRoomDetails] = useState()

    useEffect(() => {
        // allRooms?.map((room, i) => {
        //     if (room.roomType === 'General') {
        setSelectedRoom(allRooms[0]?.roomType)
        setRoom(allRooms[0])
        //     }
        // })

    }, [allRooms])
    const handleClose = () => {
        setShow(false);
        setRoomDetails()
    }

    const selectRoom = (item) => {
        setSelectedRoom(item.roomType)
        setRoom(item)
    }
    const selectedRoomDetails = (item) => {
        console.log('selected Room', item);
        setRoomDetails(item)
        setShow(true)
    }

    return (
        <>{!allRooms.length ? <h3 className='text-center'>Currently You Don`t have any Room Please Go to room master and add Rooms</h3> : <>
            <ButtonGroup aria-label="Basic example" className='w-100'>
                {
                    allRooms?.map((roomType, i) => {
                        return <>
                            <Button variant={selectedRoom === roomType.roomType ? 'primary' : 'secondary'} key={roomType.roomuid} onClick={() => selectRoom(roomType)}>{roomType.roomType}</Button>
                        </>
                    })
                }
            </ButtonGroup>

            <ShowRoomcomponent roomType={room} selectedRoomDetails={selectedRoomDetails} className='mt-5' />
            <AdmitModel show={show} handleClose={handleClose} roomValues={roomDetails} />
        </>
        }
        </>
    )
}

export default Home;

