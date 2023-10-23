/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useEffect } from 'react'
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import CommanTable from 'src/comman/table/CommanTable'
import { getData, setData, updateDatainSubcollection, updateMultiDatainSubcollection, updateSingltObject } from 'src/services/firebasedb'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react'
import { useFormik } from 'formik'
import { taxSchema } from 'src/schema'
import { useDispatch, useSelector } from 'react-redux'
import { EDIT_TAX, selectAlltax } from 'src/redux/slice/taxSlice'
import { selectpermissions } from 'src/redux/slice/authSlice'

const initalValues = {
    taxUid: '',
    taxName: '',
    taxValue: undefined,
    hospitaluid: ''
}
const taxMaster = () => {
    const [show, setShow] = useState(false);
    const allTax = useSelector(selectAlltax)
    const [taxData, setTaxData] = useState([])
    const dispatch = useDispatch()
    const permissions = useSelector(selectpermissions)
    const [userpermissions, setUserpermissions] = useState([]);
    const columns = [
        { name: '#', selector: (row, index) => index + 1 },
        { name: 'Tax Name', selector: row => row.taxName, sortable: true },
        { name: 'Value', selector: row => row.taxValue, sortable: true },
        {
            name: 'Action', cell: row => <span>
                {userpermissions?.code?.includes('EDIT_TAX') ? (
                    <button onClick={() => editTax(row)} style={{ color: 'orange', border: 'none' }}>
                        <MdEdit size={25} />
                    </button>
                ) : null}
                {/* <button onClick={() => deleteTax(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button> */}
            </span>
        }
    ]
    useEffect(() => {

        setTaxData(allTax)
    }, [allTax])

    const handleClose = () => {
        setShow(false);
        formik.resetForm();
    }

    useEffect(() => {
        setUserpermissions(permissions?.find(permission => permission.module === "TAX"))
        console.log(permissions?.find(permission => permission.module === "TAX"), 'permissions?.find(permission => permission.module === "TAX")');
    }, [])
    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: taxSchema,
        onSubmit: async (Values, action) => {

            try {
                // await updateSingltObject('Tax', 'LZnOzIOavFxXLPkmFaWc', 'tax', Values, 'taxUid', 'hospitaluid')
                await updateDatainSubcollection('Tax', 'LZnOzIOavFxXLPkmFaWc', 'tax', Values, 'taxUid', 'hospitaluid')
                // dispatch(EDIT_TAX(Values))
                // await setData('Tax', 'LZnOzIOavFxXLPkmFaWc', 'tax', temp_Data)
                // await setTaxData(taxData.map((item) => (item.taxName === Values.taxName ? { ...item, taxValue: Values.taxValue } : item)))
                action.resetForm();

                setShow(false);
            } catch (error) {
                console.error(error);
            }

        }
    });
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik

    const editTax = (item) => {
        setShow(true)
        values.taxUid = item.taxUid;
        values.taxName = item.taxName;
        values.taxValue = item.taxValue;
        values.hospitaluid = item.hospitaluid;
    }
    const deleteTax = () => {

    }
    return (
        <>
            <>
                <CommanTable
                    title={"Tax"}
                    columns={columns}
                    data={taxData}
                />
            </>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Patients</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form >
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Tax:</label>
                            <input type="text" className="form-control" placeholder="Enter Tax Name" name='taxName' value={values.taxName} onChange={handleChange} onBlur={handleBlur} readOnly />
                            {errors.taxName && touched.taxName ? (<p style={{ color: 'red' }}>*{errors.taxName}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Value:</label>
                            <input type="number" className="form-control" placeholder="Enter Tax Value" name='taxValue' value={values.taxValue} onChange={handleChange} onBlur={handleBlur} />
                            {errors.taxValue && touched.taxValue ? (<p style={{ color: 'red' }}>*{errors.taxValue}</p>) : null}
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default taxMaster