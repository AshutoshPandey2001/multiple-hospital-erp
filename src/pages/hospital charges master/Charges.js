/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import { drSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { ADD_CHARGE, DELETE_CHARGE, EDIT_CHARGE, selectAllCharges } from 'src/redux/slice/chargesSlice';
import { selectUserId } from 'src/redux/slice/authSlice';

const initalValues = {
    hospitaluid: '',
    chargeuid: '',
    chargeName: '',
    selected: false,
}
const Charges = () => {
    const dispatch = useDispatch()
    const allCharges = useSelector(selectAllCharges)
    const [show, setShow] = useState(false);
    const [charges, setCharges] = useState([]);
    const [chargesFilter, setChargesFilter] = useState([]);
    const [update, setUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const hospitaluid = useSelector(selectUserId)

    const columns = [
        { name: 'Id', selector: row => row.chargeuid, sortable: true },
        { name: 'Charge Name', selector: row => row.chargeName, sortable: true },
        {
            name: 'Action', cell: row => <span><button onClick={() => editCharges(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                <button onClick={() => deleteCharges(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
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
        setCharges(allCharges)
        setChargesFilter(allCharges)
        setIsLoading(false)

    }, [allCharges])


    const formik = useFormik({
        initialValues: initalValues,
        // validationSchema: drSchema,
        onSubmit: async (Values, action) => {


            let charge = [...chargesFilter]
            if (!update) {
                values.chargeuid = Math.floor(4567 + Math.random() * 7965);
                values.hospitaluid = hospitaluid;
                let charges1 = [...chargesFilter, Values]
                try {
                    // await setData('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', charges1)
                    // await addSingltObject('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', values)
                    await addDatainsubcollection('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', values)
                    // dispatch(ADD_CHARGE(Values))
                    action.resetForm();
                    clearForm()
                    setShow(false)
                    toast.success("Charge added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {
                let findindex = charge.findIndex((item) => item.chargeuid === Values.chargeuid)
                charge[findindex] = Values;
                try {
                    // await setData('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', charge)
                    // await updateSingltObject('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', values, 'chargeuid', 'hospitaluid')
                    await updateDatainSubcollection('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', values, 'chargeuid', 'hospitaluid')
                    // dispatch(EDIT_CHARGE(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Charge Updated Successfully.......");
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
            hospitaluid: '',
            chargeuid: '',
            chargeName: '',
            selected: false
        });
    }
    const editCharges = (item) => {
        // filDatainsubcollection(allCharges, 'Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', hospitaluid)
        values.chargeName = item.chargeName;
        values.chargeuid = item.chargeuid;
        values.selected = item.selected;
        values.hospitaluid = item.hospitaluid;
        setShow(true)
        setUpdate(true)
    }

    const deleteCharges = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let charges = chargesFilter.filter((item) => item.chargeuid !== item1.chargeuid)
                        try {
                            // await deleteSingltObject('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', item1, 'chargeuid', 'hospitaluid')
                            await deleteDatainSubcollection('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', item1, 'chargeuid', 'hospitaluid')
                            // await setData('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', charges)
                            // dispatch(DELETE_CHARGE(item1))
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
                    title={"Charges"}
                    columns={columns}
                    data={charges}
                    action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={30} /></span></button>}
                />
            </div>
        }
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Charge</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form >

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Charge Name<b style={{ color: 'red' }}>*</b>:</label>
                        <input className="form-control" placeholder='Enter Charge Name' name='chargeName' defaultValue={values.chargeName} onChange={handleChange} />
                        {/* {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null} */}
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

export default Charges;
