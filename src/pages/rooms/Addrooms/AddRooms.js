/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { roomSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { AiFillDelete } from 'react-icons/ai'
import { ImCross } from 'react-icons/im'
import { ADD_ROOM, DELETE_ROOM, EDIT_ROOM, FILL_ROOMS, selectAllRooms } from 'src/redux/slice/roomMasterSlice';
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, getSubcollectionData, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { selectUserId, selectpermissions } from 'src/redux/slice/authSlice';
import { TfiReload } from 'react-icons/tfi'

const initalValues = {
    roomuid: '',
    roomType: '',
    priceperNight: '',
    hospitaluid: '',
    rooms: [
        {
            roomNo: '',
            BEDS: [{ bedNo: '', occupied: false }]
        }
    ]
}
const AddRooms = () => {
    const dispatch = useDispatch()
    const allRooms = useSelector(selectAllRooms)
    const [show, setShow] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [roomsFilter, setRoomsFilter] = useState([]);
    const [update, setUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [allRoomNo, setAllRoomNo] = useState([])
    const [roomnoError, setRoomnoError] = useState(false)
    const [roomNum, setRoomnum] = useState()
    const hospitaluid = useSelector(selectUserId)
    const permissions = useSelector(selectpermissions)
    const [userpermissions, setUserpermissions] = useState([]);
    const columns = [
        { name: '#', selector: (row, index) => index + 1 },
        { name: 'Room Type', selector: row => row.roomType, sortable: true },
        { name: 'Price', selector: row => '₹' + row.priceperNight, sortable: true },
        {
            name: 'Action', cell: row => <span>
                {userpermissions?.code.includes('EDIT_ROOMS') ? <button onClick={() => editRooms(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                    : null}
                {userpermissions?.code.includes('DELETE_ROOMS') ? <button onClick={() => deleteRooms(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
                    : null}
            </span>
        }
    ]
    const handleClose = () => {
        formik.resetForm();
        setShow(false);
        clearForm();
        setUpdate(false)
    }
    const handleShow = () => setShow(true);
    useEffect(() => {
        setUserpermissions(permissions?.find(permission => permission.module === "ROOMS"))
    }, [])
    // useEffect(() => {
    //     getSubcollectionData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid, (data) => {
    //         // Handle the updated data in the callback function
    //         dispatch(FILL_ROOMS(data))
    //         setIsLoading(false)
    //         console.log('Received real-time data:', data);
    //     }).catch((error) => {
    //         setIsLoading(false)
    //         console.error('Error:', error);
    //     })
    // }, [])
    useEffect(() => {
        const roomNumbers = allRooms?.map((item) => item.rooms?.map((room) => Number(room.roomNo))).flat();
        setAllRoomNo(roomNumbers)
        console.log('roomNumbers', roomNumbers);
        setRoomList(allRooms)
        setRoomsFilter(allRooms)
        setIsLoading(false)

    }, [allRooms])


    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: roomSchema,
        onSubmit: async (Values, action) => {


            let room1 = [...roomsFilter]
            if (!update) {
                values.hospitaluid = hospitaluid;
                values.roomuid = Math.floor(1000 + Math.random() * 9000);
                let room = [...roomsFilter, Values]
                try {
                    // await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', room)
                    // await addSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', Values)
                    await addSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', Values)
                    dispatch(ADD_ROOM(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    toast.success("Added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {
                let findindex = room1.findIndex((item) => item.roomuid === Values.roomuid)
                room1[findindex] = Values;
                try {
                    // await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', room1)
                    await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', Values, 'roomuid', 'hospitaluid')
                    // await updateDatainSubcollection('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', Values, 'roomuid', 'hospitaluid')

                    dispatch(EDIT_ROOM(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Updated Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            }



        }
    });
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;
    const clearForm = () => {
        formik.setValues({
            roomuid: '',
            roomType: '',
            priceperNight: '',
            hospitaluid: '',
            rooms: [
                {
                    roomNo: '',
                    BEDS: [{ bedNo: '', occupied: false }]
                }
            ]

        });
    };
    const editRooms = (item) => {
        // setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomList)
        // filDatainsubcollection(allRooms, 'Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid)
        values.roomType = item.roomType;
        values.roomuid = item.roomuid;
        values.priceperNight = item.priceperNight;
        values.rooms = item.rooms;
        values.hospitaluid = item.hospitaluid
        setShow(true)
        setUpdate(true)
    }

    const deleteRooms = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let room = roomsFilter.filter((item) => item.roomuid !== item1.roomuid)
                        try {
                            // await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', room)
                            await deleteSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', item1, 'roomuid', 'hospitaluid')
                            // await deleteDatainSubcollection('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', item1, 'roomuid', 'hospitaluid')
                            dispatch(DELETE_ROOM(item1))
                            toast.success("Deleted Successfully.......");
                        } catch (error) {
                            toast.error(error.message)
                            console.error(error.message);
                        }
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    const roomNumber = (e, room) => {
        console.log('room before', e, room, allRoomNo.includes(Number(e)));
        if (allRoomNo.includes(Number(e))) {
            setRoomnum(e)
            setRoomnoError(true)
        } else {
            setRoomnoError(false)
            room.roomNo = e;
        }

    }
    const reloadData = () => {
        setIsLoading(true)
        getSubcollectionData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid, (data) => {
            // Handle the updated data in the callback function
            dispatch(FILL_ROOMS(data))
            setIsLoading(false)

            console.log('Received real-time data:', data);
        }).catch((error) => {
            setIsLoading(false)

            console.error('Error:', error);
        })
    }
    return <>
        {isLoading ? <Loaderspinner /> :
            <div>
                <CommanTable
                    title={"Rooms"}
                    columns={columns}
                    data={roomList}
                    action={userpermissions?.code.includes('ADD_ROOMS') ? <> <button className='btn btn-primary' onClick={() => handleShow()}><span>  <BiPlus size={25} /></span></button></> : null}

                />
            </div>
        }
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormikProvider value={formik}>
                    <form >

                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Room Type<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="text" className="form-control" placeholder="Enter Room Name" name='roomType' value={values.roomType} onChange={handleChange} onBlur={handleBlur} />


                            {errors.roomType && touched.roomType ? (<p style={{ color: 'red' }}>*{errors.roomType}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Price<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="number" className="form-control" placeholder="Enter Price per Night" name='priceperNight' value={values.priceperNight} onChange={handleChange} onBlur={handleBlur} />
                            {errors.priceperNight && touched.priceperNight ? (<p style={{ color: 'red' }}>*{errors.priceperNight}</p>) : null}
                        </div>

                        <FieldArray name='rooms'>
                            {({ remove, push }) => (
                                <div className='row'>
                                    {values.rooms?.length > 0 && values.rooms.map((room, roomIndex) => (
                                        <div className="card" key={roomIndex} style={{ padding: ' 0 10px 10px 10px', marginTop: '20px' }}>
                                            <div className='d-flex justify-content-end'>
                                                <span onClick={() => remove(roomIndex)}><ImCross /></span>
                                            </div>
                                            <div className='row'>
                                                <div className='col-lg-12'>
                                                    <div className="form-group">
                                                        <label htmlFor={`rooms[${roomIndex}].roomNo`}>Room No<b style={{ color: 'red' }}>*</b>:</label>
                                                        <input name={`rooms[${roomIndex}].roomNo`}
                                                            placeholder="Enter Room No."
                                                            type="number" className="form-control" defaultValue={room.roomNo} onChange={(e) => roomNumber(e.target.value, room)} required />
                                                        {errors.rooms && errors.rooms[roomIndex] && errors.rooms[roomIndex].roomNo && touched.rooms && touched.rooms[roomIndex] && touched.rooms[roomIndex].roomNo ? (
                                                            <p style={{ color: 'red' }}>*{errors.rooms[roomIndex].roomNo}</p>) : null}

                                                    </div>
                                                </div>
                                                <FieldArray name={`rooms[${roomIndex}].BEDS`}>
                                                    {({ remove, push }) => (
                                                        <div className='row'>
                                                            {room.BEDS.map((bed, bedIndex) => (
                                                                <div className='col-lg-3 d-flex justify-content-space-between ' key={bedIndex}>

                                                                    <div className="form-group">
                                                                        <label htmlFor={`rooms[${roomIndex}].BEDS[${bedIndex}].bedNo`}>Bed No<b style={{ color: 'red' }}>*</b>:</label>
                                                                        <input name={`rooms[${roomIndex}].BEDS[${bedIndex}].bedNo`}
                                                                            placeholder="Enter Bed No."
                                                                            type="number" className="form-control" defaultValue={bed.bedNo} onChange={handleChange} required />

                                                                        {errors.rooms && errors.rooms[roomIndex] && errors.rooms[roomIndex].BEDS && errors.rooms[roomIndex].BEDS[bedIndex] && errors.rooms[roomIndex].BEDS[bedIndex].bedNo && touched.rooms && touched.rooms[roomIndex] && touched.rooms[roomIndex].BEDS && touched.rooms[roomIndex].BEDS[bedIndex] && touched.rooms[roomIndex].BEDS[bedIndex].bedNo ? (
                                                                            <p style={{ color: 'red' }}>*{errors.rooms[roomIndex].BEDS[bedIndex].bedNo}</p>) : null}


                                                                    </div>
                                                                    <span style={{ marginTop: '28px', marginLeft: '10px' }} onClick={() => remove(bedIndex)}><ImCross /></span>
                                                                </div>
                                                            ))}

                                                            <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                                                <button
                                                                    type="button"
                                                                    className='btn btn-info'
                                                                    onClick={() => push({ bedNo: '', occupied: false })}
                                                                >
                                                                    <BiPlus size={25} />  Add Bed
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                </FieldArray>
                                            </div>
                                        </div>
                                    ))}
                                    {roomnoError ? <p style={{ color: 'red' }} >*Room No. {roomNum} already exist in Datatbase </p> : null}
                                    <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                        <button
                                            type="button"
                                            className='btn btn-warning'
                                            disabled={roomnoError}
                                            onClick={() => push({ roomNo: '', BEDS: [{ bedNo: '', occupied: false }] })}
                                        >
                                            <BiPlus size={25} />  Add Room
                                        </button>
                                    </div>
                                </div>
                            )}

                        </FieldArray>

                        {/* </div>
                                            </div>
                                        ))} */}

                        {/* <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                        <button
                                            type="button"
                                            className='btn btn-success'
                                            onClick={() => push({
                                                WardName: '',
                                                rooms: [{ roomNo: '', BEDS: [{ bedNo: '', occupied: 'false' }] }]
                                            })}
                                        >
                                            <BiPlus size={25} />  Add Ward
                                        </button>
                                    </div> */}


                        {/* </div>
                            )}
                        </FieldArray> */}
                    </form>
                </FormikProvider>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" disabled={roomnoError} onClick={handleSubmit} >
                    {update ? 'Update' : 'Submit'}
                </Button>
            </Modal.Footer>
        </Modal>
    </>


}

export default AddRooms;
