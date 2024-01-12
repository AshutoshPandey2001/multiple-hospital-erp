/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FieldArray, useFormik, FormikProvider } from 'formik';
import { padtientmedicineSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { ImCross } from 'react-icons/im'
import { AiFillDelete } from 'react-icons/ai'
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { ADD_LAST_PATIENT_DATA, FILL_PATIENTS, selectAllPatients, selectlastPatientData } from 'src/redux/slice/patientMasterslice';
import { ADD_LAST_MEDICINES, FILL_MEDICINES_STOCK, selectAllMedicines, selectLastMedicine, UPDATE_MEDICINES } from 'src/redux/slice/medicinesMasterSlice';
import { ADD_PATIENTS_MEDICINES, DELETE_PATIENTS_MEDICINES, EDIT_PATIENTS_MEDICINES, selectAllPatientsMedicines } from 'src/redux/slice/patientsMedicinesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addDataincollection, updateDataInSubcollectionMedinvoice, getSubcollectionDataWithoutsnapshot, getSubcollectionDataWithoutsnapshotPatients, addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, getData, getSubcollectionDataWithoutsnapshotMedicalAndPatients, multimedicineStockUpdate, setData, updateDatainSubcollection, updateDatainSubcollectionMedicalAndPatients, updateDataincollection, updateSingltObject, uploadArray } from 'src/services/firebasedb';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { AiFillPrinter } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import { BsEye } from 'react-icons/bs'
import SearchAutocomplete from 'src/comman/searchAutocomplete/SearchAutocomplete';
import { ddMMyyyy, yyyyMMdd } from 'src/services/dateFormate';
import Table from 'react-bootstrap/Table';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { selectUserId } from 'src/redux/slice/authSlice';
import { TfiReload } from 'react-icons/tfi'
import { db } from 'src/firebaseconfig';
import { debounce } from 'lodash';
import DataTable from 'react-data-table-component';
import billingicon from 'src/assets/images/billing-icon.png'
import PrintButtonMedical from 'src/comman/printpageComponents/PrintButtonMedical';
import { selectAllDr } from 'src/redux/slice/doctorsSlice';
import Barcode from 'react-barcode';
import { selectLicenceNumber, selectMedicalAddress, selectMedicalContactnumber, selectMedicalName } from 'src/redux/slice/medicalProfileSlice';

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px' }} >
            <div >
                <div style={{ marginRight: -3, marginBottom: '-20px' }}>
                    <Table bordered border={4}  >
                        <thead style={{ border: '1px solid black' }}>
                            <tr style={{ padding: 2, border: '1px solid black' }}>
                                <th style={{ padding: 2 }}>#</th>
                                <th style={{ padding: 2 }}>Batch No.</th>
                                <th style={{ padding: 2 }}>Medicine Name</th>
                                <th style={{ padding: 2 }}>Mfrs. Name</th>
                                <th style={{ padding: 2 }}>Exp. Date</th>
                                <th style={{ padding: 2 }}>Rate</th>
                                <th style={{ padding: 2 }}>Qty</th>
                                <th style={{ padding: 2 }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                state.medicines.map((medicine, i) => {
                                    return <>
                                        <tr key={i} style={{ padding: 1 }}>
                                            <td style={{ padding: 1 }}>{i + 1}</td>
                                            <td style={{ padding: 1 }}>{medicine.batchNo}</td>
                                            <td style={{ padding: 1 }}>{medicine.medname}{medicine.medType && `-${medicine.medType}`}</td>
                                            <td style={{ padding: 1 }}>{medicine.mfrsName}</td>
                                            <td style={{ padding: 1 }}>{medicine.expireDate}</td>
                                            <td style={{ padding: 1 }}>{medicine.medPrice.toFixed(2)}</td>
                                            <td style={{ padding: 1 }}>{Number(medicine.medQty).toFixed(2)}</td>
                                            <td style={{ padding: 1 }}>{medicine.totalmedPrice.toFixed(2)}</td>
                                        </tr>
                                    </>
                                })
                            }
                            <tr style={{ padding: 1 }}>
                                <td style={{ padding: 1 }} colSpan={7}>Sub Total</td>
                                <td style={{ padding: 1 }}>{state.allMedTotalprice.toFixed(2)}</td>
                            </tr>
                            {
                                state.cgstValue === 0 ?
                                    null
                                    : <tr style={{ padding: 1 }}>
                                        <td style={{ padding: 1 }} colSpan={6}>CGST%</td>
                                        <td style={{ padding: 1 }}>{state.cgstValue}%</td>
                                        <td style={{ padding: 1 }}>{state.cgstAmount.toFixed(2)}</td>
                                    </tr>
                            }

                            {
                                state.sgstValue === 0 ?
                                    null
                                    : <tr style={{ padding: 1 }}>
                                        <td style={{ padding: 1 }} colSpan={6}>SGST%</td>
                                        <td style={{ padding: 1 }}>{state.sgstValue}%</td>
                                        <td style={{ padding: 1 }}>{state.sgstAmount.toFixed(2)}</td>
                                    </tr>
                            }



                        </tbody>
                    </Table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginRight: '20px' }}>
                    <h6 style={{ fontSize: '12px' }}>Payable Amount : {Number(state.payableAmount).toFixed(2)}</h6>
                </div>
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
    drName: '',
    paymentStatus: 'Pending',
    medicineDate: '',
    medicines: [
        {
            medname: '',
            medQty: '',
            medPrice: '',
            meduid: '',
            totalmedPrice: '',
            batchNo: '',
            medType: '',
            expireDate: '',
            mfrsName: '',
        },
    ],
    allMedTotalprice: '',
    pmeduid: '',
    hospitaluid: ''
}
const Medicine = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [patientsMedicineList, setPatientsMedicineList] = useState([]);
    const [patientsMedicineFilter, setPatientsMedicineFilter] = useState([]);
    const [autofocus, setAutofocus] = useState(false)
    const dispatch = useDispatch()
    const [update, setUpdate] = useState(false)
    const allPatients = useSelector(selectAllPatients)
    const medicineList = useSelector(selectAllMedicines)
    const allPatientsMedicines = useSelector(selectAllPatientsMedicines)
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
    const [searchBy, setSearchBy] = useState('');
    const [searchString, setSearchString] = useState('');
    const parentDocRefMedicineStock = db.collection('Medicines').doc('dHFKEhdhbOM4v6WRMb6z');
    const subcollectionRefMedicineStock = parentDocRefMedicineStock.collection('medicines').where('hospitaluid', '==', hospitaluid)
    let unsubscribe = undefined
    const parentDocRefMedicineInvoice = db.collection('PatientsMedicines').doc('GoKwC6l5NRWSonfUAal0');
    const subcollectionRefMedicineInvoice = parentDocRefMedicineInvoice.collection('patientsMedicines').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);
    let unsub = undefined
    const parentDocRefpatients = db.collection('Patients').doc('fBoxFLrzXexT8WNBzGGh');
    const subcollectionRefpatients = parentDocRefpatients.collection('patients').where('hospitaluid', '==', hospitaluid)
    let unsubpatients = undefined
    const currentDate = new Date();
    const allDoctors = useSelector(selectAllDr)
    const medicalName = useSelector(selectMedicalName)
    const medicalAddress = useSelector(selectMedicalAddress)
    const licenceNumber = useSelector(selectLicenceNumber)
    const contactNumber = useSelector(selectMedicalContactnumber)
    const lastPatientData = useSelector(selectlastPatientData)
    const [sendData, setSendData] = useState()
    const columns = [
        // { name: 'ID', selector: row => row.pid, sortable: true },
        { name: 'Date', selector: row => row.medicineDate, sortable: true },
        { name: 'Patient Name', selector: row => row.pName, sortable: true },
        // { name: 'Address', selector: row => row.pAddress },
        { name: 'Mobile No', selector: row => row.pMobileNo },
        { name: 'Total Amount', selector: row => row.allMedTotalprice },
        {
            name: 'Payment Status', cell: row => <div style={{ backgroundColor: row.paymentStatus === "Completed" ? 'green' : 'red', color: 'white', width: '80px', height: '20px', display: 'flex', borderRadius: '10px', alignContent: 'center', justifyContent: 'center' }}>{row.paymentStatus}</div>
        },
        {
            name: 'Action', cell: row => <span> {
                row.paymentStatus === "Completed" ? <button onClick={() => viewInvoice(row)} style={{ color: 'skyblue', border: 'none' }}  ><BsEye size={22} /></button> :
                    <button onClick={() => editPatientDetails(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
            }
                <button onClick={() => generateInvoice(row)} style={{ color: 'skyblue', border: 'none' }} >{row.paymentStatus === "Completed" ? <AiFillPrinter size={25} /> : <img src={billingicon} alt='billingicon' />}</button>
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
        formik.setFieldValue('medicineDate', new Date().toISOString().substr(0, 10));
    };

    useEffect(() => {
        setMedList([...medicineList])
        setIsLoading(false)
    }, [medicineList])


    useEffect(() => {
        if (show) {
            fetchData()
            fetchDataPatients()
        }
    }, [show])

    useEffect(() => {
        const retrieveMedicineInvoices = async () => {
            const invoiceQuery = subcollectionRefMedicineInvoice
                .orderBy('timestamp', 'desc')
                .limit(perPageRows);
            debouncedRetrieveData(invoiceQuery);
        };

        const fetchDataAndUpdateTotal = async () => {
            retrieveMedicineInvoices();
            totalNumberOfData();
        };

        fetchDataAndUpdateTotal();

        return () => {
            // unsubscribe();
            unsub();
            // unsubpatients()
        };
    }, []);



    const totalNumberOfData = async () => {
        try {
            let count = 0;
            unsub = db
                .collection('MedicinePatientsCount')
                .where('hospitaluid', '==', hospitaluid)
                .onSnapshot(async (snapshot) => {
                    if (!snapshot.empty) {
                        const newData = snapshot.docs[0].data();
                        count = newData.count;
                        setTotalNumData(count);
                        console.log('res.data().count', count);
                    } else {
                        const snapshot = await subcollectionRefMedicineInvoice.get();
                        const totalDataCount = snapshot.size;
                        await addDataincollection('MedicinePatientsCount', { hospitaluid: hospitaluid, count: totalDataCount });
                        console.log('No documents found in the snapshot.');
                    }
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const retrieveDataMedicineInvoice = (query) => {
        try {
            setIsLoading(true);
            unsub = query.onSnapshot((snapshot) => {
                const newData = snapshot.docs.map((doc) => doc.data());
                console.log(newData, 'newData')
                setPatientsMedicineList(newData);

                if (snapshot.size > 0) {
                    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
                    setLastVisible(lastVisibleDoc);
                    setFirstVisible(snapshot.docs[0]);
                } else {
                    setLastVisible(null);
                    setFirstVisible(null);
                }

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
    const debouncedRetrieveData = debounce(retrieveDataMedicineInvoice, 500);

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
    const retrieveDataPatients = (query) => {
        try {
            setIsLoading(true)
            unsubpatients = query.onSnapshot((snapshot) => {
                fetchDataPatients()
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
    const fetchDataPatients = async () => {
        await getSubcollectionDataWithoutsnapshot("Patients", 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, lastPatientData, (data, lastData) => {
            dispatch(FILL_PATIENTS(data))
            dispatch(ADD_LAST_PATIENT_DATA(lastData))
            console.log('Get Patients with last Data', data, lastData);
            setIsLoading(false)
        }).catch((error) => {
            console.error('Error:', error);
        })
    }
    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: padtientmedicineSchema,
        onSubmit: async (Values, action) => {

            let medd = [...patientsMedicineList]
            values.medicineDate = values.medicineDate ? ddMMyyyy(values.medicineDate) : values.medicineDate;
            // await Values.medicines.map((item) => updateStock(item))
            await Promise.all(values.medicines.map((item) => updateStock(item)));

            if (!update) {
                values.pmeduid = Math.floor(315 + Math.random() * 8000)
                setPatientsMedicineFilter([...patientsMedicineFilter, Values])

                let med = [...patientsMedicineFilter, Values]
                try {
                    await addDatainsubcollection("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', values)
                    await updateDataincollection('MedicinePatientsCount', { hospitaluid: hospitaluid, count: totalnumData + 1 })
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    toast.success("Added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {

                let findindex = await medd.findIndex((item) => item.pmeduid === Values.pmeduid);
                await medd[findindex].medicines.map((item) => updateStockonUpdate(item))
                medd[findindex] = Values;

                try {
                    await updateDatainSubcollection("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', Values, 'pmeduid', 'hospitaluid')
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Updated Successfully.......");
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
            drName: '',
            paymentStatus: 'Pending',
            medicineDate: new Date().toISOString().substr(0, 10),
            medicines: [
                {
                    medname: '',
                    medQty: '',
                    medPrice: '',
                    meduid: '',
                    totalmedPrice: '',
                    batchNo: '',
                    medType: '',
                    expireDate: '',
                    mfrsName: '',
                },
            ],
            allMedTotalprice: '',
            pmeduid: '',
            hospitaluid: ''
        });
    };

    const updateStock = async (item) => {
        const findIndex = medList.findIndex((item1) => item1.medicineuid === item.meduid)
        let newObj = { ...medList[findIndex], availableStock: medList[findIndex].availableStock - parseInt(item.medQty) }
        await updateDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
        medList[findIndex] = newObj;
    }
    const updateStockonUpdate = async (item) => {
        const findIndex = medList.findIndex((item1) => item1.medicineuid === item.meduid)
        let newObj = { ...medList[findIndex], availableStock: medList[findIndex].availableStock + parseInt(item.medQty) }
        await updateDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
    }
    const generateInvoice = (item) => {
        if (item.paymentStatus === "Completed") {
            setPrintContent(<PrintComponent data={{
                data1: {
                    ...item,
                    medicalAddress,
                    medicalName,
                    licenceNumber,
                    contactNumber
                }
            }} />)
            setSendData({
                ...item,
                medicalAddress,
                medicalName,
                licenceNumber,
                contactNumber
            })
        } else {
            navigate("/medical/medicine/medicineinvoice", { state: item })

        }
    }
    const viewInvoice = (item) => {
        navigate("/medical/medicine/medicineinvoice", { state: item })
    }
    const editPatientDetails = (item) => {
        const {
            pid,
            pName,
            page,
            pGender,
            pAddress,
            pMobileNo,
            medicineDate,
            paymentStatus,
            medicines,
            drName,
            allMedTotalprice,
            pmeduid,
            hospitaluid
        } = item;

        formik.setValues({
            pid,
            pName,
            page,
            pGender,
            pAddress,
            pMobileNo,
            drName,
            medicineDate: yyyyMMdd(medicineDate),
            paymentStatus,
            medicines,
            allMedTotalprice,
            pmeduid,
            hospitaluid
        });

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
                        let med = await patientsMedicineFilter.filter((item) => item.pmeduid !== item1.pmeduid);
                        console.log('medicine List', medList);
                        try {
                            // await deleteSingltObject("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', item1, 'pmeduid', 'hospitaluid')
                            await deleteDatainSubcollection("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', item1, 'pmeduid', 'hospitaluid')
                            await item1.medicines.map((item) => updateStockonUpdate(item))
                            await updateDataincollection('MedicinePatientsCount', { hospitaluid: hospitaluid, count: totalnumData - 1 })

                            // await setData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', 'count', totalnumData - 1)

                            // await setData("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', med)
                            // dispatch(DELETE_PATIENTS_MEDICINES(item1))
                            // await setData("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', medList)
                            // dispatch(UPDATE_MEDICINES(medList))
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

    const totalmedprice = async (e, medicine) => {
        if (e <= stock || stock === undefined || stock === null) {
            // const updatedMedicine = { ...medicine, medQty: e, totalmedPrice: medicine.medPrice * e };
            let updatedMedicine = Object.assign({}, medicine);
            updatedMedicine.medQty = e;
            updatedMedicine.totalmedPrice = updatedMedicine.medPrice * e;
            medicine = { ...medicine, ...updatedMedicine }
            values.medicines = await values.medicines.map((med) => {
                if (med.meduid === medicine.meduid) {
                    return { ...med, ...medicine };
                } else {
                    return med;
                }
            });
            formik.setFieldValue('allMedTotalprice', await Number(values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0).toFixed(2)));

            // values.allMedTotalprice = await values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0);
            setStockerror(false);
            setAutofocus(!autofocus);
            console.log('values', medicine, updatedMedicine, values.medicines, values.allMedTotalprice);
        } else {
            setStockerror(true);
        }
    };
    const handleOnSelect = (item) => {
        formik.setFieldValue('pid', item.pid);
        formik.setFieldValue('pName', item.pName);
        formik.setFieldValue('pMobileNo', item.pMobileNo);
        formik.setFieldValue('pGender', item.pGender);
        formik.setFieldValue('page', item.page);
        formik.setFieldValue('pAddress', item.pAddress);
        formik.setFieldValue('hospitaluid', item.hospitaluid);
    };

    const handleOnSearch = (string, results) => {
        formik.setFieldValue('pName', string);
        formik.setFieldValue('hospitaluid', hospitaluid);

    }
    const handleOnSearchmobileNumber = (string, results) => {
        formik.setFieldValue('pMobileNo', string);
        formik.setFieldValue('hospitaluid', hospitaluid);

    }

    const selectMedicine = (item, med) => {
        med.medname = item.medicineName;
        med.medPrice = item.medicinePrice;
        med.meduid = item.medicineuid;
        med.expireDate = ddMMyyyy(item.expireDate);
        med.mfrsName = item.mfrsName;
        med.batchNo = item.batchNumber
        med.medType = item.medicineType
        setStock(item.availableStock)
        setAutofocus(!autofocus)
    }
    const handleOnClear = () => {
        clearForm()

    }
    const removeMedicine = async (indexToRemove) => {
        values.medicines = values.medicines.filter((_, index) => index !== indexToRemove);
        formik.setFieldValue('allMedTotalprice', await Number(values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0).toFixed(2)));

        // values.allMedTotalprice = await values.medicines.reduce((price, item) => price + item.medPrice * item.medQty, 0);
        setAutofocus(!autofocus);
    }




    const handlePageChange = async (page) => {
        if (page < currentPage) {
            setPrev(true)
            prevPage()
            setCurrentPage(page);
        } else {
            setPrev(false)
            nextPage()
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
        retrieveDataMedicineInvoice(query)
        setIsLoading(false)

    };
    const prevPage = async () => {
        setIsLoading(true)
        let query = subcollectionRefMedicineInvoice
            .orderBy('timestamp', 'desc')
            .limit(perPageRows)
            .endBefore(firstVisible).limitToLast(perPageRows);
        retrieveDataMedicineInvoice(query)
        setIsLoading(false)

    }

    const saveAndPrint = async () => {

        setIsLoading(true);

        try {
            values.medicineDate = values.medicineDate ? ddMMyyyy(values.medicineDate) : values.medicineDate;
            await Promise.all(values.medicines.map((item) => updateStock(item)));
            if (!update) {
                values.pmeduid = Math.floor(315 + Math.random() * 8000);
                setPatientsMedicineFilter([...patientsMedicineFilter, values]);
                values.hospitaluid = hospitaluid
                const newDocData = await addDatainsubcollection("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', values);
                await updateDataincollection('MedicinePatientsCount', { hospitaluid: hospitaluid, count: totalnumData + 1 });

                clearForm();
                setShow(false);
                setIsLoading(false);
                navigate("/medical/medicine/medicineinvoice", { state: newDocData.data() });
                toast.success("Added Successfully.......");
            } else {
                let findindex = patientsMedicineList.findIndex((item) => item.pmeduid === values.pmeduid);

                await Promise.all(patientsMedicineList[findindex].medicines.map((item) => updateStockonUpdate(item)));

                patientsMedicineList[findindex] = values;

                const updatedDocData = await updateDataInSubcollectionMedinvoice("PatientsMedicines", 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', values, 'pmeduid', 'hospitaluid');
                clearForm();
                setShow(false);
                setUpdate(false);
                setIsLoading(false);
                navigate("/medical/medicine/medicineinvoice", { state: updatedDocData });
                toast.success("Updated Successfully.......");
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
            console.error(error.message);
        }
    };

    return <>

        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButtonMedical content={printContent} sendData={sendData} />}</div>
                <DataTable
                    title={"Medicines invoice"}
                    columns={columns}
                    data={patientsMedicineList}
                    pagination={true}
                    fixedHeader={true}
                    noHeader={false}
                    persistTableHead
                    actions={<>
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
                <Modal.Title>Medicine Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormikProvider value={formik}>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-lg-6'>
                                {update ?
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Patient Name:</label>
                                        <input name='pName'
                                            placeholder="Enter Patient Name"
                                            type="text" className="form-control" onChange={handleChange} defaultValue={values.pName} readOnly />
                                        {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                    </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Patient Name: </label>
                                        <SearchAutocomplete
                                            allPatients={allPatients}
                                            handleOnSelect={handleOnSelect}
                                            handleOnSearch={handleOnSearch}
                                            inputsearch={values.pName}
                                            placeholder={'Enter Patient Name'}
                                            handleClear={handleOnClear}
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
                            <div className='col-lg-6'>
                                {update ?
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Mobile No:</label>
                                        <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} readOnly />
                                        {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                                    </div> :
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Mobile No: </label>
                                        <SearchAutocomplete
                                            allPatients={allPatients}
                                            handleOnSelect={handleOnSelect}
                                            inputsearch={values.pMobileNo}
                                            handleOnSearch={handleOnSearchmobileNumber}
                                            placeholder={'Enter Mobile No'}
                                            handleClear={handleOnClear}
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

                            <div className='col-lg-4'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Address:</label>
                                    <input name='pAddress'
                                        placeholder="Enter address"
                                        type="text" className="form-control" onChange={handleChange} defaultValue={values.pAddress} />
                                    {errors.pAddress && touched.pAddress ? (<p style={{ color: 'red' }}>*{errors.pAddress}</p>) : null}
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Date<b style={{ color: 'red' }}>*</b>:</label>
                                    <input name='medicineDate'
                                        placeholder="Enter Date"
                                        type="date" className="form-control" onChange={handleChange} defaultValue={values.medicineDate} />
                                    {errors.medicineDate && touched.medicineDate ? (<p style={{ color: 'red' }}>*{errors.medicineDate}</p>) : null}

                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Doctor Name<b style={{ color: 'red' }}>*</b>:</label>
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='drName' value={values.drName} onChange={handleChange}>
                                        <option >Select Doctor</option>
                                        {allDoctors?.map((option) => (
                                            <option key={option.druid} value={option.drName}>
                                                {option.drName}
                                            </option>
                                        ))}

                                    </select>

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
                                                    <div className='col-lg-6'>
                                                        <div className="form-group">
                                                            <label htmlFor={`medicines.${index}.medname`}>Medicin Name<b style={{ color: 'red' }}>*</b>:</label>
                                                            <SearchAutocomplete
                                                                allPatients={medicineList.filter(medicine => {
                                                                    return new Date(medicine.expireDate) >= currentDate;
                                                                })}
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

                                                            {errors.medicines && errors.medicines[index] && errors.medicines[index].medname && touched.medicines && touched.medicines[index] && touched.medicines[index].medname ? (
                                                                <p style={{ color: 'red' }}>*{errors.medicines[index].medname}</p>) : null}

                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6'>
                                                        <div className="form-group">
                                                            <label htmlFor={`medicines.${index}.medType`}>Type:</label>
                                                            <input name={`medicines.${index}.medType`}
                                                                placeholder="Enter Type"
                                                                type="text" className="form-control" value={medicine.medType} onChange={handleChange} required readOnly />
                                                            {errors.medicines && errors.medicines[index] && errors.medicines[index].medType && touched.medicines && touched.medicines[index] && touched.medicines[index].medType ? (
                                                                <p style={{ color: 'red' }}>*{errors.medicines[index].medType}</p>) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-lg-6'>
                                                        <div className="form-group">
                                                            <label htmlFor={`medicines.${index}.medPrice`}>Price<b style={{ color: 'red' }}>*</b>:</label>
                                                            <input name={`medicines.${index}.medPrice`}
                                                                placeholder="Enter Price"
                                                                type="number" className="form-control" value={medicine.medPrice} onChange={handleChange} required readOnly />
                                                            {errors.medicines && errors.medicines[index] && errors.medicines[index].medPrice && touched.medicines && touched.medicines[index] && touched.medicines[index].medPrice ? (
                                                                <p style={{ color: 'red' }}>*{errors.medicines[index].medPrice}</p>) : null}
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6'>
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
                                    {stockerror ? <p style={{ color: 'red' }} >* You Have only {stock} Quantity </p> : null}

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
                                        type="number" className="form-control" onChange={handleChange} value={values.allMedTotalprice} />
                                    {errors.allMedTotalprice && touched.allMedTotalprice ? (<p style={{ color: 'red' }}>*{errors.allMedTotalprice}</p>) : null}

                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label >Payment Status<b style={{ color: 'red' }}>*</b>:</label>
                                    <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='paymentStatus' defaultValue={values.paymentStatus} onChange={handleChange}>
                                        <option >Select Payment Status</option>
                                        {/* <option value='Completed'>Completed</option> */}
                                        <option value='Pending'>Pending</option>
                                    </select>
                                    {errors.paymentStatus && touched.paymentStatus ? (<p style={{ color: 'red' }}>*{errors.paymentStatus}</p>) : null}

                                </div>
                            </div>
                        </div>
                    </form>
                </FormikProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={values.medicines && values.medicines.some(medd => !medd.medname || !medd.medPrice || !medd.medQty)} >
                    {update ? 'Update' : 'Save'}
                </Button>
                <Button variant="primary" onClick={() => saveAndPrint()} disabled={values.medicines && values.medicines.some(medd => !medd.medname || !medd.medPrice || !medd.medQty)}>
                    Print
                </Button>
            </Modal.Footer>
        </Modal>
    </>


}

export default Medicine;
