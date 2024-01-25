/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import hospitalimg from 'src/assets/images/hospitalerp.png'
import '../../Hospital master/hospitalprofile.css'
import { useFormik } from 'formik';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from 'src/firebaseconfig';
import { selectUserId, selectUserUID } from 'src/redux/slice/authSlice';
import { useSelector } from 'react-redux';
import { addDatainsubcollection, updateHospitalProfile } from 'src/services/firebasedb';
import { selectContactnumber, selectHospitalAddress, selectHospitalLogo, selectHospitalName, selectSubscriptionExpireDate } from 'src/redux/slice/hospitalProfileSlice';
import moment from 'moment';
import { selectLicenceNumber, selectMedicalAddress, selectMedicalContactnumber, selectMedicalLogo, selectMedicalName } from 'src/redux/slice/medicalProfileSlice';

const initalValues = {
    medicalLogo: '',
    medicalName: '',
    medicallAddress: '',
    licenceNumber: '',
    contactNumber: '',
    hospitaluid: '',
    medicaluid: '',
}
const MedicalProfile = () => {
    const hospitaluid = useSelector(selectUserId)
    const medicalLogo = useSelector(selectMedicalLogo)
    const medicallAddress = useSelector(selectMedicalAddress)
    const medicalName = useSelector(selectMedicalName)
    const contactNumber = useSelector(selectMedicalContactnumber)
    const licenceNumber = useSelector(selectLicenceNumber)
    const [totalRemaningDays, setTotalRemaningDays] = useState();
    const [image, setImage] = useState(null);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const [update, setUpdate] = useState(false)
    const medicaluserUID = useSelector(selectUserUID)
    useEffect(() => {
        if (medicalLogo || medicallAddress || medicalName || contactNumber || licenceNumber) {
            values.medicalLogo = medicalLogo
            values.medicallAddress = medicallAddress
            values.medicalName = medicalName
            values.contactNumber = contactNumber
            values.licenceNumber = licenceNumber
            setUpdate(true)
        }
    }, [medicalLogo, medicallAddress, medicalName, contactNumber])


    const handleImageChange = async (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage)
        console.log('selectedImage', selectedImage);
    };

    const formik = useFormik({
        initialValues: initalValues,
        // validationSchema: opdformSchema,
        onSubmit: async (values, { resetForm }) => {
            values.hospitaluid = hospitaluid
            values.medicaluid = medicaluserUID
            try {
                console.log('image', image);
                if (image) {
                    const storageRef = ref(storage, `${hospitaluid} +medical`);
                    await uploadBytesResumable(storageRef, image).then(async () => {
                        await getDownloadURL(storageRef).then(async (downloadURL) => {
                            values.medicalLogo = downloadURL
                            console.log('downloadURL', downloadURL);
                        });
                    });
                }

                if (!update) {
                    addDatainsubcollection('MedicalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'medicalMaster', values)
                } else {
                    updateHospitalProfile('MedicalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'medicalMaster', values)
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
                    <h2 className="text-center mb-4">Update Medical Information</h2>
                    <div className="text-center mb-4">
                        {/*   <input style={{ display: "none" }} type='file' id='file' onChange={handleImageChange} />
                        <label htmlFor='file' className="image-container"> */}
                        <img
                            src={medicalLogo ? medicalLogo : hospitalimg}
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
                            <label >Medical Name:</label>
                            <input
                                name='medicalName'
                                type="text"
                                className="form-control"
                                defaultValue={medicalName}
                                onChange={handleChange}
                                placeholder='Enter Hospital Name'
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Licence Number:</label>
                            <input
                                name='licenceNumber'
                                type="text"
                                className="form-control"
                                defaultValue={licenceNumber}
                                onChange={handleChange}
                                placeholder='Enter Licence Number'
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label >Address:</label>
                            <textarea className="form-control" rows="3" id="address" name='medicallAddress' placeholder='Enter Hospital Address.....'
                                defaultValue={medicallAddress}
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
                                placeholder='Enter Contact Number'
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

export default MedicalProfile