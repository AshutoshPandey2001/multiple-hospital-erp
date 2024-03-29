/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SearchAutocomplete from '../searchAutocomplete/SearchAutocomplete';
import Select from 'react-select';
import Addpatientscommanmodel from 'src/comman/comman model/Addpatientscommanmodel';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { ADD_ADMIT_PATIENTS, EDIT_ADMIT_PATIENTS, selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice';
import { EDIT_ROOM, FILL_ROOMS, selectAllRooms } from 'src/redux/slice/roomMasterSlice';
import { selectAllDr } from 'src/redux/slice/doctorsSlice';
import { admitformSchema } from 'src/schema';
import { toast } from 'react-toastify';
import { calculateTotalDaysDifference, ddMMyyyy, ddMMyyyyTHHmm, formatDateyyyymmddUtc, yyyyMMdd, yyyyMMddTHHmm } from 'src/services/dateFormate';
import { addDatainsubcollection, updateDataincollection, addSingltObject, deleteDatainSubcollection, getData, deleteSingltObject, filDatainsubcollection, setData, updateDatainSubcollection, updateSingltObject, addDataincollection } from 'src/services/firebasedb';
import moment from 'moment';
import { selectUserId } from 'src/redux/slice/authSlice';
import { db } from 'src/firebaseconfig';

const initalValues = {
    pid: '',
    pName: '',
    page: '',
    pGender: '',
    pAddress: '',
    pMobileNo: '',
    drName: '',
    admitDate: '',
    dischargeDate: '',
    roomType: '',
    roomNo: '',
    bedNo: '',
    priceperNignt: '',
    totalAmount: '',
    totalDayes: '',
    diagnosis: '',
    paymentStatus: 'Pending',
    admituid: '',
    deposit: 0,
    indoorCaseNo: '',
    hospitaluid: '',
}
const AdmitModel = ({ show, update, handleClose, data, roomValues, todayDate }) => {
    const dispatch = useDispatch()

    const [model, setModel] = useState(false)
    const allPatients = useSelector(selectAllPatients)
    const allAdmitPatients = useSelector(selectAdmitPatients)
    const allDoctors = useSelector(selectAllDr)
    const roomList = useSelector(selectAllRooms);
    const [admitPatientfilter, setAdmitPatientfilter] = useState([]);
    const [room, setRoom] = useState([])
    const [bedNo, setBedNo] = useState([])
    const [rooms, setRooms] = useState([])
    const [autofocus, setAutofocus] = useState(false)
    const [totalnumData, setTotalNumData] = useState(0); // Initial value for rows per page
    const hospitaluid = useSelector(selectUserId)

    useEffect(() => {
        // setAdmitPatientfilter(allAdmitPatients);
        setRoom([...roomList]);
        patchData();
        const unsub = db
            .collection('AdmitPatientsCount')
            .where('hospitaluid', '==', hospitaluid)
            .onSnapshot(async (snapshot) => {
                if (!snapshot.empty) {
                    const newData = snapshot.docs[0].data();
                    const count = newData.count;
                    setTotalNumData(count);
                    console.log('res.data().count', count);
                }
            });
        // getData('admitPatients', 'jSqDGnjO21bpPGhb6O2y').then((res) => {
        //     // dispatch(FILL_PATIENTS(res.data().count))
        //     setTotalNumData(res.data().count)
        //     // count = res.data().count
        //     console.log('res.data().count', res.data().count);
        // }).catch((error) => {
        //     console.error("Error updating document: ", error);
        // });
        return () => {
            unsub()
        }
    }, [allAdmitPatients, roomList, data, update, roomValues, show, todayDate])

    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: admitformSchema,
        onSubmit: async (Values, { resetForm }) => {
            // let time_differ = (new Date(values.dischargeDate) - new Date(values.admitDate));
            // if (time_differ === 0) {
            //     values.totalDayes = 1;
            // } else {
            //     values.totalDayes = time_differ / (1000 * 60 * 60 * 24) + 1;
            // }
            // const utcOffset = moment.utc().format('Z').replace(':', '');

            values.totalDayes = calculateTotalDaysDifference(values.admitDate, values.dischargeDate)
            values.admitDate = formatDateyyyymmddUtc(values.admitDate)
            values.dischargeDate = values.dischargeDate ? formatDateyyyymmddUtc(values.dischargeDate) : values.dischargeDate

            console.log(' values.totalDayes', values.totalDayes);

            values.totalAmount = values.priceperNignt * values.totalDayes;
            let admit1 = [...admitPatientfilter]
            let roomArray = {}
            let findRoomindex = room.findIndex((item) => item.roomType === values.roomType)
            let finRoomNoIndex = room[findRoomindex].rooms.findIndex((item3) => Number(item3.roomNo) === Number(values.roomNo))
            if (values.dischargeDate) {
                let newArray = room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (Number(item3.bedNo) === Number(values.bedNo) ? { ...item3, occupied: false } : item3))
                let newArray1 = room[findRoomindex].rooms.map((item3) => (Number(item3.roomNo) === Number(values.roomNo) ? { ...item3, BEDS: newArray } : item3))
                // roomArray = room.map((item) => (item.roomType === values.roomType ? { ...item, rooms: newArray1 } : item))
                roomArray = { ...room[findRoomindex], rooms: newArray1 };

            } else {
                let newArray = room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (Number(item3.bedNo) === Number(values.bedNo) ? { ...item3, occupied: true } : item3))
                let newArray1 = room[findRoomindex].rooms.map((item3) => (Number(item3.roomNo) === Number(values.roomNo) ? { ...item3, BEDS: newArray } : item3))
                // roomArray = room.map((item) => (item.roomType === values.roomType ? { ...item, rooms: newArray1 } : item))
                roomArray = { ...room[findRoomindex], rooms: newArray1 };
            }
            console.log('roomobject', roomArray);
            if (!update) {
                values.admituid = Math.floor(3407 + Math.random() * 9000)

                let admit = [...admitPatientfilter, Values]

                try {
                    // await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', admit)
                    // await addSingltObject("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', Values)
                    await addDatainsubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', Values)
                    setData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'count', totalnumData + 1)
                    await updateDataincollection('AdmitPatientsCount', { hospitaluid: values.hospitaluid, count: totalnumData + 1 })

                    // dispatch(ADD_ADMIT_PATIENTS(Values))
                    await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                    // await updateDatainSubcollection('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                    // await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray)
                    dispatch(EDIT_ROOM(roomArray))
                    await resetForm({ values: '' })
                    closeModel()
                    toast.success("Admit successful.....");
                } catch (error) {
                    console.error(error.message);
                }

            } else {
                const find = admit1.findIndex((item) => item.admituid === Values.admituid)
                admit1[find] = Values
                try {
                    // await updateSingltObject("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', Values, 'admituid', 'hospitaluid')
                    await updateDatainSubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', Values, 'admituid', 'hospitaluid')

                    // await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', admit1)
                    dispatch(EDIT_ADMIT_PATIENTS(Values))
                    await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                    // await updateDatainSubcollection('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                    // await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray)
                    dispatch(EDIT_ROOM(roomArray))
                    resetForm({ values: '' })
                    closeModel();
                    toast.success("Updated successful.....");
                } catch (error) {
                    console.error(error.message);
                }

            }

        }
    });

    const { handleSubmit, handleChange, handleBlur, errors, touched, values, } = formik;
    const patchData = () => {
        if (update) {
            formik.setFieldValue('pid', data.pid);
            formik.setFieldValue('pName', data.pName);
            formik.setFieldValue('pMobileNo', data.pMobileNo);
            formik.setFieldValue('pGender', data.pGender);
            formik.setFieldValue('page', data.page);
            formik.setFieldValue('pAddress', data.pAddress);
            formik.setFieldValue('drName', data.drName);
            formik.setFieldValue('admitDate', moment(data.admitDate).utc().format('YYYY-MM-DDTHH:mm'));
            // formik.setFieldValue('admitDate', yyyyMMdd(data.admitDate));
            formik.setFieldValue('dischargeDate', data.dischargeDate ? moment(data.dischargeDate).utc().format('YYYY-MM-DDTHH:mm') : data.dischargeDate);
            // formik.setFieldValue('dischargeDate', data.dischargeDate ? yyyyMMdd(data.dischargeDate) : data.dischargeDate);
            formik.setFieldValue('roomType', data.roomType);
            formik.setFieldValue('roomNo', data.roomNo);
            formik.setFieldValue('bedNo', data.bedNo);
            formik.setFieldValue('priceperNignt', data.priceperNignt);
            formik.setFieldValue('totalAmount', data.totalAmount);
            formik.setFieldValue('totalDayes', data.totalDayes);
            formik.setFieldValue('diagnosis', data.diagnosis);
            formik.setFieldValue('paymentStatus', data.paymentStatus);
            formik.setFieldValue('admituid', data.admituid);
            formik.setFieldValue('deposit', data.deposit);
            formik.setFieldValue('indoorCaseNo', data.indoorCaseNo);
            formik.setFieldValue('hospitaluid', data.hospitaluid);
            const selectedRoom = roomList.find((room) => room.roomType === data.roomType); // Find the corresponding room object
            setRooms(selectedRoom.rooms)
            const selectedRoomNo = selectedRoom.rooms.find((room) => room.roomNo === data.roomNo); // Find the corresponding doctor object
            // formik.setFieldValue('roomNo', selectedRoomNo.roomNo);    
            // let beds = selectedRoomNo.BEDS.filter((item) => item.occupied !== true)
            setBedNo(selectedRoomNo.BEDS)
            return
        }

        if (roomValues) {
            formik.setFieldValue('roomType', roomValues.roomType);
            formik.setFieldValue('roomNo', roomValues.roomNo);
            formik.setFieldValue('bedNo', roomValues.bedNo);
            formik.setFieldValue('priceperNignt', roomValues.priceperNignt);
            formik.setFieldValue('admitDate', roomValues.todayDate);
            const selectedRoom = roomList.find((room) => room.roomType === roomValues.roomType); // Find the corresponding room object
            setRooms(selectedRoom.rooms)
            const selectedRoomNo = selectedRoom.rooms.find((room) => room.roomNo === roomValues.roomNo); // Find the corresponding doctor object
            // formik.setFieldValue('roomNo', selectedRoomNo.roomNo);    
            let beds = selectedRoomNo.BEDS.filter((item) => item.occupied !== true)
            setBedNo(beds)
            formik.setFieldValue('admitDate', new Date().toISOString().substr(0, 10) + 'T' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
            return
        }
        if (todayDate) {
            formik.setFieldValue('admitDate', todayDate);
        }
    }
    const clearForm = () => {
        formik.setValues({
            pid: '',
            pName: '',
            page: '',
            pGender: '',
            pAddress: '',
            pMobileNo: '',
            drName: '',
            admitDate: '',
            dischargeDate: '',
            roomType: '',
            roomNo: '',
            bedNo: '',
            priceperNignt: '',
            totalAmount: '',
            totalDayes: '',
            diagnosis: '',
            paymentStatus: 'Pending',
            admituid: '',
            deposit: 0,
            indoorCaseNo: '',
            hospitaluid: '',
        });
    };

    const handleOnClear = () => {
        formik.setValues({
            pid: '',
            pName: '',
            page: '',
            pGender: '',
            pAddress: '',
            pMobileNo: '',
            drName: '',
            admitDate: new Date().toISOString().substr(0, 10),
            dischargeDate: '',
            roomType: '',
            roomNo: '',
            bedNo: '',
            priceperNignt: '',
            totalAmount: '',
            totalDayes: '',
            diagnosis: '',
            paymentStatus: 'Pending',
            admituid: '',
            deposit: 0,
            indoorCaseNo: '',
            hospitaluid: '',
        });
    }
    const handleOnSelect = (item) => {
        formik.setFieldValue('pid', item.pid);
        formik.setFieldValue('pName', item.pName);
        formik.setFieldValue('pMobileNo', item.pMobileNo);
        formik.setFieldValue('pGender', item.pGender);
        formik.setFieldValue('page', item.page);
        formik.setFieldValue('pAddress', item.pAddress);
        formik.setFieldValue('hospitaluid', item.hospitaluid);
    };
    const selectRoomprice = async (e) => {
        const selectedRoom = await roomList.find((room) => room.roomType === e); // Find the corresponding doctor object
        formik.setFieldValue('roomType', selectedRoom.roomType);
        formik.setFieldValue('priceperNignt', selectedRoom.priceperNight);
        setRooms(selectedRoom.rooms)
        setAutofocus(!autofocus)

    }
    const selectDoctor = (e) => {
        values.drName = e.drName;
        // values.consultingCharge = e.consultingCharge;
        setAutofocus(!autofocus)

    }

    const closeModel = () => {
        formik.resetForm();
        clearForm()
        handleClose();
    }
    const selectRoom = async (e) => {
        const selectedRoomNo = await rooms.find((room) => room.roomNo === e); // Find the corresponding doctor object
        console.log('e', selectedRoomNo);
        formik.setFieldValue('roomNo', selectedRoomNo.roomNo);

        // values.roomNo = e.roomNo;
        let beds = selectedRoomNo.BEDS.filter((item) => item.occupied !== true)
        setBedNo(beds)
        setAutofocus(!autofocus)

    }
    const selectBed = (e) => {
        values.bedNo = e.bedNo;
        setAutofocus(!autofocus)

    }
    return (
        <>
            <Modal show={show} onHide={closeModel} size="lg" style={{ filter: model ? 'blur(5px)' : 'blur(0px)' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Admit Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex' style={{ justifyContent: 'flex-end' }}>
                        <Button variant="success" onClick={() => { setModel(true) }} >
                            Add Patients
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Indoor Case No:</label>
                                    <input name='indoorCaseNo'
                                        placeholder="Enter Indoor Case No"
                                        type="text" className="form-control" onChange={handleChange} value={values.indoorCaseNo} />

                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                {
                                    update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                        <input type="text" className="form-control" placeholder="Enter patient id" name='pid' readOnly value={values.pid} onChange={handleChange} onBlur={handleBlur} />
                                        {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}
                                    </div> :
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                            <SearchAutocomplete
                                                allPatients={allPatients}
                                                handleOnSelect={handleOnSelect}
                                                inputsearch={values.pid}
                                                placeholder={'Enter Patients id'}
                                                handleClear={handleOnClear}
                                                keyforSearch={"pid"}
                                                style={{
                                                    height: '36px',
                                                    display: 'block',
                                                    width: '100%',
                                                    borderRadius: "0.375rem",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "none",
                                                    padding: '0.375rem 0.75rem',
                                                    backgroundClip: 'padding-box',
                                                    hoverBackgroundColor: "lightgray",
                                                    color: '#212529',
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5',
                                                    fontFamily: "inherit",
                                                    iconColor: "#212529",
                                                    fontWeight: "400",
                                                    lineColor: "lightgray",
                                                    placeholderColor: "#212529",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    appearance: 'none',
                                                    zIndex: 2,
                                                    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                                }} />
                                            {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}

                                        </div>
                                }
                            </div>
                            <div className='col-lg-6'>
                                {update || values.pMobileNo ?
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Mobile No<b style={{ color: 'red' }}>*</b>:</label>
                                        <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' readOnly value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} />
                                        {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                                    </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Mobile No<b style={{ color: 'red' }}>*</b>: </label>
                                        <SearchAutocomplete
                                            allPatients={allPatients}
                                            handleOnSelect={handleOnSelect}
                                            inputsearch={values.pMobileNo}
                                            placeholder={'Enter Mobile No'}
                                            handleClear={handleOnClear}
                                            keyforSearch={"pMobileNo"}
                                            style={{
                                                height: '36px',
                                                display: 'block',
                                                width: '100%',
                                                borderRadius: "0.375rem",
                                                backgroundColor: "#fff",
                                                boxShadow: "none",
                                                padding: '0.375rem 0.75rem',
                                                backgroundClip: 'padding-box',
                                                hoverBackgroundColor: "lightgray",
                                                color: '#212529',
                                                fontSize: '1rem',
                                                lineHeight: '1.5',
                                                fontFamily: "inherit",
                                                iconColor: "#212529",
                                                fontWeight: "400",
                                                lineColor: "lightgray",
                                                placeholderColor: "#212529",
                                                clearIconMargin: "3px 8px 0 0",
                                                appearance: 'none',
                                                zIndex: 2,
                                                transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                            }} />

                                        {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}

                                    </div>
                                }
                            </div>

                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                {update || values.pName ?
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Patient Name<b style={{ color: 'red' }}>*</b>:</label>
                                        <input name='pName'
                                            placeholder="Enter Patient Name"
                                            type="text" className="form-control" onChange={handleChange} defaultValue={values.pName} readOnly />
                                        {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                    </div>
                                    :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Patient Name<b style={{ color: 'red' }}>*</b>:</label>
                                        <SearchAutocomplete
                                            allPatients={allPatients}
                                            handleOnSelect={handleOnSelect}
                                            inputsearch={values.pName}
                                            placeholder={'Enter Patient Name'}
                                            handleClear={handleOnClear}
                                            keyforSearch={"pName"}
                                            style={{
                                                height: '36px',
                                                display: 'block',
                                                width: '100%',
                                                borderRadius: "0.375rem",
                                                backgroundColor: "#fff",
                                                boxShadow: "none",
                                                padding: '0.375rem 0.75rem',
                                                backgroundClip: 'padding-box',
                                                hoverBackgroundColor: "lightgray",
                                                color: '#212529',
                                                fontSize: '1rem',
                                                lineHeight: '1.5',
                                                fontFamily: "inherit",
                                                iconColor: "#212529",
                                                fontWeight: "400",
                                                lineColor: "lightgray",
                                                placeholderColor: "#212529",
                                                clearIconMargin: "3px 8px 0 0",
                                                appearance: 'none',
                                                zIndex: 1,
                                                transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                            }} />

                                        {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                    </div>
                                }
                            </div>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Patient Age<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='page'
                                        placeholder="Enter Patient Age"
                                        type="text" className="form-control" onChange={handleChange} defaultValue={values.page} readOnly />
                                    {errors.page && touched.page ? (<p style={{ color: 'red' }}>*{errors.page}</p>) : null}

                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Admit Date<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='admitDate'
                                        placeholder="Enter Admit Date"
                                        type="datetime-local" className="form-control" onChange={handleChange} value={values.admitDate} />
                                    {errors.admitDate && touched.admitDate ? (<p style={{ color: 'red' }}>*{errors.admitDate}</p>) : null}

                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Discharge Date:</label>
                                    <input name='dischargeDate'
                                        placeholder="Enter Discharge Date"
                                        type="datetime-local" className="form-control" onChange={handleChange} defaultValue={values.dischargeDate} />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='drName' value={values.drName} onChange={handleChange}>
                                        <option >Select Doctor</option>
                                        {allDoctors?.map((option) => (
                                            <option key={option.druid} value={option.drName}>
                                                {option.drName}
                                            </option>
                                        ))}

                                    </select>
                                    {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}
                                </div>
                                {/* {update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='drName'
                                        placeholder="Enter Dr Name"
                                        type="text" className="form-control" onChange={handleChange} defaultValue={values.drName} readOnly />
                                </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                        <Select options={allDoctors} getOptionValue={(option) => option.drName}
                                            getOptionLabel={(option) => option.drName}
                                            placeholder="Select Doctor"
                                            onChange={(e) => { selectDoctor(e) }} />
                                        {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}


                                    </div>} */}
                            </div>
                            <div className='col-lg-6'>
                                {/* {update || roomValues ? <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Room Type<b style={{ color: 'red' }}>*</b>:</label>
                                    <input type='text' name="roomType" className='form-control' defaultValue={values.roomType} readOnly />
                                </div> : */}
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Room Type<b style={{ color: 'red' }}>*</b>:</label>

                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='drName' value={values.roomType} onChange={(e) => { selectRoomprice(e.target.value) }}>
                                        <option >Select Room</option>
                                        {roomList?.map((option) => (
                                            <option key={option.roomuid} value={option.roomType}>
                                                {option.roomType}
                                            </option>
                                        ))}

                                    </select>
                                    {/* <Select options={roomList} getOptionValue={(option) => option.roomType}
                                            getOptionLabel={(option) => option.roomType}
                                            // value={defaultvalue1}
                                            // defaultValue={defaultvalue1}
                                            isOptionSelected={(option) => option.roomType === values.roomType}
                                            // name='roomType'
                                            placeholder="Select Room"
                                            onChange={(e) => { selectRoomprice(e) }} /> */}
                                    {errors.roomType && touched.roomType ? (<p style={{ color: 'red' }}>*{errors.roomType}</p>) : null}

                                </div>
                                {/* } */}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Charges Per Night<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='priceperNignt'
                                        placeholder="Enter Charges"
                                        type="number" className="form-control" onChange={handleChange} defaultValue={values.priceperNignt} readOnly />
                                    {errors.priceperNignt && touched.priceperNignt ? (<p style={{ color: 'red' }}>*{errors.priceperNignt}</p>) : null}

                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Room No<b style={{ color: 'red' }}>*</b>:</label>
                                    {/* {update || roomValues ?
                                        <input name='roomNo'
                                            placeholder="Enter room no."
                                            type="number" className="form-control" onChange={handleChange} defaultValue={values.roomNo} readOnly />
                                        : */}
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='drName' value={values.roomNo} onChange={(e) => { selectRoom(e.target.value) }}>
                                        <option >Select Room</option>
                                        {rooms?.map((option) => (
                                            <option key={option.roomNo} value={option.roomNo}>
                                                {option.roomNo}
                                            </option>
                                        ))}

                                    </select>
                                    {/* //     // <Select options={rooms} getOptionValue={(option) => option.roomNo}
                                    //     //     getOptionLabel={(option) => option.roomNo}
                                    //     //     placeholder="Select Room No"
                                    //     //     onChange={(e) => { selectRoom(e) }} />
                                    // } */}

                                    {errors.roomNo && touched.roomNo ? (<p style={{ color: 'red' }}>*{errors.roomNo}</p>) : null}

                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Select Bed<b style={{ color: 'red' }}>*</b>:</label>
                                    {/* {update || roomValues ?
                                        <input name='bedNo'
                                            placeholder="Enter room no."
                                            type="number" className="form-control" onChange={handleChange} defaultValue={values.bedNo} readOnly />
                                        : */}
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='bedNo' value={values.bedNo} onChange={handleChange}>
                                        <option >Select Bed</option>
                                        {bedNo?.map((option) => (
                                            <option key={option.bedNo} value={option.bedNo}>
                                                {option.bedNo}
                                            </option>
                                        ))}

                                    </select>
                                    {/* // <Select options={bedNo} getOptionValue={(option) => option.bedNo}
                                        //     getOptionLabel={(option) => option.bedNo}
                                        //     placeholder="Select Bed"
                                        //     onChange={(e) => { selectBed(e) }} />
                                    // } */}
                                    {errors.bedNo && touched.bedNo ? (<p style={{ color: 'red' }}>*{errors.bedNo}</p>) : null}

                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Deposit:</label>
                                    <input name='deposit'
                                        placeholder="Enter Deposit Amount."
                                        type="number" className="form-control" onChange={handleChange} value={values.deposit} />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Diagnosis<b style={{ color: 'red' }}>*</b>:</label>
                                    <textarea className="form-control" rows="3" name="diagnosis" placeholder='Enter Diagnosis' onChange={handleChange} defaultValue={values.diagnosis} ></textarea>
                                    {errors.diagnosis && touched.diagnosis ? (<p style={{ color: 'red' }}>*{errors.diagnosis}</p>) : null}
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Payment Status<b style={{ color: 'red' }}>*</b>:</label>
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='paymentStatus' value={values.paymentStatus} onChange={handleChange}>
                                        <option selected disabled>Select Payment Status</option>
                                        {/* <option value='Completed'>Completed</option> */}
                                        <option value='Pending' selected>Pending</option>
                                    </select>
                                    {errors.paymentStatus && touched.paymentStatus ? (<p style={{ color: 'red' }}>*{errors.paymentStatus}</p>) : null}
                                </div>
                            </div>

                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModel}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} >
                        {update ? 'Update' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Addpatientscommanmodel
                show={model}
                handleClose={() => setModel(false)}
                handleShow={() => setModel(true)}
            />
        </>
    )
}

export default AdmitModel