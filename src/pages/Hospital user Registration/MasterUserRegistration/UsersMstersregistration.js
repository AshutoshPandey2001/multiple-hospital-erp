/* eslint-disable prettier/prettier */
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { masterUserRegistration } from 'src/schema'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from 'src/firebaseconfig';
import CommanTable from 'src/comman/table/CommanTable';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { toast } from 'react-toastify';
import firebase from 'firebase/compat/app'

const initalValues = {
    name: '',
    email: '',
    userType: '',
    password: '',
}
const UsersMstersregistration = () => {
    const [userMasterList, setUserMasterList] = useState([])
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true)

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
                if (res1.data().userType === "Patient") {

                } else {
                    temp_data.push(res1.data())
                }
                setUserMasterList(temp_data)
                setIsLoading(false)
            });

        })
    }, [])
    const handleShow = () => setShow(true);
    const handleClose = () => {
        formik.resetForm();
        setShow(false);
    }


    // const formik = useFormik({
    //     initialValues: initalValues,
    //     validationSchema: masterUserRegistration,
    //     onSubmit: (Values, action) => {
    //         createUserWithEmailAndPassword(auth, Values.email, Values.password)
    //             .then((userCredential) => {
    //                 var user = userCredential.user;
    //                 db.collection('UserList').doc(user.uid).set({
    //                     userEmail: Values.email,
    //                     userName: Values.name,
    //                     userType: Values.userType,
    //                     userPassword: Values.password,
    //                 }).then((res) => {

    //                 }).catch((err) => {

    //                 })
    //             })
    //             .catch((error) => {

    //             });
    //     }
    // });


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

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik
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
                            <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='userType' defaultValue={values.userType} onChange={handleChange}>
                                <option >Select User Type</option>
                                <option value='Admin'>Admin</option>
                                <option value='Reception'>Reception</option>
                                <option value='Medical'>Medical</option>
                                <option value='Laboratory'>Laboratory</option>
                            </select>
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