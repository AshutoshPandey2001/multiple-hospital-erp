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
import { TfiReload } from 'react-icons/tfi'
// import Select from "react-dropdown-select";
import { selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_ADMIT_PATIENTS, DELETE_ADMIT_PATIENTS, EDIT_ADMIT_PATIENTS, FILL_ADMIT_PATIENTS, selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice';
import { EDIT_ROOM, FILL_ROOMS, selectAllRooms } from 'src/redux/slice/roomMasterSlice';
import Addpatientscommanmodel from '../../comman/comman model/Addpatientscommanmodel';
import { useNavigate } from 'react-router-dom';
import { setTimeout } from 'core-js';
import Table from 'react-bootstrap/Table';
import Loaderspinner from '../../comman/spinner/Loaderspinner';
import CommanTable from 'src/comman/table/CommanTable';
import { addDatainsubcollection, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, getSubcollectionData, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
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
import { ddMMyyyy, dd_mm_YYYY, formatDateDDMMYYY, formatDateYYYYMMDD, formatDateyyyymmddUtc, yyyyMMddTHHmm } from 'src/services/dateFormate';
import { filterData, filterDatainIndoor } from 'src/services/dataFilter';
import { selectUserId } from 'src/redux/slice/authSlice';
import { ToWords } from 'to-words';
import moment from 'moment';
import { debounce } from 'lodash';
import { db } from 'src/firebaseconfig';
import DataTable from 'react-data-table-component';

const toWords = new ToWords();

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
                        <span><div>Admit Date: {formatDateDDMMYYY(state.admitDate)} </div></span>
                        <span><div>Discharge Date: {formatDateDDMMYYY(state.dischargeDate)}</div></span>
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
                <div className='row text-center'> <b className='text-center'>{toWords.convert(state.payableAmount, { currency: true })}</b></div>

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
    const [lastVisible, setLastVisible] = useState(null);
    const [perPageRows, setPerPageRows] = useState(10); // Initial value for rows per page
    const [totalnumData, setsetTotalNumData] = useState(0); // Initial value for rows per page
    const [currentPage, setCurrentPage] = useState(1);
    const [firstVisible, setFirstVisible] = useState(null);
    const [prev, setPrev] = useState(false);
    const [searchBy, setSearchBy] = useState('');
    const [searchString, setSearchString] = useState('');
    const parentDocRef = db.collection('admitPatients').doc('jSqDGnjO21bpPGhb6O2y');

    // const subcollectionRef = parentDocRef.collection('opdPatient').where('hospitaluid', '==', hospitaluid);
    const subcollectionRef = parentDocRef.collection('admitPatient').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);

    let unsubscribe = undefined

    const filtertheData = (date) => {
        if (startDate && endDate) {
            setAdmitPatientList(filterDatainIndoor(admitPatientList, startDate, endDate, date))
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
                        <Tooltip style={{ textAlign: 'left', color: 'white' }}>
                            <div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className="form-group">
                                            <label>Form<b style={{ color: 'red' }}>*</b>:</label>
                                            <input name='startDate' type="date" className="form-control" defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='col-lg-12'>
                                        <div className="form-group">
                                            <label>To<b style={{ color: 'red' }}>*</b>:</label>
                                            <input name='endDate' type="date" className="form-control" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
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
                            </div>
                        </Tooltip>}
                    trigger='click'
                    show={showtooltipadmit}
                >
                    <span className='d-flex justify-content-center w-100' style={{ cursor: 'pointer', display: 'flex' }} ><FiFilter onClick={() => setShowtooltipadmit(!showtooltipadmit)} /> Admit Date </span>
                </OverlayTrigger>
            ),
            selector: row => row.admitDate,
            sortable: true,
            sortFunction: (a, b) => { return moment(a.admitDate).toDate().getTime() - moment(b.admitDate).toDate().getTime() },
            cell: row => <div style={{ textAlign: 'center' }}>{formatDateDDMMYYY(row.admitDate)}</div>,
            width: '12%',
            // className: 'col-lg-4 col-md-4',
            padding: 0
        },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip>
                            <div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className="form-group">
                                            <label>Form<b style={{ color: 'red' }}>*</b>:</label>
                                            <input name='startDate' type="date" className="form-control" defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='col-lg-12'>
                                        <div className="form-group">
                                            <label>To<b style={{ color: 'red' }}>*</b>:</label>
                                            <input name='endDate' type="date" className="form-control" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex mt-2 mb-1 justify-content-end'>
                                    <Button variant="secondary" onClick={clearfilterData}>
                                        Clear
                                    </Button>
                                    <Button variant="primary" style={{ paddingLeft: '10px' }} onClick={() => filtertheData('dischargeDate')}>
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </Tooltip>}
                    trigger='click'
                    show={showtooltipDischarge}
                >
                    <span className='d-flex justify-content-center w-100' style={{ cursor: 'pointer', display: 'flex' }} > <FiFilter onClick={() => setShowtooltipDischarge(!showtooltipDischarge)} /> Discharge Date </span>
                </OverlayTrigger>
            ),
            selector: row => row.dischargeDate ? row.dischargeDate : '-',
            sortable: true,
            cell: row => <div style={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}>{row.dischargeDate ? formatDateDDMMYYY(row.dischargeDate) : '-'}</div>,
            width: '12%',
            // className: 'col-lg-4 col-md-4',
            padding: 0
        },
        {
            name: (<span className='d-flex justify-content-center w-100'>Patient Name</span>),
            selector: row => row.pName,
            sortable: true,
            cell: row => <div style={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}>{row.pName}</div>,
            width: '16%',
            // className: 'col-lg-2 col-md-2',
            padding: 0
        },
        {
            name: (<span className='d-flex justify-content-center w-100'>Address</span>),
            selector: row => row.pAddress,
            cell: row => <div style={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}>{row.pAddress}</div>,
            width: '12%',
            // className: 'col-lg-1 col-md-1',
            padding: 0
        },
        {
            name: (<span className='d-flex justify-content-center w-100'>Mobile No</span>),
            selector: row => row.pMobileNo ? row.pMobileNo : '-',
            cell: row => <div style={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}>{row.pMobileNo ? row.pMobileNo : '-'}</div>,
            width: '13%',
            // className: 'col-lg-1 col-md-1',
            padding: 0
        },
        {
            name: (<span className='d-flex justify-content-center w-100'>Total</span>),
            selector: row => row.payableAmount ? '₹' + row.payableAmount : '-',
            cell: row => <div style={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}>{row.payableAmount ? '₹' + (row.payableAmount + (row.deposit ? Number(row.deposit) : 0)).toFixed(2) : '-'}</div>,
            width: '10%',
            // className: 'col-lg-1 col-md-1',
            padding: 0
        },
        {
            name: (<span className='d-flex justify-content-center w-100'>Status</span>),
            cell: row => (
                <div
                    style={{
                        width: '100%',
                        backgroundColor: row.paymentStatus === 'Completed' ? 'green' : 'red',
                        color: 'white',
                        height: '1.25rem',
                        display: 'flex',
                        borderRadius: '10px',
                        alignContent: 'center',
                        justifyContent: 'center',
                        textAlign: 'center' // Center the content
                    }}
                >
                    {row.paymentStatus}
                </div>
            ),
            width: '10%',
            // className: 'col-lg-1 col-md-1',
            padding: 0
        },
        {
            name: (<span className='d-flex justify-content-center w-100'>Action</span>),
            cell: row => (
                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    {row.paymentStatus === 'Completed' ? (
                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            ),

            width: '15%',
            padding: 0
        }
    ];


    const handleClose = () => {

        setShow(false);
        setUpdate(false);
        setitems()
    }
    const handleShow = () => {
        setShow(true)
        setTodayDate(new Date().toISOString().substr(0, 10) + 'T' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
    };

    // useEffect(() => {
    //     getSubcollectionData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid, (data) => {
    //         // Handle the updated data in the callback function
    //         dispatch(FILL_ADMIT_PATIENTS(data))
    //         setIsLoading(false);
    //         console.log('Received real-time data:', data);
    //     }).catch((error) => {
    //         setIsLoading(false);
    //         console.error('Error:', error);
    //     })
    // }, [])

    // useEffect(() => {
    //     // addDatainsubcollection()
    //     setAdmitPatientList([...allAdmitPatients].reverse());
    //     setAdmitPatientfilter(allAdmitPatients);
    //     setRoom([...roomList]);
    //     setIsLoading(false);


    // }, [allAdmitPatients, roomList])

    useEffect(() => {
        // addDatainsubcollection()
        // setAdmitPatientList([...allAdmitPatients].reverse());
        // setAdmitPatientfilter(allAdmitPatients);
        setRoom([...roomList]);
        setIsLoading(false);


    }, [roomList])

    useEffect(() => {
        setIsLoading(true)
        let query = subcollectionRef
            .orderBy('timestamp', 'desc')
            .limit(perPageRows)
        debouncedRetrieveData(query)
        setIsLoading(false)
        totalNumberofData()
        // onlyChangeDetector()
        // chnageDetectore()
        return () => {
            // unsub()
            unsubscribe();
            console.log('unmounting');
        };
        // setOpdPatientList([...allopdPatientList].reverse())
        // setOpdPatientfilter(allopdPatientList)
    }, [])
    const totalNumberofData = () => {
        // const parentDocRef = db.collection('opdPatients').doc('m5JHl3l4zhaBCa8Vihcb');
        // const subcollectionRef = parentDocRef.collection('opdPatient');

        let query = subcollectionRef;

        query.onSnapshot((snapshot) => {
            console.log(snapshot);
            const totalDataCount = snapshot.size;
            setsetTotalNumData(totalDataCount)
            console.log('Total data count:', totalDataCount);
        })
    }

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
                setAdmitPatientList(newData);
                console.log('newData-------------------------------------', newData);
                if (snapshot.size > 0) {
                    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
                    // console.log('lastVisibleDoc', lastVisibleDoc.data());
                    setLastVisible(lastVisibleDoc);
                    setFirstVisible(snapshot.docs[0]);
                    // setsetTotalNumData(snapshot.size)
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
                            let finRoomNoIndex = await room[findRoomindex].rooms.findIndex((item3) => Number(item3.roomNo) === Number(item1.roomNo))
                            let newArray = await room[findRoomindex].rooms[finRoomNoIndex].BEDS.map((item3) => (Number(item3.bedNo) === Number(item1.bedNo) ? { ...item3, occupied: false } : item3))
                            let newArray1 = await room[findRoomindex].rooms.map((item3) => (Number(item3.roomNo) === Number(item1.roomNo) ? { ...item3, BEDS: newArray } : item3))
                            // roomArray = await room.map((item) => (item.roomType === item1.roomType ? { ...item, rooms: newArray1 } : item))
                            roomArray = { ...room[findRoomindex], rooms: newArray1 };
                        }
                        let admit = await admitPatientfilter.filter((item) => item.admituid !== item1.admituid);
                        try {
                            // await setData("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', admit)
                            // await deleteSingltObject("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', item1, 'admituid', 'hospitaluid')
                            await deleteDatainSubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', item1, 'admituid', 'hospitaluid')
                            // setAdmitPatientList(admitPatientList.filter((item) => item.admituid !== item1.admituid))
                            dispatch(DELETE_ADMIT_PATIENTS(item1))
                            if (!item1.dischargeDate) {
                                // await updateSingltObject('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                                await updateDatainSubcollection('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', roomArray, 'roomuid', 'hospitaluid')
                                dispatch(EDIT_ROOM(roomArray))
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

    // const requestSearch = (searchvalue) => {

    //     const filteredRows = admitPatientfilter.filter((row) => {
    //         return row.pid.toString().includes(searchvalue.toLowerCase()) || row.pName.toLowerCase().includes(searchvalue.toLowerCase()) || row.pMobileNo.includes(searchvalue);
    //     });
    //     if (searchvalue.length < 1) {

    //         setAdmitPatientList([...allAdmitPatients].reverse())
    //     }
    //     else {

    //         setAdmitPatientList(filteredRows)
    //     }
    // }

    const generateInvoice = (item) => {
        // filDatainsubcollection(allAdmitPatients, "admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid)
        // changeDateFormate()
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
    const reloadData = () => {
        setIsLoading(true)
        getSubcollectionData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid, (data) => {
            // Handle the updated data in the callback function
            dispatch(FILL_ADMIT_PATIENTS(data))
            setIsLoading(false)

            console.log('Received real-time data:', data);
        }).catch((error) => {
            setIsLoading(false)

            console.error('Error:', error);
        })
    }
    const changeDateFormate = () => {
        // const formDate = moment('08/07/2023').utc().format('YYYY-MM-DDTHH:mm[Z]');

        allAdmitPatients.map(async (item, i) => {
            // setTimeout(() => {

            // }, 2000);
            const desiredFormat = 'YYYY-MM-DDTHH:mm[Z]';

            // Check if inputDate already matches the desired format
            if (moment(item.admitDate, desiredFormat, true).isValid() && moment(item.dischargeDate, desiredFormat, true).isValid()) {
                console.log('i am done');
                return;
            }

            // console.log('admit Date', i, formatDateyyyymmddUtc(item.admitDate));

            // console.log('Discharge Date', i, formatDateyyyymmddUtc(item.dischargeDate));
            await updateDatainSubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', { ...item, admitDate: formatDateyyyymmddUtc(item.admitDate), dischargeDate: item.dischargeDate ? formatDateyyyymmddUtc(item.dischargeDate) : item.dischargeDate }, 'admituid', 'hospitaluid')

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
                setsetTotalNumData(totalDataCount)
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
            <div>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
                {/* <CommanTable
                    title={"Indoor Patients"}
                    columns={columns}
                    data={admitPatientList}
                    action={<button className='btn btn-primary ' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                    subHeaderComponent={<><Dropdown style={{ marginRight: '20px', marginLeft: '20px' }}>
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
                /> */}


                <DataTable
                    title={"Indoor Patients"}
                    columns={columns}
                    data={admitPatientList}
                    pagination={true}
                    fixedHeader={true}
                    noHeader={false}
                    persistTableHead
                    actions={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                    highlightOnHover
                    paginationServer={true}
                    subHeader={<div className='d-flex' style={{ justifyContent: 'space-between' }}></div>}
                    subHeaderComponent={<span className='d-flex w-100 justify-content-end'>
                        <select className="form-control mr-2" style={{ height: '40px', fontSize: '18px', width: '15%', marginRight: 10 }} name='searchBy' value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                            <option selected >Search by</option>
                            <option value='Name' selected>Patient Name</option>
                            <option value='MobileNo' selected>Mobile No</option>
                        </select>
                        <input type='search' placeholder='search' className='w-25 form-control' value={searchString} onChange={(e) => { onSearchInput(e.target.value) }} />
                        <button className='btn btn-primary' style={{ width: '10%', marginLeft: 10 }} disabled={!searchBy || !searchString} onClick={requestSearch}>Search</button>
                    </span>}
                    paginationTotalRows={totalnumData}
                    onChangePage={(e) => handlePageChange(e)}
                />
            </div >
        </>
        }
        <AdmitModel show={show} handleClose={handleClose} data={item} update={update} todayDate={todayDate} />

    </>


}

export default Admit;
