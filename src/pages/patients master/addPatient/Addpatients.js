/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import { addpatientsSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { BsEye } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_LAST_PATIENT_DATA, ADD_PATIENTS, DELETE_PATIENTS, EDIT_PATIENTS, FILL_PATIENTS, selectAllPatients, selectlastPatientData } from 'src/redux/slice/patientMasterslice';
import { selectMobileNo, selectUserId, selectUsertype, selectpermissions } from 'src/redux/slice/authSlice';
import CommanTable from 'src/comman/table/CommanTable';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { addDatainsubcollection, deleteDatainSubcollection, deleteDatainSubcollectionPatients, deleteSingltObject, filDatainsubcollection, getSubcollectionData, getSubcollectionDataWithoutsnapshot, setData, updateDatainSubcollection } from 'src/services/firebasedb';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Addpatientscommanmodel from 'src/comman/comman model/Addpatientscommanmodel';
import { AiFillPrinter } from 'react-icons/ai'
import { useReactToPrint } from 'react-to-print';
import ReactToPrint from 'react-to-print';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { TfiReload } from 'react-icons/tfi'
import { db } from 'src/firebaseconfig';
import DataTable from 'react-data-table-component';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';

// const initalValues = {
//     pid: '',
//     pName: '',
//     page: '',
//     pGender: '',
//     pAddress: '',
//     pMobileNo: '',
// }
// const MyComponentToPrint = React.forwardRef((props, ref) => {
//     return (
//         <div ref={ref}>
//             <h1>{props.data.pid}</h1>
//             <p>{props.data.pName}</p>
//         </div>
//     );
// });
const Addpatients = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const allPatientsList = useSelector(selectAllPatients);
    const [show, setShow] = useState(false);
    const [patientsList, setPatientsList] = useState([]);
    const [patientsFilter, setPatientsFilter] = useState([]);
    const [update, setUpdate] = useState(false)
    const [item, setItems] = useState()
    // const patientMobileNo = useSelector(selectMobileNo)
    // const usertype = useSelector(selectUsertype)
    const [isLoading, setIsLoading] = useState(true)
    const [printContent, setPrintContent] = useState(null);
    // const reversedArray = allPatientsList.slice().reverse();
    const hospitaluid = useSelector(selectUserId)
    const permissions = useSelector(selectpermissions)
    const [userpermissions, setUserpermissions] = useState([]);
    const [firstVisible, setFirstVisible] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [perPageRows, setPerPageRows] = useState(10); // Initial value for rows per page
    const [totalnumData, setTotalNumData] = useState(0); // Initial value for rows per page
    const [currentPage, setCurrentPage] = useState(1);
    const [prev, setPrev] = useState(false);
    const [searchBy, setSearchBy] = useState('');
    const [searchString, setSearchString] = useState('');
    const lastPatientData = useSelector(selectlastPatientData)
    const parentDocRef = db.collection('Patients').doc('fBoxFLrzXexT8WNBzGGh');
    const subcollectionRef = parentDocRef.collection('patients').where('hospitaluid', '==', hospitaluid)
    // const subcollectionRef = parentDocRef.collection('patients').where('hospitaluid', '==', hospitaluid)
    //     .where('deleted', '==', 0);

    let unsubscribe = undefined

    const columns = [
        { name: 'ID', selector: row => row.pid, sortable: true },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Age', selector: row => row.page, width: '100px' },
        { name: 'Gender', selector: row => row.pGender, width: '100px' },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo ? row.pMobileNo : '-' },
        {
            name: 'Action', cell: row => <span className='d-flex justify-content-center'>
                {userpermissions?.code.includes('VIEW_PATIENTS') ? <><button style={{ color: 'skyblue', border: 'none' }} onClick={() => patientHistory(row)}><BsEye size={25} /></button></> : null}
                {userpermissions?.code.includes('EDIT_PATIENTS') ? <><button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button></> : null}
                {userpermissions?.code.includes('DELETE_PATIENTS') ? <> <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
                </> : null}
                {userpermissions?.code.includes('PRINT_PATIENTS') ? <><button onClick={() => handlePrintWithProps(row)} style={{ color: 'skyblue', border: 'none' }} ><AiFillPrinter size={25} /></button>
                </> : null}


            </span>, width: '200px'
        }
    ]

    useEffect(() => {
        const retrivePatientsList = async () => {
            const stockQuery = subcollectionRef;
            retrieveData(stockQuery);
        };
        retrivePatientsList()
        setUserpermissions(permissions?.find(permission => permission.module === "PATIENTS"))
        return () => {
            unsubscribe()
        }
    }, [])


    useEffect(() => {
        setPatientsList([...allPatientsList].reverse())
        setPatientsFilter(allPatientsList)
        setIsLoading(false)
    }, [allPatientsList])


    const retrieveData = (query) => {
        try {
            // let initialSnapshot = true;
            setIsLoading(true)
            unsubscribe = query.onSnapshot((snapshot) => {
                fetchData()
            });
        } catch (error) {
            setIsLoading(false)

            console.error('Error retrieving data:', error);
        }
    };

    const fetchData = async () => {
        await getSubcollectionDataWithoutsnapshot('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, lastPatientData, (data, lastData) => {
            // Handle the updated data in the callback function
            dispatch(FILL_PATIENTS(data))
            dispatch(ADD_LAST_PATIENT_DATA(lastData))
            console.log('Get Patients data with last Data', data, lastData);
        }).catch((error) => {
            console.error('Error:', error);
        })
    }

    const handleClose = () => {
        setShow(false);
        setUpdate(false);
        setItems();
    }

    const handlePrintWithProps = async (items) => {

        setPrintContent(
            <div style={{ width: '800px', marginRight: '50px' }}>
                <div className='card' style={{ border: "2px solid black", padding: '20px', height: 'auto' }}>
                    <div className='row'>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <span><div><b>Case No:-</b></div></span>
                            <span><div>Age /sex: {items.page}/{items.pGender}</div></span>
                            <span><div>Address: {items.pAddress}</div></span>
                            {!items.drName ? null :
                                <span><div>Doctor Name: {items.drName}</div></span>}
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                            <div>
                                <span><div><b>Name: {items.pName} </b></div></span>
                                <span><div>Mobile No: {items.pMobileNo}</div></span>
                                <span><div>Date: {new Date().toISOString().substr(0, 10)}</div></span>
                            </div>

                        </div>
                    </div>
                    <b><hr></hr></b>
                </div>
            </div>
        );


    };
    const handleShow = () => setShow(true);


    const editPatientDetails = (item) => {
        // addDatainsubcollection('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', item)
        // updateDatainSubcollection('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', item)
        // filDatainsubcollection(allPatientsList, 'Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid)
        setItems(item)
        setShow(true)
        setUpdate(true)
    }


    const deletePatientsDetails = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let patient = patientsFilter.filter((item) => item.pid !== item1.pid)
                        try {

                            // await setData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', patient)
                            // await deleteSingltObject('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', item1, 'pid', 'hospitaluid')
                            await deleteDatainSubcollectionPatients('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', item1, 'pid', 'hospitaluid')
                            // .then((updatedData) => {
                            //     dispatch(FILL_PATIENTS(updatedData))
                            //     dispatch(ADD_LAST_PATIENT_DATA(updatedData[updatedData.length - 1]))
                            //     console.log('updatedData[updatedData.length - 1])', updatedData[updatedData.length - 1]);
                            // })
                            //     .catch((error) => {
                            //         console.error('Error updating data:', error);
                            //     });
                            dispatch(DELETE_PATIENTS(item1))
                            toast.success("Deleted Successfully.......")
                        } catch (error) {
                            toast.error(error.message)
                            console.error(error.message);
                        }
                    }
                },
                {
                    label: 'No',
                }
            ]
        });




    }


    const requestSearch = (searchvalue) => {

        if (searchvalue.length < 1) {
            setPatientsList([...allPatientsList].reverse())
            return
        }

        const filteredRows = patientsFilter.filter((row) => {
            const searchString = searchvalue.toLowerCase()
            return row.pid.toString().includes(searchString) ||
                row.pName.toLowerCase().includes(searchString) ||
                row.pMobileNo.includes(searchString);
        });

        setPatientsList(filteredRows)
    }
    const patientHistory = (item) => {
        const itemString = JSON.stringify(item);

        // navigate(`/patients/patientslist/patientshistory`, { state: item })
        navigate(`/patients/patientshistory`, { state: item })
    }
    const reloadData = () => {
        setIsLoading(true)
        getSubcollectionData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, (data) => {
            // Handle the updated data in the callback function
            dispatch(FILL_PATIENTS(data))
            setIsLoading(false)

            console.log('Received real-time data:', data);
        }).catch((error) => {
            setIsLoading(false)

            console.error('Error:', error);
        })
    }

    // const handlePageChange = async (page) => {
    //     if (page < currentPage) {
    //         setPrev(true)
    //         prevPage()
    //         // const one = true
    //         // console.log('i am here');
    //         // retrieveData(one)
    //         setCurrentPage(page);
    //     } else {
    //         setPrev(false)
    //         nextPage()
    //         // const one = false
    //         // retrieveData(one)
    //         setCurrentPage(page);
    //     }
    //     console.log('page', page);

    //     // Perform any additional logic or actions based on the page change
    // };

    // const nextPage = async () => {
    //     setIsLoading(true)
    //     let query = subcollectionRef
    //         .orderBy('timestamp', 'desc')
    //         .limit(perPageRows).startAfter(lastVisible);
    //     retrieveData(query)
    //     setIsLoading(false)

    // };
    // const prevPage = async () => {
    //     setIsLoading(true)
    //     let query = subcollectionRef
    //         .orderBy('timestamp', 'desc')
    //         .limit(perPageRows)
    //         .endBefore(firstVisible).limitToLast(perPageRows);
    //     retrieveData(query)
    //     setIsLoading(false)

    // }
    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
                <div>

                    {/* <DataTable
                        title={"Patients List"}
                        columns={columns}
                        data={patientsList}
                        pagination={true}
                        fixedHeader={true}
                        noHeader={false}
                        persistTableHead
                        actions={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                        highlightOnHover
                        paginationServer={true}
                        subHeader={<div className='d-flex' style={{ justifyContent: 'space-between' }}></div>}
                        subHeaderComponent={<span className='d-flex w-100 justify-content-end'>
                            <select className="form-control mr-2" style={{ height: '40px', fontSize: '18px', width: '15%', marginRight: 10 }} name='searchBy' value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                                <option selected >Search by</option>
                                <option value='Name' selected>Patient Name</option>
                                <option value='MobileNo' selected>Mobile No</option>
                            </select>
                            <input type='search' placeholder='search' className='w-25 form-control' value={searchString} onChange={(e) => { onSearchInput(e.target.value) }} />
                            <button className='btn btn-primary' style={{ width: '10%', marginLeft: 10 }} disabled={!searchBy || !searchString} onClick={requestSearch}>Search</button>
                        </span>}
                        paginationTotalRows={totalnumData}

                        onChangePage={(e) => handlePageChange(e)}
                    /> */}
                    <CommanTable
                        title={"Patients List"}
                        columns={columns}
                        data={patientsList}
                        action={
                            <>
                                <input type='search' placeholder='Search...' className='w-25 form-control' onChange={(e) => requestSearch(e.target.value)} />

                                <>{
                                    userpermissions?.code.includes('ADD_PATIENTS') ? <button className='btn btn-primary' onClick={() => handleShow()}><span>  <BiPlus size={30} /></span></button> : null
                                }
                                </>
                            </>
                        }
                        subHeaderComponent={<>
                            <input type='search' placeholder='Search...' className='w-25 form-control' onChange={(e) => requestSearch(e.target.value)} /></>}
                    />
                </div>
            </>}
        <Addpatientscommanmodel show={show} handleClose={handleClose} data={item} update={update} />
        {/* <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Patients</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form >
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Patient Name:</label>
                        <input type="text" className="form-control" placeholder="Enter patient name" name='pName' value={values.pName} onChange={handleChange} onBlur={handleBlur} />
                        {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Age:</label>
                        <input type="number" className="form-control" placeholder="Enter patient age" name='page' value={values.page} onChange={handleChange} onBlur={handleBlur} />
                        {errors.page && touched.page ? (<p style={{ color: 'red' }}>*{errors.page}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Gender:</label>
                        <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='pGender' defaultValue={values.pGender} onChange={handleChange}>
                            <option >Select Gender</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Others'>Others</option>
                        </select>
                        {errors.pGender && touched.pGender ? (<p style={{ color: 'red' }}>*{errors.pGender}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Address:</label>
                        <input type="text" className="form-control" placeholder="Enter patient address" name='pAddress' value={values.pAddress} onChange={handleChange} onBlur={handleBlur} />
                        {errors.pAddress && touched.pAddress ? (<p style={{ color: 'red' }}>*{errors.pAddress}</p>) : null}
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Mobile No:</label>
                        <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} />
                        {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                    </div>




                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit} >
                    {update ? 'Update Patient' : 'Add Patient'}
                </Button>
            </Modal.Footer>
        </Modal> */}
    </>




}

export default Addpatients;
