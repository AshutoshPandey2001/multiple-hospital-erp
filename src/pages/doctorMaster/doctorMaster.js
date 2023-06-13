/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { drSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { addSingltObject, deleteSingltObject, setData, updateSingltObject } from 'src/services/firebasedb';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { ADD_DR, DELETE_DR, EDIT_DR, selectAllDr } from 'src/redux/slice/doctorsSlice';
import { ImCross } from 'react-icons/im'
import { selectUserId } from 'src/redux/slice/authSlice';

const initalValues = {
    druid: '',
    drName: '',
    hospitaluid: '',
    consultingCharges: [
        {
            visit: 'First Visit',
            charge: '',
        },
        {
            visit: 'Second Visit',
            charge: '',
        },
    ],
}
const doctorMaster = () => {
    const dispatch = useDispatch()
    const allDoctors = useSelector(selectAllDr)
    const [show, setShow] = useState(false);
    const [drList, setDrList] = useState([]);
    const [drFilter, setDrFilter] = useState([]);
    const [update, setUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const hospitaluid = useSelector(selectUserId)

    const columns = [
        { name: 'Id', selector: row => row.druid, sortable: true },
        { name: 'Dr Name', selector: row => row.drName, sortable: true },
        { name: 'Consulting Charge', selector: row => row.consultingCharges.map((charge) => '₹' + charge.charge).toString(), sortable: true },
        {
            name: 'Action', cell: row => <span><button onClick={() => editDoctor(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                <button onClick={() => deleteDoctor(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
            </span>
        }
    ]
    const handleClose = () => {
        formik.resetForm();
        clearForm()
        setShow(false);
        setUpdate(false)
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        setDrList(allDoctors)
        setDrFilter(allDoctors)
        setIsLoading(false)

    }, [allDoctors])


    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: drSchema,
        onSubmit: async (Values, action) => {

            console.log('values', values);
            let doctor1 = [...drFilter]
            if (!update) {
                values.druid = Math.floor(2000 + Math.random() * 7000);
                values.hospitaluid = hospitaluid;
                let doctor = [...drFilter, Values]
                try {
                    // await setData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', doctor)
                    await addSingltObject('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', values)
                    dispatch(ADD_DR(Values))
                    action.resetForm();
                    clearForm()
                    setShow(false)
                    toast.success("Doctor Details added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {
                let findindex = doctor1.findIndex((item) => item.druid === Values.druid)
                doctor1[findindex] = Values;
                try {
                    // await setData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', doctor1)
                    await updateSingltObject('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', doctor1, 'druid', 'hospitaluid')
                    dispatch(EDIT_DR(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Doctor Details Updated Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            }



        }
    });
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik
    const clearForm = () => {
        formik.setValues({
            druid: '',
            drName: '',
            hospitaluid: '',
            consultingCharges: [
                {
                    visit: 'First Visit',
                    charge: '',
                },
                {
                    visit: 'Second Visit',
                    charge: '',
                },
            ],
        });
    }
    const editDoctor = (item) => {
        values.drName = item.drName;
        values.druid = item.druid;
        values.hospitaluid = item.hospitaluid
        values.consultingCharges = item.consultingCharges;
        setShow(true)
        setUpdate(true)
    }

    const deleteDoctor = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let room = drFilter.filter((item) => item.druid !== item1.druid)
                        try {
                            await setData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', room)
                            dispatch(DELETE_DR(item1))
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


    return <>
        {isLoading ? <Loaderspinner /> :
            <div>
                <CommanTable
                    title={"Doctors"}
                    columns={columns}
                    data={drList}
                    action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={30} /></span></button>}
                />
            </div>
        }
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Doctor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormikProvider value={formik}>
                    <form >

                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                            <input className="form-control" placeholder='Enter Dr Name' name='drName' defaultValue={values.drName} onChange={handleChange} />
                            {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}
                        </div>

                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Consulting Charges<b style={{ color: 'red' }}>*</b>:</label>
                            {/* <input type="number" className="form-control" placeholder="Enter Consulting Charges" name='consultingCharge' value={values.consultingCharge} onChange={handleChange} onBlur={handleBlur} />
                            {errors.consultingCharge && touched.consultingCharge ? (<p style={{ color: 'red' }}>*{errors.consultingCharge}</p>) : null} */}
                        </div>
                        <FieldArray name="consultingCharges">
                            {({ insert, remove, push }) => (
                                <div>
                                    {values.consultingCharges?.length > 0 &&
                                        values.consultingCharges.map((charge, index) => (
                                            <div key={index} style={{ padding: ' 0 10px 10px 10px', marginTop: '20px' }}>
                                                <div className='d-flex justify-content-end'>

                                                    <span onClick={() => remove(index)}><ImCross /></span>

                                                </div>
                                                <div className='row'>
                                                    <div className='col-lg-6'>
                                                        <div className="form-group">
                                                            <label htmlFor={`consultingCharges.${index}.visit`}>Visit Name<b style={{ color: 'red' }}>*</b>:</label>
                                                            <input className="form-control" placeholder='Enter Visit Name' name={`consultingCharges.${index}.visit`} value={charge.visit} onChange={handleChange} />

                                                            {/* <SearchAutocomplete
                                                                allPatients={chargeList}
                                                                handleOnSelect={(e) => selectcharge(e, charge)}
                                                                inputsearch={charge.visit}
                                                                placeholder={'Enter charge Name'}
                                                                keyforSearch={"chargeName"}
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
                                                                }} /> */}

                                                            {/* {errors.consultingCharges && errors.consultingCharges[index] && errors.consultingCharges[index].visit && touched.consultingCharges && touched.consultingCharges[index] && touched.consultingCharges[index].visit ? (
                                                                <p style={{ color: 'red' }}>*{errors.consultingCharges[index].visit}</p>) : null} */}

                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6'>
                                                        <div className="form-group">
                                                            <label htmlFor={`consultingCharges.${index}.charge`}>Charge<b style={{ color: 'red' }}>*</b>:</label>
                                                            <input name={`consultingCharges.${index}.charge`}
                                                                placeholder="Enter Price"
                                                                type="number" className="form-control" value={charge.charge} onChange={handleChange} required />
                                                            {/* {errors.consultingCharges && errors.consultingCharges[index] && errors.consultingCharges[index].charge && touched.consultingCharges && touched.consultingCharges[index] && touched.consultingCharges[index].charge ? (
                                                                <p style={{ color: 'red' }}>*{errors.consultingCharges[index].charge}</p>) : null} */}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}

                                    <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                        <button
                                            type="button"
                                            className='btn btn-success'
                                            onClick={() => push({ visit: '', charge: '' })}
                                        >
                                            <BiPlus size={25} />  Add Charge
                                        </button>
                                    </div>


                                </div>
                            )}
                        </FieldArray>
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

export default doctorMaster;
