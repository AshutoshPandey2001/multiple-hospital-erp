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
import { ADD_MEDICINES, DELETE_MEDICINES, EDIT_MEDICINES, UPLOAD_MEDICINES, selectAllMedicines } from 'src/redux/slice/medicinesMasterSlice';
import Papa from "papaparse";
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, setData, updateDatainSubcollection, updateSingltObject, uploadArray } from 'src/services/firebasedb';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { selectUserId } from 'src/redux/slice/authSlice';

const initalValues = {
    medicineuid: '',
    medicineName: '',
    medicineFormula: '',
    availableStock: '',
    medicinePrice: '',
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
    const columns = [
        { name: 'Id', selector: row => row.medicineuid },
        { name: 'Medicine Name', selector: row => row.medicineName, sortable: true },
        { name: 'Medicine Formula', selector: row => row.medicineFormula, sortable: true },
        { name: 'Medicine Price', selector: row => row.medicinePrice, sortable: true },
        { name: 'Available Stock', selector: row => row.availableStock, sortable: true },
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
        values.medicineFormula = '';
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


    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: medicineSchema,
        onSubmit: async (Values, action) => {
            setIsLoading(true)


            let medd = [...medicinessFilter]
            if (!update) {
                values.hospitaluid = hospitaluid
                // setMedicinessFilter([...medicinessFilter, Values])
                let findMedicine = medd.findIndex((item1) => item1.medicineuid === Values.medicineuid)
                if (findMedicine >= 0) {

                    let totalStock = medd[findMedicine].availableStock + Values.availableStock;
                    let newObj = { ...medd[findMedicine], availableStock: totalStock }
                    medd[findMedicine] = newObj
                } else {
                    medd.push(Values)
                }

                try {
                    await addDatainsubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', values)
                    dispatch(ADD_MEDICINES(Values))
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

                    await updateDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', values, 'medicineuid', 'hospitaluid')
                    dispatch(EDIT_MEDICINES(Values))
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
        values.medicineFormula = item.medicineFormula;
        values.hospitaluid = item.hospitaluid;

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
                            await deleteDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', item1, 'medicineuid', 'hospitaluid')
                            // await setData("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', med)
                            dispatch(DELETE_MEDICINES(item1))
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
            return row.medicineName.toLowerCase().includes(searchvalue.toLowerCase()) || row.medicineFormula.toLowerCase().includes(searchvalue.toLowerCase());
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
                        if (item.medicineFormula) {
                            let findMedicine = medicine.findIndex((item1) => item1.medicineuid === item.medicineuid)
                            if (findMedicine >= 0) {
                                let totalStock = medicine[findMedicine].availableStock + item.availableStock;
                                let newObj = { ...medicine[findMedicine], availableStock: totalStock }
                                updateDatainSubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', newObj, 'medicineuid', 'hospitaluid')
                                // medicine[findMedicine] = newObj
                            } else {
                                addDatainsubcollection("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', { ...item, hospitaluid: hospitaluid })
                                // medicine.push({ ...item, hospitaluid: hospitaluid })
                            }
                            tempData.push({ ...item, hospitaluid: hospitaluid })
                        }
                    })

                    setFiles('')
                    // try {
                    //     await uploadArray("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', medicine, 'medicineuid', 'hospitaluid')
                    //     // await setData("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', medicine)
                    //     dispatch(UPLOAD_MEDICINES(medicine))
                    // } catch (error) {
                    //     console.error(error.message);
                    // }
                }
            }
            )
        }
    }
    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div>
                    <CommanTable
                        title={"Medicines Stock"}
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
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Medicine id<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="number" className="form-control" placeholder="Enter Medicine UID" name='medicineuid' value={values.medicineuid} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicineuid && touched.medicineuid ? (<p style={{ color: 'red' }}>*{errors.medicineuid}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Medicine Name<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="text" className="form-control" placeholder="Enter Medicine Name" name='medicineName' value={values.medicineName} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicineName && touched.medicineName ? (<p style={{ color: 'red' }}>*{errors.medicineName}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Medicine Formula<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="text" className="form-control" placeholder="Enter Medicine Formula" name='medicineFormula' value={values.medicineFormula} onChange={handleChange} onBlur={handleBlur} />
                        {errors.medicineFormula && touched.medicineFormula ? (<p style={{ color: 'red' }}>*{errors.medicineFormula}</p>) : null}
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Stock<b style={{ color: 'red' }}>*</b>:</label>
                        <input type="number" className="form-control" placeholder="Enter Stock" name='availableStock' value={values.availableStock} onChange={handleChange} onBlur={handleBlur} />
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
