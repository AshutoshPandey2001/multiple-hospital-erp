/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
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
const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginLeft: '20px' }} >
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
                        <span><h6>Return invoice UID: {state.returnuid}</h6></span>
                        <span><div>Date: {state.returnDate} </div></span>
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

                    </tbody>
                </Table>
            </div>

            <div className='row'>
                <b><hr></hr></b>
                <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                    <div>
                        <h6>Refund Amount : {state.allMedTotalprice.toFixed(2)}</h6>
                    </div>
                </div>
                <b><hr></hr></b>
            </div>


        </div>
    )
};
const ReturnmedicineInvoice = () => {
    const componentRef = useRef();
    const { state } = useLocation()
    const dispatch = useDispatch()
    const allMedicinePatient = useSelector(selectAllPatientsMedicines)
    const [cgstAmount, setCgstamount] = useState(0)
    const [sgstAmount, setSgstamount] = useState(0)
    const [cgstValue, setCgstValue] = useState(0)
    const [sgstValue, setSgstValue] = useState(0)
    const [refundAmount, setPayableamount] = useState(0)
    const [subtotalAmount, setSubTotalamount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [printContent, setPrintContent] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
    }, [])

    const printInvoice = () => {

        setPrintContent(<PrintComponent data={{
            data1: {
                ...state,
            }
        }} />)


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
                                <span><h6>Patient UID : {state.pid}</h6></span>
                                <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                <span><div>Age: {state.page}</div></span>
                                <span><div>Address: {state.pAddress}</div></span>
                                <span><div>Mobile No: {state.pMobileNo}</div></span>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                <div>
                                    <span><h6>Return invoice UID: {state.returnuid}</h6></span>
                                    <span><div>Date: {state.returnDate} </div></span>
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
                                    {/* <tr>
                                    <td colSpan={3}>CGST%</td>
                                    <td>{cgstValue}%</td>
                                    <td>{cgstAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>SGST%</td>
                                    <td>{sgstValue}%</td>
                                    <td>{sgstAmount.toFixed(2)}</td>
                                </tr> */}

                                </tbody>
                            </Table>
                        </div>

                        <div className='row'>
                            <b><hr></hr></b>
                            <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                <div>
                                    <h6>Refund Amount : {state.allMedTotalprice.toFixed(2)}</h6>
                                </div>
                            </div>
                            <b><hr></hr></b>
                        </div>


                    </div>
                    {/* 
                    <div style={{ display: 'none' }}>
                        <div ref={componentRef}>
                            <div className="header">
                                <PrintHeader />
                            </div>
                            <div style={{ marginLeft: '10px' }} >
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
                                            <span><h6>Return invoice UID: {state.returnuid}</h6></span>
                                            <span><div>Date: {state.returnDate} </div></span>
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
                                            
                                        </tbody>
                                    </Table>
                                </div>

                                <div className='row'>
                                    <b><hr></hr></b>
                                    <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                        <div>
                                            <h6>Refund Amount : {state.allMedTotalprice.toFixed(2)}</h6>
                                        </div>
                                    </div>
                                    <b><hr></hr></b>
                                </div>


                            </div>

                            <div className="footer"><PrintFooter /></div>

                        </div>
                    </div> */}
                </div>

                <div className='d-flex justify-content-center'>
                    <button className='btn btn-primary mx-2' onClick={() => printInvoice()}>Print</button>

                    {/* <PrintButton content={
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
                                        <span><h6>Return invoice UID: {state.returnuid}</h6></span>
                                        <span><div>Date: {state.returnDate} </div></span>
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
                                        

                                    </tbody>
                                </Table>
                            </div>

                            <div className='row'>
                                <b><hr></hr></b>
                                <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                    <div>
                                        <h6>Refund Amount : {state.allMedTotalprice.toFixed(2)}</h6>
                                    </div>
                                </div>
                                <b><hr></hr></b>
                            </div>


                        </div>} /> */}
                    {/* <ReactToPrint
                        trigger={() => {
                            return <button className='btn btn-primary mx-2'>Print</button>;
                        }}
                        content={() => componentRef.current}
                        documentTitle={'Return Medicine Invoice'}
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
                </div>


            </>
        }



    </>
}

export default ReturnmedicineInvoice