/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { AppFooter, AppHeader, AppSidebar } from 'src/components'
import { useDispatch, useSelector } from 'react-redux'
import { selectChangeState } from 'src/redux/slice/changeStateslice'
import { selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice'
import LaboratoryComponent from './laboratoryComponent/LaboratoryComponent'
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

const LaboratoryModule = () => {
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

            await getDatawithhospitaluid('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid).then((matchingValues) => {
                dispatch(FILL_PATIENTS(matchingValues))
            })
                .catch((error) => {
                    console.error(error);
                });

            await getDatawithhospitaluid('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid).then((matchingValues) => {
                dispatch(FILL_DR(matchingValues))
            })
                .catch((error) => {
                    console.error(error);
                });

            await getDatawithhospitaluid('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', hospitaluid).then((matchingValues) => {
                dispatch(FILL_PARAMETERS(matchingValues))
            })
                .catch((error) => {
                    console.error(error);
                });

            await getDatawithhospitaluid('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', hospitaluid).then((matchingValues) => {
                dispatch(FILL_LABORATORY_REPORTS(matchingValues))
            })
                .catch((error) => {
                    console.error(error);
                });


            // get Data in sub collection

            await getSubcollectionData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_PATIENTS(data))
                console.log('Received real-time data patients:', data);
            }).catch((error) => {
                console.error('Error:', error);
            });



            await getSubcollectionData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid, (data) => {
                // Handle the updated data in the callback function
                dispatch(FILL_DR(data))
                console.log('Received real-time data:', data);
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
                            <LaboratoryComponent />
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
        //             <LaboratoryComponent />
        //         </div>
        //         <AppFooter />
        //     </div>
        // </div>
    )
}

export default LaboratoryModule;