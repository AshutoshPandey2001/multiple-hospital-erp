/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import { opdformSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_OPD_PATIENTS, DELETE_OPD_PATIENTS, EDIT_OPD_PATIENTS, FILL_OPD_PATIENTS, selectOpdPatients } from 'src/redux/slice/opdPatientsList';
import Addpatientscommanmodel from '../../comman/comman model/Addpatientscommanmodel';
import Table from 'react-bootstrap/Table';
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, getOnlyChangesLisitnor, getSubcollectionData, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import CommanTable from 'src/comman/table/CommanTable';
import Loaderspinner from '../../comman/spinner/Loaderspinner';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { selectAllDr } from 'src/redux/slice/doctorsSlice';
import { AiFillPrinter } from 'react-icons/ai'
import { BsPencilSquare } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { BsEye } from 'react-icons/bs'
import SearchAutocomplete from 'src/comman/searchAutocomplete/SearchAutocomplete';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { ddMMyyyy, formatDateDDMMYYY, formatDateyyyymmddUtcopd, yyyyMMdd } from 'src/services/dateFormate';
import billingicon from 'src/assets/images/billing-icon.png'
import { filterData } from 'src/services/dataFilter';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiFilter } from 'react-icons/fi'
import { TfiReload } from 'react-icons/tfi'

import '../admit/admit.css'
import { selectUserId } from 'src/redux/slice/authSlice';
import { ToWords } from 'to-words';
import moment from 'moment';
const toWords = new ToWords();

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>INVOICE</h4></div>
            <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                        <span><div><b>OPD Case No : {state.opdCaseNo}</b></div></span>
                        <span><div>Name: {state.pName}</div></span>
                        <span><div>Age /Sex: {state.page} /{state.pGender}</div></span>
                        <span><div>Address: {state.pAddress}</div></span>
                        <span><div>Mobile No: {state.pMobileNo}</div></span>

                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                        <div>
                            <span><b>Bill No: {state.invoiceuid}</b></span>
                            <span><div><b>OPD id: {state.opduid}</b></div></span>
                            <span><div>Date: {formatDateDDMMYYY(state.consultingDate)} </div></span>
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
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.pendingOpd?.map((item, i) => {
                                return (<tr key={i}>
                                    <td>Consulting Charge({item.drName})</td>
                                    <td>{item.consultingCharges.toFixed(2)}</td>
                                    <td>{item.consultingCharges.toFixed(2)}</td>
                                </tr>)
                            })}
                            {state.extraCharges?.map((charge, k) => {
                                return <>
                                    <tr key={k}>
                                        <td>{charge.chargeName}</td>
                                        <td>{charge.rate.toFixed(2)}</td>
                                        <td>{charge.total.toFixed(2)}</td>
                                    </tr>
                                </>
                            })}

                            {state.reportDetails?.map((item, i) => {
                                return (<tr key={i}>
                                    <td>{item.reportName}</td>
                                    <td>{Number(item.reportPrice).toFixed(2)}</td>
                                    <td>{Number(item.reportPrice).toFixed(2)}</td>
                                </tr>)
                            })}
                            {/* {!state.medicineDetails?.length ? null :
                                <tr>
                                    <td colSpan={2}>
                                        <Table bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Medicine</th>
                                                    <th>Qty * Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {state.medicineDetails?.map((item, index) => {
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
                                    <td>{state.totalAmountofMedicines.toFixed(2)}</td>
                                </tr>
                            } */}
                            <tr>
                                <td colSpan={2}>Sub Total</td>
                                <td>{state.subTotalamount.toFixed(2)}</td>
                            </tr>
                            {
                                state.cgstValue === 0 ?
                                    null
                                    : <tr>
                                        <td>CGST%</td>
                                        <td>{state.cgstValue}%</td>
                                        <td>{state.cgstAmount.toFixed(2)}</td>
                                    </tr>
                            }

                            {
                                state.sgstValue === 0 ?
                                    null
                                    : <tr>
                                        <td >SGST%</td>
                                        <td>{state.sgstValue}%</td>
                                        <td>{state.sgstAmount.toFixed(2)}</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>

                <div className='row'>
                    <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                        <div>
                            <span>Payment Type <b>:{state.paymentType}</b></span>
                            <div><b>Invoice By :{state.userName}</b></div>
                        </div>


                    </div>
                    <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                        <div>
                            <h6>Total:- {state.billingAmount ? state.billingAmount.toFixed(2) : state.payAbleAmount.toFixed(2)}</h6>
                            {state.discount ? <h6>Discount :{Number(state.discount).toFixed(2)}</h6> : null}
                            <h6>Recived : {state.payAbleAmount.toFixed(2)}</h6>
                        </div>
                    </div>
                    <div className='row text-center'> <b className='text-center'>{toWords.convert(state.payAbleAmount, { currency: true })}</b></div>

                    <b><hr></hr></b>
                    <div className='row'>
                        <div className='col-lg-6'>
                            {state.advices.length ? <div className='row'>
                                <span className='row '> <h5>Advice :-</h5></span>
                                <div className='row'>
                                    {
                                        state.advices?.map((advice, i) => {
                                            return <>
                                                <span key={i}>{advice}</span>
                                            </>
                                        })
                                    }
                                </div> </div> : null}
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                            <div><b>Payment Status :{state.paymentStatus}</b></div>
                        </div>
                    </div>
                    {/* {state.advices ? <div className='row'>

                        <span className='row text-center'> <h3>Advice</h3></span>

                        <div className='row'>
                            {
                                state.advices?.map((advice, i) => {
                                    return <>
                                        <span key={i}>{advice}</span>
                                    </>
                                })
                            }
                        </div> </div> : null} */}

                </div>
            </div>

        </div>
    )
};
const initalValues = {
    pid: '',
    pName: '',
    page: '',
    pGender: '',
    pAddress: '',
    pMobileNo: '',
    consultingDate: '',
    drName: '',
    consultingCharge: '',
    opduid: '',
    opdCaseNo: '',
    paymentStatus: 'Pending',
    advices: [],
    hospitaluid: '',
}
const Opd = () => {
    const dispatch = useDispatch();
    const allPatients = useSelector(selectAllPatients)
    const allopdPatientList = useSelector(selectOpdPatients)
    const allDoctors = useSelector(selectAllDr)
    const [show, setShow] = useState(false);
    const [opdPatientList, setOpdPatientList] = useState([]);
    const [opdPatientfilter, setOpdPatientfilter] = useState([]);
    const [model, setModel] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [update, setUpdate] = useState(false)
    const [advice, setAdvice] = useState('')
    const [advices, setAdvices] = useState([])
    const [printContent, setPrintContent] = useState(null);
    const [autofocus, setAutofocus] = useState(false)
    const [consultingCharges, setConsultingCharges] = useState([])
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [showtooltip, setShowtooltip] = useState(false);
    const hospitaluid = useSelector(selectUserId)

    const navigate = useNavigate()

    const filtertheData = (date) => {
        if (startDate && endDate) {
            setOpdPatientList(filterData(allopdPatientList, startDate, endDate, date))
            setShowtooltip(false)
        }
    }
    const clearfilterData = () => {
        setStartDate('')
        setEndDate('')
        setOpdPatientList([...allopdPatientList].reverse());
        setShowtooltip(false)
    }
    const columns = [
        // { name: 'ID', selector: row => row.pid, sortable: true },
        {
            // name: 'Date',
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
                            <Button variant="primary" style={{ marginLeft: '10px' }} onClick={() => filtertheData('consultingDate')}>
                                Filter
                            </Button>
                        </div>


                    </div></Tooltip>}
                    trigger='click'
                    show={showtooltip}

                >
                    <span style={{ cursor: 'pointer' }} ><FiFilter onClick={() => setShowtooltip(!showtooltip)} /> Date </span>
                </OverlayTrigger>
            ),
            selector: row => formatDateDDMMYYY(row.consultingDate),
            sortable: true,
            sortFunction: (a, b) => { return moment(a.consultingDate).toDate().getTime() - moment(b.consultingDate).toDate().getTime() }
        },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        // { name: 'Age', selector: row => row.page },
        // { name: 'Gender', selector: row => row.pGender },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo ? row.pMobileNo : '-' },
        { name: 'Total', selector: row => row.payAbleAmount ? '₹' + row.payAbleAmount.toFixed(2) : '-' },
        {
            name: 'Payment Status', cell: row => <div style={{ backgroundColor: row.paymentStatus === "Completed" ? 'green' : 'red', color: 'white', width: '80px', height: '20px', display: 'flex', borderRadius: '10px', alignContent: 'center', justifyContent: 'center' }}>{row.paymentStatus}</div>
        },
        {
            name: 'Action', cell: row => <span style={{ display: 'flex', justifyContent: 'center' }}>
                {row.paymentStatus === "Completed" ? <button onClick={() => viewInvoice(row)} style={{ color: 'skyblue', border: 'none' }} > <BsEye size={25} /></button >
                    :
                    <>
                        <button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                    </>
                }
                <button onClick={() => generateInvoice(row)} style={{ color: 'skyblue', border: 'none' }} >{row.paymentStatus === "Completed" ? <AiFillPrinter size={25} /> : <img src={billingicon} alt='billingicon' />} </button >
                <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
            </span >
        }
    ]
    // const columns = [
    //     {
    //         name: (
    //             <OverlayTrigger
    //                 placement="top"
    //                 overlay={<Tooltip ><div >
    //                     <div className='row'>
    //                         <div className='col-lg-12'>
    //                             <div className="form-group" >
    //                                 <label >Form<b style={{ color: 'red' }}>*</b>:</label>
    //                                 <input name='startDate'
    //                                     type="date" className="form-control" defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)} />

    //                             </div>
    //                         </div>
    //                         <div className='col-lg-12'>
    //                             <div className="form-group" >
    //                                 <label >To<b style={{ color: 'red' }}>*</b>:</label>
    //                                 <input name='endDate'
    //                                     type="date" className="form-control" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className='d-flex mt-2 mb-1 justify-content-end'>
    //                         <Button variant="secondary" onClick={clearfilterData}>
    //                             Clear
    //                         </Button>
    //                         <Button variant="primary" style={{ marginLeft: '10px' }} onClick={() => filtertheData('consultingDate')}>
    //                             Filter
    //                         </Button>
    //                     </div>


    //                 </div></Tooltip>}
    //                 trigger='click'
    //                 show={showtooltip}

    //             >
    //                 <span style={{ cursor: 'pointer' }} onClick={() => setShowtooltip(!showtooltip)}>Date <FiFilter /></span>
    //             </OverlayTrigger>
    //         ),
    //         selector: row => row.consultingDate,
    //         className: 'col-lg-3 col-md-4 col-sm-6 col-12',
    //     },
    //     {
    //         name: 'Patient Name',
    //         selector: row => row.pName,
    //         sortable: true,
    //         className: 'col-lg-2 col-md-3 col-sm-4 col-6',
    //     },
    //     {
    //         name: 'Age',
    //         selector: row => row.page,
    //         className: 'col-lg-1 col-md-2 col-sm-3 col-6',
    //     },
    //     {
    //         name: 'Address',
    //         selector: row => row.pAddress,
    //         className: 'col-lg-2 col-md-3 col-sm-6 col-12',
    //     },
    //     {
    //         name: 'Mobile No',
    //         selector: row => row.pMobileNo,
    //         className: 'col-lg-2 col-md-3 col-sm-6 col-12',
    //     },
    //     {
    //         name: 'Total',
    //         selector: row => row.payAbleAmount ? '₹' + row.payAbleAmount.toFixed(2) : '-',
    //         className: 'col-lg-1 col-md-2 col-sm-3 col-6',
    //     },
    //     {
    //         name: 'Payment Status',
    //         cell: row => (
    //             <div
    //                 style={{
    //                     backgroundColor: row.paymentStatus === 'Completed' ? 'green' : 'red',
    //                     color: 'white',
    //                     width: '80px',
    //                     height: '20px',
    //                     display: 'flex',
    //                     borderRadius: '10px',
    //                     alignContent: 'center',
    //                     justifyContent: 'center',
    //                 }}
    //             >
    //                 {row.paymentStatus}
    //             </div>
    //         ),
    //         className: 'col-lg-1 col-md-2 col-sm-3 col-6',
    //     },
    //     {
    //         name: 'Action',
    //         cell: row => (
    //             <span style={{ display: 'flex', justifyContent: 'center' }}>
    //                 {row.paymentStatus === 'Completed' ? (
    //                     <button onClick={() => viewInvoice(row)} style={{ color: 'skyblue', border: 'none' }}>
    //                         <BsEye size={25} />
    //                     </button>
    //                 ) : (
    //                     <>
    //                         <button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}>
    //                             <MdEdit size={25} />
    //                         </button>
    //                     </>
    //                 )}
    //                 <button onClick={() => generateInvoice(row)} style={{ color: 'skyblue', border: 'none' }}>
    //                     {row.paymentStatus === 'Completed' ? <AiFillPrinter size={25} /> : <img src={billingicon} alt="billingicon" />}
    //                 </button>
    //                 <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }}>
    //                     <AiFillDelete size={25} />
    //                 </button>
    //             </span>
    //         ),
    //         className: 'col-lg-2 col-md-3 col-sm-4 col-6',
    //     },
    // ];

    const handleClose = () => {
        clearForm()
        formik.resetForm();
        setShow(false);
        setUpdate(false)
    }

    useEffect(() => {

        // getOnlyChangesLisitnor()
        getSubcollectionData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid, (data) => {
            // Handle the updated data in the callback function
            setIsLoading(false)
            dispatch(FILL_OPD_PATIENTS(data))
            console.log('Received real-time data:', data);
        }).catch((error) => {
            setIsLoading(false)
            console.error('Error:', error);
        })

    }, [])

    useEffect(() => {
        setOpdPatientList([...allopdPatientList].reverse())
        setOpdPatientfilter(allopdPatientList)
    }, [allopdPatientList])


    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: opdformSchema,
        onSubmit: async (values, { resetForm }) => {
            const opd1 = [...opdPatientfilter];

            // values.consultingDate = ddMMyyyy(values.consultingDate)
            values.consultingCharge = Number(values.consultingCharge)
            values.consultingDate = moment(values.consultingDate).format('YYYY-MM-DD[Z]');
            const newValues = { ...values, opduid: Math.floor(2000 + Math.random() * 9000) };
            if (!update) {
                // values.opduid=Math.floor(2000 + Math.random() * 9000);
                // values.hospitaluid=hospitaluid
                setOpdPatientfilter([...opdPatientfilter, newValues]);
                try {
                    // await setData("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', [...opdPatientfilter, newValues]);
                    // await addSingltObject("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', newValues)
                    await addDatainsubcollection("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', newValues)
                    // await getOnlyChangesLisitnor('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid, (data) => {
                    //     console.log('new Data added', data);
                    //     dispatch(ADD_OPD_PATIENTS(data))
                    // }).catch((error) => {
                    //     console.error('Error:', error);
                    // })
                    dispatch(ADD_OPD_PATIENTS(newValues));
                    resetForm({ values: '' });
                    clearForm();
                    toast.success('Added Successfully.......')
                } catch (error) {
                    toast.error(error.message);
                    console.error(error.message);
                }
            } else {
                const findindex = opd1.findIndex((item) => item.opduid === values.opduid);
                opd1[findindex] = values;
                try {
                    // await setData("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', opd1);
                    // await updateSingltObject("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', values, 'opduid', 'hospitaluid')
                    await updateDatainSubcollection("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', values, 'opduid', 'hospitaluid')
                    dispatch(EDIT_OPD_PATIENTS(values));

                    // await getOnlyChangesLisitnor('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid, (data) => {
                    //     console.log('Updated data', data);

                    //     dispatch(EDIT_OPD_PATIENTS(data))
                    // }).catch((error) => {
                    //     console.error('Error:', error);
                    // })
                    resetForm({ values: '' });
                    clearForm();
                    setUpdate(false);
                    toast.success('Updated Successfully.......')
                } catch (error) {
                    toast.error(error.message);
                    console.error(error.message);
                }
            }
            setShow(false);
        },
    });
    const { values, errors, touched, handleSubmit, handleChange, handleBlur } = formik;
    const handleShow = () => {
        setShow(true)
        formik.setFieldValue('consultingDate', new Date().toISOString().substr(0, 10));
    };

    const clearForm = () => {
        formik.setValues({
            pid: '',
            pName: '',
            page: '',
            pGender: '',
            pAddress: '',
            pMobileNo: '',
            consultingDate: '',
            drName: '',
            consultingCharge: '',
            paymentStatus: 'Pending',
            opduid: '',
            advices: [],
            opdCaseNo: '',
            hospitaluid: '',

        });
        setAdvices([])

    };
    const handleClear = () => {
        formik.setValues({
            pid: '',
            pName: '',
            page: '',
            pGender: '',
            pAddress: '',
            pMobileNo: '',
            consultingDate: new Date().toISOString().substr(0, 10),
            drName: '',
            consultingCharge: '',
            paymentStatus: 'Pending',
            opduid: '',
            advices: [],
            opdCaseNo: '',
            hospitaluid: '',

        });
        setAdvices([])
        setConsultingCharges([])
    }
    const generateInvoice = (item) => {
        // filDatainsubcollection(allopdPatientList, 'opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid)
        // changeDateFormate()
        if (item.paymentStatus === "Completed") {
            setPrintContent(<PrintComponent data={{
                data1: {
                    ...item,
                }
            }} />)
        } else {
            navigate('/opd/opdinvoice', { state: item })
        }

    }
    const viewInvoice = (item) => {
        navigate('/opd/opdinvoice', { state: item })

    }
    const editPatientDetails = async (item) => {
        // filDatainsubcollection(allopdPatientList, 'opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient',hospitaluid)
        const {
            pid,
            pName,
            page,
            pGender,
            pAddress,
            pMobileNo,
            consultingDate,
            drName,
            consultingCharge,
            advices,
            opduid,
            opdCaseNo,
            paymentStatus,
            hospitaluid

        } = await item;

        await formik.setValues({
            pid,
            pName,
            page,
            pGender,
            pAddress,
            pMobileNo,
            consultingDate: moment(consultingDate).format("YYYY-MM-DD"),
            drName,
            consultingCharge,
            advices,
            opduid,
            opdCaseNo,
            paymentStatus,
            hospitaluid
        });
        const selectedDoctor = await allDoctors.find((doctor) => doctor.drName === drName);
        setConsultingCharges(selectedDoctor.consultingCharges)
        setAdvices(advices);
        setShow(true);
        setUpdate(true);
    }

    const deletePatientsDetails = async (item1) => {
        try {
            await confirmAlert({
                title: 'Confirm to Delete',
                message: 'Are you sure to delete this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {
                            const opd = opdPatientfilter.filter((item) => item.opduid !== item1.opduid);
                            // await setData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', opd);
                            // await deleteSingltObject('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', item1, 'opduid', 'hospitaluid')
                            await deleteDatainSubcollection('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', item1, 'opduid', 'hospitaluid')
                            dispatch(DELETE_OPD_PATIENTS(item1));
                            // await getOnlyChangesLisitnor('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid, (data) => {
                            //     console.log('Deleted data', data);

                            //     dispatch(DELETE_OPD_PATIENTS(data))
                            // }).catch((error) => {
                            //     console.error('Error:', error);
                            // })
                            toast.success('Deleted Successfully.......')
                        }
                    },
                    {
                        label: 'No',
                    }
                ]
            });
        } catch (error) {
            toast.error(error.message);
            console.error(error.message);
        }
    };

    const requestSearch = (searchvalue) => {
        if (searchvalue.length < 1) {
            setOpdPatientList([...allopdPatientList].reverse())
            return
        }

        const filteredRows = opdPatientfilter.filter((row) => {
            const searchString = searchvalue.toLowerCase()
            return row.pid.toString().includes(searchString) ||
                row.pName.toLowerCase().includes(searchString) ||
                row.pMobileNo.includes(searchString);
        });

        setOpdPatientList(filteredRows)
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

    const selectDoctor = async (e) => {
        const selectedDoctor = await allDoctors.find((doctor) => doctor.drName === e); // Find the corresponding doctor object
        formik.setFieldValue('drName', selectedDoctor.drName);
        setConsultingCharges(selectedDoctor.consultingCharges)
        if (selectedDoctor.consultingCharges?.length === 1) {
            formik.setFieldValue('consultingCharge', selectedDoctor.consultingCharges[0].charge)
        }
        // formik.setFieldValue('consultingCharge', selectedDoctor.consultingCharge);
        // values.drName = selectedDoctor.drName;
        // values.consultingCharge = selectedDoctor.consultingCharge;
        // setAutofocus(!autofocus)
        // console.log('values', e, selectedDoctor, values);
    }


    const pushAdvice = () => {
        // if (!advice) {

        // } else {
        //     setAdvices([...advices, advice])
        //     values.advices = [...values.advices, advice]
        // }
        // setAdvice('')
        if (!advice) {
            return;
        }
        setAdvices([...advices, advice]);
        values.advices = [...values.advices, advice]
        setAdvice('');

    }
    const cancleAdvice = (i) => {
        setAdvices(advices.filter((item) => item !== i))
        values.advices = values.advices.filter((item) => item !== i)
    }
    const selectConsultingCharge = (value) => {
        formik.setFieldValue('consultingCharge', parseInt(value, 10))

    }

    const changeDateFormate = () => {
        // const formDate = moment('08/07/2023').utc().format('YYYY-MM-DDTHH:mm[Z]');

        allopdPatientList.map(async (item, i) => {
            // setTimeout(() => {

            // }, 2000);
            // const desiredFormat = 'YYYY-MM-DDTHH:mm[Z]';

            // Check if inputDate already matches the desired format
            // if (moment(item.admitDate, desiredFormat, true).isValid() && moment(item.dischargeDate, desiredFormat, true).isValid()) {
            //     console.log('i am done');
            //     return;
            // }
            const desiredFormat = 'YYYY-MM-DD[Z]';

            // Check if inputDate already matches the desired format
            if (moment(item.consultingDate, desiredFormat, true).isValid()) {
                console.log('i am done');
                return;
            }

            // console.log('admit Date', i, formatDateyyyymmddUtc(item.admitDate));

            // console.log('Discharge Date', i, formatDateyyyymmddUtc(item.dischargeDate));
            await updateDatainSubcollection("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', { ...item, consultingDate: formatDateyyyymmddUtcopd(item.consultingDate) }, 'opduid', 'hospitaluid')
            // await updateDatainSubcollection("admitPatients", 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', { ...item, admitDate: formatDateyyyymmddUtc(item.admitDate), dischargeDate: item.dischargeDate ? formatDateyyyymmddUtc(item.dischargeDate) : item.dischargeDate }, 'admituid', 'hospitaluid')

        })
    }
    const reloadData = () => {
        setIsLoading(true)
        getSubcollectionData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid, (data) => {
            // Handle the updated data in the callback function
            dispatch(FILL_OPD_PATIENTS(data))
            setIsLoading(false)

            console.log('Received real-time data:', data);
        }).catch((error) => {
            setIsLoading(false)

            console.error('Error:', error);
        })
    }
    return <>

        {isLoading ? <Loaderspinner /> : <>
            <div>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
                <CommanTable
                    title={"OPD Patients"}
                    columns={columns}
                    data={opdPatientList}
                    action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                    subHeaderComponent={<> <button className='btn btn-dark' onClick={reloadData} style={{ marginRight: '20px' }}><span>  <TfiReload size={18} />&nbsp;Reload</span></button>
                        <input type='search' placeholder='search' className='w-25 form-control' onChange={(e) => requestSearch(e.target.value)} /></>}
                />
            </div>
        </>}


        <Modal show={show} onHide={handleClose} size="lg" style={{ filter: model ? 'blur(5px)' : 'blur(0px)' }}>
            <Modal.Header closeButton>
                <Modal.Title>OPD Registration</Modal.Title>
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
                                            handleClear={handleClear}
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
                                        handleClear={handleClear}

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

                                </div> : <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Patient Name<b style={{ color: 'red' }}>*</b>:</label>
                                    <SearchAutocomplete
                                        allPatients={allPatients}
                                        handleOnSelect={handleOnSelect}
                                        inputsearch={values.pName}
                                        placeholder={'Enter Patient Name'}
                                        handleClear={handleClear}
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

                                </div>}
                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Patient Age<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='page'
                                    placeholder="Enter Patient Age"
                                    type="number" className="form-control" onChange={handleChange} defaultValue={values.page} readOnly />
                                {errors.page && touched.page ? (<p style={{ color: 'red' }}>*{errors.page}</p>) : null}

                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Date<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='consultingDate'
                                    placeholder="Enter Consulting Date"
                                    type="date" className="form-control" onChange={handleChange} defaultValue={values.consultingDate} />
                                {errors.consultingDate && touched.consultingDate ? (<p style={{ color: 'red' }}>*{errors.consultingDate}</p>) : null}

                            </div>
                        </div>
                        <div className='col-lg-6'>
                            {/* {update ?
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='drName' placeholder="Enter Dr Name" type="text" className="form-control" onChange={handleChange} defaultValue={values.drName} readOnly />
                                    {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}

                                </div>
                                : */}
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='drName' value={values.drName} onChange={(e) => { selectDoctor(e.target.value) }}>
                                    <option >Select Doctor</option>
                                    {allDoctors?.map((option) => (
                                        <option key={option.druid} value={option.drName}>
                                            {option.drName}
                                        </option>
                                    ))}

                                </select>
                                {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}
                            </div>

                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Consulting Charges<b style={{ color: 'red' }}>*</b>:</label>
                                {consultingCharges.length === 1 ?
                                    <input name='consultingCharge'
                                        placeholder="Enter Consulting Charges"
                                        type="number" className="form-control" onChange={handleChange} value={values.consultingCharge} />
                                    :
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='consultingCharge' value={values.consultingCharge} onChange={handleChange}>
                                        <option >Select Consulting Charges</option>
                                        {consultingCharges?.map((option) => (
                                            <option key={option.visit} value={option.charge}>
                                                {option.visit}  -  {option.charge}
                                            </option>
                                        ))}

                                    </select>
                                }

                                {errors.consultingCharge && touched.consultingCharge ? (<p style={{ color: 'red' }}>*{errors.consultingCharge}</p>) : null}
                            </div>
                            {/* <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >Consulting Charges<b style={{ color: 'red' }}>*</b>:</label>
                                <input name='consultingCharge'
                                    placeholder="Enter Consulting Charges"
                                    type="number" className="form-control" onChange={handleChange} value={values.consultingCharge} />
                                {errors.consultingCharge && touched.consultingCharge ? (<p style={{ color: 'red' }}>*{errors.consultingCharge}</p>) : null}

                            </div> */}
                        </div>
                        <div className='col-lg-6'>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label >OPD Case No:</label>
                                <input name='opdCaseNo'
                                    placeholder="Enter Case No"
                                    type="text" className="form-control" onChange={handleChange} value={values.opdCaseNo} />

                            </div>
                        </div>

                    </div>
                    <div className='row'>
                        <div className='col-lg-12'>
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
                                <label >RX(Advice on OPD):</label>
                                <div className='card' style={{ height: '100px' }}>
                                    <Scrollbars style={{ height: '100px' }}>
                                        {advices?.map((item, i) => {
                                            return <>
                                                <div key={i} style={{ display: 'flex' }}>
                                                    <div style={{ backgroundColor: 'lightgrey', margin: '2px', width: '90%' }}>
                                                        <span style={{ marginLeft: '5px' }}>{item}  </span>
                                                        <span style={{ marginLeft: '10px' }} onClick={() => cancleAdvice(item)}><AiFillDelete style={{ color: 'red' }} /></span>
                                                    </div>
                                                </div>
                                            </>
                                        })}
                                    </Scrollbars>
                                </div>
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
                    {update ? 'Update' : 'Submit'}
                </Button>
            </Modal.Footer>
        </Modal>

        <Addpatientscommanmodel
            show={model}
            handleClose={() => setModel(false)}
            handleShow={() => setModel(true)}
        ></Addpatientscommanmodel>
    </>


}

export default Opd;
