/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { FieldArray, useFormik, FormikProvider } from 'formik';
import { padtientmedicineSchema, returnpadtientmedicineSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { ImCross } from 'react-icons/im'
import { AiFillDelete } from 'react-icons/ai'
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { selectAllMedicines, UPDATE_MEDICINES } from 'src/redux/slice/medicinesMasterSlice';
import { ADD_PATIENTS_MEDICINES, DELETE_PATIENTS_MEDICINES, EDIT_PATIENTS_MEDICINES, selectAllPatientsMedicines } from 'src/redux/slice/patientsMedicinesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, setData, updateDatainSubcollection, updateSingltObject, uploadArray } from 'src/services/firebasedb';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { AiFillPrinter } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import { BsEye } from 'react-icons/bs'
import { ADD_RETURN_PATIENTS_MEDICINES, DELETE_RETURN_PATIENTS_MEDICINES, EDIT_RETURN_PATIENTS_MEDICINES, selectAllreturnPatientsMedicines } from 'src/redux/slice/returnMedicineslice';
import { TfiArrowCircleLeft } from 'react-icons/tfi'
import SearchAutocomplete from 'src/comman/searchAutocomplete/SearchAutocomplete';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { ddMMyyyy, yyyyMMdd } from 'src/services/dateFormate';
import { selectUserId } from 'src/redux/slice/authSlice';
import { TfiReload } from 'react-icons/tfi'

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center'> <h3>Invoice</h3></div>
            <b><hr></hr></b>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6'>
                    <span><b>Patient id : {state.pid}</b></span>
                    <span><div>Name: {state.pName} </div></span>
                    <span><div>Address: {state.pAddress}</div></span>
                    <span><div>Date: {state.returnDate} </div></span>

                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <span><b>Return Bill No: {state.returnuid}</b></span>
                        <span><div>Age /sex: {state.page} / {state.pGender}</div></span>
                        <span><div>Mobile No: {state.pMobileNo}</div></span>

                    </div>

                </div>
            </div>

            <b><hr></hr></b>
            <div className='row text-center'> <h3>Medicine Summary</h3></div>
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
let initalValues = {
    pid: '',
    pName: '',
    pMobileNo: '',
    pGender: '',
    page: '',
    pAddress: '',
    returnDate: '',
    // paymentStatus: '',
    // medicineDate: '',
    medicines: [
        {
            medname: '',
            medQty: '',
            medPrice: '',
            meduid: '',
            totalmedPrice: ''
        },
    ],
    allMedTotalprice: '',
    returnuid: '',
    hospitaluid: ''

}
const MedicineReturn = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [patientsReturnMedicineList, setPatientsReturnMedicineList] = useState([]);
    const [patientsReturnMedicineFilter, setPatientsReturnMedicineFilter] = useState([]);
    const [autofocus, setAutofocus] = useState(false)
    const dispatch = useDispatch()
    const [update, setUpdate] = useState(false)
    const allPatients = useSelector(selectAllPatients)
    const medicineList = useSelector(selectAllMedicines)
    const allPatientsMedicines = useSelector(selectAllPatientsMedicines)
    const allreturnPatientsMedicines = useSelector(selectAllreturnPatientsMedicines)
    const [isLoading, setIsLoading] = useState(true)
    const [stock, setStock] = useState()
    const [stockerror, setStockerror] = useState(false)
    const [medList, setMedList] = useState([])
    const [printContent, setPrintContent] = useState(null);
    const hospitaluid = useSelector(selectUserId)

    // let medList = medicineList
    // const reversedArray = allPatientsMedicines.slice().reverse();

    const columns = [
        { name: 'ID', selector: row => row.pid, sortable: true },
        { name: 'Date', selector: row => row.returnDate, sortable: true },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        { name: 'Total Amount Return', selector: row => row.allMedTotalprice },
        {
            name: 'Action', cell: row => <span>
                {/* <button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button> */}
                <button onClick={() => generateInvoice(row)} style={{ color: 'skyblue', border: 'none' }}  ><AiFillPrinter size={22} /></button>
                <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
            </span>
        }
    ]

    const handleClose = () => {
        formik.resetForm();
        setShow(false);
        clearForm()
        setUpdate(false)
    }
    const handleShow = () => {
        setShow(true)
        formik.setFieldValue('returnDate', new Date().toISOString().substr(0, 10));
    };

    useEffect(() => {
        setPatientsReturnMedicineList([...allreturnPatientsMedicines].reverse())
        setPatientsReturnMedicineFilter(allreturnPatientsMedicines)
        setMedList([...medicineList])
        setIsLoading(false)
    }, [allreturnPatientsMedicines, medicineList])


    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: returnpadtientmedicineSchema,
        onSubmit: async (Values, action) => {
            console.log('before', medList, values);
            let medd = [...patientsReturnMedicineFilter]
            // const date = new Date(values.returnDate); // Convert input value to Date object
            // const formattedDate = date.toLocaleDateString("en-GB").split('/').join('-');
            values.returnDate = values.returnDate ? ddMMyyyy(values.returnDate) : values.returnDate;
            if (!update) {
                values.returnuid = Math.floor(717 + Math.random() * 6574)
                setPatientsReturnMedicineFilter([...patientsReturnMedicineFilter, Values])
                let med = [...patientsReturnMedicineFilter, Values]
                await Values.medicines.map((item) => updatStock(item))
                console.log('after', medList, med);

                try {
                    // await addSingltObject('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', values)
                    await addDatainsubcollection('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', values)
                    // await addSingltObject('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', med)
                    // await setData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', med)
                    // dispatch(ADD_RETURN_PATIENTS_MEDICINES(Values))
                    // await setData("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', medList)
                    // await uploadArray("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', medList, 'medicineuid', 'hospitaluid')
                    // dispatch(UPDATE_MEDICINES(medList))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    toast.success("Added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {
                let findindex = medd.findIndex((item) => item.returnuid === Values.returnuid);
                await medd[findindex].medicines.map((item) => updateStockonUpdate(item))
                medd[findindex] = Values;

                try {
                    // await setTimeout(() => {
                    // await updateSingltObject('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', Values, 'returnuid', 'hospitaluid')
                    await updateDatainSubcollection('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', Values, 'returnuid', 'hospitaluid')

                    // setData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', medd)
                    // dispatch(EDIT_RETURN_PATIENTS_MEDICINES(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Updated Successfully.......");
                    // }, 1000)
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            }

        }
    })
    const {
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
    } = formik;

    const clearForm = () => {
        formik.setValues({
            pid: '',
            pName: '',
            pMobileNo: '',
            pGender: '',
            page: '',
            pAddress: '',
            returnDate: '',
            // paymentStatus: '',
            // medicineDate: '',
            medicines: [
                {
                    medname: '',
                    medQty: '',
                    medPrice: '',
                    meduid: '',
                    totalmedPrice: ''
                },
            ],
            allMedTotalprice: '',
            returnuid: '',
            hospitaluid: ''

        });
    };
    const updatStock = async (item) => {
        const findIndex = medList.findIndex((item1) => item1.medicineuid === item.meduid)
        let newObj = { ...medList[findIndex], availableStock: medList[findIndex].availableStock + Number(item.medQty) }
        medList[findIndex] = newObj;
        await updateDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
    }
    const updateStockonUpdate = async (item) => {
        const findIndex = medList.findIndex((item1) => item1.medicineuid === item.meduid)
        let newObj = { ...medList[findIndex], availableStock: medList[findIndex].availableStock - parseInt(item.medQty) }
        await updateDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
        // medList[findIndex] = newObj;
    }
    const generateInvoice = (item) => {
        filDatainsubcollection(allreturnPatientsMedicines, 'ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine')
        setPrintContent(<PrintComponent data={{
            data1: {
                ...item,
            }
        }} />)

        // navigate('/medical/medicinereturn/returnmedicineinvoice', { state: item })
    }
    const editPatientDetails = (item) => {
        values.returnuid = item.returnuid;
        values.pid = item.pid;
        values.pName = item.pName;
        values.page = item.page;
        values.pGender = item.pGender;
        values.pAddress = item.pAddress;
        values.returnDate = yyyyMMdd(item.returnDate);
        values.pMobileNo = item.pMobileNo;
        values.paymentStatus = item.paymentStatus;
        values.medicines = item.medicines;
        values.allMedTotalprice = item.allMedTotalprice;
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
                        let med = patientsReturnMedicineFilter.filter((item) => item.returnuid !== item1.returnuid);
                        try {
                            // await deleteSingltObject('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', item1, 'returnuid', 'hospitaluid')
                            await deleteDatainSubcollection('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', item1, 'returnuid', 'hospitaluid')
                            await item1.medicines.map((item) => updateStockonUpdate(item))
                            // await setData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', med)
                            // dispatch(DELETE_RETURN_PATIENTS_MEDICINES(item1))
                            toast.success("Deleted Successfully.......");
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
        const filteredRows = patientsReturnMedicineFilter.filter((row) => {
            return row.pid.toString().includes(searchvalue.toLowerCase()) || row.pName.toLowerCase().includes(searchvalue.toLowerCase()) || row.pMobileNo.includes(searchvalue);
        });
        if (searchvalue.length < 1) {

            setPatientsReturnMedicineList([...allreturnPatientsMedicines].reverse())
        }
        else {

            setPatientsReturnMedicineList(filteredRows)
        }
    }
    const totalmedprice = (e, medicine) => {
        medicine.medQty = e;
        medicine.totalmedPrice = medicine.medPrice * e;
        values.allMedTotalprice = values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0)
        setAutofocus(!autofocus)

    }
    const handleOnSelect = (item) => {
        // values.pid = item.pid;
        // values.pName = item.pName;
        // values.pMobileNo = item.pMobileNo;
        // values.pGender = item.pGender;
        // values.page = item.page;
        // values.pAddress = item.pAddress;
        // setAutofocus(!autofocus)
        formik.setFieldValue('pid', item.pid);
        formik.setFieldValue('pName', item.pName);
        formik.setFieldValue('pMobileNo', item.pMobileNo);
        formik.setFieldValue('pGender', item.pGender);
        formik.setFieldValue('page', item.page);
        formik.setFieldValue('pAddress', item.pAddress);
        formik.setFieldValue('hospitaluid', item.hospitaluid);

    };
    const handleOnSelectmobile = (item) => {
        values.pid = item.pid;
        values.pName = item.pName;
        values.pMobileNo = item.pMobileNo;
        values.pGender = item.pGender;
        values.page = item.page;
        values.pAddress = item.pAddress;
        setAutofocus(!autofocus)

    };
    const handleOnSelectName = (item) => {
        values.pid = item.pid;
        values.pName = item.pName;
        values.pMobileNo = item.pMobileNo;
        values.pGender = item.pGender;
        values.page = item.page;
        values.pAddress = item.pAddress;
        setAutofocus(!autofocus)

    };
    const selectMedicine = (item, med) => {
        med.medname = item.medicineName;
        med.medPrice = item.medicinePrice;
        med.meduid = item.medicineuid;
        setStock(item.availableStock)
        setAutofocus(!autofocus)
    }
    const handleClear = () => {
        clearForm()

    }
    const removeMedicine = async (indexToRemove) => {
        values.medicines = values.medicines.filter((_, index) => index !== indexToRemove);
        formik.setFieldValue('allMedTotalprice', await values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0));

        // values.allMedTotalprice = await values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0);
        setAutofocus(!autofocus);
    }
    return <>

        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>

                <CommanTable
                    title={"Return Medicines invoice "}
                    columns={columns}
                    data={patientsReturnMedicineList}
                    action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                    subHeaderComponent={<>
                        <input type='search' placeholder='search' className='w-25 form-control' onChange={(e) => requestSearch(e.target.value)} /></>}
                />
            </>
        }
        <Modal show={show} onHide={handleClose} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>Return Medicine</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormikProvider value={formik}>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-lg-6'>
                                {
                                    update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                        <input type="text" className="form-control" placeholder="Enter patient id" name='pid' value={values.pid} onChange={handleChange} onBlur={handleBlur} readOnly />
                                        {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}
                                    </div> :
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                            <SearchAutocomplete
                                                allPatients={allPatients}
                                                handleOnSelect={handleOnSelect}
                                                inputsearch={values.pid}
                                                placeholder={'Enter Patients id'}
                                                handleClear={handleClear}
                                                keyforSearch={"pid"}
                                                style={{
                                                    height: '36px',
                                                    display: 'block',
                                                    width: '100%',
                                                    borderRadius: "0.375rem",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "none",
                                                    padding: '0.375rem 0.75rem',
                                                    backgroundClip: 'padding-box',
                                                    hoverBackgroundColor: "lightgray",
                                                    color: '#212529',
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5',
                                                    fontFamily: "inherit",
                                                    iconColor: "#212529",
                                                    fontWeight: "400",
                                                    lineColor: "lightgray",
                                                    placeholderColor: "#212529",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    appearance: 'none',
                                                    zIndex: 2,
                                                    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                                }} />
                                            {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}

                                        </div>
                                }
                            </div>
                            <div className='col-lg-6'>
                                {update || values.pMobileNo ?
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Mobile No<b style={{ color: 'red' }}>*</b>:</label>
                                        <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} readOnly />
                                        {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                                    </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Mobile No<b style={{ color: 'red' }}>*</b>: </label>
                                        <SearchAutocomplete
                                            allPatients={allPatients}
                                            handleOnSelect={handleOnSelect}
                                            inputsearch={values.pMobileNo}
                                            placeholder={'Enter Mobile No'}
                                            handleClear={handleClear}
                                            keyforSearch={"pMobileNo"}
                                            style={{
                                                height: '36px',
                                                display: 'block',
                                                width: '100%',
                                                borderRadius: "0.375rem",
                                                backgroundColor: "#fff",
                                                boxShadow: "none",
                                                padding: '0.375rem 0.75rem',
                                                backgroundClip: 'padding-box',
                                                hoverBackgroundColor: "lightgray",
                                                color: '#212529',
                                                fontSize: '1rem',
                                                lineHeight: '1.5',
                                                fontFamily: "inherit",
                                                iconColor: "#212529",
                                                fontWeight: "400",
                                                lineColor: "lightgray",
                                                placeholderColor: "#212529",
                                                clearIconMargin: "3px 8px 0 0",
                                                appearance: 'none',
                                                zIndex: 2,
                                                transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                            }} />
                                        {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}

                                    </div>
                                }
                            </div>

                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                {update || values.pName ?
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Patient Name<b style={{ color: 'red' }}>*</b>:</label>
                                        <input name='pName'
                                            placeholder="Enter Patient Name"
                                            type="text" className="form-control" onChange={handleChange} defaultValue={values.pName} readOnly />
                                        {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                    </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Patient Name<b style={{ color: 'red' }}>*</b>: </label>
                                        <SearchAutocomplete
                                            allPatients={allPatients}
                                            handleOnSelect={handleOnSelect}
                                            inputsearch={values.pName}
                                            placeholder={'Enter Patient Name'}
                                            handleClear={handleClear}
                                            keyforSearch={"pName"}
                                            style={{
                                                height: '36px',
                                                display: 'block',
                                                width: '100%',
                                                borderRadius: "0.375rem",
                                                backgroundColor: "#fff",
                                                boxShadow: "none",
                                                padding: '0.375rem 0.75rem',
                                                backgroundClip: 'padding-box',
                                                hoverBackgroundColor: "lightgray",
                                                color: '#212529',
                                                fontSize: '1rem',
                                                lineHeight: '1.5',
                                                fontFamily: "inherit",
                                                iconColor: "#212529",
                                                fontWeight: "400",
                                                lineColor: "lightgray",
                                                placeholderColor: "#212529",
                                                clearIconMargin: "3px 8px 0 0",
                                                appearance: 'none',
                                                zIndex: 1,
                                                transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                            }} />
                                        {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                    </div>
                                }

                            </div>
                            {/* <div className='col-lg-4'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Medicine Date:</label>
                                    <input name='medicineDate'
                                        placeholder="Enter Date"
                                        type="date" className="form-control" onChange={handleChange} defaultValue={values.medicineDate} />
                                    {errors.medicineDate && touched.medicineDate ? (<p style={{ color: 'red' }}>*{errors.medicineDate}</p>) : null}

                                </div>
                            </div> */}
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Return Date<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='returnDate'
                                        placeholder="Enter Date"
                                        type="date" className="form-control" onChange={handleChange} defaultValue={values.returnDate} />
                                    {errors.returnDate && touched.returnDate ? (<p style={{ color: 'red' }}>*{errors.returnDate}</p>) : null}

                                </div>
                            </div>
                        </div>
                        <FieldArray name="medicines">
                            {({ insert, remove, push }) => (
                                <div>
                                    {values.medicines?.length > 0 &&
                                        values.medicines.map((medicine, index) => (
                                            <div className="card" key={index} style={{ padding: ' 0 10px 10px 10px', marginTop: '20px' }}>
                                                <div className='d-flex justify-content-end'>
                                                    <span onClick={() => removeMedicine(index)}><ImCross /></span>

                                                </div>
                                                <div className='row'>
                                                    <div className='col-lg-4'>
                                                        <div className="form-group">
                                                            <label htmlFor={`medicines.${index}.meduid`}>Medicin Name<b style={{ color: 'red' }}>*</b>:</label>
                                                            <SearchAutocomplete
                                                                allPatients={medicineList}
                                                                handleOnSelect={(e) => selectMedicine(e, medicine)}
                                                                inputsearch={medicine.medname}
                                                                placeholder={'Enter Medicine Name'}
                                                                keyforSearch={"medicineName"}
                                                                style={{
                                                                    height: '36px',
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    borderRadius: "0.375rem",
                                                                    backgroundColor: "#fff",
                                                                    boxShadow: "none",
                                                                    padding: '0.375rem 0.75rem',
                                                                    backgroundClip: 'padding-box',
                                                                    hoverBackgroundColor: "lightgray",
                                                                    color: '#212529',
                                                                    fontSize: '1rem',
                                                                    lineHeight: '1.5',
                                                                    fontFamily: "inherit",
                                                                    iconColor: "#212529",
                                                                    fontWeight: "400",
                                                                    lineColor: "lightgray",
                                                                    placeholderColor: "#212529",
                                                                    clearIconMargin: "3px 8px 0 0",
                                                                    appearance: 'none',
                                                                    zIndex: 0,
                                                                    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                                                }} />
                                                            {errors.medicines && errors.medicines[index] && errors.medicines[index].meduid && touched.medicines && touched.medicines[index] && touched.medicines[index].meduid ? (
                                                                <p style={{ color: 'red' }}>*{errors.medicines[index].meduid}</p>) : null}

                                                        </div>
                                                    </div>
                                                    {/* <div className='col-lg-3'>
                                                        <div className="form-group">
                                                            <label htmlFor={`medicines.${index}.medicineFormula`}>Medicin  Formula</label>
                                                            <SearchAutocomplete
                                                                allPatients={medicineList}
                                                                handleOnSelect={(e) => selectMedicine(e, medicine)}
                                                                inputsearch={medicine.medname}
                                                                placeholder={'Enter Medicine Formula'}
                                                                keyforSearch={"medicineFormula"} />
                                                            {errors.medicines && errors.medicines[index] && errors.medicines[index].medicineFormula && touched.medicines && touched.medicines[index] && touched.medicines[index].medicineFormula ? (
                                                                <p style={{ color: 'red' }}>*{errors.medicines[index].medicineFormula}</p>) : null}

                                                        </div>
                                                    </div> */}
                                                    <div className='col-lg-4'>
                                                        <div className="form-group">
                                                            <label htmlFor={`medicines.${index}.medPrice`}>Price<b style={{ color: 'red' }}>*</b>:</label>
                                                            <input name={`medicines.${index}.medPrice`}
                                                                placeholder="Enter Price"
                                                                type="number" className="form-control" value={medicine.medPrice} onChange={handleChange} readOnly />
                                                            {errors.medicines && errors.medicines[index] && errors.medicines[index].medPrice && touched.medicines && touched.medicines[index] && touched.medicines[index].medPrice ? (
                                                                <p style={{ color: 'red' }}>*{errors.medicines[index].medPrice}</p>) : null}
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4'>
                                                        <div className="form-group">
                                                            <label htmlFor={`medicines.${index}.medQty`}>Qty<b style={{ color: 'red' }}>*</b>:</label>
                                                            <input name={`medicines.${index}.medQty`}
                                                                placeholder="Enter Qty"
                                                                type="number" className="form-control" value={medicine.medQty} onChange={(e) => totalmedprice(e.target.value, medicine)} required min='1' max='5'
                                                            />
                                                            {errors.medicines && errors.medicines[index] && errors.medicines[index].medQty && touched.medicines && touched.medicines[index] && touched.medicines[index].medQty ? (
                                                                <p style={{ color: 'red' }}>*{errors.medicines[index].medQty}</p>) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    {/* {stockerror ? <p style={{ color: 'red' }} >* You Have only {stock} Quantity </p> : null} */}

                                    <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                        <button
                                            type="button"
                                            className='btn btn-success'
                                            onClick={() => push({ medname: '', medPrice: '', medQty: '', meduid: '', totalmedPrice: '' })}
                                        >
                                            <BiPlus size={25} />  Add Medicine
                                        </button>
                                    </div>


                                </div>
                            )}
                        </FieldArray>

                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Total Amount<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='allMedTotalprice'
                                        placeholder="Enter Total Amount"
                                        type="number" className="form-control" defaultValue={values.allMedTotalprice} />
                                    {errors.allMedTotalprice && touched.allMedTotalprice ? (<p style={{ color: 'red' }}>*{errors.allMedTotalprice}</p>) : null}

                                </div>
                            </div>
                            {/* <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Payment Status:</label>
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='paymentStatus' defaultValue={values.paymentStatus} onChange={handleChange}>
                                        <option >Select Payment Status</option>
                                        <option value='Complete'>Complete</option>
                                        <option value='Panding'>Panding</option>
                                    </select>
                                    {errors.paymentStatus && touched.paymentStatus ? (<p style={{ color: 'red' }}>*{errors.paymentStatus}</p>) : null}

                                </div>
                            </div> */}
                        </div>

                    </form>
                </FormikProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit} >
                    {update ? 'Update' : 'Submit'}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default MedicineReturn;