/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { BsCloudUploadFill } from 'react-icons/bs'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Formik, useFormik } from 'formik';
import { medicineSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { ADD_LAST_MEDICINES, ADD_MEDICINES, DELETE_MEDICINES, EDIT_MEDICINES, FILL_MEDICINES_STOCK, UPLOAD_MEDICINES, selectAllMedicines, selectLastMedicine } from 'src/redux/slice/medicinesMasterSlice';
import Papa from "papaparse";
import { addDatainsubcollection, addDatainsubcollectionmedicalAndPatients, addSingltObject, deleteDatainSubcollection, deleteDatainSubcollectionMedicalAndPatients, deleteSingltObject, filDatainsubcollection, getSubcollectionDataWithoutsnapshotMedicalAndPatients, setData, updateDatainSubcollection, updateDatainSubcollectionMedicalAndPatients, updateSingltObject, uploadArray } from 'src/services/firebasedb';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { selectUserId } from 'src/redux/slice/authSlice';
import { TfiReload } from 'react-icons/tfi'
import { db } from 'src/firebaseconfig';
import { ddMMyyyy, formatDateYYYYMMDD } from 'src/services/dateFormate';

const initalValues = {
    medicineuid: '',
    medicineName: '',
    batchNumber: '',
    availableStock: '',
    medicinePrice: '',
    expireDate: '',
    medicineType: '',
    medicineCapacity: '',
    mfrsName: '',
    hospitaluid: ''
}
const MedicineMaster = () => {
    const dispatch = useDispatch();
    const allMedicinesList = useSelector(selectAllMedicines)
    const hospitaluid = useSelector(selectUserId)
    const [show, setShow] = useState(false);
    const [medicinesList, setMedicinesList] = useState([]);
    const [medicinessFilter, setMedicinessFilter] = useState([]);
    const [update, setUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [files, setFiles] = useState('')
    let [medicine, setMedicines] = useState([])
    const currentDate = new Date();
    const lastMedicines = useSelector(selectLastMedicine)
    const parentDocRef = db.collection('Medicines').doc('dHFKEhdhbOM4v6WRMb6z');
    const subcollectionRef = parentDocRef.collection('medicines').where('hospitaluid', '==', hospitaluid)
    let unsubscribe = undefined
    const columns = [
        { name: 'Batch No', selector: row => row.batchNumber, sortable: true },
        { name: 'Name of Drug', selector: row => row.medicineName, sortable: true },
        { name: 'Manufacturer Name', selector: row => row.mfrsName, sortable: true },
        { name: 'Expire Date', selector: row => ddMMyyyy(row.expireDate), sortable: true },
        { name: 'Price', selector: row => row.medicinePrice, sortable: true },
        { name: 'Available Quantity', selector: row => row.availableStock, sortable: true },
        {
            name: 'Action', cell: row => <span><button onClick={() => editMedicines(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                <button onClick={() => deleteMedicines(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
            </span>
        }
    ]

    const handleClose = () => {
        setShow(false);
        values.medicineName = '';
        values.medicinePrice = '';
        values.batchNumber = '';
        values.medicineuid = '';
        values.availableStock = '';
        values.hospitaluid = '';
        setUpdate(false)
        formik.resetForm();
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        setMedicinesList(allMedicinesList)
        setMedicinessFilter(allMedicinesList)
        setIsLoading(false)
    }, [allMedicinesList])

    useEffect(() => {
        let query = subcollectionRef
        retrieveData(query)
        return () => {
            unsubscribe();
        };
    }, [])

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
        validationSchema: medicineSchema,
        onSubmit: async (Values, action) => {
            setIsLoading(true)
            let medd = [...medicinessFilter]
            if (!update) {
                values.hospitaluid = hospitaluid
                let timestamp = new Date(values.expireDate).getTime();
                let medicineCapacity = values.medicineCapacity ? values.medicineCapacity.toUpperCase() : ''; // If medicineCapacity doesn't exist, assign an empty string
                values.medicineuid = values.medicineName.substring(0, 3).toUpperCase() + values.mfrsName.substring(0, 3).toUpperCase() + timestamp + medicineCapacity
                // setMedicinessFilter([...medicinessFilter, Values])
                let findMedicine = medd.findIndex((item1) => item1.medicineuid === Values.medicineuid)
                if (findMedicine >= 0) {
                    let totalStock = medd[findMedicine].availableStock + Values.availableStock;
                    let newObj = { ...medd[findMedicine], availableStock: totalStock }
                    medd[findMedicine] = newObj
                    try {
                        await updateDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')

                        // await updateDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', values, 'medicineuid', 'hospitaluid')
                        // dispatch(EDIT_MEDICINES(Values))
                        action.resetForm()
                        setShow(false)
                        setUpdate(false)
                        toast.success("Updated Successfully.......");
                        setIsLoading(false)
                        return
                    } catch (error) {
                        setIsLoading(false)
                        toast.error(error.message)
                        return
                        console.error(error.message);
                    }
                } else {
                    medd.push(Values)
                }
                try {
                    // await addDatainsubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', values)
                    await addDatainsubcollectionmedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', values)
                    // dispatch(ADD_MEDICINES(Values))
                    action.resetForm()
                    setShow(false)
                    toast.success("Added Successfully.......");
                    setIsLoading(false)
                } catch (error) {
                    setIsLoading(false)
                    toast.error(error.message)
                    console.error(error.message);
                }
            } else {

                let findindex = medd.findIndex((item) => item.medicineuid == Values.medicineuid);
                medd[findindex] = Values;

                try {
                    await updateDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', values, 'medicineuid', 'hospitaluid')

                    // await updateDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', values, 'medicineuid', 'hospitaluid')
                    // dispatch(EDIT_MEDICINES(Values))
                    action.resetForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Updated Successfully.......");
                    setIsLoading(false)

                } catch (error) {
                    setIsLoading(false)
                    toast.error(error.message)
                    console.error(error.message);
                }
            }
        }
    });
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;
    const editMedicines = (item) => {
        // filDatainsubcollection(allMedicinesList, "Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines')
        values.medicineuid = item.medicineuid;
        values.medicineName = item.medicineName;
        values.medicinePrice = item.medicinePrice;
        values.availableStock = item.availableStock;
        values.batchNumber = item.batchNumber;
        values.hospitaluid = item.hospitaluid;
        values.expireDate = item.expireDate;
        values.mfrsName = item.mfrsName;
        values.medicineType = item.medicineType;
        values.medicineCapacity = item.medicineCapacity;
        setShow(true)
        setUpdate(true)
    }

    const deleteMedicines = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let med = medicinessFilter.filter((item) => item.medicineuid !== item1.medicineuid);
                        try {
                            // await deleteSingltObject("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', item1, 'medicineuid', 'hospitaluid')
                            // await deleteDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', item1, 'medicineuid', 'hospitaluid')
                            await deleteDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', item1, 'medicineuid', 'hospitaluid')
                            // await setData("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', med)
                            // dispatch(DELETE_MEDICINES(item1))
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
        const filteredRows = medicinessFilter.filter((row) => {
            return row.medicineName.toLowerCase().includes(searchvalue.toLowerCase()) || row.batchNumber.toLowerCase().includes(searchvalue.toLowerCase());
        });
        if (searchvalue.length < 1) {

            setMedicinesList(medicinessFilter.reverse())
        }
        else {
            setMedicinesList(filteredRows)
        }


    }

    const csvtoJson = (files) => {
        // setFiles(files[0].name)
        medicine = [...medicinessFilter]

        if (files) {

            Papa.parse(files[0], {
                header: true,
                dynamicTyping: true,
                complete: async function (results) {
                    let tempData = [];
                    let res = results.data

                    await res.map((item) => {
                        if (item.batchNumber) {
                            item.expireDate = formatDateYYYYMMDD(item.expireDate)
                            let timestamp = new Date(item.expireDate).getTime();
                            let medicineCapacity = item.medicineCapacity ? item.medicineCapacity.toUpperCase() : ''; // If medicineCapacity doesn't exist, assign an empty string

                            const medicineuid = item.medicineName.substring(0, 3).toUpperCase() + item.mfrsName.substring(0, 3).toUpperCase() + timestamp + medicineCapacity
                            let findMedicine = medicine.findIndex((item1) => item1.medicineuid === medicineuid)
                            if (findMedicine >= 0) {
                                let totalStock = medicine[findMedicine].availableStock + item.availableStock;
                                let newObj = { ...medicine[findMedicine], availableStock: totalStock }
                                updateDatainSubcollectionMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
                                // medicine[findMedicine] = newObj
                            } else {
                                addDatainsubcollectionmedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', { ...item, hospitaluid: hospitaluid, medicineuid: medicineuid })
                                // medicine.push({ ...item, hospitaluid: hospitaluid })
                            }
                            tempData.push({ ...item, hospitaluid: hospitaluid })
                        }
                    })

                    setFiles('')

                }
            }
            )
        }
    }
    const conditionalRowStyles = [
        {
            when: row => new Date(row.expireDate) <= currentDate,
            style: {
                backgroundColor: 'red',
                color: 'white', // Adjust text color for better visibility
            },
        },
    ];
    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div>
                    <CommanTable
                        title={"Medicines Stock"}
                        conditionalRowStyles={conditionalRowStyles}
                        columns={columns}
                        data={medicinesList}
                        action={<span style={{ display: 'flex' }}><span style={{ display: 'flex', marginRight: '20px' }}><BsCloudUploadFill size={30} color={'green'} style={{ marginRight: '10px' }} /><input type="file" className='form-control' accept=".csv,.xlsx,.xls" onChange={(e) => { csvtoJson(e.target.files) }} value={files} /></span><button className='btn btn-primary' onClick={handleShow} style={{ height: '40px' }}><span>  <BiPlus size={25} /></span></button></span>}
                        subHeaderComponent={<>
                            <input type='search' placeholder='search' className='w-25 form-control' onChange={(e) => requestSearch(e.target.value)} /></>}
                    />
                </div>
            </>
        }


        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Medicine</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form >
                    {/* <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Medicine id<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="number" className="form-control" placeholder="Enter Medicine UID" name='medicineuid' value={values.medicineuid} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicineuid && touched.medicineuid ? (<p style={{ color: 'red' }}>*{errors.medicineuid}</p>) : null}
                    </div> */}
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Batch No.<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="text" className="form-control" placeholder="Enter Medicine Formula" name='batchNumber' value={values.batchNumber} onChange={handleChange} onBlur={handleBlur} />
                        {errors.batchNumber && touched.batchNumber ? (<p style={{ color: 'red' }}>*{errors.batchNumber}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Name of Drug<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="text" className="form-control" placeholder="Enter Medicine Name" name='medicineName' value={values.medicineName} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicineName && touched.medicineName ? (<p style={{ color: 'red' }}>*{errors.medicineName}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Medicine Type<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="text" className="form-control" placeholder="Enter Medicine Type" name='medicineType' value={values.medicineType} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicineType && touched.medicineType ? (<p style={{ color: 'red' }}>*{errors.medicineType}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Capacity<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="text" className="form-control" placeholder="Enter Medicine Capacity" name='medicineCapacity' value={values.medicineCapacity} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicineCapacity && touched.medicineCapacity ? (<p style={{ color: 'red' }}>*{errors.medicineCapacity}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Manufacturer Name<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="text" className="form-control" placeholder="Enter Manufacturer Name" name='mfrsName' value={values.mfrsName} onChange={handleChange} onBlur={handleBlur} />
                        {errors.mfrsName && touched.mfrsName ? (<p style={{ color: 'red' }}>*{errors.mfrsName}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Expire Date<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="date" className="form-control" placeholder="Enter Medicine Name" name='expireDate' value={values.expireDate} onChange={handleChange} onBlur={handleBlur} />
                        {errors.expireDate && touched.expireDate ? (<p style={{ color: 'red' }}>*{errors.expireDate}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Quantity<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="number" className="form-control" placeholder="Enter Quantity" name='availableStock' value={values.availableStock} onChange={handleChange} onBlur={handleBlur} />
                        {errors.availableStock && touched.availableStock ? (<p style={{ color: 'red' }}>*{errors.availableStock}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Price<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="number" className="form-control" placeholder="Enter Medicine Price" name='medicinePrice' value={values.medicinePrice} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicinePrice && touched.medicinePrice ? (<p style={{ color: 'red' }}>*{errors.medicinePrice}</p>) : null}
                    </div>




                </form>
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

export default MedicineMaster;
