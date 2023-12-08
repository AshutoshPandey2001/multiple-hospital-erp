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
import { ADD_LAST_MEDICINES, FILL_MEDICINES_STOCK, selectAllMedicines, selectLastMedicine, UPDATE_MEDICINES } from 'src/redux/slice/medicinesMasterSlice';
import { ADD_PATIENTS_MEDICINES, DELETE_PATIENTS_MEDICINES, EDIT_PATIENTS_MEDICINES, selectAllPatientsMedicines } from 'src/redux/slice/patientsMedicinesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addDataincollection, addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, getData, getSubcollectionDataWithoutsnapshotMedicalAndPatients, setData, updateDatainSubcollection, updateDatainSubcollectionMedicalAndPatients, updateDataincollection, updateHospitalProfile, updateSingltObject, uploadArray } from 'src/services/firebasedb';
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
import { db } from 'src/firebaseconfig';
import { debounce } from 'lodash';
import DataTable from 'react-data-table-component';
import { selectreturnmedicinerprevBillNo } from 'src/redux/slice/prevBillNoSlice';
import PrintButtonMedical from 'src/comman/printpageComponents/PrintButtonMedical';
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
                        <span><b>Return Bill No: {state.invoiceuid}</b></span>
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
                            <th>Batch No.</th>
                            <th>Medicine Name</th>
                            <th>Mfrs. Name</th>
                            <th>Exp. Date</th>
                            <th>Rate</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            state.medicines.map((medicine, i) => {
                                return <>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{medicine.batchNo}</td>
                                        <td>{medicine.medname}</td>
                                        <td>{medicine.mfrsName}</td>
                                        <td>{medicine.expireDate}</td>
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

    medicines: [
        {
            medname: '',
            medQty: '',
            medPrice: '',
            meduid: '',
            totalmedPrice: '',
            batchNo: '',
            expireDate: '',
            mfrsName: '',
        }
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
    const lastMedicines = useSelector(selectLastMedicine)
    const [lastVisible, setLastVisible] = useState(null);
    const [perPageRows, setPerPageRows] = useState(10); // Initial value for rows per page
    const [totalnumData, setTotalNumData] = useState(0); // Initial value for rows per page
    const [currentPage, setCurrentPage] = useState(1);
    const [firstVisible, setFirstVisible] = useState(null);
    const [prev, setPrev] = useState(false);
    const prevBillno = useSelector(selectreturnmedicinerprevBillNo)
    const [searchBy, setSearchBy] = useState('');
    const [searchString, setSearchString] = useState('');
    const parentDocRefMedicineStock = db.collection('Medicines').doc('dHFKEhdhbOM4v6WRMb6z');
    const subcollectionRefMedicineStock = parentDocRefMedicineStock.collection('medicines').where('hospitaluid', '==', hospitaluid)
    let unsubscribe = undefined
    const parentDocRefMedicineInvoice = db.collection('ReturnMedicine').doc('lGxMW7T2f7Dsb93A19qa');
    const subcollectionRefMedicineInvoice = parentDocRefMedicineInvoice.collection('returnMedicine').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);
    let unsub = undefined


    const columns = [
        // { name: 'ID', selector: row => row.pid, sortable: true },
        { name: 'Date', selector: row => row.returnDate, sortable: true },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        // { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        { name: 'Total Refund Amount', selector: row => row.allMedTotalprice },
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

        setMedList([...medicineList])
        // medList = [...medicineList]
        setIsLoading(false)
    }, [medicineList])

    useEffect(() => {
        const fetchData = async () => {
            retrieveData(subcollectionRefMedicineStock);
            const invoiceQuery = subcollectionRefMedicineInvoice
                .orderBy('timestamp', 'desc')
                .limit(perPageRows);
            debouncedRetrieveData(invoiceQuery);
            totalNumberOfData()
        };

        fetchData();

        return () => {
            unsubscribe();
            unsub();
        };
    }, []);

    const totalNumberOfData = async () => {
        try {
            unsub = db
                .collection('ReturnMedicinePatientsCount')
                .where('hospitaluid', '==', hospitaluid)
                .onSnapshot(async (snapshot) => {
                    let count = 0;

                    if (!snapshot.empty) {
                        const newData = snapshot.docs[0].data();
                        count = newData.count;
                        setTotalNumData(count);
                        console.log('res.data().count', count);
                    } else {
                        const invoiceSnapshot = await subcollectionRefMedicineInvoice.get();
                        const totalDataCount = invoiceSnapshot.size;
                        await addDataincollection('ReturnMedicinePatientsCount', { hospitaluid: hospitaluid, count: totalDataCount });
                        console.log('No documents found in the snapshot.');
                    }
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const retrieveDataMedcineInvoice = (query) => {
        try {
            setIsLoading(true);
            unsub = query.onSnapshot((snapshot) => {
                const newData = snapshot.docs.map((doc) => doc.data());
                setPatientsReturnMedicineList(newData);

                const snapshotSize = snapshot.size;
                const lastVisibleDoc = snapshot.docs[snapshotSize - 1];

                setLastVisible(lastVisibleDoc);
                setFirstVisible(snapshot.docs[0]);
                setTotalNumData(snapshotSize);

                setIsLoading(false);
            });

            return () => {
                unsub();
            };
        } catch (error) {
            setIsLoading(false);
            console.error('Error retrieving data:', error);
        }
    };

    const debouncedRetrieveData = debounce(retrieveDataMedcineInvoice, 500);

    const retrieveData = (query) => {
        try {
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
        await getSubcollectionDataWithoutsnapshotMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', hospitaluid, lastMedicines, (data, lastData) => {
            dispatch(FILL_MEDICINES_STOCK(data))
            dispatch(ADD_LAST_MEDICINES(lastData))
            console.log('Get Medicines with last Data', data, lastData);
            setIsLoading(false)
        }).catch((error) => {
            console.error('Error:', error);
        })
    }

    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: returnpadtientmedicineSchema,
        onSubmit: async (Values, action) => {
            console.log('before', medList, values);
            let medd = [...patientsReturnMedicineList]
            // const date = new Date(values.returnDate); // Convert input value to Date object
            // const formattedDate = date.toLocaleDateString("en-GB").split('/').join('-');
            values.returnDate = values.returnDate ? ddMMyyyy(values.returnDate) : values.returnDate;
            if (!update) {
                values.invoiceuid = prevBillno + 1;
                values.returnuid = Math.floor(717 + Math.random() * 6574)
                setPatientsReturnMedicineFilter([...patientsReturnMedicineFilter, Values])
                let med = [...patientsReturnMedicineFilter, Values]
                await Values.medicines.map((item) => updatStock(item))
                console.log('after', medList, med);

                try {
                    await addDatainsubcollection('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', values)
                    await updateHospitalProfile('lastReturnMedicineBillNo', '4I3NWbYnR86xYlxbSHp4', 'lastReturnMedicineBillNo', { hospitaluid: hospitaluid, billNo: values.invoiceuid })
                    await updateDataincollection('ReturnMedicinePatientsCount', { hospitaluid: hospitaluid, count: totalnumData + 1 })

                    // await setData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'count', totalnumData + 1)
                    setTotalNumData(totalnumData + 1)
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
                    await updateDatainSubcollection('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', Values, 'returnuid', 'hospitaluid')

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
                    totalmedPrice: '',
                    batchNo: '',
                    expireDate: '',
                    mfrsName: '',
                }
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
        await updateDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
    }
    const updateStockonUpdate = async (item) => {
        const findIndex = medList.findIndex((item1) => item1.medicineuid === item.meduid)
        let newObj = { ...medList[findIndex], availableStock: medList[findIndex].availableStock - parseInt(item.medQty) }
        await updateDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
        // medList[findIndex] = newObj;
    }
    const generateInvoice = (item) => {
        // filDatainsubcollection(allreturnPatientsMedicines, 'ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine')
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
                            await updateDataincollection('ReturnMedicinePatientsCount', { hospitaluid: hospitaluid, count: totalnumData - 1 })
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

    const totalmedprice = (e, medicine) => {
        medicine.medQty = e;
        medicine.totalmedPrice = medicine.medPrice * e;
        values.allMedTotalprice = values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0)
        setAutofocus(!autofocus)

    }
    const handleOnSelect = (item) => {

        formik.setFieldValue('pid', item.pid);
        formik.setFieldValue('pName', item.pName);
        formik.setFieldValue('pMobileNo', item.pMobileNo);
        formik.setFieldValue('pGender', item.pGender);
        formik.setFieldValue('page', item.page);
        formik.setFieldValue('pAddress', item.pAddress);
        formik.setFieldValue('hospitaluid', item.hospitaluid);

    };

    const selectMedicine = (item, med) => {
        med.medname = item.medicineName;
        med.medPrice = item.medicinePrice;
        med.meduid = item.medicineuid;
        med.expireDate = ddMMyyyy(item.expireDate);
        med.mfrsName = item.mfrsName;
        med.batchNo = item.batchNumber
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

    const handlePageChange = async (page) => {
        if (page < currentPage) {
            setPrev(true)
            prevPage()
            // const one = true
            // console.log('i am here');
            // retrieveData(one)
            setCurrentPage(page);
        } else {
            setPrev(false)
            nextPage()
            // const one = false
            // retrieveData(one)
            setCurrentPage(page);
        }
        console.log('page', page);

        // Perform any additional logic or actions based on the page change
    };
    const requestSearch = () => {
        // const searchString = searchvalue.toLowerCase();
        // console.log(searchString, 'searchString');
        if (searchString.length) {
            var query = subcollectionRefMedicineInvoice

            // query = query
            //     .where('hospitaluid', '==', hospitaluid)
            if (searchBy === 'Name') {
                query = query
                    .where('pName', '>=', searchString).
                    where('pName', '<=', searchString + "\uf8ff")
            } else if (searchBy === 'MobileNo') {
                query = query
                    .where('pMobileNo', '>=', searchString)
                    .where('pMobileNo', '<=', searchString + "\uf8ff");
            }


            query = query.limit(perPageRows);
            debouncedRetrieveData(query)
            query.get().then(snapshot => {
                // console.log(snapshot);
                const totalDataCount = snapshot.size;
                setTotalNumData(totalDataCount)
                console.log('Total data count:', totalDataCount);
            }).catch(error => {
                console.error('Error retrieving data:', error);
            });
        }



        // if (searchvalue.length < 1) {
        //     setOpdPatientList([...allopdPatientList].reverse())
        //     return
        // }

        // const filteredRows = opdPatientfilter.filter((row) => {
        //     const searchString = searchvalue.toLowerCase()
        //     return row.pid.toString().includes(searchString) ||
        //         row.pName.toLowerCase().includes(searchString) ||
        //         row.pMobileNo.includes(searchString);
        // });

        // setOpdPatientList(filteredRows)
    }

    const onSearchInput = (value) => {
        setSearchString(value)
        if (!value.length) {
            setIsLoading(true)
            setSearchString('')

            let query = subcollectionRefMedicineInvoice
                .orderBy('timestamp', 'desc')
                .limit(perPageRows)
            debouncedRetrieveData(query)
            setIsLoading(false)
            totalNumberOfData()
        }
    }
    const nextPage = async () => {
        setIsLoading(true)
        let query = subcollectionRefMedicineInvoice
            .orderBy('timestamp', 'desc')
            .limit(perPageRows).startAfter(lastVisible);
        debouncedRetrieveData(query)
        setIsLoading(false)

    };
    const prevPage = async () => {
        setIsLoading(true)
        let query = subcollectionRefMedicineInvoice
            .orderBy('timestamp', 'desc')
            .limit(perPageRows)
            .endBefore(firstVisible).limitToLast(perPageRows);
        debouncedRetrieveData(query)
        setIsLoading(false)

    }

    return <>

        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButtonMedical content={printContent} />}</div>
                <DataTable
                    title={"Return Medicines invoice"}
                    columns={columns}
                    data={patientsReturnMedicineList}
                    pagination={true}
                    fixedHeader={true}
                    noHeader={false}
                    persistTableHead
                    actions={
                        <>
                            <span className='d-flex w-100 justify-content-end'>
                                <select className="form-control mr-2" style={{ height: '40px', fontSize: '18px', width: '15%', marginRight: 10 }} name='searchBy' value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                                    <option selected >Search by</option>
                                    <option value='Name' selected>Patient Name</option>
                                    <option value='MobileNo' selected>Mobile No</option>
                                </select>
                                <input type='search' placeholder='search' className='w-25 form-control' value={searchString} onChange={(e) => { onSearchInput(e.target.value) }} />
                                <button className='btn btn-primary' style={{ width: '10%', marginLeft: 10 }} disabled={!searchBy || !searchString} onClick={requestSearch}>Search</button>
                            </span>
                            <button className='btn btn-primary' onClick={() => handleShow()}><span>  <BiPlus size={25} /></span></button>
                        </>
                    }
                    highlightOnHover
                    paginationServer={true}
                    paginationTotalRows={totalnumData}
                    onChangePage={(e) => handlePageChange(e)}
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
                                            onClick={() => push({ medname: '', medPrice: '', medQty: '', meduid: '', totalmedPrice: '', batchNo: '', mfrsName: '', expireDate: '' })}
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
        </Modal >
    </>
}

export default MedicineReturn;
