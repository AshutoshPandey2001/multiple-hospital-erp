/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loaderspinner from 'src/comman/spinner/Loaderspinner'
import { FILL_ADMIT_PATIENTS } from 'src/redux/slice/admitPatientsSlice'
import { selectUserId, selectUsertype } from 'src/redux/slice/authSlice'
import { FILL_DISCHARGE_PATIENTS } from 'src/redux/slice/dischargePatientSlice'
import { FILL_DR } from 'src/redux/slice/doctorsSlice'
import { ADD_LAST_MEDICINES, FILL_MEDICINES_STOCK, UPLOAD_MEDICINES, selectLastMedicine } from 'src/redux/slice/medicinesMasterSlice'
import { ADD_LAST_OPD_DATA, FILL_OPD_PATIENTS, selectlastOpdData } from 'src/redux/slice/opdPatientsList'
import { ADD_LAST_PATIENT_DATA, FILL_PATIENTS, selectlastPatientData } from 'src/redux/slice/patientMasterslice'
import { FILL_PATIENTS_MEDICINES } from 'src/redux/slice/patientsMedicinesSlice'
import { FILL_ROOMS } from 'src/redux/slice/roomMasterSlice'
import { addDatainsubcollection, getData, getDatawithhospitaluid, getHospitalProfile, getOnlyChangesListener, getSubcollectionData, getSubcollectionDataWithoutsnapshot, getSubcollectionDataWithoutsnapshotMedicalAndPatients, getSubcollectionDatafter, getSubcollectionDataopd, getTaxDatainsubCollection, getTaxDatawithhospitaluid } from 'src/services/firebasedb'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { FILL_PARAMETERS } from 'src/redux/slice/laborataryMaster'
import { FILL_LABORATORY_REPORTS } from 'src/redux/slice/patientsLaboratoryReportsSlice'
import NavigationBar from 'src/components/Navigationbar'
import navigation from '../_nav'
import { selectChangeState } from 'src/redux/slice/changeStateslice'
import ChangeMenustyle from 'src/components/changeMenustyle/ChangeMenustyle'
import { selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice'
import { FILL_RETURN_PATIENTS_MEDICINES } from 'src/redux/slice/returnMedicineslice'
import { FILL_TAXS, FILL_MEDICAL_TAXS } from 'src/redux/slice/taxSlice'
import { FILL_CHARGES } from 'src/redux/slice/chargesSlice'
import { SET_HOSPITAL_PROFILE } from 'src/redux/slice/hospitalProfileSlice'
import { SET_INDOORPREVBILL_NO, SET_MEDICINEPREVBILL_NO, SET_OPDPREVBILL_NO, SET_RETURN_MEDICINEPREVBILL_NO } from 'src/redux/slice/prevBillNoSlice'
import { db } from 'src/firebaseconfig'
import { FILL_ROLE } from 'src/redux/slice/userRolesSlice'
import { SET_MEDICAL_PROFILE } from 'src/redux/slice/medicalProfileSlice'

const DefaultLayout = () => {
  // const { hospitaluid } = props

  const dispatch = useDispatch()
  const userType = useSelector(selectUsertype)
  const sidebarShow = useSelector(selectChangeState)
  const hospitaluid = useSelector(selectUserId)
  const selectedMenu = useSelector(selectmenuStyle)
  const lastOpdData = useSelector(selectlastOpdData)
  const lastPatientData = useSelector(selectlastPatientData)
  const lastMedicines = useSelector(selectLastMedicine)
  const parentDocRef = db.collection('Patients').doc('fBoxFLrzXexT8WNBzGGh');
  const subcollectionRef = parentDocRef.collection('patients').where('hospitaluid', '==', hospitaluid)
  const [isLoading, setIsLoading] = useState(true)
  let unsubscribe = undefined


  useEffect(() => {
    setTimeout(async () => {
      console.log('hospitaluid', hospitaluid);

      await getSubcollectionDataWithoutsnapshot('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, lastPatientData, (data, lastData) => {
        // Handle the updated data in the callback function
        dispatch(FILL_PATIENTS(data))
        dispatch(ADD_LAST_PATIENT_DATA(lastData))
        console.log('Get Patients data with last Data', data, lastData);
      }).catch((error) => {
        console.error('Error:', error);
      })

      await getDatawithhospitaluid('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid).then((matchingValues) => {
        dispatch(FILL_ROOMS(matchingValues))
      })
        .catch((error) => {
          console.error(error);
        });


      await getSubcollectionDataWithoutsnapshotMedicalAndPatients("Medicines", 'dHFKEhdhbOM4v6WRMb6z', 'medicines', hospitaluid, lastMedicines, (data, lastData) => {
        dispatch(FILL_MEDICINES_STOCK(data))
        dispatch(ADD_LAST_MEDICINES(lastData))
        console.log('Get Patients data with last Data', data, lastData);
      }).catch((error) => {
        console.error('Error:', error);
      })


      await getDatawithhospitaluid('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid).then((matchingValues) => {
        dispatch(FILL_DR(matchingValues))
      })
        .catch((error) => {
          console.error(error);
        });

      await getDatawithhospitaluid('Roles', 'd3ryEUt65hfqA2FMa0fEyxde', 'roles', hospitaluid).then((matchingValues) => {
        dispatch(FILL_ROLE(matchingValues))
      })
        .catch((error) => {
          console.error(error);
        });

      await getSubcollectionData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_PARAMETERS(data))
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
      await getTaxDatainsubCollection('MedicalTax', 'LZnOzIOavFxXLPkmFaWc', 'medicaltax', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_MEDICAL_TAXS(data))
        console.log('Received real-time data tax:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })

      await getDatawithhospitaluid('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', hospitaluid).then((matchingValues) => {
        dispatch(FILL_CHARGES(matchingValues))
      })
        .catch((error) => {
          console.error(error);
        });


      await getHospitalProfile('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(SET_HOSPITAL_PROFILE(data))
        console.log('Received real-time data :', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      await getHospitalProfile('MedicalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'medicalMaster', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(SET_MEDICAL_PROFILE(data))
        console.log('Medical Profile :', data);
      }).catch((error) => {
        console.error('Error:', error);
      })


      // get prev bill No

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

      await getHospitalProfile('lastMedicineBillNo', 'VE8TfjLSEWC69ik8HUGr', 'lastMedicineBillno', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(SET_MEDICINEPREVBILL_NO(data))
        console.log('Received real-time data :', data);
      }).catch((error) => {
        console.error('Error:', error);
      })

      await getHospitalProfile('lastReturnMedicineBillNo', '4I3NWbYnR86xYlxbSHp4', 'lastReturnMedicineBillNo', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(SET_RETURN_MEDICINEPREVBILL_NO(data))
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
        <>
          <div>
            {userType === "Patient" || selectedMenu === 'header' ? null : <AppSidebar />}

            <div className={`d-flex flex-column min-vh-100 bg-light ${sidebarShow ? 'contentWrapper' : 'contentWrapperN'} ${selectedMenu === 'header' ? 'contentWrapperNot' : null}`}>
              <AppHeader />
              {/* <ChangeMenustyle /> */}

              <div className="body flex-grow-1 " style={{ margin: '0px 0px 20px 0px' }}>
                <AppContent />
              </div>
              <AppFooter />
            </div>
          </div>
        </>
      }
    </>



  )
}

export default DefaultLayout
