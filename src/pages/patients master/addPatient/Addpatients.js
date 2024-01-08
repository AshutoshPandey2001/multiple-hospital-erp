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
        setPatientsList([...allPatientsList].reverse())
        setPatientsFilter(allPatientsList)
        setIsLoading(false)
    }, [allPatientsList])

    useEffect(() => {
        setUserpermissions(permissions?.find(permission => permission.module === "PATIENTS"))
        fetchData()
    }, [])

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
            return row.pid.toString().toLowerCase().includes(searchString) ||
                row.pName.toString().toLowerCase().includes(searchString) ||
                row.pMobileNo.toString().toLowerCase().includes(searchString);
        });

        setPatientsList(filteredRows)
    }
    const patientHistory = (item) => {
        const itemString = JSON.stringify(item);

        // navigate(`/patients/patientslist/patientshistory`, { state: item })
        navigate(`/patients/patientshistory`, { state: item })
    }

    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
                <div>


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

    </>




}

export default Addpatients;
