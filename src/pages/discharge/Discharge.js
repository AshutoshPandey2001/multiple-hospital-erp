/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React, { useEffect, useState, useRef } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import { admitformSchema, dischargeSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import Table from 'react-bootstrap/Table';
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { AiFillDelete } from 'react-icons/ai'
import { AiFillPrinter } from 'react-icons/ai'
import { FiFilter } from 'react-icons/fi'
import { FcDownload } from 'react-icons/fc'
// import Select from "react-dropdown-select";
import { selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_ADMIT_PATIENTS, DELETE_ADMIT_PATIENTS, EDIT_ADMIT_PATIENTS, FILL_ADMIT_PATIENTS, selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice';
import { EDIT_ROOM, FILL_ROOMS, selectAllRooms } from 'src/redux/slice/roomMasterSlice';
import Addpatientscommanmodel from '../../comman/comman model/Addpatientscommanmodel';
import { useNavigate } from 'react-router-dom';
import { setTimeout } from 'core-js';
import Loaderspinner from '../../comman/spinner/Loaderspinner';
import CommanTable from 'src/comman/table/CommanTable';
import { addDatainsubcollection, addSingltObject, addDataincollection, updateDataincollection, getData, getSelectedFieldData, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, getSubcollectionData, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import Dropdown from 'react-bootstrap/Dropdown';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { selectAllDr } from 'src/redux/slice/doctorsSlice';
import { BsEye } from 'react-icons/bs'
import { Scrollbars } from 'react-custom-scrollbars-2';
import { ADD_DISCHARGE_PATIENTS, DELETE_DISCHARGE_PATIENTS, EDIT_DISCHARGE_PATIENTS, FILL_DISCHARGE_PATIENTS, selectdischargePatients } from 'src/redux/slice/dischargePatientSlice';
import ReactToPrint from 'react-to-print';
import { ImCross } from 'react-icons/im'
import PrintHeader from 'src/comman/printpageComponents/PrintHeader';
import PrintFooter from 'src/comman/printpageComponents/PrintFooter';
import SearchAutocomplete from 'src/comman/searchAutocomplete/SearchAutocomplete';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { calculateTotalDaysDifference, formatDateDDMMYYY, ddMMyyyy, ddMMyyyyTHHmm, formatDateyyyymmddUtc, yyyyMMdd, yyyyMMddTHHmm } from 'src/services/dateFormate';
import { selectUserId, selectpermissions } from 'src/redux/slice/authSlice';
import { TfiReload } from 'react-icons/tfi'
import { db } from 'src/firebaseconfig';
import { debounce } from 'lodash';
import DataTable from 'react-data-table-component';
import moment from 'moment';

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>Discharge Summary</h4></div>
            <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                <div className='row ' style={{ borderBottom: '2px solid black', paddingBottom: '20px' }}>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                        <span><h6>Patient id : {state.pid}</h6></span>
                        <span><h6>Age/Sex : {state.page}/{state.pGender}</h6></span>
                        <span><h6>Dr Name : {state.drName}</h6></span>
                        <span><h6>Discharge Type : {state.dischargeType}</h6></span>
                        <span><h6>Admit Date : {state.admitDate}</h6></span>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end '>
                        <div>
                            <span><h6>Patient Name : {state.pName}</h6></span>
                            <span><h6>Admit UID : {state.admituid}</h6></span>
                            <span><h6>Mobile No: {state.pMobileNo}</h6></span>
                            <span><h6>Room Type: {state.roomType}({state.roomNo})</h6></span>
                            <span><h6>Discharge Date: {state.dischargeDate}</h6></span>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    {state.diagnosis ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Diagnosis</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b>
                                {state.diagnosis.split('\n').map((item, key) => {
                                    return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                })}
                            </div>
                        </div> : null
                    }
                    {state.history ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>History and Clinical Summary</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b>
                                {state.history.split('\n').map((item, key) => {
                                    return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                })}
                            </div>
                        </div> : null
                    }
                    {state.medicalRx ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Medical RX</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b>
                                {state.medicalRx.split('\n').map((item, key) => {
                                    return <React.Fragment key={key}>{item}<br /></React.Fragment>
                                })}
                            </div>
                        </div> : null
                    }
                    {state.surgeryName ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Surgery/Procedure Name</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b>
                                {state.surgeryName.split('\n').map((item, key) => {
                                    return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                })}
                            </div>
                        </div> : null
                    }
                    {state.investigation ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Investigations</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b>
                                {state.investigation.split('\n').map((item, key) => {
                                    return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                })}
                            </div>
                        </div> : null
                    }
                    {state.surgeryNote ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Surgery Note</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b>
                                {state.surgeryNote.split('\n').map((item, key) => {
                                    return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                })}
                            </div>
                        </div> : null
                    }

                    {state.histopathologyReport ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Histopathology Report</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b> {state.histopathologyReport}</div>
                        </div> : null
                    }
                    {state.radiologyInvstigation ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Radiology Investigation</h6></div>
                            <div className='col-lg-9'><b>:</b> {state.radiologyInvstigation}</div>
                        </div> : null
                    }
                    {state.adviceonDischarge ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Advice on Discharge/Urgent Care</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b> {state.adviceonDischarge}</div>
                        </div> : null
                    }

                    {state.conditionOnDischarge ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Condition On Discharge</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b> {state.conditionOnDischarge}</div>
                        </div> : null
                    }

                    {state.followUpDetails ?
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-3'><h6>Follow Up</h6></div>
                            <div className='col-lg-9 col-md-9 col-sm-9'><b>:</b> {new Date(state.followUpDetails).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</div>
                        </div> : null
                    }
                    {state.advices ?
                        <div className='card' style={{ padding: '3px' }}>
                            <div className='row'>
                                <div className='col-lg-3 col-md-3 col-sm-3'><h6>RX(Advice on Discharge)</h6></div>
                                <div className='col-lg-9 col-md-9 col-sm-9'>
                                    <b>:</b>{state.advices?.map((item, i) => {
                                        return <React.Fragment key={i}> <b>{item}</b><br /></React.Fragment>
                                    })}</div>
                            </div>
                        </div> : null
                    }


                </div>
            </div>


        </div>
    )
};
const initalValues = {
    pid: '',
    pName: '',
    page: '',
    pMobileNo: '',
    drName: '',
    admitDate: '',
    dischargeDate: '',
    roomType: '',
    roomNo: '',
    bedNo: '',
    admituid: '',
    diagnosis: '',
    history: '',
    medicalRx: '',
    surgeryName: '',
    investigation: '',
    surgeryNote: '',
    histopathologyReport: '',
    radiologyInvstigation: '',
    adviceonDischarge: '',
    conditionOnDischarge: '',
    dischargeType: '',
    followUpDetails: '',
    advices: [],
    hospitaluid: ''
}

const Discharge = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const componentRef = useRef();

    // const allDoctors = useSelector(selectAllDr)
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [dischargePatient, setDischargePatient] = useState([]);
    const [dischargePtientfilter, setDischargePatientfilter] = useState([]);
    // const [allPatients, setAllPatients] = useState([]);
    const roomList = useSelector(selectAllRooms);
    const [autofocus, setAutofocus] = useState(false)
    const [admitPatients, setAdmitPatients] = useState([]);
    const [printContent, setPrintContent] = useState(null);
    const [update, setUpdate] = useState(false)
    const [print, setPrint] = useState(false)
    const allDischargePatients = useSelector(selectdischargePatients)
    const allAdmitPatients = useSelector(selectAdmitPatients)
    const [model, setModel] = useState(false)
    const [room, setRoom] = useState([])
    const [advice, setAdvice] = useState('')
    const [advices, setAdvices] = useState([])
    const hospitaluid = useSelector(selectUserId)
    const [totalnumData, setTotalNumData] = useState(0); // Initial value for rows per page
    const [lastVisible, setLastVisible] = useState(null);
    const [perPageRows, setPerPageRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstVisible, setFirstVisible] = useState(null);
    const [prev, setPrev] = useState(false);
    const [searchBy, setSearchBy] = useState('');
    const [searchString, setSearchString] = useState('');
    const parentDocRef = db.collection('DischargePatients').doc('cki4rIGKtNwyXr27cZBY');
    const subcollectionRef = parentDocRef.collection('dischargePatients').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);
    let unsubscribe = undefined
    let unsub = undefined
    const permissions = useSelector(selectpermissions)
    const [userpermissions, setUserpermissions] = useState([]);
    const columns = [
        // { name: 'Admit ID', selector: row => row.admituid, sortable: true },
        // { name: 'Patient ID', selector: row => row.pid, sortable: true },
        { name: 'Admit Date', selector: row => <div style={{ textAlign: 'center' }}>{formatDateDDMMYYY(row.admitDate)}</div>, sortable: true },
        { name: 'Discharge Date', selector: row => <div style={{ textAlign: 'center' }}>{formatDateDDMMYYY(row.dischargeDate)}</div> },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        {
            name: 'Action', cell: row => <span style={{ display: 'flex', justifyContent: 'center' }}>
                {userpermissions?.code.includes('EDIT_DISCHARGE') ? <button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={22} /></button> : null}
                {userpermissions?.code.includes('DELETE_DISCHARGE') ? <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={22} /></button>
                    : null}
                {userpermissions?.code.includes('PRINT_DISCHARGE') ? <button onClick={() => printDischargesummary(row)} style={{ color: 'skyblue', border: 'none' }} ><AiFillPrinter size={22} /></button> : null}


            </span>

        }
    ]
    const handleClose = () => {
        formik.resetForm();
        clearForm()
        setShow(false);
        setUpdate(false);
        setPrint(false);

    }

    useEffect(() => {
        setIsLoading(true)
        let query = subcollectionRef
            .orderBy('timestamp', 'desc')
            .limit(perPageRows)
        debouncedRetrieveData(query)
        fetchData()
        totalNumberofData()
        setUserpermissions(permissions?.find(permission => permission.module === "DISCHARGE"))

        setIsLoading(false)
        return () => {
            unsub()
            unsubscribe();
        };
    }, [])


    useEffect(() => {

        setRoom([...roomList])
        setIsLoading(false);


    }, [roomList])
    const fetchData = async () => {
        const indoorData = await getSelectedFieldData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid, 'dischargeDate')
        setAdmitPatients(indoorData)
    }

    const totalNumberofData = async () => {
        // try {
        //     let count = 0
        //     unsub = db.collection('DischargePatientsCount').where('hospitaluid', '==', hospitaluid).onSnapshot((snapshot) => {
        //         const newData = [];
        //         snapshot.forEach((doc) => {
        //             newData.push(doc.data());
        //         });
        //         setTotalNumData(newData[0].count);
        //         count = newData[0].count
        //         console.log('res.data().count', newData[0].count);

        //     })
        //     // await getData('DischargePatients', 'cki4rIGKtNwyXr27cZBY').then((res) => {
        //     //     // dispatch(FILL_PATIENTS(res.data().count))
        //     //     count = res.data().count
        //     //     console.log('res.data().count', res.data().count);
        //     // }).catch((error) => {
        //     //     console.error("Error updating document: ", error);
        //     // });
        //     // const parentDocRef = db.collection('opdPatients').doc('m5JHl3l4zhaBCa8Vihcb');
        //     // const subcollectionRef = parentDocRef.collection('opdPatient');
        //     if (count === 0 || count === undefined) {
        //         const snapshot = await subcollectionRef.get();
        //         const totalDataCount = snapshot.size;
        //         setTotalNumData(totalDataCount);
        //         await addDataincollection('DischargePatientsCount', { hospitaluid: hospitaluid, count: totalDataCount })
        //         // await setData('DischargePatients', 'cki4rIGKtNwyXr27cZBY', 'count', totalDataCount)
        //         console.log('Total data count:', totalDataCount);
        //     } else {
        //         setTotalNumData(count);
        //     }

        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // }


        try {
            let count = 0;

            unsub = db
                .collection('DischargePatientsCount')
                .where('hospitaluid', '==', hospitaluid)
                .onSnapshot(async (snapshot) => {
                    if (!snapshot.empty) {
                        const newData = snapshot.docs[0].data();
                        count = newData.count;
                        setTotalNumData(count);
                        console.log('res.data().count', count);
                    } else {
                        const snapshot = await subcollectionRef.get();
                        const totalDataCount = snapshot.size;
                        await addDataincollection('DischargePatientsCount', { hospitaluid: hospitaluid, count: totalDataCount })
                        console.log('No documents found in the snapshot.');
                    }
                });

            // You can save the unsubscribe function if needed to stop listening later
            // unsub();

            // Optionally, you can use the unsubscribe function to stop listening to changes
            // when you no longer need it, e.g., when the component unmounts.
            // useEffect(() => {
            //   return () => unsubscribe();
            // }, []);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const retrieveData = (query) => {
        try {
            // let initialSnapshot = true;
            console.log('i am a lisitnor who alwas call');
            setIsLoading(true)
            unsubscribe = query.onSnapshot((snapshot) => {
                const newData = [];
                snapshot.forEach((doc) => {
                    newData.push(doc.data());
                });
                // if (initialSnapshot && snapshot.metadata.hasPendingWrites) {
                //     // Skip the initial snapshot with local, unsaved changes
                //     initialSnapshot = false;
                //     return;
                // }
                setDischargePatient(newData);
                console.log('newData-------------------------------------', newData);
                if (snapshot.size > 0) {
                    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
                    // console.log('lastVisibleDoc', lastVisibleDoc.data());
                    setLastVisible(lastVisibleDoc);
                    setFirstVisible(snapshot.docs[0]);
                    // setTotalNumData(snapshot.size)
                    setIsLoading(false)

                    // console.log('setFirstVisible', snapshot.docs[0].data());
                } else {
                    setIsLoading(false)

                    setLastVisible(null);
                    setFirstVisible(null);
                }
            });

            return () => {
                unsubscribe();
            };
        } catch (error) {
            setIsLoading(false)

            console.error('Error retrieving data:', error);
        }
    };
    const debouncedRetrieveData = debounce(retrieveData, 500);
    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: dischargeSchema,
        onSubmit: async (Values, { resetForm }) => {

            values.totalDayes = calculateTotalDaysDifference(values.admitDate, values.dischargeDate)
            values.admitDate = formatDateyyyymmddUtc(values.admitDate)
            values.dischargeDate = values.dischargeDate ? formatDateyyyymmddUtc(values.dischargeDate) : values.dischargeDate

            console.log(' values.totalDayes', values.totalDayes);

            values.totalAmount = values.priceperNignt * values.totalDayes;

            let discharge1 = [...dischargePtientfilter]
            let admit = [...admitPatients]
            let roomArray = {};
            let findRoomindex = room.findIndex((item) => item.roomType === values.roomType)
            let finRoomNoIndex = room[findRoomindex].rooms.findIndex((item3) => item3.roomNo === values.roomNo)
            let findAmitIndex = admit.findIndex((item) => item.admituid === values.admituid)
            let newObj = { ...admit[findAmitIndex], dischargeDate: values.dischargeDate, totalDayes: values.totalDayes, totalAmount: values.totalAmount }
            // admit[findAmitIndex] = newObj;

            if (values.dischargeDate) {
                let newArray = room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (item3.bedNo === values.bedNo ? { ...item3, occupied: false } : item3))
                let newArray1 = room[findRoomindex].rooms.map((item3) => (item3.roomNo === values.roomNo ? { ...item3, BEDS: newArray } : item3))
                // roomArray = room.map((item) => (item.roomType === values.roomType ? { ...item, rooms: newArray1 } : item))
                roomArray = { ...room[findRoomindex], rooms: newArray1 };

            } else {
                let newArray = room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (item3.bedNo === values.bedNo ? { ...item3, occupied: true } : item3))
                let newArray1 = room[findRoomindex].rooms.map((item3) => (item3.roomNo === values.roomNo ? { ...item3, BEDS: newArray } : item3))
                // roomArray = room.map((item) => (item.roomType === values.roomType ? { ...item, rooms: newArray1 } : item))
                roomArray = { ...room[findRoomindex], rooms: newArray1 };
            }
            console.log('values', values, newObj, roomArray);

            if (!update) {
                // values.admituid = Math.floor(3407 + Math.random() * 9000)
                let discharge = [...dischargePtientfilter, Values]

                try {
                    // await updateSingltObject("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newObj, 'admituid', 'hospitaluid')
                    await updateDatainSubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newObj, 'admituid', 'hospitaluid')
                    // await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', admit)
                    // dispatch(EDIT_ADMIT_PATIENTS(newObj))
                    // await addSingltObject("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', Values)
                    await addDatainsubcollection("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', Values)
                    await updateDataincollection('DischargePatientsCount', { hospitaluid: hospitaluid, count: totalnumData + 1 })
                    // setData("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'count', totalnumData + 1)

                    // await setData("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', discharge)
                    // dispatch(ADD_DISCHARGE_PATIENTS(Values))
                    // await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                    await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')

                    // await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray)
                    // dispatch(EDIT_ROOM(roomArray))
                    await resetForm({ values: '' })
                    clearForm()
                    toast.success("Discharge Summery Created successful.....");


                    setShow(false)
                } catch (error) {
                    console.error(error.message);
                }

            } else {
                const find = discharge1.findIndex((item) => item.admituid === Values.admituid)
                discharge1[find] = Values
                try {
                    // await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newObj)
                    // dispatch(FILL_ADMIT_PATIENTS(admit))
                    // await setData("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', discharge1)
                    // dispatch(EDIT_DISCHARGE_PATIENTS(Values))
                    // await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray)
                    // dispatch(FILL_ROOMS(roomArray))

                    // await updateSingltObject("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newObj, 'admituid', 'hospitaluid')
                    await updateDatainSubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newObj, 'admituid', 'hospitaluid')
                    // dispatch(EDIT_ADMIT_PATIENTS(newObj))
                    // await updateSingltObject("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', Values, 'admituid', 'hospitaluid')
                    await updateDatainSubcollection("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', Values, 'admituid', 'hospitaluid')
                    // dispatch(EDIT_DISCHARGE_PATIENTS(Values))
                    // await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                    await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                    // dispatch(EDIT_ROOM(roomArray))
                    resetForm({ values: '' })
                    clearForm()
                    toast.success("Discharge Summery updated successful.....");
                    setShow(false)
                    setUpdate(false)
                } catch (error) {
                    console.error(error.message);
                }

            }

        }
    });

    const {
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
    } = formik;

    const clearForm = () => {
        formik.setValues({
            pid: '',
            pName: '',
            page: '',
            pMobileNo: '',
            drName: '',
            admitDate: '',
            dischargeDate: '',
            roomType: '',
            roomNo: '',
            bedNo: '',
            admituid: '',
            diagnosis: '',
            history: '',
            medicalRx: '',
            surgeryName: '',
            investigation: '',
            surgeryNote: '',
            histopathologyReport: '',
            radiologyInvstigation: '',
            adviceonDischarge: '',
            conditionOnDischarge: '',
            dischargeType: '',
            followUpDetails: '',
            advices: [],
            hospitaluid: ''
        });
        setAdvices([])
        setPrint(false);
    };

    const handleShow = () => {
        setShow(true);
        formik.setFieldValue('dischargeDate', new Date().toISOString().substr(0, 10) + 'T' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };

    const handleOnClear = () => {
        formik.setValues({
            pid: '',
            pName: '',
            page: '',
            pMobileNo: '',
            drName: '',
            admitDate: '',
            dischargeDate: new Date().toISOString().substr(0, 10),
            roomType: '',
            roomNo: '',
            bedNo: '',
            admituid: '',
            diagnosis: '',
            history: '',
            medicalRx: '',
            surgeryName: '',
            investigation: '',
            surgeryNote: '',
            histopathologyReport: '',
            radiologyInvstigation: '',
            adviceonDischarge: '',
            conditionOnDischarge: '',
            dischargeType: '',
            followUpDetails: '',
            advices: [],
            hospitaluid: ''
        });
        setAdvices([])

    }
    const editPatientDetails = (item) => {
        const { pid, pName, page, pMobileNo, admitDate, dischargeDate, hospitaluid, drName, roomType, roomNo, bedNo, admituid, diagnosis, history, medicalRx, surgeryName, investigation, surgeryNote, histopathologyReport, radiologyInvstigation, adviceonDischarge, conditionOnDischarge, dischargeType, followUpDetails, advices } = item;

        formik.setValues({
            pid, pName, page, pMobileNo, admitDate: moment(admitDate).utc().format('YYYY-MM-DDTHH:mm'), dischargeDate: moment(dischargeDate).utc().format('YYYY-MM-DDTHH:mm'), hospitaluid, drName, roomType, roomNo, bedNo, admituid, diagnosis, history, medicalRx, surgeryName, investigation, surgeryNote, histopathologyReport, radiologyInvstigation, adviceonDischarge, conditionOnDischarge, dischargeType, followUpDetails, advices
        });

        setAdvices(advices);
        setShow(true)
        setUpdate(true)

    }

    const deletePatientsDetails = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let discharge = dischargePtientfilter.filter((item) => item.admituid !== item1.admituid);
                        try {
                            await deleteDatainSubcollection("DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', item1, 'admituid', 'hospitaluid');
                            await updateDataincollection('DischargePatientsCount', { hospitaluid: hospitaluid, count: totalnumData - 1 })

                            // setData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'count', totalnumData - 1)
                            toast.error("Deleted successful.....");

                        } catch (error) {
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
    const printDischargesummary = (item) => {
        // filDatainsubcollection(allDischargePatients, "DischargePatients", 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', hospitaluid)

        setPrintContent(<PrintComponent data={{
            data1: {
                ...item,
            }
        }} />)
        // const { pid, pName, page, pMobileNo, admitDate, dischargeDate, drName, roomType, roomNo, bedNo, admituid, diagnosis, history, medicalRx, surgeryName, investigation, surgeryNote, histopathologyReport, radiologyInvstigation, adviceonDischarge, conditionOnDischarge, dischargeType, followUpDetails, advices } = item;
        // formik.setValues({
        //     pid, pName, page, pMobileNo, admitDate, dischargeDate, drName, roomType, roomNo, bedNo, admituid, diagnosis, history, medicalRx, surgeryName, investigation, surgeryNote, histopathologyReport, radiologyInvstigation, adviceonDischarge, conditionOnDischarge, dischargeType, followUpDetails, advices
        // });

        // setAdvices(advices);
        // setShow(true)
        // setPrint(true)
    }
    // const requestSearch = (searchvalue) => {

    //     const filteredRows = dischargePtientfilter.filter((row) => {
    //         return row.pid.toString().includes(searchvalue.toLowerCase()) || row.pName.toLowerCase().includes(searchvalue.toLowerCase()) || row.pMobileNo.includes(searchvalue);
    //     });
    //     if (searchvalue.length < 1) {

    //         setDischargePatient([...allDischargePatients].reverse())
    //     }
    //     else {

    //         setDischargePatient(filteredRows)
    //     }
    // }
    const handleOnSelect = (item) => {
        formik.setFieldValue('pid', item.pid);
        formik.setFieldValue('pName', item.pName);
        formik.setFieldValue('pMobileNo', item.pMobileNo);
        formik.setFieldValue('page', item.page);
        // const dateStr = item.admitDate; // Original date string in "dd-mm-yyyy" format
        // const dateParts = dateStr.split("-"); // Split date string into day, month, year components
        // const yyyy_mm_ddadmit = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Join components in "yyyy-mm-dd" forma
        formik.setFieldValue('admitDate', moment(item.admitDate).utc().format('YYYY-MM-DDTHH:mm'));
        formik.setFieldValue('drName', item.drName);
        formik.setFieldValue('roomType', item.roomType);
        formik.setFieldValue('roomNo', item.roomNo);
        formik.setFieldValue('bedNo', item.bedNo);
        formik.setFieldValue('admituid', item.admituid);
        formik.setFieldValue('bedNo', item.bedNo);
        formik.setFieldValue('diagnosis', item.diagnosis);
        formik.setFieldValue('hospitaluid', item.hospitaluid);

        // values.pid = item.pid;
        // values.pName = item.pName;
        // values.page = item.page;
        // // values.pGender = item.pGender;
        // // values.pAddress = item.pAddress;
        // values.pMobileNo = item.pMobileNo;
        // values.admitDate = item.admitDate;
        // values.dischargeDate = item.dischargeDate;
        // values.drName = item.drName;
        // values.roomType = item.roomType;
        // // values.priceperNignt = item.priceperNignt;
        // values.roomNo = item.roomNo;
        // // values.wardName = item.wardName;
        // values.bedNo = item.bedNo;
        // // values.paymentStatus = item.paymentStatus;
        // values.admituid = item.admituid;
        // // values.deposit = item.deposit;


        // setAutofocus(!autofocus)
    };
    const handleOnSelectMobile = (item) => {
        values.pid = item.pid;
        values.pName = item.pName;
        values.page = item.page;
        // values.pGender = item.pGender;
        // values.pAddress = item.pAddress;
        values.pMobileNo = item.pMobileNo;
        values.admitDate = item.admitDate;
        values.dischargeDate = item.dischargeDate;
        values.drName = item.drName;
        values.roomType = item.roomType;
        // values.priceperNignt = item.priceperNignt;
        values.roomNo = item.roomNo;
        values.bedNo = item.bedNo;
        // values.paymentStatus = item.paymentStatus;
        values.admituid = item.admituid;
        // values.deposit = item.deposit;


        setAutofocus(!autofocus)
    };
    const handleOnSelectName = (item) => {
        values.pid = item.pid;
        values.pName = item.pName;
        values.page = item.page;
        // values.pGender = item.pGender;
        // values.pAddress = item.pAddress;
        values.pMobileNo = item.pMobileNo;
        values.admitDate = item.admitDate;
        values.dischargeDate = item.dischargeDate;
        values.drName = item.drName;
        values.roomType = item.roomType;
        // values.priceperNignt = item.priceperNignt;
        values.roomNo = item.roomNo;
        values.bedNo = item.bedNo;
        // values.paymentStatus = item.paymentStatus;
        values.admituid = item.admituid;
        // values.deposit = item.deposit;


        setAutofocus(!autofocus)
    };
    const pushAdvice = () => {
        if (advice) {
            setAdvices(prevAdvices => [...prevAdvices, advice])
            values.advices = [...values.advices, advice]
            setAdvice('')
        }

    }
    const cancleAdvice = (i) => {
        setAdvices(advices.filter((item) => item !== i))
        values.advices = values.advices.filter((item) => item !== i)


    }
    const reloadData = () => {
        setIsLoading(true)
        getSubcollectionData('DischargePatients', 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', hospitaluid, (data) => {
            // Handle the updated data in the callback function
            dispatch(FILL_DISCHARGE_PATIENTS(data))
            setIsLoading(false)

            console.log('Received real-time data:', data);
        }).catch((error) => {
            setIsLoading(false)

            console.error('Error:', error);
        })
    }

    const handlePageChange = async (page) => {
        if (page < currentPage) {
            setPrev(true)
            prevPage()
            // const one = true
            // console.log('i am here');
            // retrieveData(one)
            setCurrentPage(page);
        } else {
            setPrev(false)
            nextPage()
            // const one = false
            // retrieveData(one)
            setCurrentPage(page);
        }
        console.log('page', page);

        // Perform any additional logic or actions based on the page change
    };
    const requestSearch = () => {
        // const searchString = searchvalue.toLowerCase();
        // console.log(searchString, 'searchString');
        if (searchString.length) {
            var query = subcollectionRef

            // query = query
            //     .where('hospitaluid', '==', hospitaluid)
            if (searchBy === 'Name') {
                query = query
                    .where('pName', '>=', searchString).
                    where('pName', '<=', searchString + "\uf8ff")
            } else if (searchBy === 'MobileNo') {
                query = query
                    .where('pMobileNo', '>=', searchString)
                    .where('pMobileNo', '<=', searchString + "\uf8ff");
            }


            query = query.limit(perPageRows);
            retrieveData(query)
            query.get().then(snapshot => {
                // console.log(snapshot);
                const totalDataCount = snapshot.size;
                setTotalNumData(totalDataCount)
                console.log('Total data count:', totalDataCount);
            }).catch(error => {
                console.error('Error retrieving data:', error);
            });
        }



        // if (searchvalue.length < 1) {
        //     setOpdPatientList([...allopdPatientList].reverse())
        //     return
        // }

        // const filteredRows = opdPatientfilter.filter((row) => {
        //     const searchString = searchvalue.toLowerCase()
        //     return row.pid.toString().includes(searchString) ||
        //         row.pName.toLowerCase().includes(searchString) ||
        //         row.pMobileNo.includes(searchString);
        // });

        // setOpdPatientList(filteredRows)
    }

    const onSearchInput = (value) => {
        setSearchString(value)
        if (!value.length) {
            setIsLoading(true)
            setSearchString('')

            let query = subcollectionRef
                .orderBy('timestamp', 'desc')
                .limit(perPageRows)
            retrieveData(query)
            setIsLoading(false)
            totalNumberofData()
        }
    }
    const nextPage = async () => {
        setIsLoading(true)
        let query = subcollectionRef
            .orderBy('timestamp', 'desc')
            .limit(perPageRows).startAfter(lastVisible);
        retrieveData(query)
        setIsLoading(false)

    };
    const prevPage = async () => {
        setIsLoading(true)
        let query = subcollectionRef
            .orderBy('timestamp', 'desc')
            .limit(perPageRows)
            .endBefore(firstVisible).limitToLast(perPageRows);
        retrieveData(query)
        setIsLoading(false)

    }
    return <>
        {isLoading ? <Loaderspinner /> : <>
            <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>

            <div>
                {/* <CommanTable
                    title={"Discharge Summary"}
                    columns={columns}
                    data={dischargePatient}
                    action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                    subHeaderComponent={<>
                        <input type='search' placeholder='search' className='w-25 form-control' onChange={(e) => requestSearch(e.target.value)} /></>}
                /> */}

                <DataTable
                    title={"Discharge Summary"}
                    columns={columns}
                    data={dischargePatient}
                    pagination={true}
                    fixedHeader={true}
                    noHeader={false}
                    persistTableHead
                    actions={<>
                        <span className='d-flex w-100 justify-content-end'>
                            <select className="form-control mr-2" style={{ height: '40px', fontSize: '18px', width: '15%', marginRight: 10 }} name='searchBy' value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                                <option selected >Search by</option>
                                <option value='Name' selected>Patient Name</option>
                                <option value='MobileNo' selected>Mobile No</option>
                            </select>
                            <input type='search' placeholder='search' className='w-25 form-control' value={searchString} onChange={(e) => { onSearchInput(e.target.value) }} />
                            <button className='btn btn-primary' style={{ width: '10%', marginLeft: 10 }} disabled={!searchBy || !searchString} onClick={requestSearch}>Search</button>
                        </span>
                        {userpermissions?.code.includes('ADD_DISCHARGE') ? <button className='btn btn-primary' onClick={() => handleShow()}><span>  <BiPlus size={25} /></span></button> : null
                        }
                    </>
                    }
                    highlightOnHover
                    paginationServer={true}
                    // subHeader={<div className='d-flex' style={{ justifyContent: 'space-between' }}></div>}
                    // subHeaderComponent={
                    // <span className='d-flex w-100 justify-content-end'>
                    //     <select className="form-control mr-2" style={{ height: '40px', fontSize: '18px', width: '15%', marginRight: 10 }} name='searchBy' value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    //         <option selected >Search by</option>
                    //         <option value='Name' selected>Patient Name</option>
                    //         <option value='MobileNo' selected>Mobile No</option>
                    //     </select>
                    //     <input type='search' placeholder='search' className='w-25 form-control' value={searchString} onChange={(e) => { onSearchInput(e.target.value) }} />
                    //     <button className='btn btn-primary' style={{ width: '10%', marginLeft: 10 }} disabled={!searchBy || !searchString} onClick={requestSearch}>Search</button>
                    // </span>
                    // }
                    paginationTotalRows={totalnumData}
                    onChangePage={(e) => handlePageChange(e)}
                />
            </div >
        </>
        }
        <Modal show={show} onHide={handleClose} fullscreen={true}
        >

            <Modal.Header closeButton>
                <Modal.Title >Discharge Card</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        {/* <div className='col-lg-3'>
                                {
                                    update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Admit Uid:</label>
                                        <input type="text" className="form-control" placeholder="Enter patient id" name='admituid' readOnly value={values.admituid} onChange={handleChange} onBlur={handleBlur} />
                                        {errors.admituid && touched.admituid ? (<p style={{ color: 'red' }}>*{errors.admituid}</p>) : null}
                                    </div> :
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label>Admit Uid:</label>
                                            <SearchAutocomplete
                                                allPatients={admitPatients}
                                                handleOnSelect={handleOnSelect}
                                                inputsearch={values.admituid}
                                                placeholder={'Enter admit uid'}
                                                handleClear={handleOnClear}
                                                keyforSearch={"admituid"} />                                           
                                            {errors.admituid && touched.admituid ? (<p style={{ color: 'red' }}>*{errors.admituid}</p>) : null}

                                        </div>
                                }
                            </div> */}
                        <div className='col-lg-4'>
                            {
                                update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                    <input type="text" className="form-control" placeholder="Enter patient id" name='pid' readOnly value={values.pid} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}
                                </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                        <SearchAutocomplete
                                            allPatients={admitPatients}
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
                                        {/* <ReactSearchAutocomplete
                                                items={allAdmitPatients}
                                                fuseOptions={{ keys: ["pid"] }}
                                                resultStringKeyName="pid"
                                                onSelect={handleOnSelect}
                                                inputSearchString={values.pid}
                                                placeholder='Enter Patients id'
                                                showIcon={false}
                                                onClear={handleOnClear}
                                                showClear
                                                styling={{
                                                    height: "34px",
                                                    borderRadius: "4px",
                                                    backgroundColor: "white",
                                                    boxShadow: "none",
                                                    hoverBackgroundColor: "lightgray",
                                                    color: "black",
                                                    fontSize: "18px",
                                                    fontFamily: "Courier",
                                                    iconColor: "black",
                                                    lineColor: "lightgray",
                                                    placeholderColor: "black",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    zIndex: 2
                                                }}

                                            /> */}
                                        {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}

                                    </div>
                            }
                        </div>
                        <div className='col-lg-4'>
                            {update || values.pMobileNo ?
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Mobile No<b style={{ color: 'red' }}>*</b>:</label>
                                    <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' readOnly value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                                </div> :
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Mobile No<b style={{ color: 'red' }}>*</b>: </label>
                                    <SearchAutocomplete
                                        allPatients={admitPatients}
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
                                    {/* <ReactSearchAutocomplete
                                            items={allAdmitPatients}
                                            fuseOptions={{ keys: ["pMobileNo"] }}
                                            resultStringKeyName="pMobileNo"
                                            onSelect={handleOnSelectMobile}
                                            inputSearchString={values.pMobileNo}
                                            inputDebounce={values.pMobileNo}
                                            placeholder='Enter Mobile No'
                                            showIcon={false}
                                            onClear={handleOnClear}
                                            showClear
                                            styling={{
                                                height: "34px",
                                                borderRadius: "4px",
                                                backgroundColor: "white",
                                                boxShadow: "none",
                                                hoverBackgroundColor: "lightgray",
                                                color: "black",
                                                fontSize: "18px",
                                                fontFamily: "Courier",
                                                iconColor: "black",
                                                lineColor: "lightgray",
                                                placeholderColor: "black",
                                                clearIconMargin: "3px 8px 0 0",
                                                zIndex: 2
                                            }}

                                        /> */}
                                    {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}

                                </div>
                            }
                        </div>
                        <div className='col-lg-4'>
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
                                        allPatients={admitPatients}
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
                                    {/* <ReactSearchAutocomplete
                                            items={allAdmitPatients}
                                            fuseOptions={{ keys: ["pName"] }}
                                            resultStringKeyName="pName"
                                            onSelect={handleOnSelectName}
                                            inputSearchString={values.pName}
                                            inputDebounce={values.pName}
                                            placeholder='Enter Patient Name'
                                            showIcon={false}
                                            onClear={handleOnClear}
                                            showClear
                                            styling={{
                                                height: "34px",
                                                borderRadius: "4px",
                                                backgroundColor: "white",
                                                boxShadow: "none",
                                                hoverBackgroundColor: "lightgray",
                                                color: "black",
                                                fontSize: "18px",
                                                fontFamily: "Courier",
                                                iconColor: "black",
                                                lineColor: "lightgray",
                                                placeholderColor: "black",
                                                clearIconMargin: "3px 8px 0 0",
                                                zIndex: 2
                                            }}

                                        /> */}
                                    {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                </div>
                            }
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-3'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Patient Age<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='page'
                                    placeholder="Enter Patient Age"
                                    type="text" className="form-control" onChange={handleChange} defaultValue={values.page} readOnly />
                                {errors.page && touched.page ? (<p style={{ color: 'red' }}>*{errors.page}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Admit Date<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='admitDate'
                                    placeholder="Enter Admit Date"
                                    type="datetime-local" className="form-control" onChange={handleChange} defaultValue={values.admitDate} readOnly />
                                {errors.admitDate && touched.admitDate ? (<p style={{ color: 'red' }}>*{errors.admitDate}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Discharge Date<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='dischargeDate'
                                    placeholder="Enter Discharge Date"
                                    type="datetime-local" className="form-control" onChange={handleChange} defaultValue={values.dischargeDate} />
                                {errors.dischargeDate && touched.dischargeDate ? (<p style={{ color: 'red' }}>*{errors.dischargeDate}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='drName'
                                    placeholder="Enter Dr Name"
                                    type="text" className="form-control" onChange={handleChange} defaultValue={values.drName} readOnly />
                            </div>

                            {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}


                        </div>
                    </div>

                    <div className='row'>

                        <div className='col-lg-4'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Room Type<b style={{ color: 'red' }}>*</b>:</label>
                                <input type='text' name="roomType" className='form-control' placeholder='Enter Room Name' defaultValue={values.roomType} readOnly />
                            </div>
                            {errors.roomType && touched.roomType ? (<p style={{ color: 'red' }}>*{errors.roomType}</p>) : null}

                        </div>
                        <div className='col-lg-4'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Room No<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='roomNo'
                                    placeholder="Enter room no."
                                    type="number" className="form-control" onChange={handleChange} defaultValue={values.roomNo} readOnly />

                                {errors.roomNo && touched.roomNo ? (<p style={{ color: 'red' }}>*{errors.roomNo}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Bed No<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='bedNo'
                                    placeholder="Enter Bed no."
                                    type="number" className="form-control" onChange={handleChange} defaultValue={values.bedNo} readOnly />
                                {errors.bedNo && touched.bedNo ? (<p style={{ color: 'red' }}>*{errors.bedNo}</p>) : null}

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
                                <label >History and Clinical Summary:</label>
                                <textarea className="form-control" rows="3" name="history" placeholder='Enter Clinical History' onChange={handleChange} defaultValue={values.history} ></textarea>
                            </div>

                        </div>

                    </div>
                    <div className='row'>

                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Medical RX:</label>
                                <textarea className="form-control" rows="3" name="medicalRx" placeholder='Enter Medical Rx' onChange={handleChange} defaultValue={values.medicalRx} ></textarea>
                            </div>


                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Surgery / Procedure Name:</label>
                                <textarea className="form-control" rows="3" name="surgeryName" placeholder='Enter Surgery Name' onChange={handleChange} defaultValue={values.surgeryName} ></textarea>
                            </div>

                        </div>

                    </div>

                    <div className='row'>

                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Investigations<b style={{ color: 'red' }}>*</b>:</label>
                                <textarea className="form-control" rows="3" name="investigation" placeholder='Enter investigation Details' onChange={handleChange} defaultValue={values.investigation} ></textarea>
                                {errors.investigation && touched.investigation ? (<p style={{ color: 'red' }}>*{errors.investigation}</p>) : null}

                            </div>


                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Surgery Note:</label>
                                <textarea className="form-control" rows="3" name="surgeryNote" placeholder='Enter Surgery Note' onChange={handleChange} defaultValue={values.surgeryNote} ></textarea>
                            </div>

                        </div>

                    </div>
                    <div className='row'>

                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Histopathology Report:</label>
                                <input type='text' name="histopathologyReport" className='form-control' placeholder='Enter Histopathology Report' defaultValue={values.histopathologyReport} onChange={handleChange} />
                            </div>


                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Radiology Investigation:</label>
                                <input name='radiologyInvstigation'
                                    placeholder="Enter Radiology Investigation"
                                    type="text" className="form-control" onChange={handleChange} defaultValue={values.radiologyInvstigation} />
                            </div>
                        </div>

                    </div>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Advice on Discharge / Urgent Care<b style={{ color: 'red' }}>*</b>:</label>
                                <input type='text' name="adviceonDischarge" className='form-control' placeholder='Enter advice on Discharge Time' defaultValue={values.adviceonDischarge} onChange={handleChange} />
                                {errors.adviceonDischarge && touched.adviceonDischarge ? (<p style={{ color: 'red' }}>*{errors.adviceonDischarge}</p>) : null}

                            </div>

                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Condition On Discharge<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='conditionOnDischarge'
                                    placeholder="Enter Condition on Discharge"
                                    type="text" className="form-control" onChange={handleChange} defaultValue={values.conditionOnDischarge} />
                                {errors.conditionOnDischarge && touched.conditionOnDischarge ? (<p style={{ color: 'red' }}>*{errors.conditionOnDischarge}</p>) : null}


                            </div>
                        </div>

                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Advice:</label>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Enter Advice" value={advice} onChange={(e) => setAdvice(e.target.value)} />
                                    <div className="input-group-append">
                                        <span className="btn btn-success" onClick={pushAdvice}> <BiPlus size={25} /></span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >RX(Advice on Discharge)<b style={{ color: 'red' }}>*</b>:</label>
                                <div className='card' style={{ height: '100px' }}>
                                    <Scrollbars style={{ height: '100px' }}>
                                        {advices?.map((item, i) => {
                                            return <>
                                                <div key={i} style={{ display: 'flex' }}>
                                                    <div style={{ backgroundColor: 'lightgrey', margin: '2px', width: '90%' }}>
                                                        <span style={{ marginLeft: '5px' }}>{item}  </span>
                                                    </div>
                                                    <span style={{ marginLeft: '10px' }} onClick={() => cancleAdvice(item)}><AiFillDelete size={20} style={{ color: 'red' }} /></span>
                                                </div>
                                            </>
                                        })}
                                    </Scrollbars>
                                </div>
                                {errors.advices && touched.advices ? (<p style={{ color: 'red' }}>*{errors.advices}</p>) : null}

                            </div>

                        </div>
                        <div className='col-lg-6'>
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Select Discharge Type<b style={{ color: 'red' }}>*</b>:</label>
                                        <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='dischargeType' defaultValue={values.dischargeType} onChange={handleChange}>
                                            <option >Select Discharge Type </option>
                                            <option value='Improved'>Improved</option>
                                            <option value='Referred' >Referred</option>
                                            <option value='Unwell' >Unwell</option>
                                        </select>
                                        {errors.dischargeType && touched.dischargeType ? (<p style={{ color: 'red' }}>*{errors.dischargeType}</p>) : null}


                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Follow Up:</label>
                                        <input name='followUpDetails'
                                            placeholder="Enter Follow up Details."
                                            type="date" className="form-control" onChange={handleChange} defaultValue={values.followUpDetails} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
                {/* <div style={{ display: 'none' }}>
                    <div ref={componentRef}>
                        <table>
                            <thead>
                                <div className="header">
                                    <PrintHeader />
                                </div>
                            </thead>
                            <tbody>
                                <div style={{ width: '800px' }}>
                                    <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>Discharge Summary</h4></div>
                                    <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                                        <div className='row ' style={{ borderBottom: '2px solid black', paddingBottom: '20px' }}>
                                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                                <span><h6>Patient UID : {values.pid}</h6></span>
                                                <span><h6>Age/Sex : {values.page}/{values.pGender}</h6></span>
                                                <span><h6>Dr Name : {values.drName}</h6></span>
                                                <span><h6>Discharge Type : {values.dischargeType}</h6></span>
                                                <span><h6>Admit Date : {values.admitDate}</h6></span>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end '>
                                                <div>
                                                    <span><h6>Patient Name : {values.pName}</h6></span>
                                                    <span><h6>Admit UID : {values.admituid}</h6></span>
                                                    <span><h6>Mobile No: {values.pMobileNo}</h6></span>
                                                    <span><h6>Room Type: {values.roomType}({values.roomNo})</h6></span>
                                                    <span><h6>Discharge Date: {values.dischargeDate}</h6></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            {values.diagnosis ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Diagnosis</h6></div>
                                                    <div className='col-lg-9'><b>:</b>
                                                        {values.diagnosis.split('\n').map((item, key) => {
                                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                                        })}
                                                    </div>
                                                </div> : null
                                            }
                                            {values.history ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>History and Clinical Summary</h6></div>
                                                    <div className='col-lg-9'><b>:</b>
                                                        {values.history.split('\n').map((item, key) => {
                                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                                        })}
                                                    </div>
                                                </div> : null
                                            }
                                            {values.medicalRx ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Medical RX</h6></div>
                                                    <div className='col-lg-9'><b>:</b>
                                                        {values.medicalRx.split('\n').map((item, key) => {
                                                            return <React.Fragment key={key}>{item}<br /></React.Fragment>
                                                        })}
                                                    </div>
                                                </div> : null
                                            }
                                            {values.surgeryName ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Surgery/Procedure Name</h6></div>
                                                    <div className='col-lg-9'><b>:</b>
                                                        {values.surgeryName.split('\n').map((item, key) => {
                                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                                        })}
                                                    </div>
                                                </div> : null
                                            }
                                            {values.investigation ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Investigations</h6></div>
                                                    <div className='col-lg-9'><b>:</b>
                                                        {values.investigation.split('\n').map((item, key) => {
                                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                                        })}
                                                    </div>
                                                </div> : null
                                            }
                                            {values.surgeryNote ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Surgery Note</h6></div>
                                                    <div className='col-lg-9'><b>:</b>
                                                        {values.surgeryNote.split('\n').map((item, key) => {
                                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                                        })}
                                                    </div>
                                                </div> : null
                                            }

                                            {values.histopathologyReport ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Histopathology Report</h6></div>
                                                    <div className='col-lg-9'><b>:</b> {values.histopathologyReport}</div>
                                                </div> : null
                                            }
                                            {values.radiologyInvstigation ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Radiology Investigation</h6></div>
                                                    <div className='col-lg-9'><b>:</b> {values.radiologyInvstigation}</div>
                                                </div> : null
                                            }
                                            {values.adviceonDischarge ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Advice on Discharge/Urgent Care</h6></div>
                                                    <div className='col-lg-9'><b>:</b> {values.adviceonDischarge}</div>
                                                </div> : null
                                            }

                                            {values.conditionOnDischarge ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Condition On Discharge</h6></div>
                                                    <div className='col-lg-9'><b>:</b> {values.conditionOnDischarge}</div>
                                                </div> : null
                                            }

                                            {values.followUpDetails ?
                                                <div className='row'>
                                                    <div className='col-lg-3'><h6>Follow Up</h6></div>
                                                    <div className='col-lg-9'><b>:</b> {values.followUpDetails}</div>
                                                </div> : null
                                            }
                                            {advices ?
                                                <div className='card' style={{ padding: '3px' }}>
                                                    <div className='row'>
                                                        <div className='col-lg-3'><h6>RX(Advice on Discharge)</h6></div>
                                                        <div className='col-lg-9'><b>:</b>
                                                            {advices?.map((item, i) => {
                                                                return <>
                                                                    <div key={i} >
                                                                        <span>{item}</span>
                                                                    </div>
                                                                </>
                                                            })}</div>
                                                    </div>
                                                </div> : null
                                            }


                                        </div>
                                    </div>
                                </div>

                            </tbody>
                            <tfoot>
                                <div className="footer"><PrintFooter /></div>

                            </tfoot>
                        </table>


                    </div>
                </div> */}
            </Modal.Body>
            <Modal.Footer>
                {/* <PrintButton content={<div style={{ width: '800px' }}>
                    <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>Discharge Summary</h4></div>
                    <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                        <div className='row ' style={{ borderBottom: '2px solid black', paddingBottom: '20px' }}>
                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                <span><h6>Patient UID : {values.pid}</h6></span>
                                <span><h6>Age/Sex : {values.page}/{values.pGender}</h6></span>
                                <span><h6>Dr Name : {values.drName}</h6></span>
                                <span><h6>Discharge Type : {values.dischargeType}</h6></span>
                                <span><h6>Admit Date : {values.admitDate}</h6></span>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end '>
                                <div>
                                    <span><h6>Patient Name : {values.pName}</h6></span>
                                    <span><h6>Admit UID : {values.admituid}</h6></span>
                                    <span><h6>Mobile No: {values.pMobileNo}</h6></span>
                                    <span><h6>Room Type: {values.roomType}({values.roomNo})</h6></span>
                                    <span><h6>Discharge Date: {values.dischargeDate}</h6></span>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            {values.diagnosis ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Diagnosis</h6></div>
                                    <div className='col-lg-9'><b>:</b>
                                        {values.diagnosis.split('\n').map((item, key) => {
                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                        })}
                                    </div>
                                </div> : null
                            }
                            {values.history ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>History and Clinical Summary</h6></div>
                                    <div className='col-lg-9'><b>:</b>
                                        {values.history.split('\n').map((item, key) => {
                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                        })}
                                    </div>
                                </div> : null
                            }
                            {values.medicalRx ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Medical RX</h6></div>
                                    <div className='col-lg-9'><b>:</b>
                                        {values.medicalRx.split('\n').map((item, key) => {
                                            return <React.Fragment key={key}>{item}<br /></React.Fragment>
                                        })}
                                    </div>
                                </div> : null
                            }
                            {values.surgeryName ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Surgery/Procedure Name</h6></div>
                                    <div className='col-lg-9'><b>:</b>
                                        {values.surgeryName.split('\n').map((item, key) => {
                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                        })}
                                    </div>
                                </div> : null
                            }
                            {values.investigation ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Investigations</h6></div>
                                    <div className='col-lg-9'><b>:</b>
                                        {values.investigation.split('\n').map((item, key) => {
                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                        })}
                                    </div>
                                </div> : null
                            }
                            {values.surgeryNote ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Surgery Note</h6></div>
                                    <div className='col-lg-9'><b>:</b>
                                        {values.surgeryNote.split('\n').map((item, key) => {
                                            return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                        })}
                                    </div>
                                </div> : null
                            }

                            {values.histopathologyReport ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Histopathology Report</h6></div>
                                    <div className='col-lg-9'><b>:</b> {values.histopathologyReport}</div>
                                </div> : null
                            }
                            {values.radiologyInvstigation ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Radiology Investigation</h6></div>
                                    <div className='col-lg-9'><b>:</b> {values.radiologyInvstigation}</div>
                                </div> : null
                            }
                            {values.adviceonDischarge ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Advice on Discharge/Urgent Care</h6></div>
                                    <div className='col-lg-9'><b>:</b> {values.adviceonDischarge}</div>
                                </div> : null
                            }

                            {values.conditionOnDischarge ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Condition On Discharge</h6></div>
                                    <div className='col-lg-9'><b>:</b> {values.conditionOnDischarge}</div>
                                </div> : null
                            }

                            {values.followUpDetails ?
                                <div className='row'>
                                    <div className='col-lg-3'><h6>Follow Up</h6></div>
                                    <div className='col-lg-9'><b>:</b> {values.followUpDetails}</div>
                                </div> : null
                            }
                            {advices ?
                                <div className='card' style={{ padding: '3px' }}>
                                    <div className='row'>
                                        <div className='col-lg-3'><h6>RX(Advice on Discharge)</h6></div>
                                        <div className='col-lg-9'><b>:</b>
                                            {advices?.map((item, i) => {
                                                return <>
                                                    <React.Fragment key={i}> <b>{item}</b><br /></React.Fragment>
                                                </>
                                            })}</div>
                                    </div>
                                </div> : null
                            }


                        </div>
                    </div>
                </div>} /> */}
                {/* <ReactToPrint
                    trigger={() => {
                        return <Button variant="primary">Print</Button>;
                    }}
                    content={() => componentRef.current}
                    documentTitle={'Discharge Card'}
                    pageStyle={`
                    @page {
                      size: A4;
                      margin: 0;
                    }
                    @media print {
                      body {
                        margin: 1.6cm;
                      }
                      .header {                           
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        text-align: center;
                        background-color: transparent;
                      }
                      .footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        text-align: center;
                        background-color: transparent;

                      }
                    }
                  `} /> */}
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {!print ?
                    <Button variant="primary" onClick={handleSubmit} >
                        {update ? 'Update' : 'Discharge'}
                    </Button> : null
                }
            </Modal.Footer>
        </Modal>
        <Addpatientscommanmodel
            show={model}
            handleClose={() => setModel(false)}
            handleShow={() => setModel(true)}
        />
    </>


}

export default Discharge;
