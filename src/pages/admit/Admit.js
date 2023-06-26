/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import { admitformSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { AiFillPrinter } from 'react-icons/ai'
import { BsPencilSquare } from 'react-icons/bs'
import { FiFilter } from 'react-icons/fi'
// import Select from "react-dropdown-select";
import { selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_ADMIT_PATIENTS, DELETE_ADMIT_PATIENTS, EDIT_ADMIT_PATIENTS, selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice';
import { EDIT_ROOM, FILL_ROOMS, selectAllRooms } from 'src/redux/slice/roomMasterSlice';
import Addpatientscommanmodel from '../../comman/comman model/Addpatientscommanmodel';
import { useNavigate } from 'react-router-dom';
import { setTimeout } from 'core-js';
import Table from 'react-bootstrap/Table';
import Loaderspinner from '../../comman/spinner/Loaderspinner';
import CommanTable from 'src/comman/table/CommanTable';
import { addDatainsubcollection, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import Dropdown from 'react-bootstrap/Dropdown';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Select from 'react-select';
import './admit.css';
import { selectAllDr } from 'src/redux/slice/doctorsSlice';
import { BsEye } from 'react-icons/bs'
import SearchAutocomplete from 'src/comman/searchAutocomplete/SearchAutocomplete';
import AdmitModel from 'src/comman/commanAdmitModel.js/AdmitModel';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import billingicon from 'src/assets/images/billing-icon.png'
import { OverlayTrigger, Tooltip, Overlay } from 'react-bootstrap';
import { ddMMyyyy } from 'src/services/dateFormate';
import { filterData } from 'src/services/dataFilter';
import { selectUserId } from 'src/redux/slice/authSlice';

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center'> <h3>Invoice</h3></div>
            <b><hr></hr></b>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6'>
                    <span><b>Indoor Case No : {state.indoorCaseNo}</b></span>
                    <span><div>Name: {state.pName} ({state.pGender})</div></span>
                    <span><div>Age: {state.page}</div></span>
                    <span><div>Address: {state.pAddress}</div></span>
                    <span><div>Mobile No: {state.pMobileNo}</div></span>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <span><b>Bill No: {state.invoiceuid}</b></span>
                        <span><div>Admission UID: {state.admituid}</div></span>
                        <span><div>Admit Date: {state.admitDate} </div></span>
                        <span><div>Discharge Date: {state.dischargeDate}</div></span>
                        <span><div>Consulting Dr.: {state.drName}</div></span>
                    </div>
                </div>
            </div>

            <b><hr></hr></b>
            <div className='row text-center'> <h3>Bill Summary</h3></div>
            <div className='row'>
                <Table striped bordered>
                    <thead>
                        <tr>

                            <th>Particular</th>
                            <th>Rate</th>
                            <th>Units</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.allprevRooms?.map((room, j) => {
                            return <>
                                <tr key={j}>
                                    <td>Room ({room.roomType})</td>
                                    <td>{room.roomPrice.toFixed(2)}</td>
                                    <td>{room.totaldays}(Days)</td>
                                    <td>{room.totalRoomrent.toFixed(2)}</td>
                                </tr>
                            </>
                        })}
                        {state.extraCharges?.map((charge, k) => {
                            return <>
                                <tr key={k}>
                                    <td>{charge.chargeName}</td>
                                    <td>{charge.rate.toFixed(2)}</td>
                                    <td>{charge.qty}</td>
                                    <td>{charge.total.toFixed(2)}</td>
                                </tr>
                            </>
                        })}
                        {/* <tr>

                            <td>Nursing Charges</td>
                            <td>{Number(state.nursingRate).toFixed(2)}</td>
                            <td>{Number(state.nursingUnits).toFixed(2)}</td>
                            <td>{state.totalNursing.toFixed(2)}</td>
                        </tr>
                        <tr>

                            <td>OT Charges</td>
                            <td>{Number(state.otRate).toFixed(2)}</td>
                            <td>{Number(state.otUnits).toFixed(2)}</td>
                            <td>{state.totalOt.toFixed(2)}</td>
                        </tr>
                        <tr>

                            <td>ICU Charges</td>
                            <td>{Number(state.icuRate).toFixed(2)}</td>
                            <td>{Number(state.icuUnits).toFixed(2)}</td>
                            <td>{state.totalIcu.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td >Hospital Charges</td>
                            <td colSpan={2}>{state.hospitalCharges.toFixed(2)}</td>
                            <td>{state.hospitalCharges.toFixed(2)}</td>
                        </tr> */}
                        {/* {
                            state.pendingOpd?.map((opd, r) => {
                                return <>
                                    <tr key={r}>
                                        <td colSpan={3}>OPD({opd.drName})</td>
                                        <td>{opd.consultingCharges.toFixed(2)}</td>
                                    </tr>
                                </>
                            })
                        } */}
                        {
                            state.reportDetails?.map((report, i) => {
                                return <>
                                    <tr key={i}>
                                        <td >{report.reportName}</td>
                                        <td>{Number(report.reportPrice).toFixed(2)}</td>
                                        <td>1.00</td>
                                        <td>{Number(report.reportPrice).toFixed(2)}</td>
                                    </tr>
                                </>
                            })
                        }
                        {/* {!state.medicines.length ? null :
                            <tr>

                                <td colSpan={3}>
                                    <Table bordered hover>
                                        <thead>
                                            <tr>

                                                <th>Medicine</th>
                                                <th>Qty * Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state.medicines?.map((item, index) => {
                                                return <>
                                                    <tr key={index}>

                                                        <td>{item.medname}</td>
                                                        <td>{item.medQty} * {item.medPrice.toFixed(2)}</td>
                                                        <td>{item.totalmedPrice.toFixed(2)}</td>
                                                    </tr>
                                                </>;
                                            })}

                                        </tbody>
                                    </Table></td>
                                <td>{state.totalMedicines.toFixed(2)}</td>
                            </tr>
                        } */}
                        <tr>
                            <td colSpan={3}>Sub Total</td>
                            <td>{state.subtotal.toFixed(2)}</td>
                        </tr>
                        {
                            state.cgstValue === 0 ?
                                null
                                : <tr>
                                    <td colSpan={2}>CGST%</td>
                                    <td>{state.cgstValue}%</td>
                                    <td>{state.cgstAmount.toFixed(2)}</td>
                                </tr>
                        }

                        {
                            state.sgstValue === 0 ?
                                null
                                : <tr>
                                    <td colSpan={2} >SGST%</td>
                                    <td>{state.sgstValue}%</td>
                                    <td>{state.sgstAmount.toFixed(2)}</td>
                                </tr>
                        }

                    </tbody>
                </Table>
            </div>

            <div className='row'>
                <b><hr></hr></b>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                    <div>
                        <div>
                            <div><b>Invoice By :{state.userName}</b></div>
                            <span><b>Payment Type :{state.paymentType}</b></span>
                            <div><b>Payment Status :{state.paymentStatus}</b></div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <div><b>Total Bill Amount :{state.billingAmount.toFixed(2)}</b></div>
                        <span> <b>Advance:{Number(state.deposit).toFixed(2)}</b></span>
                        {state.discount ? <div><b>Discount :{Number(state.discount).toFixed(2)}</b></div> : null}
                        <div> <b>Payable Amount:{state.payableAmount.toFixed(2)}</b></div>
                    </div>
                </div>
                {/* <div className="form-check" style={{ marginTop: '20px' }}>
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='paid' checked={paid} onChange={(e) => setPaid(e.target.checked)} />If You Want to Paid the bill Please check the check box and cilck on Paid
                                        </label>
                                    </div> */}
                <b><hr></hr></b>
            </div>


        </div>
    )
};
const AdmitDateOverlayTrigger = forwardRef((props, ref) => {
    return (
        <OverlayTrigger
            ref={ref}
            {...props}
        >
            <span style={{ cursor: 'pointer' }}>Admit Date <FiFilter /></span>
        </OverlayTrigger>
    );
}


);

const DischargeDateOverlayTrigger = forwardRef((props, ref) => (
    <OverlayTrigger
        ref={ref}
        {...props}
    >
        <span style={{ cursor: 'pointer' }}>Discharge Date <FiFilter /></span>
    </OverlayTrigger>
));
const Admit = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [admitPatientList, setAdmitPatientList] = useState([]);
    const [admitPatientfilter, setAdmitPatientfilter] = useState([]);
    const [showtooltipadmit, setShowtooltipadmit] = useState(false);
    const [showtooltipDischarge, setShowtooltipDischarge] = useState(false);
    const hospitaluid = useSelector(selectUserId)

    const [todayDate, setTodayDate] = useState()
    // const [allPatients, setAllPatients] = useState([]);
    const roomList = useSelector(selectAllRooms);
    const [update, setUpdate] = useState(false)
    const allAdmitPatients = useSelector(selectAdmitPatients)
    const [item, setitems] = useState()
    const [room, setRoom] = useState([])
    const [printContent, setPrintContent] = useState(null);
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()


    const filtertheData = (date) => {
        if (startDate && endDate) {
            setAdmitPatientList(filterData(admitPatientList, startDate, endDate, date))
            setShowtooltipadmit(false)
            setShowtooltipDischarge(false)
        }

    }
    const clearfilterData = () => {
        setStartDate('')
        setEndDate('')
        setAdmitPatientList([...allAdmitPatients].reverse());
        setShowtooltipadmit(false)
        setShowtooltipDischarge(false)

    }
    const columns = [
        {


            name: (

                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip ><div >
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <div className="form-group" >
                                        <label >Form<b style={{ color: 'red' }}>*</b>:</label>
                                        <input name='startDate'
                                            type="date" className="form-control" defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)} />

                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className="form-group" >
                                        <label >To<b style={{ color: 'red' }}>*</b>:</label>
                                        <input name='endDate'
                                            type="date" className="form-control" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex mt-2 mb-1 justify-content-end'>
                                <Button variant="secondary" onClick={clearfilterData}>
                                    Clear
                                </Button>
                                <Button variant="primary" style={{ marginLeft: '10px' }} onClick={() => filtertheData('admitDate')}>
                                    Filter
                                </Button>
                            </div>


                        </div></Tooltip>}
                    trigger='click'
                    show={showtooltipadmit}

                >
                    <span style={{ cursor: 'pointer' }} onClick={() => setShowtooltipadmit(!showtooltipadmit)}>Admit Date <FiFilter /></span>
                </OverlayTrigger>
            ),
            selector: row => row.admitDate,
            // sortable: true,
            cell: row => <div style={{ textAlign: 'center' }}>{row.admitDate}</div>,
        },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip ><div >
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className="form-group" >
                                    <label >Form<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='startDate'
                                        type="date" className="form-control" defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)} />

                                </div>
                            </div>
                            <div className='col-lg-12'>
                                <div className="form-group" >
                                    <label >To<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='endDate'
                                        type="date" className="form-control" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
                                </div>
                            </div>
                        </div>
                        <div className='d-flex mt-2 mb-1 justify-content-end'>
                            <Button variant="secondary" onClick={clearfilterData}>
                                Clear
                            </Button>
                            <Button variant="primary" style={{ marginLeft: '10px' }} onClick={() => filtertheData('dischargeDate')}>
                                Filter
                            </Button>
                        </div>


                    </div></Tooltip>}
                    trigger='click'
                    show={showtooltipDischarge}
                >
                    <span style={{ cursor: 'pointer' }} onClick={() => setShowtooltipDischarge(!showtooltipDischarge)}>Discharge Date <FiFilter /></span>
                </OverlayTrigger>
            ),

            selector: row => row.dischargeDate ? row.dischargeDate : '-',
            cell: row => <div style={{ textAlign: 'center' }}>{row.dischargeDate ? row.dischargeDate : '-'}</div>,
            width: '200px'
        },
        {
            name: 'Patient Name',
            selector: row => row.pName,
            sortable: true,
            cell: row => <div style={{ textAlign: 'center' }}>{row.pName}</div>
        },
        {
            name: 'Address',
            selector: row => row.pAddress,
            cell: row => <div style={{ textAlign: 'center' }}>{row.pAddress}</div>
        },
        {
            name: 'Mobile No',
            selector: row => row.pMobileNo,
            cell: row => <div style={{ textAlign: 'center' }}>{row.pMobileNo}</div>
        },
        {
            name: 'Total',
            selector: row => row.payableAmount ? '₹' + row.payableAmount : '-',
            cell: row => <div className='d-flex justifycontent-center' style={{ textAlign: 'center' }}>{row.payableAmount ? '₹' + (row.payableAmount + (row.deposit ? Number(row.deposit) : 0)).toFixed(2) : '-'}</div>
        },
        {
            name: 'Payment Status',
            cell: row => (
                <div
                    style={{
                        backgroundColor: row.paymentStatus === 'Completed' ? 'green' : 'red',
                        color: 'white',
                        width: '80px',
                        height: '20px',
                        display: 'flex',
                        borderRadius: '10px',
                        alignContent: 'center',
                        justifyContent: 'center',
                        textAlign: 'center' // Center the content
                    }}
                >
                    {row.paymentStatus}
                </div>
            )
        },
        {
            name: 'Action',
            cell: row => (
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                    {row.paymentStatus === 'Completed' ? (
                        <span style={{ display: 'flex', justifyContent: 'center' }}>
                            <button onClick={() => viewInvoice(row)} style={{ color: 'skyblue', border: 'none' }}>
                                <BsEye size={22} />
                            </button>
                        </span>
                    ) : (
                        <>
                            <button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}>
                                <MdEdit size={22} />
                            </button>
                        </>
                    )}
                    {row.dischargeDate ? (
                        <button onClick={() => generateInvoice(row)} style={{ color: 'skyblue', border: 'none' }}>
                            {row.paymentStatus === 'Completed' ? <AiFillPrinter size={25} /> : <img src={billingicon} alt='billingicon' />}
                        </button>
                    ) : null}
                    <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }}>
                        <AiFillDelete size={22} />
                    </button>
                </span>
            )
        }
    ];

    const handleClose = () => {

        setShow(false);
        setUpdate(false);
        setitems()
    }
    const handleShow = () => {
        setShow(true)
        setTodayDate(new Date().toISOString().substr(0, 10))
    };

    useEffect(() => {
        // addDatainsubcollection()
        setAdmitPatientList([...allAdmitPatients].reverse());
        setAdmitPatientfilter(allAdmitPatients);
        setRoom([...roomList]);
        setIsLoading(false);
    }, [allAdmitPatients, roomList])


    // const formik = useFormik({
    //     initialValues: initalValues,
    //     validationSchema: admitformSchema,
    //     onSubmit: async (Values, { resetForm }) => {
    //         let time_differ = (new Date(values.dischargeDate) - new Date(values.admitDate));
    //         values.totalDayes = time_differ / (1000 * 60 * 60 * 24);
    //         values.totalAmount = values.priceperNignt * values.totalDayes;
    //         let admit1 = [...admitPatientfilter]
    //         let roomArray = undefined
    //         let findRoomindex = room.findIndex((item) => item.roomType === values.roomType)

    //         let finRoomNoIndex = room[findRoomindex].rooms.findIndex((item3) => item3.roomNo === values.roomNo)
    //         if (values.dischargeDate) {
    //             let newArray = room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (item3.bedNo === values.bedNo ? { ...item3, occupied: false } : item3))
    //             let newArray1 = room[findRoomindex].rooms.map((item3) => (item3.roomNo === values.roomNo ? { ...item3, BEDS: newArray } : item3))
    //             roomArray = room.map((item) => (item.roomType === values.roomType ? { ...item, rooms: newArray1 } : item))

    //         } else {
    //             let newArray = room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (item3.bedNo === values.bedNo ? { ...item3, occupied: true } : item3))
    //             let newArray1 = room[findRoomindex].rooms.map((item3) => (item3.roomNo === values.roomNo ? { ...item3, BEDS: newArray } : item3))
    //             roomArray = room.map((item) => (item.roomType === values.roomType ? { ...item, rooms: newArray1 } : item))

    //         }

    //         if (!update) {
    //             values.admituid = Math.floor(3407 + Math.random() * 9000)

    //             let admit = [...admitPatientfilter, Values]

    //             try {
    //                 await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', admit)
    //                 dispatch(ADD_ADMIT_PATIENTS(Values))
    //                 await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray)
    //                 dispatch(FILL_ROOMS(roomArray))
    //                 await resetForm({ values: '' })
    //                 clearForm()
    //                 toast.success("Admit successful.....");


    //                 setShow(false)
    //             } catch (error) {
    //                 console.error(error.message);
    //             }

    //         } else {
    //             const find = admit1.findIndex((item) => item.admituid === Values.admituid)
    //             admit1[find] = Values
    //             try {
    //                 await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', admit1)
    //                 dispatch(EDIT_ADMIT_PATIENTS(Values))
    //                 await setData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray)
    //                 dispatch(FILL_ROOMS(roomArray))
    //                 resetForm({ values: '' })
    //                 clearForm()
    //                 toast.success("Updated successful.....");
    //                 setShow(false)
    //                 setUpdate(false)
    //             } catch (error) {
    //                 console.error(error.message);
    //             }

    //         }

    //     }
    // });
    // const {
    //     values,
    //     errors,
    //     touched,
    //     handleSubmit,
    //     handleChange,
    //     handleBlur,
    // } = formik;

    // const clearForm = () => {
    //     formik.setValues({
    //         pid: '',
    //         pName: '',
    //         page: '',
    //         pGender: '',
    //         pAddress: '',
    //         pMobileNo: '',
    //         drName: '',
    //         admitDate: '',
    //         dischargeDate: '',
    //         roomType: '',
    //         roomNo: '',
    //         bedNo: '',
    //         priceperNignt: '',
    //         totalAmount: '',
    //         totalDayes: '',
    //         paymentStatus: '',
    //         admituid: '',
    //         deposit: 0,
    //     });
    // };

    // const handleOnClear = () => {
    //     formik.setValues({
    //         pid: '',
    //         pName: '',
    //         page: '',
    //         pGender: '',
    //         pAddress: '',
    //         pMobileNo: '',
    //     });
    // }
    const editPatientDetails = (item) => {
        // filDatainsubcollection(allAdmitPatients, "admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient')
        // const { pid, pName, page, pGender, pAddress, pMobileNo, admitDate, dischargeDate, drName, roomType, priceperNignt, roomNo, bedNo, paymentStatus, admituid, deposit } = item;
        // formik.setValues({
        //     pid, pName, page, pGender, pAddress, pMobileNo, admitDate, dischargeDate, drName, roomType, priceperNignt, roomNo, bedNo, paymentStatus, admituid, deposit
        // }); 
        setitems(item)
        setShow(true);
        setUpdate(true);

    }

    const deletePatientsDetails = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let roomArray = {}
                        if (!item1.dischargeDate) {
                            let findRoomindex = await room.findIndex((item) => item.roomType === item1.roomType)
                            let finRoomNoIndex = await room[findRoomindex].rooms.findIndex((item3) => item3.roomNo === item1.roomNo)
                            let newArray = await room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (item3.bedNo === item1.bedNo ? { ...item3, occupied: false } : item3))
                            let newArray1 = await room[findRoomindex].rooms.map((item3) => (item3.roomNo === item1.roomNo ? { ...item3, BEDS: newArray } : item3))
                            // roomArray = await room.map((item) => (item.roomType === item1.roomType ? { ...item, rooms: newArray1 } : item))
                            roomArray = { ...room[findRoomindex], rooms: newArray1 };
                        }
                        let admit = await admitPatientfilter.filter((item) => item.admituid !== item1.admituid);
                        try {
                            // await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', admit)
                            // await deleteSingltObject("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', item1, 'admituid', 'hospitaluid')
                            await deleteDatainSubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', item1, 'admituid', 'hospitaluid')
                            // setAdmitPatientList(admitPatientList.filter((item) => item.admituid !== item1.admituid))
                            // dispatch(DELETE_ADMIT_PATIENTS(item1))
                            if (!item1.dischargeDate) {
                                // await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                                await updateDatainSubcollection('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                                // dispatch(EDIT_ROOM(roomArray))
                            }
                            toast.success("Deleted successful.....");

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

    const requestSearch = (searchvalue) => {

        const filteredRows = admitPatientfilter.filter((row) => {
            return row.pid.toString().includes(searchvalue.toLowerCase()) || row.pName.toLowerCase().includes(searchvalue.toLowerCase()) || row.pMobileNo.includes(searchvalue);
        });
        if (searchvalue.length < 1) {

            setAdmitPatientList([...allAdmitPatients].reverse())
        }
        else {

            setAdmitPatientList(filteredRows)
        }
    }

    const generateInvoice = (item) => {
        // filDatainsubcollection(allAdmitPatients, "admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid)
        if (item.paymentStatus === "Completed") {
            setPrintContent(<PrintComponent data={{
                data1: {
                    ...item,
                }
            }} />)
        } else {
            navigate('/indoor/invoice', { state: item })
        }
        // if (item.dischargeDate) {

        // } else {
        //     toast.error("Discharge Date not found.....");
        // }
    }
    const viewInvoice = (item) => {
        if (item.dischargeDate) {
            navigate('/indoor/invoice', { state: item })
        } else {
            toast.error("Discharge Date not found.....");
        }
    }

    const filterDataAdmit = () => {
        let patient = admitPatientfilter.filter((item) => item.dischargeDate === '');
        setAdmitPatientList(patient)

    }
    const filterDataDischarge = () => {
        let patient = admitPatientfilter.filter((item) => item.dischargeDate !== '');
        setAdmitPatientList(patient)

    }
    const clearFilter = () => {
        setAdmitPatientList(admitPatientfilter)
    }

    return <>
        {isLoading ? <Loaderspinner /> : <>
            <div>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
                <CommanTable
                    title={"Indoor Patients"}
                    columns={columns}
                    data={admitPatientList}
                    action={<button className='btn btn-primary ' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                    subHeaderComponent={<><Dropdown style={{ marginRight: '20px' }}>
                        <Dropdown.Toggle variant="primary" >
                            <FiFilter size={22} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={filterDataAdmit}>Admit</Dropdown.Item>
                            <Dropdown.Item onClick={filterDataDischarge}>Discharged</Dropdown.Item>
                            <Dropdown.Item onClick={clearFilter}>Clear Filter</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                        <input type='search' placeholder='search' className='w-25 form-control' onChange={(e) => requestSearch(e.target.value)} /></>}
                />
            </div >
        </>
        }
        <AdmitModel show={show} handleClose={handleClose} data={item} update={update} todayDate={todayDate} />
        {/* <Modal show={show} onHide={handleClose} size="lg" style={{ filter: model ? 'blur(5px)' : 'blur(0px)' }}>

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
                            {
                                update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Patient id:</label>
                                    <input type="text" className="form-control" placeholder="Enter patient id" name='pid' readOnly value={values.pid} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}
                                </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Patient id:</label>
                                        <SearchAutocomplete
                                            allPatients={allPatients}
                                            handleOnSelect={handleOnSelect}
                                            inputsearch={values.pid}
                                            placeholder={'Enter Patients id'}
                                            handleClear={handleOnClear}
                                            keyforSearch={"pid"} />

                                        {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}

                                    </div>
                            }
                        </div>
                        <div className='col-lg-6'>
                            {update || values.pMobileNo ?
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Mobile No:</label>
                                    <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' readOnly value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                                </div> :
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Mobile No: </label>
                                    <SearchAutocomplete
                                        allPatients={allPatients}
                                        handleOnSelect={handleOnSelect}
                                        inputsearch={values.pMobileNo}
                                        placeholder={'Enter Mobile No'}
                                        handleClear={handleOnClear}
                                        keyforSearch={"pMobileNo"} />

                                    {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}

                                </div>
                            }
                        </div>

                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            {update || values.pName ?
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Patient Name:</label>
                                    <input name='pName'
                                        placeholder="Enter Patient Name"
                                        type="text" className="form-control" onChange={handleChange} defaultValue={values.pName} />
                                    {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                </div>
                                :
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Patient Name:</label>
                                    <SearchAutocomplete
                                        allPatients={allPatients}
                                        handleOnSelect={handleOnSelect}
                                        inputsearch={values.pName}
                                        placeholder={'Enter Patient Name'}
                                        handleClear={handleOnClear}
                                        keyforSearch={"pName"} />

                                    {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                </div>
                            }
                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Patient Age:</label>
                                <input name='page'
                                    placeholder="Enter Patient Age"
                                    type="number" className="form-control" onChange={handleChange} defaultValue={values.page} />
                                {errors.page && touched.page ? (<p style={{ color: 'red' }}>*{errors.page}</p>) : null}

                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Admit Date:</label>
                                <input name='admitDate'
                                    placeholder="Enter Admit Date"
                                    type="date" className="form-control" onChange={handleChange} defaultValue={values.admitDate} />
                                {errors.admitDate && touched.admitDate ? (<p style={{ color: 'red' }}>*{errors.admitDate}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Discharge Date:</label>
                                <input name='dischargeDate'
                                    placeholder="Enter Discharge Date"
                                    type="date" className="form-control" onChange={handleChange} defaultValue={values.dischargeDate} />
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            {update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Dr Name:</label>
                                <input name='drName'
                                    placeholder="Enter Dr Name"
                                    type="text" className="form-control" onChange={handleChange} defaultValue={values.drName} readOnly />
                            </div> :
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Dr Name:</label>
                                    <Select options={allDoctors} getOptionValue={(option) => option.drName}
                                        getOptionLabel={(option) => option.drName}
                                        placeholder="Select Doctor"
                                        onChange={(e) => { selectDoctor(e) }} />
                                    {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}


                                </div>}
                        </div>
                        <div className='col-lg-6'>
                            {update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Room Type:</label>
                                <input type='text' name="roomType" className='form-control' defaultValue={values.roomType} readOnly />
                            </div> :
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Room Type:</label>
                                    <Select options={roomList} getOptionValue={(option) => option.roomType}
                                        getOptionLabel={(option) => option.roomType}
                                        // value={defaultvalue1}
                                        // defaultValue={defaultvalue1}
                                        isOptionSelected={(option) => option.roomType === values.roomType}
                                        // name='roomType'
                                        placeholder="Select Room"
                                        onChange={(e) => { selectRoomprice(e) }} />
                                    {errors.roomType && touched.roomType ? (<p style={{ color: 'red' }}>*{errors.roomType}</p>) : null}

                                </div>}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Charges Per Night:</label>
                                <input name='priceperNignt'
                                    placeholder="Enter Charges"
                                    type="number" className="form-control" onChange={handleChange} defaultValue={values.priceperNignt} readOnly />
                                {errors.priceperNignt && touched.priceperNignt ? (<p style={{ color: 'red' }}>*{errors.priceperNignt}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Room No:</label>
                                {update ?
                                    <input name='roomNo'
                                        placeholder="Enter room no."
                                        type="number" className="form-control" onChange={handleChange} defaultValue={values.roomNo} readOnly />
                                    :
                                    <Select options={rooms} getOptionValue={(option) => option.roomNo}
                                        getOptionLabel={(option) => option.roomNo}
                                        placeholder="Select Room No"
                                        onChange={(e) => { selectRoom(e) }} />}

                                {errors.roomNo && touched.roomNo ? (<p style={{ color: 'red' }}>*{errors.roomNo}</p>) : null}

                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Select Bed:</label>
                                {update ?
                                    <input name='bedNo'
                                        placeholder="Enter room no."
                                        type="number" className="form-control" onChange={handleChange} defaultValue={values.bedNo} readOnly />
                                    :
                                    <Select options={bedNo} getOptionValue={(option) => option.bedNo}
                                        getOptionLabel={(option) => option.bedNo}
                                        placeholder="Select Bed"
                                        onChange={(e) => { selectBed(e) }} />}
                                {errors.bedNo && touched.bedNo ? (<p style={{ color: 'red' }}>*{errors.bedNo}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Deposit:</label>
                                <input name='deposit'
                                    placeholder="Enter Deposit Amount."
                                    type="number" className="form-control" onChange={handleChange} defaultValue={values.deposit} />
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Payment Status:</label>
                                <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='paymentStatus' defaultValue={values.paymentStatus} onChange={handleChange}>
                                    <option >Select Payment Status</option>
                                    <option value='Complete'>Complete</option>
                                    <option value='Panding' selected>Panding</option>
                                </select>
                                {errors.paymentStatus && touched.paymentStatus ? (<p style={{ color: 'red' }}>*{errors.paymentStatus}</p>) : null}

                            </div>
                        </div>

                    </div>

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit} >
                    {update ? 'Update' : 'Admit'}
                </Button>
            </Modal.Footer>
        </Modal>
        <Addpatientscommanmodel
            show={model}
            handleClose={() => setModel(false)}
            handleShow={() => setModel(true)}
        /> */}
    </>


}

export default Admit;
