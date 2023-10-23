/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Barcode from 'react-barcode';
import { formatDateDDMMYYY } from 'src/services/dateFormate';
import { useState } from 'react';
import { BiPlus } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import { Table } from 'react-bootstrap';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { updateDatainSubcollectionmedicineinvoice } from 'src/services/firebasedb';
import { selectUserId, selectdoctoruid } from 'src/redux/slice/authSlice';
import { useSelector } from 'react-redux';
import { db } from 'src/firebaseconfig';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className="card" style={{ border: "2px solid black" }}>
                <div style={{ fontWeight: 'bold', borderBottom: "2px solid black", }} >
                    <div className="row" style={{ padding: '20px' }}>
                        <div className="col-lg-4 col-md-4 col-sm-4">
                            <div style={{ height: '10px' }}>
                                <Barcode value={state.pid} height={50} width={1.5} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 d-flex justify-content-end">

                            <div>
                                <div>Name: {state.pName}</div>
                                <div>Age/Sex: {state.page}/{state.pGender}</div>
                                <div>Address: {state.pAddress}</div>
                                <div>Mobile No: {state.pMobileNo}</div>
                            </div>

                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 d-flex justify-content-end">
                            <div >
                                <div>OPD Case No: {state.opdCaseNo}</div>
                                <div>OPD id: {state.opduid}</div>
                                <div>Date: {formatDateDDMMYYY(state.consultingDate)}</div>
                                <div>Consulting Dr.: {state.drName}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row' style={{ padding: '20px' }}>
                    <div className='col-lg-6 col-md-6 col-12 '>
                        <span><b>Diagnosis: {state.diagnosis}</b></span>
                    </div>
                    <div className='col-lg-6 col-md-6 col-12 '>
                        <span><b>Follow up: {new Date(state.followup).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}</b></span>
                    </div>

                </div>
                <div className='row text-center' style={{ backgroundColor: 'gainsboro', marginLeft: '1px', marginRight: '1px', borderBottom: "2px solid black", borderTop: "2px solid black" }}><h4>PRESCRIPTION</h4></div>

                <div className='row' style={{ padding: '20px' }}>
                    <div className='col-lg-12'>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label ><b>RX(Advice on OPD):</b></label>
                            <div className='card' >
                                <Table bordered={false}>
                                    <thead>
                                        <tr>
                                            <th>Medicine Name</th>
                                            <th>Frequency</th>
                                            <th>Day</th>
                                            <th>Total</th>
                                            <th>Advice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <Scrollbars style={{ height: '100px' }}> */}
                                        {state.prescription?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{item.medicine}</td>
                                                    <td>{item.frequency.M} - {item.frequency.A} - {item.frequency.E} - {item.frequency.N}</td>
                                                    <td>{item.days}</td>
                                                    <td>{item.total}</td>
                                                    <td>{item.advice}</td>
                                                </tr>
                                            </>
                                        })}

                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>


                </div>
                {state.generalInstruction ?
                    <div className='row' style={{ padding: '20px', width: '100%' }}>
                        <div><b>General instructions:</b></div>
                        <div className='card' style={{ border: "2px solid black" }}>
                            {state.generalInstruction.split('\n').map((item, key) => {
                                return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                            })}
                        </div>

                    </div> : null
                }

            </div>

        </div>
    )
};

const DoctorPriscription = () => {
    const hospitaluid = useSelector(selectUserId)
    const druid = useSelector(selectdoctoruid)
    const location = useLocation();
    const state = location.state
    const [advice, setAdvice] = useState({
        medicine: '',
        frequency: {
            M: 0,
            A: 0,
            E: 0,
            N: 0,
        },
        total: '',
        days: '',
        advice: ''
    })
    const [prescription, setPrescription] = useState([])
    const [diagnosis, setDiagnosis] = useState('')
    const [followup, setFollwup] = useState('')
    const [generalInstruction, setGeneralInstruction] = useState('')
    const [printContent, setPrintContent] = useState(null);
    const [show, setShow] = useState(false);
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Add 1 to month since it is zero-based
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const [patientsHistory, setPatientsHistory] = useState([]);
    const parentDocRef = db.collection('opdPatients').doc('m5JHl3l4zhaBCa8Vihcb');
    const subcollectionRef = parentDocRef.collection('opdPatient').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0).where('druid', '==', druid);
    useEffect(() => {
        console.log('');
        let query = subcollectionRef.where('pid', "==", state.pid).where('paymentStatus', "==", "Completed")
            .orderBy('timestamp', 'asc')
        const unsubscribe = query.onSnapshot((snapshot) => {
            const newData = [];
            snapshot.forEach((doc) => {
                newData.push(doc.data());
            });
            setPatientsHistory(newData)
        });
        return () => {
            unsubscribe();
        };
    }, [])
    const handleClose = () => {
        setShow(false);
    }
    const openHistory = () => {
        setShow(true);
    }
    const pushAdvice = () => {

        if (!advice) {
            return;
        }
        console.log('advice', advice);
        setPrescription([...prescription, advice]);
        setAdvice({
            medicine: '',
            frequency: {
                M: 0,
                A: 0,
                E: 0,
                N: 0,
            },
            total: '',
            days: '',
            advice: ''
        });
        setCheckboxValues({
            M: false,
            A: false,
            E: false,
            N: false,
        })
    }
    const cancleAdvice = (i) => {
        setPrescription(prescription.filter((item) => item.medicine !== i.medicine))
    }
    const printPrescription = (item) => {
        setPrintContent(<PrintComponent data={{
            data1: {
                ...state,
                prescription,
                diagnosis,
                generalInstruction,
                followup
            }
        }} />)
    }
    const saveprescription = async () => {
        console.log('i am in');
        await updateDatainSubcollectionmedicineinvoice("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', {
            ...state,
            prescription,
            diagnosis,
            generalInstruction,
            followup
        }, 'opduid', 'hospitaluid')
        window.history.back();

    }
    const [checkboxValues, setCheckboxValues] = useState({
        M: false,
        A: false,
        E: false,
        N: false,
    });
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxValues({ ...checkboxValues, [name]: checked });

        setAdvice((prevAdvice) => ({
            ...prevAdvice,
            frequency: {
                ...prevAdvice.frequency,
                [name]: checked ? 1 : 0,
            },
        }));
    };
    return (
        <div>
            <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
            {state.paymentStatus === "Pending" ?
                <>
                    <div className='d-flex justify-content-center'>
                        <div style={{ width: '90%', height: 'auto', marginLeft: '50px' }} >
                            <div className="card" style={{ border: "2px solid black" }}>
                                <div style={{ fontWeight: 'bold', borderBottom: "2px solid black", }} >
                                    <div className="row" style={{ padding: '20px' }}>
                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                            <div style={{ height: '10px' }}>
                                                <Barcode value={state.pid} height={50} width={1.5} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 d-flex justify-content-end">

                                            <div>
                                                <div>Name: {state.pName}</div>
                                                <div>Age/Sex: {state.page}/{state.pGender}</div>
                                                <div>Address: {state.pAddress}</div>
                                                <div>Mobile No: {state.pMobileNo}</div>
                                            </div>

                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 d-flex justify-content-end">
                                            <div >
                                                <div>OPD Case No: {state.opdCaseNo}</div>
                                                <div>OPD id: {state.opduid}</div>
                                                <div>Date: {formatDateDDMMYYY(state.consultingDate)}</div>
                                                <div>Consulting Dr.: {state.drName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '10px', justifyContent: 'end', display: 'flex' }}>
                                    <button className='btn btn-primary mx-2' onClick={() => openHistory()}>History</button>
                                </div>
                                <div className='row' style={{ padding: '20px' }}>
                                    <div className='col-lg-6 col-md-6 col-12 '>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label ><b>Diagnosis:</b></label>
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" placeholder="Enter diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-12 '>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label ><b>Follow up:</b></label>
                                            <div className="input-group mb-3">
                                                <input type="date" className="form-control" placeholder="Enter follow up Details" value={followup} onChange={(e) => setFollwup(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row text-center' style={{ backgroundColor: 'gainsboro', marginLeft: '1px', marginRight: '1px', borderBottom: "2px solid black", borderTop: "2px solid black" }}><h4>PRESCRIPTION</h4></div>

                                <div className='row' style={{ padding: '20px' }}>
                                    <div className='col-lg-12'>

                                        <div className='row'>
                                            <div className='col-lg-3'>
                                                <div className="form-group" style={{ marginTop: '20px' }}>
                                                    <label ><b>Medicine:</b></label>
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Enter Medicine" value={advice.medicine} onChange={(e) => setAdvice({ ...advice, medicine: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group" style={{ marginTop: '20px' }}>
                                                    <label><b>Frequency:</b></label>
                                                    <div className='mt-2'>
                                                        <div className="form-check form-check-inline">
                                                            <label className="form-check-label" >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="M"
                                                                    value="M"
                                                                    checked={checkboxValues.M}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                M
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <label className="form-check-label" >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="A"
                                                                    value="A"
                                                                    checked={checkboxValues.A}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                A
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <label className="form-check-label" >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="E"
                                                                    value="E"
                                                                    checked={checkboxValues.E}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                E
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <label className="form-check-label">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="N"
                                                                    value="N"
                                                                    checked={checkboxValues.N}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                N
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-1'>
                                                <div className="form-group" style={{ marginTop: '20px' }}>
                                                    <label ><b>Days:</b></label>
                                                    <div className="input-group mb-3">
                                                        <input type="number" className="form-control" value={advice.days} onChange={(e) => setAdvice({ ...advice, days: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-1'>
                                                <div className="form-group" style={{ marginTop: '20px' }}>
                                                    <label ><b>Total:</b></label>
                                                    <div className="input-group mb-3">
                                                        <input type="number" className="form-control" value={advice.total} onChange={(e) => setAdvice({ ...advice, total: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-3'>
                                                <div className="form-group" style={{ marginTop: '20px' }}>
                                                    <label ><b>Advice:</b></label>
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Enter Advice" value={advice.advice} onChange={(e) => setAdvice({ ...advice, advice: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-1 d-flex justify-content-end' style={{ marginTop: '42px' }}  >
                                                <div className="form-group">
                                                    <span className="btn btn-success" onClick={pushAdvice}> <BiPlus size={25} /></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label ><b>RX(Advice on OPD):</b></label>
                                            <div className='card' >
                                                <Table bordered={false}>
                                                    <thead>
                                                        <tr>
                                                            <th>Medicine Name</th>
                                                            <th>Frequency</th>
                                                            <th>Day</th>
                                                            <th>Total</th>
                                                            <th>Advice</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* <Scrollbars style={{ height: '100px' }}> */}
                                                        {prescription?.map((item, i) => {
                                                            return <>
                                                                <tr key={i}>
                                                                    <td>{item.medicine}</td>
                                                                    <td>{item.frequency.M} - {item.frequency.A} - {item.frequency.E} - {item.frequency.N}</td>
                                                                    <td>{item.days}</td>
                                                                    <td>{item.total}</td>
                                                                    <td>{item.advice}</td>
                                                                    <td>                                                        <span style={{ marginLeft: '10px' }} onClick={() => cancleAdvice(item)}><AiFillDelete size={20} style={{ color: 'red' }} /></span>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        })}

                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div className='row' style={{ padding: '20px' }}>
                                    <div className='col-lg-12'>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label ><b>General instructions:</b></label>
                                            <textarea className="form-control" rows="3" name="generalInstruction" placeholder='Enter general instructions' onChange={(e) => setGeneralInstruction(e.target.value)} defaultValue={generalInstruction} ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='d-flex justify-content-center mt-5'>
                        <button className='btn btn-primary mx-2' onClick={() => printPrescription(state)}>Print</button>
                        <button className='btn btn-primary mx-2' onClick={() => saveprescription()}>Save</button>
                    </div>
                    <Modal show={show} onHide={handleClose} size="lg" >
                        <Modal.Header closeButton>
                            <Modal.Title>Patients history</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Accordion>
                                {patientsHistory.map((item, i) => {

                                    return <>
                                        <Accordion.Item eventKey={i}>
                                            <Accordion.Header><b>Date:-{formatDateDDMMYYY(state.consultingDate)}</b></Accordion.Header>
                                            <Accordion.Body>
                                                <div className='row'>
                                                    <div className='col-lg-6 col-md-6 col-12 '>
                                                        <span><b>Diagnosis: {item.diagnosis}</b></span>
                                                    </div>
                                                    <div className='col-lg-6 col-md-6 col-12 '>
                                                        <span><b>Follow up: {new Date(item.followup).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}</b></span>
                                                    </div>

                                                </div>
                                                <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderBottom: "2px solid black", borderTop: "2px solid black" }}><h4>PRESCRIPTION</h4></div>

                                                <div className='row'>
                                                    <div className='col-lg-12'>
                                                        <div className="form-group" >
                                                            <label ><b>RX(Advice on OPD):</b></label>
                                                            <div className='card' >
                                                                <Table bordered={false}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Medicine Name</th>
                                                                            <th>Frequency</th>
                                                                            <th>Day</th>
                                                                            <th>Total</th>
                                                                            <th>Advice</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {/* <Scrollbars style={{ height: '100px' }}> */}
                                                                        {item.prescription?.map((item, i) => {
                                                                            return <>
                                                                                <tr key={i}>
                                                                                    <td>{item.medicine}</td>
                                                                                    <td>{item.frequency.M} - {item.frequency.A} - {item.frequency.E} - {item.frequency.N}</td>
                                                                                    <td>{item.days}</td>
                                                                                    <td>{item.total}</td>
                                                                                    <td>{item.advice}</td>
                                                                                </tr>
                                                                            </>
                                                                        })}

                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </>
                                })}


                            </Accordion>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </> :

                <>
                    <div className='d-flex justify-content-center'>
                        <div style={{ width: '90%', height: 'auto', marginLeft: '50px' }} >
                            <div className="card" style={{ border: "2px solid black" }}>
                                <div style={{ fontWeight: 'bold', borderBottom: "2px solid black", }} >
                                    <div className="row" style={{ padding: '20px' }}>
                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                            <div style={{ height: '10px' }}>
                                                <Barcode value={state.pid} height={50} width={1.5} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 d-flex justify-content-end">

                                            <div>
                                                <div>Name: {state.pName}</div>
                                                <div>Age/Sex: {state.page}/{state.pGender}</div>
                                                <div>Address: {state.pAddress}</div>
                                            </div>

                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 d-flex justify-content-end">
                                            <div >
                                                <div>Mobile No: {state.pMobileNo}</div>
                                                <div>Consulting Dr.: {state.drName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ margin: '20px', padding: '10px' }}>
                                    <div style={{ fontSize: '24px', marginBottom: '10px' }}><b>History:</b></div>
                                    <Accordion>
                                        {patientsHistory.map((item, i) => {

                                            return <>
                                                <Accordion.Item eventKey={i}>
                                                    <Accordion.Header><b>Date:- {formatDateDDMMYYY(state.consultingDate)}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                        <div className='row'>
                                                            <div className='col-lg-6 col-md-6 col-12 '>
                                                                <span><b>Diagnosis: {item.diagnosis}</b></span>
                                                            </div>
                                                            <div className='col-lg-6 col-md-6 col-12 '>
                                                                <span><b>Follow up: {new Date(item.followup).toLocaleDateString(undefined, {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}</b></span>
                                                            </div>

                                                        </div>
                                                        <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderBottom: "2px solid black", borderTop: "2px solid black" }}><h4>PRESCRIPTION</h4></div>

                                                        <div className='row'>
                                                            <div className='col-lg-12'>
                                                                <div className="form-group" >
                                                                    <label ><b>RX(Advice on OPD):</b></label>
                                                                    <div className='card' >
                                                                        <Table bordered={false}>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Medicine Name</th>
                                                                                    <th>Frequency</th>
                                                                                    <th>Day</th>
                                                                                    <th>Total</th>
                                                                                    <th>Advice</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {/* <Scrollbars style={{ height: '100px' }}> */}
                                                                                {item.prescription?.map((item, i) => {
                                                                                    return <>
                                                                                        <tr key={i}>
                                                                                            <td>{item.medicine}</td>
                                                                                            <td>{item.frequency.M} - {item.frequency.A} - {item.frequency.E} - {item.frequency.N}</td>
                                                                                            <td>{item.days}</td>
                                                                                            <td>{item.total}</td>
                                                                                            <td>{item.advice}</td>
                                                                                        </tr>
                                                                                    </>
                                                                                })}

                                                                            </tbody>
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                        {state.generalInstruction ?
                                                            <div className='row' style={{ padding: '20px', width: '100%' }}>
                                                                <div><b>General instructions:</b></div>
                                                                <div className='card' style={{ border: "2px solid black" }}>
                                                                    {state.generalInstruction.split('\n').map((item, key) => {
                                                                        return <React.Fragment key={key}> <b>{item}</b><br /></React.Fragment>
                                                                    })}
                                                                </div>

                                                            </div> : null
                                                        }
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </>
                                        })}


                                    </Accordion>
                                </div>
                            </div>

                        </div>
                    </div>


                </>
            }


        </div>
    )
}
export default DoctorPriscription;