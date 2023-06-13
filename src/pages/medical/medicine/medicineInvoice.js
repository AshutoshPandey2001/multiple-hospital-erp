/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getData, setData } from 'src/services/firebasedb';
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
const PrintComponent = ({ data }) => {
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
    const [paymentStatus, setPaymentStatus] = useState('')
    const userName = useSelector(selectUserName)
    const [invoiceuid, setInvoiceuid] = useState(Math.floor(5489 + Math.random() * 6395))

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = () => {
        setTimeout(async () => {
            let totalcgst = undefined;
            let totalsgst = undefined;
            await getData('Tax', 'LZnOzIOavFxXLPkmFaWc').then((res) => {
                let data3 = res.data().tax
                data3.forEach((item, i) => {
                    if (item.taxName === "CGST") {
                        setCgstValue(item.taxValue)
                        totalcgst = item.taxValue / 100 * state.allMedTotalprice
                        setCgstamount(totalcgst)
                    } else if (item.taxName === "SGST") {
                        setSgstValue(item.taxValue)
                        totalsgst = item.taxValue / 100 * state.allMedTotalprice
                        setSgstamount(totalsgst)
                    }
                    else {

                    }
                });
            }).catch((err) => {
                console.error(err);
            })
            let totalBill = state.allMedTotalprice + totalcgst + totalsgst;
            setPayableamount(totalBill)
            setIsLoading(false)
        }, 3000);
    }
    const saveInvoice = async () => {
        setIsLoading(true)
        let medicinePatient = await [...allMedicinePatient]
        let newObj = await { ...state, paymentStatus: 'Completed', paymentType, payableAmount: payAbleAmount, cgstValue, sgstValue, cgstAmount, sgstAmount, userName, invoiceuid }
        let newArray = await medicinePatient.map((item) => (item.pmeduid === state.pmeduid ? { ...newObj } : item))
        try {
            await setData("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', newArray)
            dispatch(EDIT_PATIENTS_MEDICINES(newObj))
            toast.success("Invoice Saved SuccessFully...")
            // setIsLoading(false)
            window.history.back()
        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
        // const element = componentRef.current;
        // const options = {
        //     margin: [10, 10, 0, 0],
        //     filename: 'medicineinvoice.pdf' + state.opduid,
        //     image: { type: 'jpeg', quality: 0.98 },
        //     enableLinks: true,
        //     html2canvas: { scale: 2 },
        //     jsPDF: { format: 'letter', orientation: 'portrait' },
        // };
        // let pdf = html2pdf().from(element).set(options).toPdf();
        // // pdf.save()
        // const blob = pdf.output('blob');
        // blob.then((value) => {
        //     var storagePath = 'Invoices/' + options.filename;
        //     const storageRef = ref(storage, storagePath);
        //     const uploadTask = uploadBytesResumable(storageRef, value);
        //     uploadTask.on('state_changed', (snapshot) => {
        //         // progrss function ....
        //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        //     }, (error) => {
        //         // error function ....

        //     }, () => {
        //         // complete function ....
        //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        //             let newObj = { ...state, paymentStatus: 'Complete' }
        //             let newArray = medicinePatient.map((item) => (item.pmeduid === state.pmeduid ? { ...newObj } : item))
        //             try {
        //                 await setData("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', newArray)
        //                 dispatch(EDIT_PATIENTS_MEDICINES(newObj))
        //                 toast.success("Invoice Saved SuccessFully...")
        //                 // setIsLoading(false)
        //                 window.history.back()
        //             } catch (error) {
        //                 console.error(error);
        //             }


        //         })
        //     })
        // });


    }
    const printInvoice = () => {
        // if (state.paymentStatus === "Complete") {
        //     setPrintContent(<PrintComponent data={{
        //         data1: {
        //             ...state,
        //         }
        //     }} />)
        // } else {
        setPrintContent(<PrintComponent data={{
            data1: {
                ...state,
                cgstValue: cgstValue,
                cgstAmount: cgstAmount,
                sgstValue: sgstValue,
                sgstAmount: sgstAmount,
                payableAmount: payAbleAmount,
                paymentType,
                userName,
                invoiceuid
            }
        }} />)
        // }



    }
    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>

                <div className='d-flex justify-content-center'>
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
                                    <span><b>Bill No: {state.invoiceuid}</b></span>
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
                                        <td>{cgstValue}%</td>
                                        <td>{cgstAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>SGST%</td>
                                        <td>{sgstValue}%</td>
                                        <td>{sgstAmount.toFixed(2)}</td>
                                    </tr>

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
                                    {/* <div>
                                        <div><b>Invoice By :{state.userName}</b></div>
                                        <span>Payment Type <b>:{state.paymentType}</b></span>
                                        <div><b>Payment Status :{state.paymentStatus}</b></div>
                                    </div> */}
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                <div>
                                    <h6>Payable Amount : {payAbleAmount.toFixed(2)}</h6>
                                </div>
                            </div>
                            {/* <div className="form-check" style={{ marginTop: '20px' }}>
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='paid' checked={paid} onChange={(e) => setPaid(e.target.checked)} />If You Want to Paid the bill Please check the check box and cilck on Paid
                                        </label>
                                    </div> */}
                            <b><hr></hr></b>
                        </div>
                        {/* <div className='row'>
                            <b><hr></hr></b>
                            <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                <div>
                                    <h6>Payable Amount : {payAbleAmount.toFixed(2)}</h6>
                                </div>
                            </div>
                            {
                                state.paymentStatus === "Complete" ? null :

                                    <div className="form-check" style={{ marginTop: '20px' }}>
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='paid' checked={paid} onChange={(e) => setPaid(e.target.checked)} />If You Want to Paid the bill Please check the check box and cilck on Paid
                                        </label>
                                    </div>
                            }
                            <b><hr></hr></b>
                        </div> */}


                    </div>

                    {/* <div style={{ display: 'none' }}>
                        <div ref={componentRef}>
                            <table>
                                <thead>
                                    <div className="header">
                                        <PrintHeader />
                                    </div>
                                </thead>
                                <tbody>
                                    <div style={{ width: '700px', height: 'auto', marginLeft: '50px' }} >
                                        <div className='row text-center'> <h3>Invoice</h3></div>
                                        <b><hr></hr></b>
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                                <span><h6>Patient UID : {state.pid}</h6></span>
                                                <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                                <span><div>Age: {state.page}</div></span>
                                                <span><div>Address: {state.pAddress}</div></span>
                                                <span><div>Mobile No: {state.pMobileNo}</div></span>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                                <div>
                                                    <span><h6>Invoice UID: {state.pmeduid}</h6></span>
                                                    <span><div>Date: {state.medicineDate} </div></span>
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
                                                        <td>{cgstValue}%</td>
                                                        <td>{cgstAmount.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3}>SGST%</td>
                                                        <td>{sgstValue}%</td>
                                                        <td>{sgstAmount.toFixed(2)}</td>
                                                    </tr>

                                                </tbody>
                                            </Table>
                                        </div>

                                        <div className='row'>
                                            <b><hr></hr></b>
                                            <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                                <div>
                                                    <h6>Payable Amount : {payAbleAmount.toFixed(2)}</h6>
                                                </div>
                                            </div>
                                            <b><hr></hr></b>
                                        </div>


                                    </div>
                                </tbody>
                                <tfoot>
                                    <div style={{ marginTop: '30px' }}></div>
                                    <div className="footer"><PrintFooter /></div>
                                </tfoot>
                            </table>





                        </div>
                    </div> */}
                </div>


                <div className='d-flex justify-content-center'>
                    <button className='btn btn-primary mx-2' onClick={() => printInvoice()}>Print</button>

                    {/* <PrintButton content={
                        <div style={{ marginLeft: '20px', width: '800px', }} >
                            <div className='row text-center'> <h5>Invoice</h5></div>
                            <b><hr ></hr></b>
                            <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-6'>
                                    <span><b>Patient UID : {state.pid}</b></span>
                                    <span><div>Name: {state.pName} </div></span>
                                    <span><div>Mobile No: {state.pMobileNo}</div></span>
                                    <span><div>Date: {state.medicineDate} </div></span>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                    <div>
                                        <span><b>Invoice UID: {state.pmeduid}</b></span>
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
                                            <td>{cgstValue}%</td>
                                            <td>{cgstAmount.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3}>SGST%</td>
                                            <td>{sgstValue}%</td>
                                            <td>{sgstAmount.toFixed(2)}</td>
                                        </tr>

                                    </tbody>
                                </Table>
                            </div>

                            <div className='row'>
                                <b><hr></hr></b>
                                <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                    <div>
                                        <h6>Payable Amount : {payAbleAmount.toFixed(2)}</h6>
                                    </div>
                                </div>
                                <b><hr></hr></b>
                            </div>


                        </div>} /> */}
                    {
                        state.paymentStatus === "Completed" ? null : <button className='btn btn-primary' disabled={paymentStatus === "Completed" ? false : true} onClick={saveInvoice}>Paid</button>}
                </div>

            </>
        }



    </>
}

export default medicineInvoice