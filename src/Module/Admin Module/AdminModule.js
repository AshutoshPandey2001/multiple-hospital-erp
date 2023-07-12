/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { AppFooter, AppHeader, AppSidebar } from 'src/components'
import { useDispatch, useSelector } from 'react-redux'
import { selectChangeState } from 'src/redux/slice/changeStateslice'
import { selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice'
import { FILL_ADMIT_PATIENTS } from 'src/redux/slice/admitPatientsSlice'
import { FILL_RETURN_PATIENTS_MEDICINES } from 'src/redux/slice/returnMedicineslice'
import { FILL_TAXS } from 'src/redux/slice/taxSlice'
import { FILL_PARAMETERS } from 'src/redux/slice/laborataryMaster'
import { FILL_LABORATORY_REPORTS } from 'src/redux/slice/patientsLaboratoryReportsSlice'
import { FILL_DISCHARGE_PATIENTS } from 'src/redux/slice/dischargePatientSlice'
import { FILL_DR } from 'src/redux/slice/doctorsSlice'
import { UPLOAD_MEDICINES } from 'src/redux/slice/medicinesMasterSlice'
import { FILL_OPD_PATIENTS } from 'src/redux/slice/opdPatientsList'
import { FILL_PATIENTS } from 'src/redux/slice/patientMasterslice'
import { FILL_PATIENTS_MEDICINES } from 'src/redux/slice/patientsMedicinesSlice'
import { FILL_ROOMS } from 'src/redux/slice/roomMasterSlice'
import Loaderspinner from 'src/comman/spinner/Loaderspinner'
import AdminComponent from './Admin Component/AdminComponent'
import { FILL_CHARGES } from 'src/redux/slice/chargesSlice'
import { addDatainsubcollection, getData, getDatawithhospitaluid, getHospitalProfile, getSubcollectionData, getTaxDatainsubCollection, getTaxDatawithhospitaluid } from 'src/services/firebasedb'
import { selectUserId } from 'src/redux/slice/authSlice'
import { SET_INDOORPREVBILL_NO, SET_OPDPREVBILL_NO } from 'src/redux/slice/prevBillNoSlice'
import { SET_HOSPITAL_PROFILE } from 'src/redux/slice/hospitalProfileSlice'

const AdminModule = () => {
    const dispatch = useDispatch()
    const sidebarShow = useSelector(selectChangeState)
    const selectedMenu = useSelector(selectmenuStyle)
    const hospitaluid = useSelector(selectUserId)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(async () => {

            // await getDatawithhospitaluid('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_PATIENTS(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });

            // await getDatawithhospitaluid('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_OPD_PATIENTS(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });



            // await getDatawithhospitaluid('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_ADMIT_PATIENTS(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });


            // await getDatawithhospitaluid('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_ROOMS(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });


            // await getDatawithhospitaluid('Medicines', 'dHFKEhdhbOM4v6WRMb6z', 'medicines', hospitaluid).then((matchingValues) => {
            //     dispatch(UPLOAD_MEDICINES(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });


            // await getDatawithhospitaluid('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_PATIENTS_MEDICINES(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });


            // await getDatawithhospitaluid('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_DR(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });

            // await getDatawithhospitaluid('DischargePatients', 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_DISCHARGE_PATIENTS(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });

            // await getDatawithhospitaluid('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_PARAMETERS(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });

            // await getDatawithhospitaluid('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_LABORATORY_REPORTS(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });


            // await getTaxDatawithhospitaluid('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_RETURN_PATIENTS_MEDICINES(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });



            // await getTaxDatawithhospitaluid('Tax', 'LZnOzIOavFxXLPkmFaWc', 'tax', hospitaluid).then((matchingValues) => {
            //     console.log('tax data', matchingValues);
            //     dispatch(FILL_TAXS(matchingValues))

            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });


            // await getDatawithhospitaluid('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_CHARGES(matchingValues))
            // })
            //     .catch((error) => {
            //         console.error(error);
            //     });


            // get Data in sub collection

            await getSubcollectionData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_PATIENTS(data))
                console.log('Received real-time data patients:', data);
            }).catch((error) => {
                console.error('Error:', error);
            });

            await getSubcollectionData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_OPD_PATIENTS(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })


            await getSubcollectionData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_ADMIT_PATIENTS(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_ROOMS(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('Medicines', 'dHFKEhdhbOM4v6WRMb6z', 'medicines', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(UPLOAD_MEDICINES(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_PATIENTS_MEDICINES(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_DR(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('DischargePatients', 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_DISCHARGE_PATIENTS(data))
                console.log('Received real-time data discharge:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_PARAMETERS(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_LABORATORY_REPORTS(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getSubcollectionData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_RETURN_PATIENTS_MEDICINES(data))
                console.log('Received real-time data:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getTaxDatainsubCollection('Tax', 'LZnOzIOavFxXLPkmFaWc', 'tax', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_TAXS(data))
                console.log('Received real-time data tax:', data);
            }).catch((error) => {
                console.error('Error:', error);
            })


            await getSubcollectionData('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_CHARGES(data))
                console.log('Received real-time data :', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getHospitalProfile('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(SET_HOSPITAL_PROFILE(data))
                console.log('Received real-time data :', data);
            }).catch((error) => {
                console.error('Error:', error);
            })
            // for getting prev bill No
            await getHospitalProfile('lastIndoorBillNo', '2VgHSc4tPq9NqU9HrI0N', 'lastIndoorbillNo', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(SET_INDOORPREVBILL_NO(data))
                console.log('Received real-time data :', data);
            }).catch((error) => {
                console.error('Error:', error);
            })

            await getHospitalProfile('lastOpdbillNo', 'zyojcRPH1zTQLiT1Gepz', 'lastopdbillNo', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(SET_OPDPREVBILL_NO(data))
                console.log('Received real-time data :', data);
            }).catch((error) => {
                console.error('Error:', error);
            })
            setIsLoading(false)
        })

    }, [hospitaluid])
    return (
        <>
            {isLoading ? <Loaderspinner /> :
                <div>
                    {selectedMenu === 'header' ? null : <AppSidebar />}
                    <div className={`d-flex flex-column min-vh-100 bg-light ${sidebarShow ? 'contentWrapper' : 'contentWrapperN'} ${selectedMenu === 'header' ? 'contentWrapperNot' : null}`}>
                        <AppHeader />
                        <div className="body flex-grow-1 " style={{ margin: '20px 20px 20px 20px' }}>
                            <AdminComponent />
                        </div>
                        <AppFooter />
                    </div>
                </div>
            }
        </>

    )
}

export default AdminModule