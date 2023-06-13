/* eslint-disable prettier/prettier */
import React from 'react'
// const Dashboard = React.lazy(() => lazyRetry(() => import('./dashboard/Dashboard'), "dashboard"))
// const Opd = React.lazy(() => lazyRetry(() => import('./pages/opd/Opd'), "opd"))
// const Admit = React.lazy(() => lazyRetry(() => import('./pages/admit/Admit'), 'admit'))
// const Patients = React.lazy(() => lazyRetry(() => import('./pages/patients master/addPatient/Addpatients'), "patients"))
// const PatientsHistory = React.lazy(() => lazyRetry(() => import('./pages/patients master/Patientshistory'), "patienthistory"))
// const Opdinvoice = React.lazy(() => lazyRetry(() => import('./pages/opd/opdInvoice'), "opdinvoice"))
// const Invoice = React.lazy(() => lazyRetry(() => import('./pages/Invoice/Invoicepage'), "admitinvoice"))
// const Discharge = React.lazy(() => lazyRetry(() => import('./pages/discharge/Discharge'), "discharge"))
// const Home = React.lazy(() => lazyRetry(() => import('./pages/home/Home'), "home"))

const Dashboard = React.lazy(() => lazyRetry(() => import('./dashboard/Dashboard'), "dashboard"))
const Opd = React.lazy(() => lazyRetry(() => import('./pages/opd/Opd'), "opd"))
const Admit = React.lazy(() => lazyRetry(() => import('./pages/admit/Admit'), 'admit'))
const Patients = React.lazy(() => lazyRetry(() => import('./pages/patients master/addPatient/Addpatients'), "patients"))
const Medicine = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine/Medicine'), "medicine"))
const MedicineReturn = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine Return/MedicineReturn'), "medicinereturn"))
const Rooms = React.lazy(() => lazyRetry(() => import('./pages/rooms/Addrooms/AddRooms'), "rooms"))

const Medicinemaster = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine msater/MedicineMaster'), "medicinemaster"))
const PatientsHistory = React.lazy(() => lazyRetry(() => import('./pages/patients master/Patientshistory'), "patienthistory"))
const Invoice = React.lazy(() => lazyRetry(() => import('./pages/Invoice/Invoicepage'), "admitinvoice"))
const Usersmasters = React.lazy(() => lazyRetry(() => import('./pages/Hospital user Registration/MasterUserRegistration/UsersMstersregistration'), 'userMaster'))
const Drsmasters = React.lazy(() => lazyRetry(() => import('./pages/doctorMaster/doctorMaster'), "drMaster"))
const Discharge = React.lazy(() => lazyRetry(() => import('./pages/discharge/Discharge'), "discharge"))

const TaxMasters = React.lazy(() => lazyRetry(() => import('./pages/tax masters/taxMaster'), "taxmaster"))
const Opdinvoice = React.lazy(() => lazyRetry(() => import('./pages/opd/opdInvoice'), "opdinvoice"))
const Medicineinvoice = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine/medicineInvoice'), "medineInvoice"))
const ReturnMedicineinvoice = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine Return/ReturnmedicineInvoice'), "returnmedineInvoice"))

const Labreport = React.lazy(() => lazyRetry(() => import('./pages/laboratory/Labreport'), "labreport"))
const Labreportprint = React.lazy(() => lazyRetry(() => import('./pages/laboratory/Labreportprint'), "labreportprint"))
const Labmaster = React.lazy(() => lazyRetry(() => import('./pages/laboratory/LabMaster'), "labmaster"))
const Home = React.lazy(() => lazyRetry(() => import('./pages/home/Home'), "home"))
const Charges = React.lazy(() => lazyRetry(() => import('./pages/hospital charges master/Charges'), "charges"))

const receptionRoutes = [
    // { path: '/home', exact: true, name: 'Home', element: Home },
    // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    // { path: '/patients', name: 'Patients', element: Patients, exact: true },
    // { path: '/patients/addpatients', name: 'Patients', element: Patients },
    // { path: '/patients/patientshistory', name: 'PatientsHistory', element: PatientsHistory },
    // { path: '/opd', name: 'OPD', element: Opd },
    // { path: '/indoor', name: 'Indoor', element: Admit },
    // { path: '/indoor/invoice', name: 'Invoice', element: Invoice, exact: true },
    // { path: '/opd/opdinvoice', name: 'Invoice', element: Opdinvoice, exact: true },
    // { path: '/discharge', name: 'Discharge', element: Discharge },
    { path: '/home', exact: true, name: 'Home', element: Home },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    // { path: '/usersmasters', name: 'Users', element: Usersmasters },
    { path: '/patients', element: Patients, exact: true },
    { path: '/patients/patientslist', name: 'Patients', element: Patients },
    { path: '/patients/patientslist/patientshistory', name: 'PatientsHistory', element: PatientsHistory },
    { path: '/patients/patientslist/patientshistory/admitinvoice', name: 'Invoice', element: Invoice },
    { path: '/patients/patientslist/patientshistory/opdinvoice', name: 'Invoice', element: Opdinvoice },
    { path: '/patients/patientslist/patientshistory/medicineinvoice', name: 'Invoice', element: Medicineinvoice },
    // { path: '/rooms', element: Rooms, exact: true },
    { path: '/rooms', name: 'Rooms', element: Rooms },
    { path: '/opd', name: 'OPD', element: Opd },
    { path: '/indoor', name: 'Indoor', element: Admit },
    { path: '/discharge', name: 'Discharge', element: Discharge },
    // { path: '/medical',  element: Medicine, exact: true },
    // { path: '/medical/medicinemaster', name: 'Medicine Stock', element: Medicinemaster },
    // { path: '/medical/medicine', name: 'Medicine Invoice', element: Medicine },
    // { path: '/medical/medicine/medicineinvoice', name: 'Invoice', element: Medicineinvoice },
    // { path: '/medical/medicinereturn', name: 'Medicine Return Invoice', element: MedicineReturn },
    // { path: '/medical/medicinereturn/returnmedicineinvoice', name: 'Medicine Return Invoice', element: ReturnMedicineinvoice },
    { path: '/laboratory', element: Labreport, exact: true },
    { path: '/laboratory/labreport', name: 'Laboratory Reports', element: Labreport },
    { path: '/laboratory/labreport/labreportprint', name: 'Paitent Lab Report', element: Labreportprint },
    { path: '/laboratory/labmaster', name: 'Laboratory Master', element: Labmaster },
    { path: '/indoor/invoice', name: 'Invoice', element: Invoice, exact: true },
    { path: '/opd/opdinvoice', name: 'Invoice', element: Opdinvoice, exact: true },
    { path: '/tax', name: 'Tax', element: TaxMasters, exact: true },
    { path: '/drmaster', name: 'Doctors', element: Drsmasters, exact: true },
    { path: '/charges', name: 'Charges', element: Charges, exact: true },

]

export default receptionRoutes;
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