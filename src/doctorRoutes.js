/* eslint-disable prettier/prettier */
import React from 'react'
const DoctorDashboard = React.lazy(() => lazyRetry(() => import('./pages/doctors/DoctarDashboard'), "doctordashboard"))
const DoctorTodayappoinment = React.lazy(() => lazyRetry(() => import('./pages/doctors/TodaydoctorAppoinmentPatients'), "doctortodayappoinment"))
const DoctorallPatients = React.lazy(() => lazyRetry(() => import('./pages/doctors/DoctorallPatients'), "doctorallpatients"))
const DoctorPriscription = React.lazy(() => lazyRetry(() => import('./pages/doctors/DoctorPriscription'), "doctorPriscription"))

const doctorRoutes = [
    { path: '/doctordashboard', name: 'Dashboard', element: DoctorDashboard, exact: true },
    { path: '/todayAppoinments', name: 'Patients', element: DoctorTodayappoinment },
    { path: '/allcheckpatients', name: 'All Patients', element: DoctorallPatients },
    { path: '/todayAppoinments/doctorPriscription', name: 'Priscription', element: DoctorPriscription },
    { path: '/allcheckpatients/patientshistory', name: 'History', element: DoctorPriscription },
]

export default doctorRoutes;
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