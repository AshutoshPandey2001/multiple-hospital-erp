/* eslint-disable prettier/prettier */
import React from 'react'

const Dashboard = React.lazy(() => lazyRetry(() => import('./dashboard/Dashboard'), "dashboard"))
const Opd = React.lazy(() => lazyRetry(() => import('./pages/opd/Opd'), "opd"))
const Admit = React.lazy(() => lazyRetry(() => import('./pages/admit/Admit'), 'admit'))
const Patients = React.lazy(() => lazyRetry(() => import('./pages/patients master/addPatient/Addpatients'), "patients"))
const Medicine = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine/Medicine'), "medicine"))
const MedicineReturn = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine Return/MedicineReturn'), "medicinereturn"))
const Rooms = React.lazy(() => lazyRetry(() => import('./pages/rooms/Addrooms/AddRooms'), "rooms"))

const Medicinemaster = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine msater/MedicineMaster'), "medicinemaster"))
const MedicalProfile = React.lazy(() => lazyRetry(() => import('./pages/medical/medical profile/MedicalProfile'), "medicalprofile"))
const PatientsHistory = React.lazy(() => lazyRetry(() => import('./pages/patients master/Patientshistory'), "patienthistory"))
const Invoice = React.lazy(() => lazyRetry(() => import('./pages/Invoice/Invoicepage'), "admitinvoice"))
const Usersmasters = React.lazy(() => lazyRetry(() => import('./pages/Hospital user Registration/MasterUserRegistration/UsersMstersregistration'), 'userMaster'))
const Drsmasters = React.lazy(() => lazyRetry(() => import('./pages/doctorMaster/doctorMaster'), "drMaster"))
const Discharge = React.lazy(() => lazyRetry(() => import('./pages/discharge/Discharge'), "discharge"))

const TaxMasters = React.lazy(() => lazyRetry(() => import('./pages/tax masters/taxMaster'), "taxmaster"))
const Medicaltax = React.lazy(() => lazyRetry(() => import('./pages/tax masters/medicalTax'), "medicaltax"))
const Opdinvoice = React.lazy(() => lazyRetry(() => import('./pages/opd/opdInvoice'), "opdinvoice"))
const Medicineinvoice = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine/medicineInvoice'), "medineInvoice"))
const ReturnMedicineinvoice = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine Return/ReturnmedicineInvoice'), "returnmedineInvoice"))

const Labreport = React.lazy(() => lazyRetry(() => import('./pages/laboratory/Labreport'), "labreport"))
const Labreportprint = React.lazy(() => lazyRetry(() => import('./pages/laboratory/Labreportprint'), "labreportprint"))
const Labmaster = React.lazy(() => lazyRetry(() => import('./pages/laboratory/LabMaster'), "labmaster"))
const Home = React.lazy(() => lazyRetry(() => import('./pages/home/Home'), "home"))
const Charges = React.lazy(() => lazyRetry(() => import('./pages/hospital charges master/Charges'), "charges"))
const HospitalMaster = React.lazy(() => lazyRetry(() => import('./pages/Hospital master/HospitalProfile'), "HospitalMaster"))
const Subscription = React.lazy(() => lazyRetry(() => import('./pages/subscription/subscription'), "Subscription"))
const Rolesmaster = React.lazy(() => lazyRetry(() => import('./pages/roles master/Rolesmaster'), "Rolesmaster"))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/home', exact: true, name: 'Home', element: Home },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/usersmasters', name: 'Users', element: Usersmasters },
  { path: '/patients', name: 'Patients', element: Patients, exact: true },
  // { path: '/patients/patientslist', name: 'Patients', element: Patients },
  // { path: '/patients/patientslist/patientshistory', name: 'PatientsHistory', element: PatientsHistory },
  { path: '/patients/patientshistory', name: 'PatientsHistory', element: PatientsHistory },
  { path: '/patients/patientslist/patientshistory/admitinvoice', name: 'Invoice', element: Invoice },
  { path: '/patients/patientslist/patientshistory/opdinvoice', name: 'Invoice', element: Opdinvoice },
  { path: '/patients/patientslist/patientshistory/medicineinvoice', name: 'Invoice', element: Medicineinvoice },
  // { path: '/rooms', element: Rooms, exact: true },
  { path: '/rooms', name: 'Rooms', element: Rooms },
  { path: '/opd', name: 'OPD', element: Opd },
  { path: '/indoor', name: 'Indoor', element: Admit },
  { path: '/discharge', name: 'Discharge', element: Discharge },
  { path: '/medical', element: Medicine, exact: true },
  { path: '/medical/medicalprofile', name: 'Medical', element: MedicalProfile },
  { path: '/medical/medicinemaster', name: 'Medicine Stock', element: Medicinemaster },
  { path: '/medical/medicine', name: 'Medicine Invoice', element: Medicine },
  { path: '/medical/medicine/medicineinvoice', name: 'Invoice', element: Medicineinvoice },
  { path: '/medical/medicinereturn', name: 'Medicine Return Invoice', element: MedicineReturn },
  { path: '/medical/medicinereturn/returnmedicineinvoice', name: 'Medicine Return Invoice', element: ReturnMedicineinvoice },
  { path: '/laboratory', element: Labreport, exact: true },
  { path: '/laboratory/labreport', name: 'Laboratory Reports', element: Labreport },
  { path: '/laboratory/labreport/labreportprint', name: 'Paitent Lab Report', element: Labreportprint },
  { path: '/laboratory/labmaster', name: 'Laboratory Master', element: Labmaster },
  { path: '/indoor/invoice', name: 'Invoice', element: Invoice, exact: true },
  { path: '/opd/opdinvoice', name: 'Invoice', element: Opdinvoice, exact: true },
  { path: '/tax', name: 'Tax', element: TaxMasters, exact: true },
  { path: '/tax/hospitaltax', name: 'Hospital Tax', element: TaxMasters },
  { path: '/tax/medicaltax', name: 'Medical Tax', element: Medicaltax },
  { path: '/drmaster', name: 'Doctors', element: Drsmasters, exact: true },
  { path: '/charges', name: 'Charges', element: Charges, exact: true },
  { path: '/hospitalprofile', name: 'Hospital Profile', element: HospitalMaster, exact: true },
  { path: '/subscription', name: 'Subscription', element: Subscription, exact: true },
  { path: '/rolemaster', name: 'Roles', element: Rolesmaster, exact: true },
]



// const routes = [
//   { path: '/home', exact: true, name: 'Home', element: <Home /> },
//   { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
//   { path: '/usersmasters', name: 'Users', element: <Usersmasters /> },
//   {
//     path: '/patients',
//     name: 'Patients',
//     element: <Patients />,
//     children: [
//       { path: '', element: <Patients /> },
//       { path: 'addpatients', element: <Patients /> },
//       { path: 'patientshistory/:item', element: <PatientsHistory /> },
//       { path: 'patientshistory/admitinvoice', element: <Invoice /> },
//       { path: 'patientshistory/opdinvoice', element: <Opdinvoice /> },
//       { path: 'patientshistory/medicineinvoice', element: <Medicineinvoice /> },
//     ],
//   },
//   {
//     path: '/rooms',
//     name: 'Rooms',
//     element: <Rooms />,
//     children: [{ path: '', element: <Rooms /> }, { path: 'addrooms', element: <Rooms /> }],
//   },
//   { path: '/opd', name: 'OPD', element: <Opd /> },
//   { path: '/indoor', name: 'Indoor', element: <Admit /> },
//   { path: '/discharge', name: 'Discharge', element: <Discharge /> },
//   {
//     path: '/medical',
//     name: 'Medical',
//     element: <Medicine />,
//     children: [
//       { path: '', element: <Medicine /> },
//       { path: 'medicinemaster', element: <Medicinemaster /> },
//       { path: 'medicine', element: <Medicine /> },
//       { path: 'medicine/medicineinvoice', element: <Medicineinvoice /> },
//       { path: 'medicinereturn', element: <MedicineReturn /> },
//       { path: 'medicinereturn/returnmedicineinvoice', element: <ReturnMedicineinvoice /> },
//     ],
//   },
//   {
//     path: '/laboratory',
//     name: 'Laboratory',
//     element: <Labreport />,
//     children: [
//       { path: '', element: <Labreport /> },
//       { path: 'labreport', element: <Labreport /> },
//       { path: 'labreport/labreportprint', element: <Labreportprint /> },
//       { path: 'labmaster', element: <Labmaster /> },
//     ],
//   },
//   { path: '/tax', name: 'Tax', element: <TaxMasters /> },
//   { path: '/drmaster', name: 'Doctors', element: <Drsmasters /> },
// ];
export default routes
const lazyRetry = function (componentImport, name) {
  return new Promise((resolve, reject) => {
    // check if the window has already been refreshed
    const hasRefreshed = JSON.parse(
      window.sessionStorage.getItem(`retry-${name}-refreshed`) || 'false'
    );
    // try to import the component
    componentImport().then((component) => {
      window.sessionStorage.setItem('retry-lazy-refreshed', 'false'); // success so reset the refresh
      resolve(component);
    }).catch((error) => {
      if (!hasRefreshed) { // not been refreshed yet
        window.sessionStorage.setItem('retry-lazy-refreshed', 'true'); // we are now going to refresh
        return window.location.reload(); // refresh the page
      }
      reject(error); // Default error behaviour as already tried refresh
    });
  });
};