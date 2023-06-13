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
import { ADD_PATIENTS, DELETE_PATIENTS, EDIT_PATIENTS, selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { selectMobileNo, selectUsertype } from 'src/redux/slice/authSlice';
import CommanTable from 'src/comman/table/CommanTable';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { deleteSingltObject, setData } from 'src/services/firebasedb';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Addpatientscommanmodel from 'src/comman/comman model/Addpatientscommanmodel';
import { AiFillPrinter } from 'react-icons/ai'
import { useReactToPrint } from 'react-to-print';
import ReactToPrint from 'react-to-print';
import PrintButton from 'src/comman/printpageComponents/PrintButton';

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


    const columns = [
        { name: 'ID', selector: row => row.pid, sortable: true },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Age', selector: row => row.page, width: '100px' },
        { name: 'Gender', selector: row => row.pGender, width: '100px' },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        {
            name: 'Action', cell: row => <span className='d-flex justify-content-center'><button style={{ color: 'skyblue', border: 'none' }} onClick={() => patientHistory(row)} ><BsEye size={25} /></button><button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
                <button onClick={() => handlePrintWithProps(row)} style={{ color: 'skyblue', border: 'none' }} ><AiFillPrinter size={25} /></button>

            </span>, width: '200px'
        }
    ]


    useEffect(() => {
        setPatientsList([...allPatientsList].reverse())
        setPatientsFilter(allPatientsList)
        setIsLoading(false)
    }, [allPatientsList])

    // const handlePrint = useReactToPrint({
    //     content: () => <MyComponentToPrint name={'ashu'} />
    // });
    // const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    //     initialValues: initalValues,
    //     validationSchema: addpatientsSchema,
    //     onSubmit: async (Values, action) => {
    //         let timestamp = new Date().getTime();


    //         let patient1 = [...patientsFilter]
    //         if (!update) {
    //             values.pid = Math.floor(Math.random() + timestamp)
    //             const index = patientsFilter.findIndex(obj => obj.pMobileNo === Values.pMobileNo);
    //             if (index === -1) {
    //                 let patient = [...patientsFilter, Values]
    //                 try {
    //                     await setData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', patient)
    //                     dispatch(ADD_PATIENTS(Values))
    //                     action.resetForm()
    //                     setShow(false)
    //                     toast.success("Added Successfully.......");
    //                 } catch (error) {
    //                     toast.error(error.message)
    //                     console.error(error.message)
    //                 }
    //             } else {
    //                 toast.error("This Mobile No already Exist")

    //             }



    //         } else {
    //             let findindex = patient1.findIndex((item) => item.pid === Values.pid);
    //             patient1[findindex] = Values;
    //             try {
    //                 await setData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', patient1)
    //                 dispatch(EDIT_PATIENTS(Values))
    //                 action.resetForm()
    //                 setShow(false)
    //                 setUpdate(false)
    //                 toast.success("Updated Successfully.......");
    //             } catch (error) {
    //                 toast.error(error.message)
    //                 console.error(error.message)
    //             }


    //         }


    //     }
    // });
    const handleClose = () => {
        setShow(false);
        setUpdate(false);
        setItems();
    }
    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    // });
    const handlePrintWithProps = async (items) => {
        console.log('items', items);
        setPrintContent(
            <div style={{ width: '800px', marginRight: '50px' }}>
                <div className='card' style={{ border: "2px solid black", padding: '20px', height: '90vh' }}>
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
                            await deleteSingltObject('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', item1, 'pid', 'hospitaluid')
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
        console.log('searchvalue', searchvalue);
        const filteredRows = patientsFilter.filter((row) => {
            return row.pid.toString().includes(searchvalue.toLowerCase()) || row.pName.toLowerCase().includes(searchvalue.toLowerCase()) || row.pMobileNo.includes(searchvalue);
        });
        if (searchvalue.length < 1) {

            setPatientsList([...allPatientsList].reverse())
        }
        else {
            setPatientsList(filteredRows)
        }
        console.log('filteredRows', filteredRows);

    }

    const patientHistory = (item) => {
        const itemString = JSON.stringify(item);

        navigate(`/patients/patientslist/patientshistory`, { state: item })
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
                        action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={30} /></span></button>}
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
