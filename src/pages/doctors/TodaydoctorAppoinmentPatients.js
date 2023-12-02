/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import CommanTable from 'src/comman/table/CommanTable'
import { db } from 'src/firebaseconfig';
import { selectUserId, selectdoctoruid } from 'src/redux/slice/authSlice';
import moment from 'moment';
import { BsEye } from 'react-icons/bs'
import { ddMMyyyy, formatDateDDMMYYY, formatDateyyyymmddUtcopd, yyyyMMdd } from 'src/services/dateFormate';
import { useNavigate } from 'react-router-dom'
import { AiFillPrinter } from 'react-icons/ai'
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { Table } from 'react-bootstrap';
import Barcode from 'react-barcode';


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
const TodaydoctorAppoinmentPatients = () => {
    const hospitaluid = useSelector(selectUserId)
    const druid = useSelector(selectdoctoruid)
    const [todayPatients, setTodaypatients] = useState([])
    const navigate = useNavigate()
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Add 1 to month since it is zero-based
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}Z`;
    const parentDocRef = db.collection('opdPatients').doc('m5JHl3l4zhaBCa8Vihcb');
    const subcollectionRef = parentDocRef.collection('opdPatient').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0).where('druid', '==', druid).where('consultingDate', '==', formattedDate).where('paymentStatus', "==", "Pending");
    const [printContent, setPrintContent] = useState(null);

    // const subcollectionRef = parentDocRef.collection('opdPatient').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0).where('consultingDate', '==', formattedDate);
    const columns = [
        {
            name: 'Date',
            selector: row => formatDateDDMMYYY(row.consultingDate),
            sortable: true,
            sortFunction: (a, b) => { return moment(a.consultingDate).toDate().getTime() - moment(b.consultingDate).toDate().getTime() }
        },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo ? row.pMobileNo : '-' },
        {
            name: 'Action', cell: row => <span style={{ display: 'flex', justifyContent: 'center' }}>
                <button style={{ color: 'skyblue', border: 'none' }} onClick={() => addprescription(row)} >{row.prescription ? <AiFillPrinter size={25} /> : <BsEye size={25} />} </button >

            </span >
        }
    ]
    useEffect(() => {
        let query = subcollectionRef
            .orderBy('timestamp', 'desc')
        const unsubscribe = query.onSnapshot((snapshot) => {
            const newData = [];
            snapshot.forEach((doc) => {
                newData.push(doc.data());
            });

            setTodaypatients(newData)
            console.log('newData-------------------------------------', newData);

        });

        return () => {
            unsubscribe();
        };
    }, [])

    const addprescription = (item) => {
        if (item.prescription) {
            setPrintContent(<PrintComponent data={{
                data1: {
                    ...item
                }
            }} />)
        } else {
            navigate('/todayAppoinments/doctorPriscription', { state: item })
        }
    }
    return (
        <div>
            <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
            <DataTable
                title={"Today Patients"}
                columns={columns}
                data={todayPatients}
                pagination={true}
                fixedHeader={true}
                noHeader={false}
                persistTableHead
                highlightOnHover
                paginationServer={true}
                // subHeader={<div className='d-flex' style={{ justifyContent: 'space-between' }}></div>}
                paginationTotalRows={todayPatients.length}
            />
        </div>
    )
}

export default TodaydoctorAppoinmentPatients