/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import hospitalimg from 'src/assets/images/hospitalerp.png'
import './hospitalprofile.css'
import { BsCloudUploadFill } from 'react-icons/bs'
import { useFormik } from 'formik';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from 'src/firebaseconfig';
import { selectUserId } from 'src/redux/slice/authSlice';
import { useSelector } from 'react-redux';
import { addDatainsubcollection, updateDatainSubcollection, updateHospitalProfile } from 'src/services/firebasedb';
import { selectContactnumber, selectHospitalAddress, selectHospitalLogo, selectHospitalName } from 'src/redux/slice/hospitalProfileSlice';
import Subscription from '../subscription/subscription.js';

const initalValues = {
    hospitslLogo: '',
    hospitslName: '',
    hospitalAddress: '',
    contactNumber: '',
    hospitaluid: '',
}
const HospitalProfile = () => {
    const hospitaluid = useSelector(selectUserId)
    const hospitslLogo = useSelector(selectHospitalLogo)
    const hospitalAddress = useSelector(selectHospitalAddress)
    const hospitslName = useSelector(selectHospitalName)
    const contactNumber = useSelector(selectContactnumber)
    const [image, setImage] = useState(null);

    const [update, setUpdate] = useState(false)
    useEffect(() => {
        if (hospitslLogo || hospitalAddress || hospitslName || contactNumber) {
            values.hospitslLogo = hospitslLogo
            values.hospitalAddress = hospitalAddress
            values.hospitslName = hospitslName
            values.contactNumber = contactNumber
            setUpdate(true)
        }
    }, [hospitslLogo, hospitalAddress, hospitslName, contactNumber])


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

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     // Handle form submission here (e.g., send data to a server)
    //     // You can access the form values in the corresponding state variables (name, address, contact, image)
    //     // Reset the form state after successful submission
    //     setName('');
    //     setAddress('');
    //     setContact('');
    //     setImage(null);
    // };

    const formik = useFormik({
        initialValues: initalValues,
        // validationSchema: opdformSchema,
        onSubmit: async (values, { resetForm }) => {
            values.hospitaluid = hospitaluid
            try {
                console.log('image', image);
                if (image) {
                    const storageRef = ref(storage, `${hospitaluid}`);
                    await uploadBytesResumable(storageRef, image).then(() => {
                        getDownloadURL(storageRef).then(async (downloadURL) => {
                            values.hospitslLogo = downloadURL
                            console.log('downloadURL', downloadURL);
                        });
                    });
                }

                if (!update) {
                    addDatainsubcollection('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', values)
                } else {
                    updateHospitalProfile('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', values)
                }
            } catch (error) {
                console.error('error', error);
            }
        },
    });
    const { values, errors, touched, handleSubmit, handleChange, handleBlur } = formik;
    return (
        // <Subscription />
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Update Hospital Information</h2>
                    <div className="text-center mb-4">
                        {/*   <input style={{ display: "none" }} type='file' id='file' onChange={handleImageChange} />
                        <label htmlFor='file' className="image-container"> */}
                        <img
                            src={hospitslLogo ? hospitslLogo : hospitalimg}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ width: '100px' }}
                        />
                        {/* <span className="edit-icon">
                                <i className="fas fa-edit"><BsCloudUploadFill color='#0d6efd' /></i>
                            </span>
                        </label> */}
                    </div>

                    <form onSubmit={handleSubmit}>
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
                        <div className="form-group  mt-3">
                            <label >Hospital Name:</label>
                            <input
                                name='hospitslName'
                                type="text"
                                className="form-control"
                                defaultValue={hospitslName}
                                onChange={handleChange}
                                placeholder='Enter Hospital Name'
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label >Address:</label>
                            <textarea className="form-control" rows="3" id="address" name='hospitalAddress' placeholder='Enter Hospital Address.....'
                                defaultValue={hospitalAddress}
                                onChange={handleChange}
                                required></textarea>

                        </div>

                        <div className="form-group mt-3">
                            <label>Contact Information:</label>
                            <input
                                name='contactNumber'
                                type="text"
                                className="form-control"
                                defaultValue={contactNumber}
                                onChange={handleChange}
                                placeholder='Enter Your Contact Number'
                                required
                            />
                        </div>


                        <div className="text-center mt-3">
                            <button type="submit" className="btn btn-primary">
                                {update ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default HospitalProfile