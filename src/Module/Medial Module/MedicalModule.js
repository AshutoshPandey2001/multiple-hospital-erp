/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { AppFooter, AppHeader, AppSidebar } from 'src/components'
import MedicalComponent from './MedicalComponent/MedicalComponent'
import { useDispatch, useSelector } from 'react-redux'
import { selectChangeState } from 'src/redux/slice/changeStateslice'
import { selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice'
import { addDatainsubcollection, getData, getDatawithhospitaluid, getSubcollectionData, getTaxDatainsubCollection, getTaxDatawithhospitaluid } from 'src/services/firebasedb'
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
import { selectUserId } from 'src/redux/slice/authSlice'

const MedicalModule = () => {
    const dispatch = useDispatch()
    const sidebarShow = useSelector(selectChangeState)
    const selectedMenu = useSelector(selectmenuStyle)
    const hospitaluid = useSelector(selectUserId)

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setTimeout(async () => {
            // await getData('Patients', 'fBoxFLrzXexT8WNBzGGh').then((res) => {
            //     dispatch(FILL_PATIENTS(res.data().patients))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });

            // await getData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb').then((res) => {
            //     dispatch(FILL_OPD_PATIENTS(res.data().opdPatient))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });

            // await getData('admitPatients', 'jSqDGnjO21bpPGhb6O2y').then((res) => {
            //     dispatch(FILL_ADMIT_PATIENTS(res.data().admitPatient))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });

            // await getData('Rooms', '3PvtQ2G1RbG3l5VtiCMI').then((res) => {
            //     dispatch(FILL_ROOMS(res.data().rooms));
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });

            // await getData('Medicines', 'dHFKEhdhbOM4v6WRMb6z').then((res) => {
            //     dispatch(UPLOAD_MEDICINES(res.data().medicines))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });

            // await getData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0').then((res) => {
            //     dispatch(FILL_PATIENTS_MEDICINES(res.data().patientsMedicines))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });
            // await getData('Doctors', 'd3ryEUfqA2FMa0fEyxde').then((res) => {
            //     dispatch(FILL_DR(res.data().doctors))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });
            // await getData('DischargePatients', 'cki4rIGKtNwyXr27cZBY').then((res) => {
            //     dispatch(FILL_DISCHARGE_PATIENTS(res.data().dischargePatients))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });
            // await getData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft').then((res) => {
            //     dispatch(FILL_PARAMETERS(res.data().labParameters))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });
            // await getData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc').then((res) => {
            //     dispatch(FILL_LABORATORY_REPORTS(res.data().labReports))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });
            // await getData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa').then((res) => {
            //     dispatch(FILL_RETURN_PATIENTS_MEDICINES(res.data().returnMedicine))
            // }).catch((error) => {
            //     console.error("Error updating document: ", error);
            // });
            // await getData('Tax', 'LZnOzIOavFxXLPkmFaWc').then((res) => {
            //     dispatch(FILL_TAXS(res.data().tax))
            // }).catch((err) => {
            //     console.error(err);
            // })


            // await getDatawithhospitaluid('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid).then((matchingValues) => {
            //     dispatch(FILL_PATIENTS(matchingValues))
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



            await getSubcollectionData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_PATIENTS(data))
                console.log('Received real-time data patients:', data);
            }).catch((error) => {
                console.error('Error:', error);
            });

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
                            <MedicalComponent />
                        </div>
                        <AppFooter />
                    </div>
                </div>
            }
        </>
        // <div>
        //     {selectedMenu === 'header' ? null : <AppSidebar />}
        //     <div className={`d-flex flex-column min-vh-100 bg-light ${sidebarShow ? 'contentWrapper' : 'contentWrapperN'} ${selectedMenu === 'header' ? 'contentWrapperNot' : null}`}>
        //         <AppHeader />
        //         <div className="body flex-grow-1 " style={{ margin: '20px 20px 20px 20px' }}>
        //             <MedicalComponent />
        //         </div>
        //         <AppFooter />
        //     </div>
        // </div>
    )
}

export default MedicalModule