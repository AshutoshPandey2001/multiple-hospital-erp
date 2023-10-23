/* eslint-disable prettier/prettier */
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommanTable from 'src/comman/table/CommanTable'
import { auth, db, storage } from 'src/firebaseconfig'
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { masterUserRegistration } from 'src/schema'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik'
import { toast } from 'react-toastify';
import { addDatainsubcollection, updateHospitalProfile } from 'src/services/firebasedb'
import { MdEdit } from 'react-icons/md'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setTimeout } from 'core-js'

const initalValues = {
    name: '',
    email: '',
    userType: 'Super Admin',
    hospitslName: '',
    password: '',
    hospitslLogo: '',
    type: '',
    hospitalAddress: '',
    contactNumber: '',
    hospitaluid: '',
}
const Management = () => {
    const [userMasterList, setUserMasterList] = useState([])
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [update, setUpdate] = useState(false)
    // const hospitaluid = useSelector(selectUserId)
    const [image, setImage] = useState(null);
    const [permissions, setPermissions] = useState([
        { module: "PATIENTS", code: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"] },
        { module: "OPD", code: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"] },
        { module: "INDOOR", code: ["ADD_INDOOR", "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"] },
        { module: "ROOMS", code: ['ADD_ROOMS', "VIEW_ROOMS", "EDIT_ROOMS", "DELETE_ROOMS", "INVOICE_ROOMS"] },
        { module: "DISCHARGE", code: ['ADD_DISCHARGE', "VIEW_DISCHARGE", "EDIT_DISCHARGE", "DELETE_DISCHARGE", "PRINT_DISCHARGE"] },
        { module: "MEDICAL", code: ['ADD_MEDICAL', "VIEW_MEDICAL", "EDIT_MEDICAL", "DELETE_MEDICAL", "INVOICE_MEDICAL"] },
        { module: "LABORATORY", code: ['ADD_LABORATORY', "VIEW_LABORATORY", "EDIT_LABORATORY", "DELETE_LABORATORY", "PRINT_LABORATORY"] },
        { module: "CHARGES", code: ['ADD_CHARGES', "VIEW_CHARGES", "EDIT_CHARGES", "DELETE_CHARGES"] },
        { module: "USERSMASTER", code: ['ADD_USER', "VIEW_USER", "EDIT_USER", "DELETE_USER", "INVOICE_USER"] },
        { module: "DOCTORS", code: ['ADD_DOCTORS', "VIEW_DOCTORS", "EDIT_DOCTORS", "DELETE_DOCTORS"] },
        { module: "TAX", code: ['ADD_TAX', "VIEW_TAX", "EDIT_TAX", "DELETE_TAX"] },
        { module: "HOSPITALPROFILE", code: ['ADD_HOSPITALPROFILE', "VIEW_HOSPITALPROFILE", "EDIT_HOSPITALPROFILE", "DELETE_HOSPITALPROFILE"] },
        { module: "ROLEMASTER", code: ['ADD_ROLES', "VIEW_ROLES", "EDIT_ROLES", "DELETE_ROLES"] },
        { module: "DASHBOARD", code: [] },
        { module: "HOME", code: [] },
    ])
    const columns = [
        { name: '#', selector: (row, index) => index + 1 },
        {
            name: 'Logo', selector: row => row.hospitslLogo ? <img
                src={row.hospitslLogo}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '50px' }}
            /> : '-', sortable: true
        },
        { name: 'Hospital Name', selector: row => row.hospitslName ? row.hospitslName : '-', sortable: true },
        { name: 'User Name', selector: row => row.userName, sortable: true },
        { name: 'Email', selector: row => row.userEmail, sortable: true },
        { name: 'Type', selector: row => row.userType, sortable: true },
        { name: 'Password', selector: row => row.userPassword },
        {
            name: 'Action', cell: row => <span style={{ display: 'flex', justifyContent: 'center' }}>

                <>
                    <button onClick={() => editHospitaDetails(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                </>

                {/* <button onClick={() => deletePatientsDetails(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button> */}
            </span >
        }
    ]
    useEffect(() => {
        let temp_data = []
        db.collection("HospitalMaster").doc('S4fRJIO5ZxE5isoBIbEU').collection('hospitalMaster').get().then((res) => {

            res.docs.forEach((res1) => {

                temp_data.push(res1.data())
                setIsLoading(false)
            });
            console.log('Hospital Master', temp_data);

        })

        let temp_data1 = []
        db.collection("UserList").get().then((res) => {
            res.docs.forEach((res1) => {
                if (res1.data().userType === "Super Admin") {
                    temp_data1.push(res1.data())
                } else {
                }
                setIsLoading(false)
            });
            console.log('Hospital Super Admin', temp_data1);
            const merged = temp_data1.map((data) => {
                const matchedData = temp_data.find(data1 => data1.hospitaluid === data.hospitaluid);

                if (matchedData) {
                    const newObj = { ...data, ...matchedData };
                    return newObj;
                } else {
                    return data;
                }
            });

            console.log('Hospital merged', merged);


            setUserMasterList(merged)

        })
    }, [])
    const handleShow = () => setShow(true);
    const handleClose = () => {
        formik.resetForm();
        setShow(false);
        setUpdate(false)
    }



    const formik = useFormik({
        initialValues: initalValues,
        validationSchema: masterUserRegistration,
        onSubmit: async (values, action) => {

            if (!update) {
                try {
                    // setTimeout(async () => {
                    const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                    const user = userCredential.user;
                    if (image) {
                        const storageRef = await ref(storage, `${user.uid}`);
                        await uploadBytesResumable(storageRef, image).then(() => {
                            getDownloadURL(storageRef).then(async (downloadURL) => {
                                values.hospitslLogo = downloadURL
                                console.log('downloadURL', downloadURL);
                            });
                        });
                    }
                    await db.collection('UserList').doc(user.uid).set({
                        userEmail: values.email,
                        userName: values.name,
                        userType: values.userType,
                        userPassword: values.password,
                        hospitaluid: user.uid,
                        permissions: permissions
                    });

                    addDatainsubcollection('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', {
                        hospitslLogo: values.hospitslLogo ? values.hospitslLogo : '',
                        hospitslName: values.hospitslName,
                        hospitalAddress: values.hospitalAddress,
                        contactNumber: values.contactNumber,
                        hospitaluid: user.uid,
                        type: values.type,
                    })
                    action.resetForm()
                    toast.success("User Registration successfully Completed.....");
                    handleClose()
                    // }, 5000);

                    // Handle successful registration here
                    // You can redirect to a different page or show a success message

                } catch (error) {
                    toast.error(error.message);
                    console.log('error', error);
                    // Handle error during user registration or authentication
                }
            } else {
                try {

                    await db.collection('UserList').where('hospitaluid', '==', values.hospitaluid).where('userType', '==', values.userType).get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(doc => {
                                doc.ref.update({
                                    userEmail: values.email,
                                    userName: values.name,
                                    userType: values.userType,
                                    userPassword: values.password,
                                    hospitaluid: values.hospitaluid,
                                    permissions: permissions

                                })
                                    .then(() => {
                                        console.log('Document successfully updated!');
                                    })
                                    .catch(error => {
                                        console.error('Error updating document: ', error);
                                    });
                            });
                        })
                        .catch(error => {
                            console.log('Error getting documents: ', error);
                        });

                    if (image) {
                        const storageRef = await ref(storage, `${values.hospitaluid}`);
                        await uploadBytesResumable(storageRef, image).then(() => {
                            getDownloadURL(storageRef).then(async (downloadURL) => {
                                values.hospitslLogo = downloadURL
                                console.log('downloadURL', downloadURL);
                            });
                        });
                    } else {

                    }
                    const parentDocRef = await db.collection('HospitalMaster').doc('S4fRJIO5ZxE5isoBIbEU');

                    // Access the specific subcollection
                    const subcollectionRef = await parentDocRef.collection('hospitalMaster');
                    const query = await subcollectionRef.where('hospitaluid', '==', values.hospitaluid)

                    query.get()
                        .then(querySnapshot => {
                            console.log('querySnapshot', querySnapshot.docs);
                            if (querySnapshot.docs.length > 0) {
                                querySnapshot.forEach(doc => {
                                    doc.ref.update({
                                        hospitslLogo: values.hospitslLogo ? values.hospitslLogo : '',
                                        hospitslName: values.hospitslName,
                                        hospitalAddress: values.hospitalAddress,
                                        contactNumber: values.contactNumber,
                                        hospitaluid: values.hospitaluid,
                                        type: values.type,
                                    })
                                        .then(() => {
                                            console.log('Document successfully updated!');
                                        })
                                        .catch(error => {
                                            console.error('Error updating document: ', error);
                                        });
                                });
                            } else {
                                addDatainsubcollection('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', {
                                    hospitslLogo: values.hospitslLogo ? values.hospitslLogo : '',
                                    hospitslName: values.hospitslName,
                                    hospitalAddress: values.hospitalAddress,
                                    contactNumber: values.contactNumber,
                                    hospitaluid: values.hospitaluid,
                                    type: values.type,
                                })
                            }

                        })
                        .catch(error => {
                            console.log('Error getting documents: ', error, values);
                        });
                    // updateHospitalProfile('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', {
                    //     hospitslLogo: values.hospitslLogo,
                    //     hospitslName: values.hospitslName,
                    //     hospitalAddress: values.hospitalAddress,
                    //     contactNumber: values.contactNumber,
                    //     hospitaluid: values.hospitaluid,
                    // })
                    action.resetForm()

                    toast.success("Hospital Details Updated Successfully.....");
                    handleClose()
                    // Handle successful registration here
                    // You can redirect to a different page or show a success message

                } catch (error) {
                    toast.error(error.message);
                    console.log('error', error);
                    // Handle error during user registration or authentication
                }
            }

        }
    });

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik
    const handleImageChange = async (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage)
        console.log('selectedImage', selectedImage);

        //     try {

        //         const storageRef = ref(storage, `${hospitaluid}`);

        //         await uploadBytesResumable(storageRef, selectedImage).then(() => {
        //             getDownloadURL(storageRef).then(async (downloadURL) => {
        //                 values.hospitslLogo = downloadURL
        //                 console.log('downloadURL', downloadURL);
        //             });
        //         });
        //     } catch (error) {
        //         console.log('error', error);
        //     }
    };
    const editHospitaDetails = (item) => {
        setUpdate(true)
        values.hospitslName = item.hospitslName;
        values.hospitaluid = item.hospitaluid;
        values.hospitslLogo = item.hospitslLogo;
        values.contactNumber = item.contactNumber;
        values.userType = item.userType;
        values.name = item.userName
        values.email = item.userEmail;
        values.hospitalAddress = item.hospitalAddress;
        values.type = item.type;
        values.password = item.userPassword;
        setShow(true)
    }
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
                    <div className="text-center mb-4">
                        {/*   <input style={{ display: "none" }} type='file' id='file' onChange={handleImageChange} />
                        <label htmlFor='file' className="image-container"> */}
                        <img
                            src={values.hospitslLogo}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ width: '100px' }}
                        />
                        {/* <span className="edit-icon">
                                <i className="fas fa-edit"><BsCloudUploadFill color='#0d6efd' /></i>
                            </span>
                        </label> */}
                    </div>
                    <form >
                        <div className="form-group">
                            <label > Upload Logo:</label>
                            <input
                                type="file"
                                className="form-control"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Hospital Name<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="text" className="form-control" placeholder="Enter Name" name='hospitslName' value={values.hospitslName} onChange={handleChange} onBlur={handleBlur} />
                            {errors.hospitslName && touched.hospitslName ? (<p style={{ color: 'red' }}>*{errors.hospitslName}</p>) : null}
                        </div>
                        <div className="form-group " style={{ marginTop: '20px' }}>
                            <label >Address:</label>
                            <textarea className="form-control" rows="3" id="address" name='hospitalAddress' placeholder='Enter Hospital Address.....'
                                defaultValue={values.hospitalAddress}
                                onChange={handleChange}
                            ></textarea>

                        </div>
                        <div className="form-group " style={{ marginTop: '20px' }}>
                            <label>Contact Information:</label>
                            <input
                                name='contactNumber'
                                type="text"
                                className="form-control"
                                defaultValue={values.contactNumber}
                                onChange={handleChange}
                                placeholder='Enter Your Contact Number'
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>User Name<b style={{ color: 'red' }}>*</b>:</label>
                            <input type="text" className="form-control" placeholder="Enter Name" name='name' value={values.name} onChange={handleChange} onBlur={handleBlur} />
                            {errors.name && touched.name ? (<p style={{ color: 'red' }}>*{errors.name}</p>) : null}
                        </div>
                        {
                            !update ? <>

                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Email<b style={{ color: 'red' }}>*</b>:</label>
                                    <input type="email" className="form-control" placeholder="Enter Email Address" name='email' readOnly={update} value={values.email} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.email && touched.email ? (<p style={{ color: 'red' }}>*{errors.email}</p>) : null}
                                </div>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Password<b style={{ color: 'red' }}>*</b>:</label>
                                    <input type="password" className="form-control" placeholder="Enter Password" name='password' readOnly={update} value={values.password} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.password && touched.password ? (<p style={{ color: 'red' }}>*{errors.password}</p>) : null}
                                </div> </> : null}
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label>Type<b style={{ color: 'red' }}>*</b>:</label>
                            <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='type' defaultValue={values.type} onChange={handleChange}>
                                <option >Select Type</option>
                                <option value='Hospital'>Hospital</option>
                                <option value='Clinic'>Clinic</option>
                                <option value='Medical'>Medical</option>
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
                        {update ? 'Update' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Management