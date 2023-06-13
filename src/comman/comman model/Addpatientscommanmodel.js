/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import { addpatientsSchema } from 'src/schema';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_PATIENTS, EDIT_PATIENTS, selectAllPatients } from 'src/redux/slice/patientMasterslice';
import { addSingltObject, getDatawithhospitaluid, setData, updateSingltObject } from 'src/services/firebasedb';
import { toast } from 'react-toastify';
import { selectAllDr } from 'src/redux/slice/doctorsSlice';
import Select from 'react-select';
import { selectUserId } from 'src/redux/slice/authSlice';

const initalValues = {
    pid: '',
    pName: '',
    page: '',
    pGender: '',
    pAddress: '',
    pMobileNo: '',
    drName: '',
    hospitaluid: ''
}
const Addpatientscommanmodel = ({ show, handleClose, update, data }) => {

    const dispatch = useDispatch()
    const allPatientsList = useSelector(selectAllPatients);
    const hospitaluid = useSelector(selectUserId);
    const [patientsFilter, setPatientsFilter] = useState([]);
    const allDoctors = useSelector(selectAllDr)
    useEffect(() => {
        setPatientsFilter(allPatientsList)
        patchData()
    }, [allPatientsList, data])

    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: addpatientsSchema,
        onSubmit: async (Values, action) => {
            let timestamp = new Date().getTime();
            let patient1 = [...patientsFilter]
            console.log('values', values);
            if (!update) {
                values.pid = Math.floor(Math.random() + timestamp)
                values.hospitaluid = hospitaluid
                const index = patientsFilter.findIndex(obj => obj.pMobileNo === Values.pMobileNo);
                console.log('patient', hospitaluid);
                if (index === -1) {
                    let patient = [...patientsFilter, Values]
                    try {
                        // await setData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', patient)
                        await addSingltObject('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', Values)
                        dispatch(ADD_PATIENTS(Values))
                        action.resetForm()
                        handelClear()
                        toast.success("Added Successfully.......");
                    } catch (error) {
                        toast.error(error.message)
                        console.error(error.message)
                    }
                } else {
                    toast.error("This Mobile No already Exist")
                }
            } else {
                let findindex = patient1.findIndex((item) => item.pid === Values.pid);
                patient1[findindex] = Values;
                try {
                    // await setData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', patient1)
                    await updateSingltObject('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', Values, 'pid', 'hospitaluid')
                    dispatch(EDIT_PATIENTS(Values))
                    action.resetForm()
                    handelClear()
                    toast.success("Updated Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message)
                }
            }
        }
    });

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik
    const patchData = () => {
        if (update) {
            formik.setFieldValue('pid', data.pid);
            formik.setFieldValue('pName', data.pName);
            formik.setFieldValue('pMobileNo', data.pMobileNo);
            formik.setFieldValue('pGender', data.pGender);
            formik.setFieldValue('page', data.page);
            formik.setFieldValue('pAddress', data.pAddress);
            formik.setFieldValue('drName', data.drName);
            formik.setFieldValue('hospitaluid', data.hospitaluid);
        }

    }
    const handelClear = () => {
        formik.setValues({
            pid: '',
            pName: '',
            page: '',
            pGender: '',
            pAddress: '',
            drName: '',
            pMobileNo: '',
            hospitaluid: ''
        })
        formik.resetForm();
        handleClose()
    }
    return (
        <>
            <Modal show={show} onHide={handelClear}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Patients</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form >
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Patient Name<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="text" className="form-control" placeholder="Enter patient name" name='pName' value={values.pName} onChange={handleChange} onBlur={handleBlur} />
                            {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Age<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="number" className="form-control" placeholder="Enter patient age" name='page' value={values.page} onChange={handleChange} onBlur={handleBlur} />
                            {errors.page && touched.page ? (<p style={{ color: 'red' }}>*{errors.page}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Gender<b style={{ color: 'red' }}>*</b>:</label>
                            <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='pGender' value={values.pGender} onChange={handleChange}>
                                <option >Select Gender</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Others'>Others</option>
                            </select>
                            {errors.pGender && touched.pGender ? (<p style={{ color: 'red' }}>*{errors.pGender}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Address<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="text" className="form-control" placeholder="Enter patient address" name='pAddress' value={values.pAddress} onChange={handleChange} onBlur={handleBlur} />
                            {errors.pAddress && touched.pAddress ? (<p style={{ color: 'red' }}>*{errors.pAddress}</p>) : null}
                        </div>

                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Mobile No<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} />
                            {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label >Dr Name:</label>
                            <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='drName' value={values.drName} onChange={handleChange}>
                                <option >Select Doctor</option>
                                {allDoctors?.map((option) => (
                                    <option key={option.druid} value={option.drName}>
                                        {option.drName}
                                    </option>
                                ))}

                            </select>

                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handelClear}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} >
                        {update ? 'Update' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* <Modal show={show} onHide={handleClose} size="lg">
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
                        Add Patient
                    </Button>
                </Modal.Footer>
            </Modal> */}

        </>
    )
}

export default Addpatientscommanmodel