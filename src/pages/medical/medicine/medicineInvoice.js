/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getData, setData, updateDatainSubcollection, updateHospitalProfile, updateDatainSubcollectionmedicineinvoice } from 'src/services/firebasedb';
import Table from 'react-bootstrap/Table';
import ReactToPrint from 'react-to-print';
import { storage } from 'src/firebaseconfig';
import html2pdf from 'html2pdf.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { EDIT_PATIENTS_MEDICINES, selectAllPatientsMedicines } from 'src/redux/slice/patientsMedicinesSlice';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import PrintHeader from 'src/comman/printpageComponents/PrintHeader';
import PrintFooter from 'src/comman/printpageComponents/PrintFooter';
import { TfiArrowCircleLeft } from 'react-icons/tfi'
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { selectUserName } from 'src/redux/slice/authSlice';
import { selectAlltax, selectMedicalax } from 'src/redux/slice/taxSlice';
import { selectmedicinerprevBillNo } from 'src/redux/slice/prevBillNoSlice';
import PrintButtonMedical from 'src/comman/printpageComponents/PrintButtonMedical';
import { selectLicenceNumber, selectMedicalAddress, selectMedicalContactnumber, selectMedicalName } from 'src/redux/slice/medicalProfileSlice';
import Barcode from 'react-barcode';

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (

        <div style={{ width: '800px', marginRight: '30px' }} >
            <div className='card' style={{ border: '1px solid black', margin: 0 }}>
                <div className='row' style={{ display: 'flex', width: '100%' }}>
                    <div className='col-lg-5' style={{ borderRight: '1px solid black', width: '45%' }}>
                        <div className='p-2'>
                            <div><b>{state.medicalName}</b></div>
                            <div>{state.medicalAddress}</div>
                            <div>{state.contactNumber}</div>
                            <div>{state.licenceNumber}</div>
                        </div>
                    </div>
                    <div className='col-lg-3' style={{ borderRight: '1px solid black', width: '20%' }}>
                        <div>
                            <div><b>Bill #: {state.invoiceuid}</b></div>
                            <div>Date: {state.medicineDate}</div>
                            {state.pid &&
                                <Barcode value={state.pid} height={30} width={1} displayValue={false} />
                            }                        </div>
                    </div>
                    <div className='col-lg-4' style={{ width: '35%' }}>
                        <div className='p-2'>
                            <div>
                                Doctor:-{state.drName}
                            </div>
                            <div><b>
                                Patient:-{state.pName}
                            </b>
                            </div>
                            <div>
                                <b>
                                    Addrss:-{state.pAddress}
                                </b>

                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginRight: -3, marginBottom: '-20px' }}>
                    <Table bordered border={4}  >
                        <thead style={{ border: '1px solid black' }}>
                            <tr>
                                <th>#</th>
                                <th>Batch No.</th>
                                <th>Medicine Name</th>
                                <th>Mfrs. Name</th>
                                <th>Exp. Date</th>
                                <th>Rate</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                state.medicines.map((medicine, i) => {
                                    return <>
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{medicine.batchNo}</td>
                                            <td>{medicine.medname}</td>
                                            <td>{medicine.mfrsName}</td>
                                            <td>{medicine.expireDate}</td>
                                            <td>{medicine.medPrice.toFixed(2)}</td>
                                            <td>{Number(medicine.medQty).toFixed(2)}</td>
                                            <td>{medicine.totalmedPrice.toFixed(2)}</td>
                                        </tr>
                                    </>
                                })
                            }
                            <tr>
                                <td colSpan={7}>Sub Total</td>
                                <td>{state.allMedTotalprice.toFixed(2)}</td>
                            </tr>
                            {
                                state.cgstValue === 0 ?
                                    null
                                    : <tr>
                                        <td colSpan={6}>CGST%</td>
                                        <td>{state.cgstValue}%</td>
                                        <td>{state.cgstAmount.toFixed(2)}</td>
                                    </tr>
                            }

                            {
                                state.sgstValue === 0 ?
                                    null
                                    : <tr>
                                        <td colSpan={6}>SGST%</td>
                                        <td>{state.sgstValue}%</td>
                                        <td>{state.sgstAmount.toFixed(2)}</td>
                                    </tr>
                            }



                        </tbody>
                    </Table>
                </div>
                <div className='row' style={{ marginTop: -5 }}>
                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                        <div className='p-2'>
                            <div>
                                <div><b>Invoice By :{state.userName}</b></div>
                                <span>Payment Type <b>:{state.paymentType}</b></span>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                        <div className='p-2'>
                            <h6>Payable Amount : {Number(state.payableAmount).toFixed(2)}</h6>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        // <div style={{ width: '800px', marginRight: '50px' }} >
        //     <div className='row text-center'> <h5>Invoice</h5></div>
        //     <b><hr ></hr></b>
        //     <div className='row'>
        //         <div className='col-lg-6 col-md-6 col-sm-6'>
        //             <span><b>Patient id: {state.pid}</b></span>
        //             <span><div>Name: {state.pName} </div></span>
        //             <span><div>Mobile No: {state.pMobileNo}</div></span>
        //             <span><div>Date: {state.medicineDate} </div></span>
        //         </div>
        //         <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
        //             <div>
        //                 <span><b>Bill No: {state.invoiceuid}</b></span>
        //                 <span><div>Age /Sex: {state.page} /{state.pGender}</div></span>
        //                 <span><div>Address: {state.pAddress}</div></span>
        //             </div>

        //         </div>
        //     </div>

        //     <b><hr></hr></b>
        //     <div className='row text-center'> <h5>Medicine Summary</h5></div>

        //     <div className='row'>
        //         <Table striped bordered>
        //             <thead>
        //                 <tr>
        //                     <th>#</th>
        //                     <th>Batch No.</th>
        //                     <th>Medicine Name</th>
        //                     <th>Mfrs. Name</th>
        //                     <th>Exp. Date</th>
        //                     <th>Rate</th>
        //                     <th>Qty</th>
        //                     <th>Total</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {
        //                     state.medicines.map((medicine, i) => {
        //                         return <>
        //                             <tr key={i}>
        //                                 <td>{i + 1}</td>
        //                                 <td>{medicine.batchNo}</td>
        //                                 <td>{medicine.medname}</td>
        //                                 <td>{medicine.mfrsName}</td>
        //                                 <td>{medicine.expireDate}</td>
        //                                 <td>{medicine.medPrice.toFixed(2)}</td>
        //                                 <td>{Number(medicine.medQty).toFixed(2)}</td>
        //                                 <td>{medicine.totalmedPrice.toFixed(2)}</td>
        //                             </tr>
        //                         </>
        //                     })
        //                 }
        //                 <tr>
        //                     <td colSpan={7}>Sub Total</td>
        //                     <td>{state.allMedTotalprice.toFixed(2)}</td>
        //                 </tr>
        //                 {
        //                     state.cgstValue === 0 ?
        //                         null
        //                         : <tr>
        //                             <td colSpan={6}>CGST%</td>
        //                             <td>{state.cgstValue}%</td>
        //                             <td>{state.cgstAmount.toFixed(2)}</td>
        //                         </tr>
        //                 }

        //                 {
        //                     state.sgstValue === 0 ?
        //                         null
        //                         : <tr>
        //                             <td colSpan={6}>SGST%</td>
        //                             <td>{state.sgstValue}%</td>
        //                             <td>{state.sgstAmount.toFixed(2)}</td>
        //                         </tr>
        //                 }

        //             </tbody>
        //         </Table>
        //     </div>

        //     <div className='row'>
        //         <b><hr></hr></b>
        //         <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
        //             <div>
        //                 <div>
        //                     <div><b>Invoice By :{state.userName}</b></div>
        //                     <span>Payment Type <b>:{state.paymentType}</b></span>
        //                     <div><b>Payment Status :{state.paymentStatus}</b></div>
        //                 </div>
        //             </div>
        //         </div>
        //         <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
        //             <div>
        //                 <h6>Payable Amount : {Number(state.payableAmount).toFixed(2)}</h6>
        //             </div>
        //         </div>

        //         <b><hr></hr></b>
        //     </div>


        // </div>
    )
};

const medicineInvoice = () => {
    const componentRef = useRef();
    const navigate = useNavigate();
    let state = undefined
    const location = useLocation();
    if (location.state === null) {
        state = JSON.parse(localStorage.getItem('medicineInvoiceData'));
    } else {
        localStorage.setItem('medicineInvoiceData', JSON.stringify(location.state));
        state = location.state
    }
    // const { state } = useLocation()
    // if (state === null) {
    //     navigate('/medical/medicine')
    //     return null;
    // } 
    const dispatch = useDispatch()
    const allMedicinePatient = useSelector(selectAllPatientsMedicines)
    const alltax = useSelector(selectMedicalax)
    const [cgstAmount, setCgstamount] = useState(0)
    const [sgstAmount, setSgstamount] = useState(0)
    const [cgstValue, setCgstValue] = useState(0)
    const [sgstValue, setSgstValue] = useState(0)
    const [payAbleAmount, setPayableamount] = useState(0)
    const [subtotalAmount, setSubTotalamount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [paid, setPaid] = useState(false)
    const [printContent, setPrintContent] = useState(null);
    const [paymentType, setPaymentType] = useState()
    const [paymentStatus, setPaymentStatus] = useState('Pending')
    const userName = useSelector(selectUserName)
    const prevBillNo = useSelector(selectmedicinerprevBillNo)
    const [invoiceuid, setInvoiceuid] = useState()
    const medicalName = useSelector(selectMedicalName)
    const medicalAddress = useSelector(selectMedicalAddress)
    const licenceNumber = useSelector(selectLicenceNumber)
    const contactNumber = useSelector(selectMedicalContactnumber)
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = () => {
        setTimeout(async () => {
            let totalcgst = undefined;
            let totalsgst = undefined;
            setInvoiceuid(prevBillNo + 1)
            console.log('prevBillNo + 1', prevBillNo + 1);

            alltax.forEach((item, i) => {
                if (item.taxName === "CGST") {
                    setCgstValue(item.taxValue)
                    totalcgst = item.taxValue / 100 * state.allMedTotalprice
                    setCgstamount(totalcgst)
                } else if (item.taxName === "SGST") {
                    setSgstValue(item.taxValue)
                    totalsgst = item.taxValue / 100 * state.allMedTotalprice
                    setSgstamount(totalsgst)
                }
            });
            // }).catch((err) => {
            //     console.error(err);
            // })
            let totalBill = state.allMedTotalprice + totalcgst + totalsgst;
            setPayableamount(totalBill)
            setIsLoading(false)
        }, 3000);
    }
    const saveInvoice = async () => {
        setIsLoading(true)
        let newObj = await {
            ...state,
            paymentStatus: 'Completed',
            paymentType,
            payableAmount: payAbleAmount,
            cgstValue,
            sgstValue,
            cgstAmount,
            sgstAmount,
            userName,
            invoiceuid
        }
        // let newArray = await medicinePatient.map((item) => (item.pmeduid === state.pmeduid ? { ...newObj } : item))
        try {
            await updateDatainSubcollectionmedicineinvoice("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', newObj, 'pmeduid', 'hospitaluid')
            await updateHospitalProfile('lastMedicineBillNo', 'VE8TfjLSEWC69ik8HUGr', 'lastMedicineBillno', { hospitaluid: state.hospitaluid, billNo: invoiceuid })

            // await setData("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', newArray)
            // dispatch(EDIT_PATIENTS_MEDICINES(newObj))

            await setPrintContent(<PrintComponent data={{
                data1: {
                    ...newObj
                }
            }} />)
            toast.success("Invoice Saved SuccessFully...")
            setIsLoading(false)
            setTimeout(() => {
                window.history.back();
            }, 2000);
            // setIsLoading(false)
            // window.history.back()
        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }

    }
    const printInvoice = () => {
        if (paymentStatus === 'Completed') {
            saveInvoice()
        } else {
            setPrintContent(<PrintComponent data={{
                data1: {
                    ...state,
                    cgstValue: cgstValue,
                    cgstAmount: cgstAmount,
                    sgstValue: sgstValue,
                    sgstAmount: sgstAmount,
                    payableAmount: payAbleAmount,
                    medicalName,
                    medicalAddress,
                    contactNumber,
                    licenceNumber,
                    paymentType,
                    userName,
                    invoiceuid
                }
            }} />)
        }





    }
    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButtonMedical content={printContent} />}</div>
                <div className='d-flex justify-content-center'>
                    <div style={{ width: '800px', height: 'auto', marginLeft: '50px' }} >
                        <div className='card' style={{ border: '1px solid black', margin: 0 }}>
                            <div className='row'>
                                <div className='col-lg-5' style={{ borderRight: '1px solid black' }}>
                                    <div className='p-2'>
                                        <div><b>{medicalName}</b></div>
                                        <div>{medicalAddress}</div>
                                        <div>{contactNumber}</div>
                                        <div>{licenceNumber}</div>
                                    </div>
                                </div>
                                <div className='col-lg-3' style={{ borderRight: '1px solid black' }}>
                                    <div>
                                        <div><b>Bill #: {state.invoiceuid ? state.invoiceuid : invoiceuid}</b></div>
                                        <div>Date: {state.medicineDate}</div>
                                        {state.pid &&
                                            <Barcode value={state.pid} height={30} width={1} displayValue={false} />
                                        }
                                        {/* <Barcode value={state.pid} height={30} width={1} displayValue={false} /> */}
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='p-2'>
                                        <div>
                                            Doctor:-{state.drName}
                                        </div>
                                        <div><b>
                                            Patient:-{state.pName}
                                        </b>
                                        </div>
                                        <div>
                                            <b>
                                                Addrss:-{state.pAddress}
                                            </b>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginRight: -3 }}>
                                <Table bordered border={4}  >
                                    <thead style={{ border: '1px solid black' }}>
                                        <tr>
                                            <th>#</th>
                                            <th>Batch No.</th>
                                            <th>Medicine Name</th>
                                            <th>Mfrs. Name</th>
                                            <th>Exp. Date</th>
                                            <th>Rate</th>
                                            <th>Qty</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.medicines.map((medicine, i) => {
                                                return <>
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{medicine.batchNo}</td>
                                                        <td>{medicine.medname}</td>
                                                        <td>{medicine.mfrsName}</td>
                                                        <td>{medicine.expireDate}</td>
                                                        <td>{medicine.medPrice.toFixed(2)}</td>
                                                        <td>{Number(medicine.medQty).toFixed(2)}</td>
                                                        <td>{medicine.totalmedPrice.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            })
                                        }
                                        <tr>
                                            <td colSpan={7}>Sub Total</td>
                                            <td>{state.allMedTotalprice.toFixed(2)}</td>
                                        </tr>
                                        {
                                            cgstValue === 0 ?
                                                null
                                                : <tr>
                                                    <td colSpan={6}>CGST%</td>
                                                    <td>{cgstValue}%</td>
                                                    <td>{cgstAmount.toFixed(2)}</td>
                                                </tr>
                                        }

                                        {
                                            sgstValue === 0 ?
                                                null
                                                : <tr>
                                                    <td colSpan={6}>SGST%</td>
                                                    <td>{sgstValue}%</td>
                                                    <td>{sgstAmount.toFixed(2)}</td>
                                                </tr>
                                        }



                                    </tbody>
                                </Table>
                            </div>
                            <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                                    <div className='p-2'>

                                        <div>
                                            {state.paymentType ? <span>Payment Type <b>:{state.paymentType}</b></span> :
                                                <div className="form-group" >
                                                    <label >Payment Type:</label>
                                                    <select className="form-control" name='paymentType' defaultValue={paymentType} onChange={(e) => [setPaymentType(e.target.value), console.log('payment Type', e.target.value)]}>
                                                        <option >Select Payment Type</option>
                                                        <option value='Cash'>Cash</option>
                                                        <option value='Card' >Card</option>
                                                        <option value='Online' >Online</option>
                                                    </select>
                                                </div>
                                            }
                                            {
                                                state.paymentStatus === "Completed" ? <div><b>Payment Status :{state.paymentStatus}</b></div> :

                                                    <div className="form-group" >
                                                        <label >Payment Status<b style={{ color: 'red' }}>*</b>:</label>
                                                        <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='paymentStatus' value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                                                            <option >Select Payment Status</option>
                                                            <option value='Completed'>Completed</option>
                                                            <option value='Pending' selected>Pending</option>
                                                        </select>
                                                    </div>
                                            }

                                        </div>

                                    </div>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                    <div className='p-2'>
                                        <h6>Payable Amount : {payAbleAmount.toFixed(2)}</h6>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                {/* <div className='d-flex justify-content-center'>
                    <div style={{ width: '600px', height: 'auto', marginLeft: '50px' }} >
                        <b><hr></hr></b>
                        <div className='row text-center'> <h3>Invoice</h3></div>
                        <b><hr></hr></b>
                        <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                <span><b>Patient id : {state.pid}</b></span>
                                <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                <span><div>Age: {state.page}</div></span>

                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                <div>
                                    <span><b>Bill No: {state.invoiceuid ? state.invoiceuid : invoiceuid}</b></span>
                                    <span><div>Date: {state.medicineDate} </div></span>
                                    <span><div>Address: {state.pAddress}</div></span>
                                    <span><div>Mobile No: {state.pMobileNo}</div></span>
                                </div>
                            </div>
                        </div>

                        <b><hr></hr></b>
                        <div className='row text-center'> <h3>Medicine Summary</h3></div>
                        <b><hr></hr></b>
                        <div className='row'>
                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Batch No.</th>
                                        <th>Medicine Name</th>
                                        <th>Mfrs. Name</th>
                                        <th>Exp. Date</th>
                                        <th>Rate</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        state.medicines.map((medicine, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{medicine.batchNo}</td>
                                                    <td>{medicine.medname}</td>
                                                    <td>{medicine.mfrsName}</td>
                                                    <td>{medicine.expireDate}</td>
                                                    <td>{medicine.medPrice.toFixed(2)}</td>
                                                    <td>{Number(medicine.medQty).toFixed(2)}</td>
                                                    <td>{medicine.totalmedPrice.toFixed(2)}</td>
                                                </tr>
                                            </>
                                        })
                                    }
                                    <tr>
                                        <td colSpan={7}>Sub Total</td>
                                        <td>{state.allMedTotalprice.toFixed(2)}</td>
                                    </tr>
                                    {
                                        cgstValue === 0 ?
                                            null
                                            : <tr>
                                                <td colSpan={6}>CGST%</td>
                                                <td>{cgstValue}%</td>
                                                <td>{cgstAmount.toFixed(2)}</td>
                                            </tr>
                                    }

                                    {
                                        sgstValue === 0 ?
                                            null
                                            : <tr>
                                                <td colSpan={6}>SGST%</td>
                                                <td>{sgstValue}%</td>
                                                <td>{sgstAmount.toFixed(2)}</td>
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
                                        {state.paymentType ? <span>Payment Type <b>:{state.paymentType}</b></span> :
                                            <div className="form-group" >
                                                <label >Payment Type:</label>
                                                <select className="form-control" name='paymentType' defaultValue={paymentType} onChange={(e) => [setPaymentType(e.target.value), console.log('payment Type', e.target.value)]}>
                                                    <option >Select Payment Type</option>
                                                    <option value='Cash'>Cash</option>
                                                    <option value='Card' >Card</option>
                                                    <option value='Online' >Online</option>
                                                </select>
                                            </div>
                                        }
                                        {
                                            state.paymentStatus === "Completed" ? <div><b>Payment Status :{state.paymentStatus}</b></div> :

                                                <div className="form-group" >
                                                    <label >Payment Status<b style={{ color: 'red' }}>*</b>:</label>
                                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='paymentStatus' value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                                                        <option >Select Payment Status</option>
                                                        <option value='Completed'>Completed</option>
                                                        <option value='Pending' selected>Pending</option>
                                                    </select>
                                                </div>
                                        }

                                    </div>
                                  
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                <div>
                                    <h6>Payable Amount : {payAbleAmount.toFixed(2)}</h6>
                                </div>
                            </div>

                            <b><hr></hr></b>
                        </div>



                    </div>


                </div> */}


                <div className='d-flex justify-content-center'>
                    <button className='btn btn-primary mx-2' onClick={() => printInvoice()}>Print</button>
                    {
                        state.paymentStatus === "Completed" ? null : <button className='btn btn-primary' disabled={paymentStatus === "Completed" ? false : true} onClick={saveInvoice}>Paid</button>}
                </div>

            </>
        }



    </>
}

export default medicineInvoice