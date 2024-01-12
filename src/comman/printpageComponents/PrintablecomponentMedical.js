/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { forwardRef } from "react";
import PrintHeader from "./PrintHeader";
import PrintFooter from "./PrintFooter";
import PrintHeaderMedical from "./PrintHeaderMedical";
import Barcode from 'react-barcode';

const PrintableComponentMedical = forwardRef((props, ref) => (
    <div ref={ref} style={{ width: '100vw' }} className="page-break" >
        <table style={{ border: '1px solid black', minHeight: '100vh', height: '100%' }}>
            <thead style={{ fontSize: "12px", height: 'auto' }}>
                <div className='row' style={{ display: 'flex', width: '100%' }}>
                    <div className='col-lg-5' style={{ borderRight: '1px solid black', width: '45%' }}>
                        <div className='p-2'>
                            <div><b>{props.sendData.medicalName}</b></div>
                            <div>{props.sendData.medicalAddress}</div>
                            <div>{props.sendData.contactNumber}</div>
                            <div>{props.sendData.licenceNumber}</div>
                        </div>
                    </div>
                    <div className='col-lg-3' style={{ borderRight: '1px solid black', width: '20%' }}>
                        <div className='p-2'>
                            <div><b>Bill #: {props.sendData.invoiceuid}</b></div>
                            <div>Date: {props.sendData.medicineDate}</div>
                        </div>
                    </div>
                    <div className='col-lg-4' style={{ width: '35%' }}>
                        <div className='p-2'>
                            <div>
                                Doctor:-{props.sendData.drName}
                            </div>
                            <div><b>
                                Patient:-{props.sendData.pName}
                            </b>
                            </div>
                            <div>
                                <b>
                                    Addrss:-{props.sendData.pAddress}
                                </b>

                            </div>
                        </div>
                    </div>
                </div>
            </thead>
            <tbody style={{ fontSize: "10px" }}>
                {props.content}
            </tbody>
            <tfoot style={{ backgroundColor: 'none' }}>
                {/* <div style={{ marginTop: '50px' }}></div> */}
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px', fontSize: '12px' }}>
                    <div ><b>Invoice By :{props.sendData.userName}</b></div>
                    <span>Payment Type <b>:{props.sendData.paymentType}</b></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ marginLeft: '20px', fontSize: '10px' }}><b>Terms & Conditions:</b>Subject to Mangrol Judrisdiction</span>
                    <span style={{ marginRight: '20px', fontSize: '10px' }}> Authorised Signatory</span>
                </div>
            </tfoot>
        </table>
    </div>
));

export default PrintableComponentMedical;
