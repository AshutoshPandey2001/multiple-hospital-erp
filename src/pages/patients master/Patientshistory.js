/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { db } from 'src/firebaseconfig'
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import { selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice';
import { selectOpdPatients } from 'src/redux/slice/opdPatientsList';
import { selectAllPatientsMedicines } from 'src/redux/slice/patientsMedicinesSlice';
import CommanTable from 'src/comman/table/CommanTable';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { AiFillPrinter } from 'react-icons/ai'
import { BsEye } from 'react-icons/bs'
import PrintButton from 'src/comman/printpageComponents/PrintButton';

const PrintComponentMedicine = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center'> <h5>Invoice</h5></div>
            <b><hr ></hr></b>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6'>
                    <span><b>Patient id: {state.pid}</b></span>
                    <span><div>Name: {state.pName} </div></span>
                    <span><div>Mobile No: {state.pMobileNo}</div></span>
                    <span><div>Date: {state.medicineDate} </div></span>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <span><b>Bill No: {state.invoiceuid}</b></span>
                        <span><div>Age /Sex: {state.page} /{state.pGender}</div></span>
                        <span><div>Address: {state.pAddress}</div></span>
                    </div>

                </div>
            </div>

            <b><hr></hr></b>
            <div className='row text-center'> <h5>Medicine Summary</h5></div>

            <div className='row'>
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Medicine Name</th>
                            <th>Rate</th>
                            <th>Units</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            state.medicines.map((medicine, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{medicine.medname}</td>
                                        <td>{medicine.medPrice.toFixed(2)}</td>
                                        <td>{Number(medicine.medQty).toFixed(2)}</td>
                                        <td>{medicine.totalmedPrice.toFixed(2)}</td>
                                    </tr>
                                </>
                            })
                        }
                        <tr>
                            <td colSpan={4}>Sub Total</td>
                            <td>{state.allMedTotalprice.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>CGST%</td>
                            <td>{state.cgstValue}%</td>
                            <td>{state.cgstAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>SGST%</td>
                            <td>{state.sgstValue}%</td>
                            <td>{state.sgstAmount.toFixed(2)}</td>
                        </tr>

                    </tbody>
                </Table>
            </div>

            <div className='row'>
                <b><hr></hr></b>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                    <div>
                        <div>
                            <div><b>Invoice By :{state.userName}</b></div>
                            <span>Payment Type <b>:{state.paymentType}</b></span>
                            <div><b>Payment Status :{state.paymentStatus}</b></div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <h6>Payable Amount : {Number(state.payableAmount).toFixed(2)}</h6>
                    </div>
                </div>

                <b><hr></hr></b>
            </div>


        </div>
    )
};
const PrintComponentOpd = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>INVOICE</h4></div>
            <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                        <span><div><b>Patient id :{state.pid}</b></div></span>
                        <span><div>Name: {state.pName}</div></span>
                        <span><div>Age /Sex: {state.page} /{state.pGender}</div></span>
                        <span><div>Address: {state.pAddress}</div></span>
                        <span><div>Mobile No: {state.pMobileNo}</div></span>

                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                        <div>
                            <span><b>Bill No: {state.invoiceuid}</b></span>
                            <span><div><b>OPD id: {state.opduid}</b></div></span>
                            <span><div>Date: {state.consultingDate} </div></span>
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
                            {state.consultingChargesHospital !== undefined ?
                                <tr>
                                    <td>Consulting Charge(Hos.)</td>
                                    <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                    <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                </tr> : null}
                            {state.reportDetails?.map((item, i) => {
                                return (<tr key={i}>
                                    <td>{item.reportName}</td>
                                    <td>{Number(item.reportPrice).toFixed(2)}</td>
                                    <td>{Number(item.reportPrice).toFixed(2)}</td>
                                </tr>)
                            })}
                            {!state.medicineDetails?.length ? null :
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
                            }
                            <tr>
                                <td colSpan={2}>Sub Total</td>
                                <td>{state.subTotalamount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>CGST%</td>
                                <td>{state.cgstValue}%</td>
                                <td>{state.cgstAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td >SGST%</td>
                                <td>{state.sgstValue}%</td>
                                <td>{state.sgstAmount.toFixed(2)}</td>
                            </tr>
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
                        <div className='row' style={{ width: '200px', marginRight: '70px' }}>
                            <div className='col-lg-6 '><div>Total</div>
                                <span>Recived</span></div>
                            <div className='col-lg-6'><div>:{state.payAbleAmount.toFixed(2)}</div>
                                <h6>:{state.payAbleAmount.toFixed(2)}</h6></div>
                        </div>

                    </div>
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
const PrintComponentIndoor = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center'> <h3>Invoice</h3></div>
            <b><hr></hr></b>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6'>
                    <span><b>Patient id: {state.pid}</b></span>
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
                        {
                            state.pendingOpd?.map((opd, r) => {
                                return <>
                                    <tr key={r}>
                                        <td colSpan={3}>OPD({opd.drName})</td>
                                        <td>{opd.consultingCharges.toFixed(2)}</td>
                                    </tr>
                                </>
                            })
                        }
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
                        {!state.medicines.length ? null :
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
                        }
                        <tr>
                            <td colSpan={3}>Sub Total</td>
                            <td>{state.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>CGST%</td>
                            <td>{state.cgstValue}%</td>
                            <td>{state.cgstAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>SGST%</td>
                            <td>{state.sgstValue}%</td>
                            <td>{state.sgstAmount.toFixed(2)}</td>
                        </tr>

                    </tbody>
                </Table>
            </div>

            <div className='row'>
                <b><hr></hr></b>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                    <div>
                        <div>
                            <div><b>Invoice By :{state.userName}</b></div>
                            <span>Payment Type <b>:{state.paymentType}</b></span>
                            <div><b>Payment Status :{state.paymentStatus}</b></div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <h6>Total Bill Amount :{state.billingAmount.toFixed(2)}</h6>
                        <span>Deposit: {Number(state.deposit).toFixed(2)}</span>
                        <h6>Payable Amount : {state.payableAmount.toFixed(2)}</h6>
                    </div>
                </div>
                <b><hr></hr></b>
            </div>


        </div>
    )
};
const Patientshistory = () => {
    const navigate = useNavigate()
    const allPatientsMedicines = useSelector(selectAllPatientsMedicines)
    let state = undefined
    const location = useLocation();
    if (location.state === null) {
        state = JSON.parse(localStorage.getItem('patientshistoryData'));

    } else {
        localStorage.setItem('patientshistoryData', JSON.stringify(location.state));
        state = location.state
    }

    console.log('location', location.pathname.includes("patientshistory"), state);
    const [opdHistory, setOPdHistory] = useState([])
    const [medicineHistory, setMedicineHistory] = useState([])
    const [admitHistory, setAdmitHistory] = useState([])
    const allopdPatientList = useSelector(selectOpdPatients)
    const allAdmitPatients = useSelector(selectAdmitPatients)
    const [printContent, setPrintContent] = useState(null);
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([])
    const [selectedReportType, setSelectedReportType] = useState('')
    // if (state === null) {
    //     navigate('/patients/patientslist')
    //     return null;
    // }
    const columnsAdmit = [
        { name: 'ID', selector: row => row.admituid, sortable: true },
        { name: 'Admit Date', selector: row => row.admitDate, sortable: true },
        { name: 'Discharge Date', selector: row => row.dischargeDate },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Gender', selector: row => row.pGender },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        {
            name: 'Payment Status', cell: row => <div style={{ backgroundColor: row.paymentStatus === "Completed" ? 'green' : 'red', color: 'white', width: '80px', height: '20px', display: 'flex', borderRadius: '10px', alignContent: 'center', justifyContent: 'center' }}>{row.paymentStatus}</div>
        },
        {
            name: 'Action', cell: row => <span style={{ display: 'flex', justifyContent: 'center' }}>
                {row.paymentStatus === "Completed" ?
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={() => viewInvoiceIndoor(row)} style={{ color: 'skyblue', border: 'none' }}  ><BsEye size={22} /></button>
                    </span> : <>

                    </>}
                {row.dischargeDate ? <button onClick={() => generateInvoiceIndoor(row)} style={{ color: 'skyblue', border: 'none' }} ><AiFillPrinter size={22} /></button> : null}

            </span>
        }
    ]

    const columnsOpd = [
        { name: 'ID', selector: row => row.opduid, sortable: true },
        { name: 'Date', selector: row => row.consultingDate, sortable: true },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Age', selector: row => row.page },
        { name: 'Gender', selector: row => row.pGender },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        {
            name: 'Payment Status', cell: row => <div style={{ backgroundColor: row.paymentStatus === "Completed" ? 'green' : 'red', color: 'white', width: '80px', height: '20px', display: 'flex', borderRadius: '10px', alignContent: 'center', justifyContent: 'center' }}>{row.paymentStatus}</div>
        },
        {
            name: 'Action', cell: row => <span style={{ display: 'flex', justifyContent: 'center' }}>
                {row.paymentStatus === "Completed" ?
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={() => viewInvoiceopd(row)} style={{ color: 'skyblue', border: 'none' }}  ><BsEye size={22} /></button>
                    </span> : <>

                    </>}
                <button onClick={() => generateInvoiceOpd(row)} style={{ color: 'skyblue', border: 'none' }} ><AiFillPrinter size={22} /></button>

            </span>
        }
    ]
    const columnsMedicine = [
        { name: 'ID', selector: row => row.pmeduid, sortable: true },
        { name: 'Date', selector: row => row.medicineDate, sortable: true },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        { name: 'Total Amount', selector: row => row.allMedTotalprice },
        {
            name: 'Payment Status', cell: row => <div style={{ backgroundColor: row.paymentStatus === "Completed" ? 'green' : 'red', color: 'white', width: '80px', height: '20px', display: 'flex', borderRadius: '10px', alignContent: 'center', justifyContent: 'center' }}>{row.paymentStatus}</div>
        },
        {
            name: 'Action', cell: row => <span style={{ display: 'flex', justifyContent: 'center' }}>
                {row.paymentStatus === "Completed" ?
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={() => viewInvoicemedicine(row)} style={{ color: 'skyblue', border: 'none' }}  ><BsEye size={22} /></button>
                    </span> : <>

                    </>}
                <button onClick={() => generateInvoicemedicine(row)} style={{ color: 'skyblue', border: 'none' }} ><AiFillPrinter size={22} /></button>

            </span>
        }
    ]
    useEffect(() => {
        const allopd = allopdPatientList.filter((item1) => item1.pid === state.pid);
        setOPdHistory(allopd);
        setSelectedReportType('opd')
        setColumns(columnsOpd);
        setData(allopd)
        const allAdmit = allAdmitPatients.filter((item1) => item1.pid === state.pid);
        setAdmitHistory(allAdmit);
        const allMedicine = allPatientsMedicines.filter((item1) => item1.pid === state.pid);
        setMedicineHistory(allMedicine);
    }, [allopdPatientList, allAdmitPatients, allPatientsMedicines, state.pid])

    const selectTypeofReport = (item) => {
        switch (item) {
            case 'opd':
                setSelectedReportType('opd')
                setColumns(columnsOpd);
                setData(opdHistory)
                break;
            case 'indoor':
                setSelectedReportType('indoor')
                setColumns(columnsAdmit);
                setData(admitHistory)
                break;
            case 'medicine':
                setSelectedReportType('medicine')
                setColumns(columnsMedicine);
                setData(medicineHistory)
                break;

            default:
                break;
        }
    }
    const generateInvoiceIndoor = (item) => {
        if (item.paymentStatus === "Completed") {
            setPrintContent(<PrintComponentIndoor data={{
                data1: {
                    ...item,
                }
            }} />)
        } else {
            navigate('/patients/patientslist/patientshistory/admitinvoice', { state: item })
        }
    }
    const viewInvoiceIndoor = (item) => {
        navigate('/patients/patientslist/patientshistory/admitinvoice', { state: item })
    }

    const generateInvoiceOpd = (item) => {
        if (item.paymentStatus === "Completed") {
            setPrintContent(<PrintComponentOpd data={{
                data1: {
                    ...item,
                }
            }} />)
        } else {
            navigate('/patients/patientslist/patientshistory/opdinvoice', { state: item })
        }
    }
    const viewInvoiceopd = (item) => {
        navigate('/patients/patientslist/patientshistory/opdinvoice', { state: item })
    }

    const generateInvoicemedicine = (item) => {
        if (item.paymentStatus === "Completed") {
            setPrintContent(<PrintComponentMedicine data={{
                data1: {
                    ...item,
                }
            }} />)
        } else {
            navigate('/patients/patientslist/patientshistory/medicineinvoice', { state: item })
        }
    }
    const viewInvoicemedicine = (item) => {
        navigate('/patients/patientslist/patientshistory/medicineinvoice', { state: item })
    }
    return (
        <>
            <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>

            <div>
                <h1>Patient History</h1>

                <div className="body flex-grow-1 " style={{ margin: '20px 20px 20px 20px' }}>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-header'><h4>Patient Details</h4></div>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-lg-6'><h5>Name:- {state.pName}</h5></div>
                                        <div className='col-lg-6'><h5>ID:-{state.pid}</h5></div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6'><h5>Age:- {state.page}</h5></div>
                                        <div className='col-lg-6'><h5>Mobile No:- {state.pMobileNo}</h5></div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6'><h5>Gender:- {state.pGender}</h5></div>
                                        <div className='col-lg-6'><h5>Address:- {state.pAddress}</h5></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center mt-4'>
                            <div className='col-xl-6 col-lg-12 col-md-12 col-12'>
                                <ButtonGroup aria-label="Basic example" className='w-100'>
                                    <Button variant={selectedReportType === 'opd' ? 'primary' : 'secondary'} onClick={() => selectTypeofReport('opd')}>Outpatient Department Report</Button>
                                    <Button variant={selectedReportType === 'indoor' ? 'primary' : 'secondary'} onClick={() => selectTypeofReport('indoor')}>Indoor Report</Button>
                                    {/* <Button variant={selectedReportType === 'medicine' ? 'primary' : 'secondary'} onClick={() => selectTypeofReport('medicine')}>Medicines Report</Button> */}
                                </ButtonGroup>
                            </div>
                        </div>
                        <div className='col-lg-12'>
                            <CommanTable
                                columns={columns}
                                data={data}
                            />
                        </div>
                    </div>

                </div>







                {/* <div>
                    <div className='row'>
                        <div className='col-lg-2'><h5>Name:- {state.pName}</h5></div>
                        <div className='col-lg-2'><h5>ID:-{state.pid}</h5></div>
                        <div className='col-lg-2'><h5>Age:- {state.page}</h5></div>
                        <div className='col-lg-2'><h5>Mobile No:- {state.pMobileNo}</h5></div>
                        <div className='col-lg-2'><h5>Gender:- {state.pGender}</h5></div>
                        <div className='col-lg-2'><h5>Address:- {state.pAddress}</h5></div>
                    </div>

                    <div>
                        <h1>Outpatient Department History</h1>
                        <div>
                            <Accordion>
                                {

                                    opdHistory.map((item, index) => {
                                        return (
                                            <Accordion.Item eventKey={index} key={index}>
                                                <Accordion.Header>{item.consultingDate}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div className='row'>
                                                        <div className='col-lg-3'><span><b>Date:-</b>{item.consultingDate}</span></div>
                                                        <div className='col-lg-3'><span><b>Dr Name:-</b>{item.drName}</span></div>
                                                        <div className='col-lg-3'><span><b>Charges:-</b>{item.consultingCharge}</span></div>
                                                        <div className='col-lg-3'><span><b>Payment Status:-</b>{item.paymentStatus}</span></div>




                                                    </div>

                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )
                                    })

                                }

                            </Accordion>

                        </div>
                    </div>

                    <div>
                        <h1>Admit History</h1>
                        <div>
                            <Accordion>
                                {

                                    admitHistory.map((item1, index) => {
                                        return (
                                            <Accordion.Item eventKey={index} key={index}>
                                                <Accordion.Header>{item1.admitDate}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div className='row'>
                                                        <div className='col-lg-3'><span><b>Admit Date:-</b>{item1.admitDate}</span></div>
                                                        <div className='col-lg-3'><span><b>Discharge Date:-</b>{item1.dischargeDate}</span></div>
                                                        <div className='col-lg-3'><span><b>Dr Name:-</b>{item1.drName}</span></div>
                                                        <div className='col-lg-3'><span><b>Total Admit Dayes:-</b>{item1.totalDayes}</span></div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-lg-3'><span><b>Room Type:-</b>{item1.roomType}</span></div>
                                                        <div className='col-lg-3'><span><b>Room No:-</b>{item1.roomNo}</span></div>
                                                        <div className='col-lg-3'><span><b>Total Amount:-</b>{item1.totalAmount}</span></div>
                                                        <div className='col-lg-3'><span><b>Payment Status:-</b>{item1.paymentStatus}</span></div>
                                                    </div>

                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )
                                    })

                                }

                            </Accordion>

                        </div>
                    </div>

                    <div>
                        <h1>Medicines History</h1>
                        <div>
                            <Accordion>
                                {

                                    medicineHistory.map((item1, index) => {
                                        return (
                                            <Accordion.Item eventKey={index} key={index}>
                                                <Accordion.Header>{item1.medicineDate}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div className='row'>
                                                        <div className='col-lg-2'><span><b>Date:-</b>{item1.medicineDate}</span></div>
                                                        <div className='col-lg-4'><span><b>Medicines:-</b></span>
                                                            <div className='card'>
                                                                <Table striped bordered hover>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Name</th>
                                                                            <th>Qty</th>
                                                                            <th>Price</th>
                                                                            <th>Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            item1.medicines.map((med, i) => {
                                                                                return (
                                                                                    <tr key={i}>
                                                                                        <td>{i + 1}</td>
                                                                                        <td>{med.medname}</td>
                                                                                        <td>{med.medQty}</td>
                                                                                        <td>{med.medPrice}</td>
                                                                                        <td>{med.totalmedPrice}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }


                                                                    </tbody>
                                                                </Table>
                                                            </div>

                                                        </div>
                                                        <div className='col-lg-3'><span><b>Total Amount:-</b>{item1.allMedTotalprice}</span></div>
                                                        <div className='col-lg-3'><span><b>Payment Status:-</b>{item1.paymentStatus}</span></div>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )
                                    })

                                }

                            </Accordion>

                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default Patientshistory