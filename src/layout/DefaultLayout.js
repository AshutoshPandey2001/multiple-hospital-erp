/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
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
import { getData, getDatawithhospitaluid } from 'src/services/firebasedb'
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

const DefaultLayout = () => {
  const dispatch = useDispatch()
  const userType = useSelector(selectUsertype)
  const sidebarShow = useSelector(selectChangeState)
  const hospitaluid = useSelector(selectUserId)
  const selectedMenu = useSelector(selectmenuStyle)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(async () => {

      await getDatawithhospitaluid('Patients', 'fBoxFLrzXexT8WNBzGGh', 'patients', hospitaluid).then((matchingValues) => {
        dispatch(FILL_PATIENTS(matchingValues))
      })
        .catch((error) => {
          console.error(error);
        });
      // await getData('Patients', 'fBoxFLrzXexT8WNBzGGh').then((res) => {
      //   dispatch(FILL_PATIENTS(res.data().patients))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });

      // await getData('Patients', 'fBoxFLrzXexT8WNBzGGh').then((res) => {
      //   dispatch(FILL_PATIENTS(res.data().patients))
      // }).catch((error) => {
      // const patientsData = await getData('Patients', 'fBoxFLrzXexT8WNBzGGh');        // , (data) => {
      //   // Handle the data here
      //   dispatch(FILL_PATIENTS(data.patients))
      //   console.log('demand data', data.patients
      //   );
      // }
      // );
      // console.log('pttData', patientsData);


      await getData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb').then((res) => {
        dispatch(FILL_OPD_PATIENTS(res.data().opdPatient))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_OPD_PATIENTS(data.opdPatient))
      //   console.log('demand data', data.opdPatient);
      // });

      await getData('admitPatients', 'jSqDGnjO21bpPGhb6O2y').then((res) => {
        dispatch(FILL_ADMIT_PATIENTS(res.data().admitPatient))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_ADMIT_PATIENTS(data.admitPatient))
      //   console.log('demand data', data);
      // });

      await getData('Rooms', '3PvtQ2G1RbG3l5VtiCMI').then((res) => {
        dispatch(FILL_ROOMS(res.data().rooms));
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_ROOMS(data.rooms))
      //   console.log('demand data', data);
      // });

      await getData('Medicines', 'dHFKEhdhbOM4v6WRMb6z').then((res) => {
        dispatch(UPLOAD_MEDICINES(res.data().medicines))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('Medicines', 'dHFKEhdhbOM4v6WRMb6z', (data) => {
      //   // Handle the data here
      //   dispatch(UPLOAD_MEDICINES(data.medicines))
      //   console.log('demand data', data);
      // });

      await getData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0').then((res) => {
        dispatch(FILL_PATIENTS_MEDICINES(res.data().patientsMedicines))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_PATIENTS_MEDICINES(data.patientsMedicines))
      //   console.log('demand data', data);
      // });
      await getDatawithhospitaluid('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid).then((matchingValues) => {
        dispatch(FILL_DR(matchingValues))
      })
        .catch((error) => {
          console.error(error);
        });
      // await getData('Doctors', 'd3ryEUfqA2FMa0fEyxde').then((res) => {
      //   dispatch(FILL_DR(res.data().doctors))
      // }).catch((error) => {
      //   console.error("Error updating document: ", error);
      // });
      // getData('Doctors', 'd3ryEUfqA2FMa0fEyxde', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_DR(data.doctors))
      //   console.log('demand data', data);
      // });
      await getData('DischargePatients', 'cki4rIGKtNwyXr27cZBY').then((res) => {
        dispatch(FILL_DISCHARGE_PATIENTS(res.data().dischargePatients))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('DischargePatients', 'cki4rIGKtNwyXr27cZBY', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_DISCHARGE_PATIENTS(data.dischargePatients))
      //   console.log('demand data', data);
      // });
      await getData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft').then((res) => {
        dispatch(FILL_PARAMETERS(res.data().labParameters))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_PARAMETERS(data.labParameters))
      //   console.log('demand data', data);
      // });
      await getData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc').then((res) => {
        dispatch(FILL_LABORATORY_REPORTS(res.data().labReports))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_LABORATORY_REPORTS(data.labReports))
      //   console.log('demand data', data);
      // });
      await getData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa').then((res) => {
        dispatch(FILL_RETURN_PATIENTS_MEDICINES(res.data().returnMedicine))
      }).catch((error) => {
        console.error("Error updating document: ", error);
      });
      // getData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_RETURN_PATIENTS_MEDICINES(data.returnMedicine))
      //   console.log('demand data', data);
      // });
      await getData('Tax', 'LZnOzIOavFxXLPkmFaWc').then((res) => {
        dispatch(FILL_TAXS(res.data().tax))
      }).catch((err) => {
        console.error(err);
      })
      // getData('Tax', 'LZnOzIOavFxXLPkmFaWc', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_TAXS(data.tax))
      //   console.log('demand data', data);
      // });
      await getData('Charges', 'id6rOjHGDBEd63LQiGQe').then((res) => {
        dispatch(FILL_CHARGES(res.data().charges))
      }).catch((err) => {
        console.error(err);
      })
      // getData('Charges', 'id6rOjHGDBEd63LQiGQe', (data) => {
      //   // Handle the data here
      //   dispatch(FILL_CHARGES(data.charges))
      //   console.log('demand data', data);
      // });
      setIsLoading(false)
    })

  }, [])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const patientsData = await new Promise((resolve, reject) => {
  //         getData('Patients', 'fBoxFLrzXexT8WNBzGGh', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_PATIENTS(patientsData.patients));

  //       const opdPatientsData = await new Promise((resolve, reject) => {
  //         getData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_OPD_PATIENTS(opdPatientsData.opdPatient));

  //       const admitPatientsData = await new Promise((resolve, reject) => {
  //         getData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_ADMIT_PATIENTS(admitPatientsData.admitPatient));

  //       const roomsData = await new Promise((resolve, reject) => {
  //         getData('Rooms', '3PvtQ2G1RbG3l5VtiCMI', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_ROOMS(roomsData.rooms));

  //       const medicinesData = await new Promise((resolve, reject) => {
  //         getData('Medicines', 'dHFKEhdhbOM4v6WRMb6z', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(UPLOAD_MEDICINES(medicinesData.medicines));

  //       const patientsMedicinesData = await new Promise((resolve, reject) => {
  //         getData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_PATIENTS_MEDICINES(patientsMedicinesData.patientsMedicines));

  //       const doctorsData = await new Promise((resolve, reject) => {
  //         getData('Doctors', 'd3ryEUfqA2FMa0fEyxde', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_DR(doctorsData.doctors));

  //       const dischargePatientsData = await new Promise((resolve, reject) => {
  //         getData('DischargePatients', 'cki4rIGKtNwyXr27cZBY', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_DISCHARGE_PATIENTS(dischargePatientsData.dischargePatients));

  //       const laboratoryParametersData = await new Promise((resolve, reject) => {
  //         getData('LaboratoryParameters', 'CyBGA7dh7brcm7UlFyft', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_PARAMETERS(laboratoryParametersData.labParameters));

  //       const patientsLaboratoryReportsData = await new Promise((resolve, reject) => {
  //         getData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_LABORATORY_REPORTS(patientsLaboratoryReportsData.labReports));

  //       const returnMedicineData = await new Promise((resolve, reject) => {
  //         getData('ReturnMedicine', 'lGxMW7T2f7Dsb93A19qa', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_RETURN_PATIENTS_MEDICINES(returnMedicineData.returnMedicine));

  //       const taxData = await new Promise((resolve, reject) => {
  //         getData('Tax', 'LZnOzIOavFxXLPkmFaWc', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_TAXS(taxData.tax));

  //       const chargesData = await new Promise((resolve, reject) => {
  //         getData('Charges', 'id6rOjHGDBEd63LQiGQe', (data) => {
  //           resolve(data);
  //         });
  //       });
  //       dispatch(FILL_CHARGES(chargesData.charges));

  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error updating document: ", error);
  //     }
  //   };

  //   fetchData();

  // }, []);


  return (
    <>
      {isLoading ? <Loaderspinner /> :
        <>
          <div>
            {userType === "Patient" || selectedMenu === 'header' ? null : <AppSidebar />}

            <div className={`d-flex flex-column min-vh-100 bg-light ${sidebarShow ? 'contentWrapper' : 'contentWrapperN'} ${selectedMenu === 'header' ? 'contentWrapperNot' : null}`}>
              <AppHeader />
              {/* <ChangeMenustyle /> */}

              <div className="body flex-grow-1 " style={{ margin: '10px 20px 20px 20px' }}>
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
