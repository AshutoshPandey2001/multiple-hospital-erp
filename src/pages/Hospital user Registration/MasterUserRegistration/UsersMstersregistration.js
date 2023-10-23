/* eslint-disable prettier/prettier */
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { masterUserRegistration } from 'src/schema'
import { BiPlus } from 'react-icons/bi'
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from 'src/firebaseconfig';
import CommanTable from 'src/comman/table/CommanTable';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { toast } from 'react-toastify';
import firebase from 'firebase/compat/app'
import { selectUserId, selectpermissions } from 'src/redux/slice/authSlice';
import { useSelector } from 'react-redux';
// import Accordion from 'react-bootstrap/Accordion';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';
import { selectAllRoles } from 'src/redux/slice/userRolesSlice';

const initalValues = {
    name: '',
    email: '',
    userType: '',
    password: '',
    permissions: undefined
}
// const rolesPermissions = [
//     {
//         role: 'Opd Reception', permissions: [
//             { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//             { module: "DASHBOARD", code: [] },
//             { module: "OPD", code: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"] }
//         ]
//     },
//     {
//         role: 'Indoor Reception', permissions: [
//             { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//             { module: "DASHBOARD", code: [] },
//             { module: "HOME", code: [] },
//             { module: "INDOOR", code: ['ADD_INDOOR', "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"] },
//             { module: "ROOMS", code: ['ADD_ROOMS', "VIEW_ROOMS", "EDIT_ROOMS", "DELETE_ROOMS", "INVOICE_ROOMS"] },
//             { module: "DISCHARGE", code: ['ADD_DISCHARGE', "VIEW_DISCHARGE", "EDIT_DISCHARGE", "DELETE_DISCHARGE", "INVOICE_DISCHARGE"] }
//         ]
//     },
//     {
//         role: 'Medical', permissions: [
//             { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//             { module: "DASHBOARD", code: [] },
//             { module: "MEDICAL", code: ['ADD_MEDICAL', "VIEW_MEDICAL", "EDIT_MEDICAL", "DELETE_MEDICAL", "INVOICE_MEDICAL"] }
//         ]
//     },
//     {
//         role: 'Laboratory', permissions: [
//             { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//             { module: "DASHBOARD", code: [] },
//             { module: "LABORATORY", code: ['ADD_LABORATORY', "VIEW_LABORATORY", "EDIT_LABORATORY", "DELETE_LABORATORY", "INVOICE_LABORATORY"] }
//         ]
//     },
//     {
//         role: 'Admin', permissions: [
//             { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//             { module: "DASHBOARD", code: [] },
//             { module: "HOME", code: [] },
//             { module: "INDOOR", code: ['ADD_INDOOR', "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"] },
//             { module: "ROOMS", code: ['ADD_ROOMS', "VIEW_ROOMS", "EDIT_ROOMS", "DELETE_ROOMS", "INVOICE_ROOMS"] },
//             { module: "DISCHARGE", code: ['ADD_DISCHARGE', "VIEW_DISCHARGE", "EDIT_DISCHARGE", "DELETE_DISCHARGE", "INVOICE_DISCHARGE"] },
//             { module: "OPD", code: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"] },
//             { module: "MEDICAL", code: ['ADD_MEDICAL', "VIEW_MEDICAL", "EDIT_MEDICAL", "DELETE_MEDICAL", "INVOICE_MEDICAL"] },
//             { module: "LABORATORY", code: ['ADD_LABORATORY', "VIEW_LABORATORY", "EDIT_LABORATORY", "DELETE_LABORATORY", "INVOICE_LABORATORY"] },
//             { module: "USERSMASTER", code: ['ADD_USER', "VIEW_USER", "EDIT_USER", "DELETE_USER", "INVOICE_USER"] },
//             { module: "DOCTORS", code: ['ADD_DOCTORS', "VIEW_DOCTORS", "EDIT_DOCTORS", "DELETE_DOCTORS"] },
//             { module: "CHARGES", code: ['ADD_CHARGES', "VIEW_CHARGES", "EDIT_CHARGES", "DELETE_CHARGES"] },
//             { module: "TAX", code: ['ADD_TAX', "VIEW_TAX", "EDIT_TAX", "DELETE_TAX"] },
//             { module: "HOSPITALPROFILE", code: ['ADD_HOSPITALPROFILE', "VIEW_HOSPITALPROFILE", "EDIT_HOSPITALPROFILE", "DELETE_HOSPITALPROFILE"] },

//         ]
//     },
//     {
//         role: 'Reception', permissions: [
//             { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//             { module: "DASHBOARD", code: [] },
//             { module: "HOME", code: [] },
//             { module: "INDOOR", code: ['ADD_INDOOR', "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"] },
//             { module: "ROOMS", code: ['ADD_ROOMS', "VIEW_ROOMS", "EDIT_ROOMS", "DELETE_ROOMS", "INVOICE_ROOMS"] },
//             { module: "DISCHARGE", code: ['ADD_DISCHARGE', "VIEW_DISCHARGE", "EDIT_DISCHARGE", "DELETE_DISCHARGE", "INVOICE_DISCHARGE"] },
//             { module: "OPD", code: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"] },
//             { module: "MEDICAL", code: ['ADD_MEDICAL', "VIEW_MEDICAL", "EDIT_MEDICAL", "DELETE_MEDICAL", "INVOICE_MEDICAL"] },
//             { module: "LABORATORY", code: ['ADD_LABORATORY', "VIEW_LABORATORY", "EDIT_LABORATORY", "DELETE_LABORATORY", "INVOICE_LABORATORY"] },
//             // { module: "USERSMASTER", code: ['ADD_USER', "VIEW_USER", "EDIT_USER", "DELETE_USER", "INVOICE_USER"] },
//             // { module: "DOCTORS", code: ['ADD_DOCTORS', "VIEW_DOCTORS", "EDIT_DOCTORS", "DELETE_DOCTORS"] },
//             // { module: "CHARGES", code: ['ADD_CHARGES', "VIEW_CHARGES", "EDIT_CHARGES", "DELETE_CHARGES"] },
//             // { module: "TAX", code: ['ADD_TAX', "VIEW_TAX", "EDIT_TAX", "DELETE_TAX"] },
//             // { module: "HOSPITALPROFILE", code: ['ADD_HOSPITALPROFILE', "VIEW_HOSPITALPROFILE", "EDIT_HOSPITALPROFILE", "DELETE_HOSPITALPROFILE"] },

//         ]
//     },
//     // {
//     //     role: 'Reception', permissions: [
//     //         { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//     //         { module: "OPD", code: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"] },
//     //         { module: "INDOOR", code: ['ADD_INDOOR', "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"] }
//     //     ]
//     // },
//     // {
//     //     role: 'Reception', permissions: [
//     //         { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
//     //         { module: "OPD", code: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"] },
//     //         { module: "INDOOR", code: ['ADD_INDOOR', "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"] }
//     //     ]
//     // }
// ]
const UsersMstersregistration = () => {
    const [userMasterList, setUserMasterList] = useState([])
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const hospitaluid = useSelector(selectUserId)
    const rolesPermissions = useSelector(selectAllRoles)
    const permissions = useSelector(selectpermissions)
    const [userpermissions, setUserpermissions] = useState([]);
    const columns = [
        { name: '#', selector: (row, index) => index + 1 },
        { name: 'Name', selector: row => row.userName, sortable: true },
        { name: 'Email', selector: row => row.userEmail, sortable: true },
        { name: 'Type', selector: row => row.userType, sortable: true },
        { name: 'Password', selector: row => row.userPassword },
    ]
    useEffect(() => {
        db.collection("UserList").get().then((res) => {
            let temp_data = []
            res.docs.forEach((res1) => {
                if (res1.data().userType !== "Patient" && res1.data().hospitaluid === hospitaluid) {
                    temp_data.push(res1.data())
                } else {
                }
                setUserMasterList(temp_data)
                setIsLoading(false)
            });

        })
        setUserpermissions(permissions?.find(permission => permission.module === "USERSMASTER"))
    }, [])
    const handleShow = () => setShow(true);
    const handleClose = () => {
        formik.resetForm();
        setShow(false);
    }



    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: masterUserRegistration,
        onSubmit: async (values, action) => {
            try {

                const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                const user = userCredential.user;


                await db.collection('UserList').doc(user.uid).set({
                    userEmail: values.email,
                    userName: values.name,
                    userType: values.userType,
                    userPassword: values.password,
                    hospitaluid: hospitaluid,
                    permissions: values.permissions
                });

                toast.success("User Registration successfully Completed.....");
                handleClose()
                // Handle successful registration here
                // You can redirect to a different page or show a success message

            } catch (error) {
                toast.error(error.message);
                console.log('error', error);
                // Handle error during user registration or authentication
            }
        }
    });
    const selectRole = async (item) => {
        console.log('selected roles', item);
        const selectedRole = await rolesPermissions.find((item1) => item1.role === item); // Find the corresponding doctor object
        formik.setFieldValue('userType', selectedRole.role);
        formik.setFieldValue('permissions', selectedRole.permissions);
        console.log('selected roles', selectedRole);

        // setFieldValue('userType', item.role)
        // setFieldValue('permissions', item.permissions)
        // values.userType = item.role;
        // values.permissions = item.permissions;
    }
    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = formik
    return (
        <>
            {isLoading ? <Loaderspinner /> :
                <div>
                    <CommanTable
                        title={"Users"}
                        columns={columns}
                        data={userMasterList}
                        action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={30} /></span></button>}
                    />
                </div>
            }


            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form >
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Name<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="text" className="form-control" placeholder="Enter Name" name='name' value={values.name} onChange={handleChange} onBlur={handleBlur} />
                            {errors.name && touched.name ? (<p style={{ color: 'red' }}>*{errors.name}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Email<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="email" className="form-control" placeholder="Enter Email Address" name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} />
                            {errors.email && touched.email ? (<p style={{ color: 'red' }}>*{errors.email}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Password<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="password" className="form-control" placeholder="Enter Password" name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} />
                            {errors.password && touched.password ? (<p style={{ color: 'red' }}>*{errors.password}</p>) : null}
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>User Type<b style={{ color: 'red' }}>*</b>:</label>
                            <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='userType' value={values.userType} onChange={(e) => { selectRole(e.target.value) }}>
                                <option >Select User Type</option>
                                {rolesPermissions?.map((option) => (
                                    <option key={option.role} value={option.role}>
                                        {option.role}
                                    </option>
                                ))}

                            </select>
                            {/* <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='userType' defaultValue={values.userType} onChange={handleChange}>
                                <option >Select User Type</option>
                                <option value='Admin'>Admin</option>
                                <option value='Reception'>Reception</option>
                                <option value='Medical'>Medical</option>
                                <option value='Laboratory'>Laboratory</option>
                            </select> */}
                            {errors.userType && touched.userType ? (<p style={{ color: 'red' }}>*{errors.userType}</p>) : null}
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default UsersMstersregistration