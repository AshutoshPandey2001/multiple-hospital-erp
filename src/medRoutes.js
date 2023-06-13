/* eslint-disable prettier/prettier */
import React from 'react'
const Medicine = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine/Medicine'), "medicine"))
const Medicinemaster = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine msater/MedicineMaster'), "medicinemaster"))
const MedicineReturn = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine Return/MedicineReturn'), "medicinereturn"))
const Medicineinvoice = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine/medicineInvoice'), "medineInvoice"))
const ReturnMedicineinvoice = React.lazy(() => lazyRetry(() => import('./pages/medical/medicine Return/ReturnmedicineInvoice'), "returnmedineInvoice"))
const medroutes = [
    // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/medical', name: 'Medical', element: Medicine, exact: true },
    { path: '/medical/medicinemaster', name: 'Medicine Stock', element: Medicinemaster },
    { path: '/medical/medicine', name: 'Medicine Invoice', element: Medicine },
    { path: '/medical/medicine/medicineinvoice', name: 'Invoice', element: Medicineinvoice },
    { path: '/medical/medicinereturn', name: 'Medicine Return Invoice', element: MedicineReturn },
    { path: '/medical/medicinereturn/returnmedicineinvoice', name: 'Return Invoice', element: ReturnMedicineinvoice },
]

export default medroutes;
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