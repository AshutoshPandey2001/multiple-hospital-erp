/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Loaderspinner from '../../comman/spinner/Loaderspinner';
import { getData, setData } from 'src/services/firebasedb';
import Table from 'react-bootstrap/Table';
import ReactToPrint from 'react-to-print';
import { storage } from 'src/firebaseconfig';
import html2pdf from 'html2pdf.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_OPD_PATIENTS, selectOpdPatients } from 'src/redux/slice/opdPatientsList';
import { toast } from 'react-toastify';
import hospitalimg from 'src/assets/images/hospitalerp.png'
import PrintHeader from 'src/comman/printpageComponents/PrintHeader';
import PrintFooter from 'src/comman/printpageComponents/PrintFooter';
import { TfiArrowCircleLeft } from 'react-icons/tfi'
import PrintButton from 'src/comman/printpageComponents/PrintButton';

// import '../../print.css';

const Labreportprint = () => {
    const componentRef = useRef();
    const { state } = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
    },)
    // ref={componentRef}
    return (<>
        {isLoading ? <Loaderspinner /> :
            <>
                <div className='d-flex justify-content-center'>
                    <div >
                        <div style={{ width: '600px', height: 'auto', marginLeft: '50px' }} >
                            <b><hr></hr></b>
                            <div className='row text-center'> <h3>Report</h3></div>
                            <b><hr></hr></b>
                            <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-6'>
                                    <span><div><b>Patient UID</b> : {state.pid}</div></span>
                                    <span><div><b>Age/sex </b>: {state.page}Years / {state.pGender}</div></span>
                                    <span><div><b>Date </b>: {state.date}</div> </span>
                                    <span><div><b>Refered Dr. </b>: {state.drName}</div></span>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                    <div>
                                        <span><div><b>Name </b>: {state.pName}</div> </span>
                                        <span><div><b>Mobile No </b>: {state.pMobileNo}</div></span>
                                        <span><div><b>Report id </b>: {state.labreportuid}</div> </span>
                                        <span>
                                            {state.reportMakeby.split('\n').map((item, key) => {
                                                return <span key={key}> <b>{item}</b><br /></span>
                                            })}
                                        </span>
                                    </div>

                                </div>
                            </div>
                            <b><hr></hr></b>
                            <div className='row text-center'> <h5>{state.reportName}</h5></div>
                            <b><hr></hr></b>

                            <div className='row text-center'>
                                <Table >
                                    <thead>
                                        <tr >
                                            <th>Parameter</th>
                                            <th>Result</th>
                                            {state.isunitRequired ?
                                                <th>Unit</th> : null
                                            }
                                            <th>Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.pathalogyResults?.map((pathalogy, i) => {
                                                return <>
                                                    <tr key={i} style={{ border: 'snow' }}>
                                                        <td>{pathalogy.parameter}</td>
                                                        <td>{pathalogy.result}</td>
                                                        {pathalogy.unit ?
                                                            <td>{pathalogy.unit}</td> : null
                                                        }
                                                        <td>{pathalogy.normalRange}</td>
                                                    </tr>
                                                </>
                                            })
                                        }


                                    </tbody>
                                </Table>
                            </div>

                            <div className='row'>
                                <span>
                                    <b>Remark:-</b>
                                    {state.remark.split('\n').map((item, key) => {
                                        return <span key={key}> <b>{item}</b><br /></span>
                                    })}
                                </span>

                            </div>

                            <div className='row ' style={{ paddingTop: '50px' }}>
                                <div className='col-lg-6'> <b>EXAMINED:-</b></div>
                                <div className='col-lg-6 justify-content-end'><b>{state.examinedBy}</b></div>
                            </div>


                        </div>
                    </div>
                    {/* <div style={{ display: 'none' }}>
                        <div ref={componentRef} style={{ marginBottom: '50px' }}>
                            <table >
                                <thead >
                                    <div className="header"><PrintHeader /></div>
                                </thead>
                                <tbody>
                                    <div style={{ width: '700px', height: 'auto', marginLeft: '50px' }} >
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                                <span><div><b>Patient UID</b> : {state.pid}</div></span>
                                                <span><div><b>Age/sex </b>: {state.page}Years / {state.pGender}</div></span>
                                                <span><div><b>Date </b>: {state.date}</div> </span>
                                                <span><div><b>Refered Dr. </b>: {state.drName}</div></span>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                                <div>
                                                    <span><div><b>Name </b>: {state.pName}</div> </span>
                                                    <span><div><b>Mobile No </b>: {state.pMobileNo}</div></span>
                                                    <span><div><b>Report id </b>: {state.labreportuid}</div> </span>
                                                    <span>
                                                        {state.reportMakeby.split('\n').map((item, key) => {
                                                            return <span key={key}> <b>{item}</b><br /></span>
                                                        })}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <b><hr></hr></b>
                                        <div className='row text-center'> <h5>{state.reportName}</h5></div>
                                        <b><hr></hr></b>

                                        <div className='row text-center'>
                                            <Table >
                                                <thead>
                                                    <tr>
                                                        <th>Parameter</th>
                                                        <th>Result</th>
                                                        {state.isunitRequired ?
                                                            <th>Unit</th> : null
                                                        }
                                                        <th>Normal Range</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        state.pathalogyResults?.map((pathalogy, i) => {
                                                            return <>
                                                                <tr key={i} style={{ border: 'white' }}>
                                                                    <td>{pathalogy.parameter}</td>
                                                                    <td>{pathalogy.result}</td>
                                                                    {pathalogy.unit ?
                                                                        <td>{pathalogy.unit}</td> : null
                                                                    }
                                                                    <td>{pathalogy.normalRange}</td>
                                                                </tr>
                                                            </>
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>

                                        <div className='row'>
                                            <span>
                                                <b>Remark:-</b>
                                                {state.remark.split('\n').map((item, key) => {
                                                    return <span key={key}> <b>{item}</b><br /></span>
                                                })}
                                            </span>

                                        </div>
                                        <div className='exam'>
                                            <div className='row ' style={{ paddingTop: '50px' }} >
                                                <div className='col-lg-6'> <b>EXAMINED:-</b></div>
                                                <div className='col-lg-6 justify-content-end'><b>{state.examinedBy}</b></div>
                                            </div>
                                        </div>
                                    </div>
                                </tbody>
                                <tfoot >
                                    <div style={{ marginTop: '30px' }}></div>
                                    <div className="footer" ><PrintFooter /></div>
                                </tfoot>

                            </table>


                        </div>
                    </div> */}



                </div>
                <div className='d-flex justify-content-center'>
                    <PrintButton content={
                        <div style={{ width: '700px', height: 'auto', marginLeft: '50px' }} >
                            <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-6'>
                                    <span><div><b>Patient UID</b> : {state.pid}</div></span>
                                    <span><div><b>Age/sex </b>: {state.page}Years / {state.pGender}</div></span>
                                    <span><div><b>Date </b>: {state.date}</div> </span>
                                    <span><div><b>Refered Dr. </b>: {state.drName}</div></span>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                    <div>
                                        <span><div><b>Name </b>: {state.pName}</div> </span>
                                        <span><div><b>Mobile No </b>: {state.pMobileNo}</div></span>
                                        <span><div><b>Report id </b>: {state.labreportuid}</div> </span>
                                        <span>
                                            {state.reportMakeby.split('\n').map((item, key) => {
                                                return <span key={key}> <b>{item}</b><br /></span>
                                            })}
                                        </span>
                                    </div>

                                </div>
                            </div>
                            <b><hr></hr></b>
                            <div className='row text-center'> <h5>{state.reportName}</h5></div>
                            <b><hr></hr></b>

                            <div className='row text-center'>
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>Parameter</th>
                                            <th>Result</th>
                                            {state.isunitRequired ?
                                                <th>Unit</th> : null
                                            }
                                            <th>Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.pathalogyResults?.map((pathalogy, i) => {
                                                return <>
                                                    <tr key={i} style={{ border: 'white' }}>
                                                        <td>{pathalogy.parameter}</td>
                                                        <td>{pathalogy.result}</td>
                                                        {pathalogy.unit ?
                                                            <td>{pathalogy.unit}</td> : null
                                                        }
                                                        <td>{pathalogy.normalRange}</td>
                                                    </tr>
                                                </>
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>

                            <div className='row'>
                                <span>
                                    <b>Remark:-</b>
                                    {state.remark.split('\n').map((item, key) => {
                                        return <span key={key}> <b>{item}</b><br /></span>
                                    })}
                                </span>

                            </div>
                            <div className='exam'>
                                <div className='row ' style={{ paddingTop: '50px' }} >
                                    <div className='col-lg-6'> <b>EXAMINED:-</b></div>
                                    <div className='col-lg-6 justify-content-end'><b>{state.examinedBy}</b></div>
                                </div>
                            </div>
                        </div>} />
                    {/* <ReactToPrint
                        trigger={() => {
                            return <button className='btn btn-primary mx-2'>Print</button>;
                        }}
                        content={() => componentRef.current}
                        documentTitle={'Laboratory reports'}
                        pageStyle={`
                        @page {
                          size: A4;
                          margin:0;                        
                                        
                        }
                      
                        @media print {
                           
                          body {           
                            margin: 1.6cm ;
                          }
                          
                          .header {                           
                            position: fixed;
                            top:0;
                            left: 0;
                            right: 0;
                            text-align: center;
                            background-color: transparent;
                          }
                          .footer {                       
                            position: fixed;  
                            bottom: 0;
                            z-index: 1;
                            left: 0;
                            right: 0;        
                            text-align: center;
                            background-color: transparent;
                          }  
                                            
                          .exam{
                           margin-top:50px                      
                          }
                        }
                      `} /> */}
                    {/* <button className='btn btn-primary ' onClick={saveInvoice}>Save Invoice</button> */}
                </div></>
        }
    </>
    )

}


export default Labreportprint;