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
import { UPLOAD_MEDICINES } from 'src/redux/slice/medicinesMasterSlice'
import { FILL_OPD_PATIENTS } from 'src/redux/slice/opdPatientsList'
import { FILL_PATIENTS } from 'src/redux/slice/patientMasterslice'
import { FILL_PATIENTS_MEDICINES } from 'src/redux/slice/patientsMedicinesSlice'
import { FILL_ROOMS } from 'src/redux/slice/roomMasterSlice'
import { addDatainsubcollection, getData, getDatawithhospitaluid, getHospitalProfile, getSubcollectionData, getTaxDatainsubCollection, getTaxDatawithhospitaluid } from 'src/services/firebasedb'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { FILL_PARAMETERS } from 'src/redux/slice/laborataryMaster'
import { FILL_LABORATORY_REPORTS } from 'src/redux/slice/patientsLaboratoryReportsSlice'
import NavigationBar from 'src/components/Navigationbar'
import navigation from '../_nav'
import { selectChangeState } from 'src/redux/slice/changeStateslice'
import ChangeMenustyle from 'src/components/changeMenustyle/ChangeMenustyle'
import { selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice'
import { FILL_RETURN_PATIENTS_MEDICINES } from 'src/redux/slice/returnMedicineslice'
import { FILL_TAXS } from 'src/redux/slice/taxSlice'
import { FILL_CHARGES } from 'src/redux/slice/chargesSlice'
import { SET_HOSPITAL_PROFILE } from 'src/redux/slice/hospitalProfileSlice'
import { SET_INDOORPREVBILL_NO, SET_OPDPREVBILL_NO } from 'src/redux/slice/prevBillNoSlice'

const DefaultLayout = () => {
  // const { hospitaluid } = props

  const dispatch = useDispatch()
  const userType = useSelector(selectUsertype)
  const sidebarShow = useSelector(selectChangeState)
  const hospitaluid = useSelector(selectUserId)
  const selectedMenu = useSelector(selectmenuStyle)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(async () => {
      console.log('hospitaluid', hospitaluid);
      // addDatainsubcollection()
      // gteSubcollectionData()
      // await getDatawithhospitaluid('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_PATIENTS(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      // try {
      //   const temp_data = await getSubcollectionData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid);
      //   dispatch(FILL_PATIENTS(temp_data));
      //   console.log('Retrieved subcollection data real time:', temp_data);
      //   // Use temp_data for further processing
      // } catch (error) {
      //   console.error('Error retrieving subcollection data:', error);
      // }
      await getSubcollectionData('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_PATIENTS(data))
        console.log('Received real-time data patients:', data);
      }).catch((error) => {
        console.error('Error:', error);
      });
      // .then((temp_data) => {
      //   // dispatch(FILL_PATIENTS())

      //   console.log('Retrieved subcollection data:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });

      // await getDatawithhospitaluid('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_OPD_PATIENTS(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      await getSubcollectionData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_OPD_PATIENTS(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_OPD_PATIENTS(temp_data))

      //   console.log('Retrieved subcollection data Opd:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });


      // await getDatawithhospitaluid('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_ADMIT_PATIENTS(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      await getSubcollectionData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_ADMIT_PATIENTS(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_ADMIT_PATIENTS(temp_data))

      //   console.log('Retrieved subcollection data Opd:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });

      // await getDatawithhospitaluid('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_ROOMS(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      await getSubcollectionData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', 'rooms', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_ROOMS(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_ROOMS(temp_data))
      //   console.log('Retrieved subcollection data Opd:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });
      // await getDatawithhospitaluid('Medicines', 'dHFKEhdhbOM4v6WRMb6z', 'medicines', hospitaluid).then((matchingValues) => {
      //   dispatch(UPLOAD_MEDICINES(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      await getSubcollectionData('Medicines', 'dHFKEhdhbOM4v6WRMb6z', 'medicines', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(UPLOAD_MEDICINES(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(UPLOAD_MEDICINES(temp_data))
      //   console.log('Retrieved subcollection data labparameter:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });


      // await getDatawithhospitaluid('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_PATIENTS_MEDICINES(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      await getSubcollectionData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_PATIENTS_MEDICINES(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_PATIENTS_MEDICINES(temp_data))
      //   console.log('Retrieved subcollection data labparameter:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });

      // await getDatawithhospitaluid('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_DR(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      await getSubcollectionData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_DR(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_DR(temp_data))

      //   console.log('Retrieved subcollection data Doctors:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });

      // await getDatawithhospitaluid('DischargePatients', 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_DISCHARGE_PATIENTS(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      await getSubcollectionData('DischargePatients', 'cki4rIGKtNwyXr27cZBY', 'dischargePatients', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_DISCHARGE_PATIENTS(data))
        console.log('Received real-time data discharge:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_DISCHARGE_PATIENTS(temp_data))
      //   console.log('Retrieved subcollection data Opd:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });

      // await getDatawithhospitaluid('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_PARAMETERS(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      await getSubcollectionData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', 'labParameters', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_PARAMETERS(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_PARAMETERS(temp_data))
      //   console.log('Retrieved subcollection data labparameter:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });
      // await getDatawithhospitaluid('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_LABORATORY_REPORTS(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      await getSubcollectionData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_LABORATORY_REPORTS(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_LABORATORY_REPORTS(temp_data))
      //   console.log('Retrieved subcollection data Opd:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });

      // await getTaxDatawithhospitaluid('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_RETURN_PATIENTS_MEDICINES(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      await getSubcollectionData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', 'returnMedicine', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_RETURN_PATIENTS_MEDICINES(data))
        console.log('Received real-time data:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_RETURN_PATIENTS_MEDICINES(temp_data))
      //   console.log('Retrieved subcollection data Opd:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });


      // await getTaxDatawithhospitaluid('Tax', 'LZnOzIOavFxXLPkmFaWc', 'tax', hospitaluid).then((matchingValues) => {
      //   console.log('tax data', matchingValues);
      //   dispatch(FILL_TAXS(matchingValues))

      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });


      await getTaxDatainsubCollection('Tax', 'LZnOzIOavFxXLPkmFaWc', 'tax', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_TAXS(data))
        console.log('Received real-time data tax:', data);
      }).catch((error) => {
        console.error('Error:', error);
      })

      // await getDatawithhospitaluid('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', hospitaluid).then((matchingValues) => {
      //   dispatch(FILL_CHARGES(matchingValues))
      // })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      await getSubcollectionData('Charges', 'id6rOjHGDBEd63LQiGQe', 'charges', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(FILL_CHARGES(data))
        console.log('Received real-time data :', data);
      }).catch((error) => {
        console.error('Error:', error);
      })
      // .then((temp_data) => {
      //   dispatch(FILL_CHARGES(temp_data))
      //   console.log('Retrieved subcollection data Opd:', temp_data);
      //   // Use temp_data for further processing
      // })
      // .catch((error) => {
      //   console.error('Error retrieving subcollection data:', error);
      // });


      await getHospitalProfile('HospitalMaster', 'S4fRJIO5ZxE5isoBIbEU', 'hospitalMaster', hospitaluid, (data) => {
        // Handle the updated data in the callback function
        dispatch(SET_HOSPITAL_PROFILE(data))
        console.log('Received real-time data :', data);
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
      // For Fill Data in Prod
      // await getData('Patients', 'fBoxFLrzXexT8WNBzGGh').then((res) => {
      //   dispatch(FILL_PATIENTS(res.data().patients))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });



      // await getData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb').then((res) => {
      //   dispatch(FILL_OPD_PATIENTS(res.data().opdPatient))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });


      // await getData('admitPatients', 'jSqDGnjO21bpPGhb6O2y').then((res) => {
      //   dispatch(FILL_ADMIT_PATIENTS(res.data().admitPatient))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });


      // await getData('Rooms', '3PvtQ2G1RbG3l5VtiCMI').then((res) => {
      //   dispatch(FILL_ROOMS(res.data().rooms));
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });


      // await getData('Medicines', 'dHFKEhdhbOM4v6WRMb6z').then((res) => {
      //   dispatch(UPLOAD_MEDICINES(res.data().medicines))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });


      // await getData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0').then((res) => {
      //   dispatch(FILL_PATIENTS_MEDICINES(res.data().patientsMedicines))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });

      // await getData('Doctors', 'd3ryEUfqA2FMa0fEyxde').then((res) => {
      //   dispatch(FILL_DR(res.data().doctors))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });

      // await getData('DischargePatients', 'cki4rIGKtNwyXr27cZBY').then((res) => {
      //   dispatch(FILL_DISCHARGE_PATIENTS(res.data().dischargePatients))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });

      // await getData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft').then((res) => {
      //   dispatch(FILL_PARAMETERS(res.data().labParameters))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });

      // await getData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc').then((res) => {
      //   dispatch(FILL_LABORATORY_REPORTS(res.data().labReports))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });

      // await getData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa').then((res) => {
      //   dispatch(FILL_RETURN_PATIENTS_MEDICINES(res.data().returnMedicine))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });

      // await getData('Tax', 'LZnOzIOavFxXLPkmFaWc').then((res) => {
      //   dispatch(FILL_TAXS(res.data().tax))
      // }).catch((err) => {
      //   console.error(err);
      // })

      // await getData('Charges', 'id6rOjHGDBEd63LQiGQe').then((res) => {
      //   dispatch(FILL_CHARGES(res.data().charges))
      // }).catch((err) => {
      //   console.error(err);
      // })


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

              <div className="body flex-grow-1 " style={{ margin: '10px 0px 20px 0px' }}>
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
