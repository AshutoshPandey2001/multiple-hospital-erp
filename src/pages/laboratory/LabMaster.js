/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { laboratoryMasterhema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { AiFillDelete } from 'react-icons/ai'
import { ImCross } from 'react-icons/im'
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { ADD_PARAMETER, DELETE_PARAMETER, EDIT_PARAMETER, selectAllparameters } from 'src/redux/slice/laborataryMaster';
import { selectUserId } from 'src/redux/slice/authSlice';

const initalValues = {
    reportuid: '',
    reportName: '',
    isUnitRequired: false,
    reportPrice: '',
    hospitaluid: '',
    parameters: [
        {
            parameterName: '',
            normalRange: '',
        }
    ]
}
const LabMaster = () => {
    const dispatch = useDispatch()
    const allParameters = useSelector(selectAllparameters)
    const [show, setShow] = useState(false);
    const [parametersList, setParametersList] = useState([]);
    const [parametersFilter, setParametersFilter] = useState([]);
    const [update, setUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const hospitaluid = useSelector(selectUserId)

    const columns = [
        { name: 'Report UID', selector: row => row.reportuid, sortable: true },
        { name: 'Report Name', selector: row => row.reportName, sortable: true },
        { name: 'Price', selector: row => row.reportPrice, sortable: true },
        // { name: 'Price', selector: row => row.priceperNight, sortable: true },
        {
            name: 'Action', cell: row => <span><button onClick={() => editRooms(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                <button onClick={() => deleteRooms(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
            </span>
        }
    ]
    const handleClose = () => {
        formik.resetForm();
        setShow(false);
        clearForm();
        setUpdate(false)
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        setParametersList(allParameters)
        setParametersFilter(allParameters)
        setIsLoading(false)
    }, [allParameters])


    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: laboratoryMasterhema,
        onSubmit: async (Values, action) => {

            console.log('Lab Parameter', values);
            let parameter1 = [...parametersFilter]
            if (!update) {
                values.reportuid = Math.floor(1000 + Math.random() * 4905);
                values.hospitaluid = hospitaluid;
                let parameter = [...parametersFilter, Values]
                try {
                    // await addSingltObject('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', values)
                    await addDatainsubcollection('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', values)

                    // await setData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', parameter)
                    // dispatch(ADD_PARAMETER(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    toast.success("Added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {
                let findindex = parameter1.findIndex((item) => item.reportuid === Values.reportuid)
                parameter1[findindex] = Values;
                try {
                    // await updateSingltObject('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', Values, 'reportuid', 'hospitaluid')
                    await updateDatainSubcollection('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', Values, 'reportuid', 'hospitaluid')
                    // await setData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', parameter1)
                    // dispatch(EDIT_PARAMETER(Values))
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
    });
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;
    const clearForm = () => {
        formik.setValues({
            reportuid: '',
            reportName: '',
            isUnitRequired: false,
            reportPrice: '',
            hospitaluid: '',
            parameters: [
                {
                    parameterName: '',
                    normalRange: '',
                }
            ]

        });
    };
    const editRooms = (item) => {
        // filDatainsubcollection(allParameters, 'LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters')
        values.reportuid = item.reportuid;
        values.reportName = item.reportName;
        values.parameters = item.parameters;
        values.reportPrice = item.reportPrice;
        values.hospitaluid = item.hospitaluid;
        values.isUnitRequired = item.isUnitRequired
        setShow(true)
        setUpdate(true)
    }

    const deleteRooms = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let parameter = parametersFilter.filter((item) => item.reportuid !== item1.reportuid)
                        try {
                            // await deleteSingltObject('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', item1, 'reportuid', 'hospitaluid')
                            await deleteDatainSubcollection('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', item1, 'reportuid', 'hospitaluid')
                            // await setData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', parameter)
                            // dispatch(DELETE_PARAMETER(item1))
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
    // const unitrequired = (e) => {
    //     console.log('uniit required', e);
    //     // values.isUnitRequired = e
    //     if (e) {
    //         values.parameters = [
    //             {
    //                 parameterName: '',
    //                 unit: '',
    //                 normalRange: '',
    //             }
    //         ]
    //     } else {
    //         values.parameters = [
    //             {
    //                 parameterName: '',
    //                 normalRange: '',
    //             }
    //         ]
    //     }
    // }

    return <>
        {isLoading ? <Loaderspinner /> :
            <div>
                <CommanTable
                    title={"Report List"}
                    columns={columns}
                    data={parametersList}
                    action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                />
            </div>
        }
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Report Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormikProvider value={formik}>
                    <form >

                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Report Name:</label>
                            <input type="text" className="form-control" placeholder="Enter Report Name" name='reportName' value={values.reportName} onChange={handleChange} onBlur={handleBlur} />


                            {errors.reportName && touched.reportName ? (<p style={{ color: 'red' }}>*{errors.reportName}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Report Price:</label>
                            <input type="text" className="form-control" placeholder="Enter Report Price" name='reportPrice' value={values.reportPrice} onChange={handleChange} onBlur={handleBlur} />
                            {errors.reportPrice && touched.reportPrice ? (<p style={{ color: 'red' }}>*{errors.reportPrice}</p>) : null}
                        </div>
                        <div className="form-check" style={{ marginTop: '20px' }}>
                            <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" name='isUnitRequired' checked={values.isUnitRequired} onChange={handleChange} />If Unit is Required Please check the check box
                            </label>
                        </div>
                        {values.isUnitRequired ?
                            <FieldArray name='parameters'>
                                {({ remove, push }) => (
                                    <div className='row'>
                                        {values.parameters?.length > 0 && values.parameters.map((parameter, parameterIndex) => (
                                            <div className="card" key={parameterIndex} style={{ padding: ' 0 10px 10px 10px', marginTop: '20px' }}>
                                                <div className='d-flex justify-content-end'>
                                                    <span onClick={() => remove(parameterIndex)}><ImCross /></span>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-lg-4'>
                                                        <div className="form-group">
                                                            <label htmlFor={`parameters[${parameterIndex}].parameterName`}>Parameter Name</label>
                                                            <input name={`parameters[${parameterIndex}].parameterName`}
                                                                placeholder="Enter Parameter Name"
                                                                type="text" className="form-control" defaultValue={parameter.parameterName} onChange={handleChange} required />
                                                            {errors.parameters && errors.parameters[parameterIndex] && errors.parameters[parameterIndex].parameterName && touched.parameters && touched.parameters[parameterIndex] && touched.parameters[parameterIndex].parameterName ? (
                                                                <p style={{ color: 'red' }}>*{errors.parameters[parameterIndex].parameterName}</p>) : null}

                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4'>
                                                        <div className="form-group">
                                                            <label htmlFor={`parameters[${parameterIndex}].unit`}>Unit</label>
                                                            <input name={`parameters[${parameterIndex}].unit`}
                                                                placeholder="Enter unit"
                                                                type="text" className="form-control" defaultValue={parameter.unit} onChange={handleChange} required />


                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4'>
                                                        <div className="form-group">
                                                            <label htmlFor={`parameters[${parameterIndex}].normalRange`}>Normal Range</label>
                                                            <input name={`parameters[${parameterIndex}].normalRange`}
                                                                placeholder="Enter Normal Range"
                                                                type="text" className="form-control" defaultValue={parameter.normalRange} onChange={handleChange} required />


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                            <button
                                                type="button"
                                                className='btn btn-warning'
                                                onClick={() => push({ parameterName: '', unit: '', normalRange: '', })}
                                            >
                                                <BiPlus size={25} />  Add Parameter
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </FieldArray> :
                            <FieldArray name='parameters'>
                                {({ remove, push }) => (
                                    <div className='row'>
                                        {values.parameters?.length > 0 && values.parameters.map((parameter, parameterIndex) => (
                                            <div className="card" key={parameterIndex} style={{ padding: ' 0 10px 10px 10px', marginTop: '20px' }}>
                                                <div className='d-flex justify-content-end'>
                                                    <span onClick={() => remove(parameterIndex)}><ImCross /></span>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-lg-6'>
                                                        <div className="form-group">
                                                            <label htmlFor={`parameters[${parameterIndex}].parameterName`}>Parameter Name</label>
                                                            <input name={`parameters[${parameterIndex}].parameterName`}
                                                                placeholder="Enter Parameter Name"
                                                                type="text" className="form-control" defaultValue={parameter.parameterName} onChange={handleChange} required />
                                                            {errors.parameters && errors.parameters[parameterIndex] && errors.parameters[parameterIndex].parameterName && touched.parameters && touched.parameters[parameterIndex] && touched.parameters[parameterIndex].parameterName ? (
                                                                <p style={{ color: 'red' }}>*{errors.parameters[parameterIndex].parameterName}</p>) : null}

                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6'>
                                                        <div className="form-group">
                                                            <label htmlFor={`parameters[${parameterIndex}].normalRange`}>Normal Range</label>
                                                            <input name={`parameters[${parameterIndex}].normalRange`}
                                                                placeholder="Enter Normal Range"
                                                                type="text" className="form-control" defaultValue={parameter.normalRange} onChange={handleChange} required />


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                            <button
                                                type="button"
                                                className='btn btn-warning'
                                                onClick={() => push({ parameterName: '', normalRange: '', })}
                                            >
                                                <BiPlus size={25} />  Add Parameter
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </FieldArray>
                        }
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

export default LabMaster;
