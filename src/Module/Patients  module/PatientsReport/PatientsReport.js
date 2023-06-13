/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { AppFooter, AppHeader } from 'src/components'
import Accordion from 'react-bootstrap/Accordion';
import { useSelector } from 'react-redux';
import { selectMobileNo } from 'src/redux/slice/authSlice';
import { useEffect } from 'react';
import { db } from 'src/firebaseconfig';
import Table from 'react-bootstrap/Table';

const PatientsReport = () => {
    const patientMobileNo = useSelector(selectMobileNo)

    const [patient, setPatient] = useState({})
    const [opdHistory, setOPdHistory] = useState([])
    const [medicineHistory, setMedicineHistory] = useState([])
    const [admitHistory, setAdmitHistory] = useState([])
    useEffect(() => {
        db.collection('Patients').doc('fBoxFLrzXexT8WNBzGGh').get().then((res) => {
            let temp_data = {}
            let res1 = res.data().patients;

            res1.map((item1, index) => {
                if (item1.pMobileNo == patientMobileNo) {
                    temp_data = item1;
                }
            })


            setPatient(temp_data)
        }).catch((error) => {
            console.error("Error updating document: ", error);
        });

        db.collection('opdPatients').doc('m5JHl3l4zhaBCa8Vihcb').get().then((res) => {
            let temp_data = []
            let res1 = res.data().opdPatient;

            res1.map((item1, index) => {
                if (item1.pMobileNo == patientMobileNo) {
                    temp_data.push(item1)
                }
            })


            setOPdHistory(temp_data)
        }).catch((error) => {
            console.error("Error updating document: ", error);
        });

        db.collection('admitPatients').doc('jSqDGnjO21bpPGhb6O2y').get().then((res) => {
            let temp_data = []
            let res1 = res.data().admitPatient;

            res1.map((item1, index) => {
                if (item1.pMobileNo == patientMobileNo) {
                    temp_data.push(item1)
                }
            })


            setAdmitHistory(temp_data)

        }).catch((error) => {
            console.error("Error updating document: ", error);

        });

        db.collection('PatientsMedicines').doc('GoKwC6l5NRWSonfUAal0').get().then((res) => {

            let temp_data = []
            let res1 = res.data().patientsMedicines;

            res1.map((item1, index) => {
                if (item1.pMobileNo == patientMobileNo) {
                    temp_data.push(item1)
                }
            })


            setMedicineHistory(temp_data)

        }).catch((error) => {
            console.error("Error updating document: ", error);

        });
    }, [])

    return (
        <>
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AppHeader />
                {
                    patient ?
                        <div className="body flex-grow-1 " style={{ margin: '20px 20px 20px 20px' }}>
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div className='card'>
                                        <div className='card-header'><h4>Patient Details</h4></div>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col-lg-6'><h5>Name:- {patient.pName}</h5></div>
                                                <div className='col-lg-6'><h5>ID:-{patient.pid}</h5></div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-lg-6'><h5>Age:- {patient.page}</h5></div>
                                                <div className='col-lg-6'><h5>Mobile No:- {patient.pMobileNo}</h5></div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-lg-6'><h5>Gender:- {patient.pGender}</h5></div>
                                                <div className='col-lg-6'><h5>Address:- {patient.pAddress}</h5></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='card'>
                                        <div className='card-header'></div>
                                        <div className='card-body'>
                                            <Accordion>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>Outpatient Department Report</Accordion.Header>
                                                    <Accordion.Body>
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
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                                <Accordion.Item eventKey="1">
                                                    <Accordion.Header>Admit Report</Accordion.Header>
                                                    <Accordion.Body>
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
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                                <Accordion.Item eventKey="2">
                                                    <Accordion.Header>Medicines Report</Accordion.Header>
                                                    <Accordion.Body>
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
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div> : <div><h1>No Data Found</h1></div>
                }

                <AppFooter />
            </div>
        </>
    )
}

export default PatientsReport