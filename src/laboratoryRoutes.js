/* eslint-disable prettier/prettier */
import React from 'react'
const Labreport = React.lazy(() => lazyRetry(() => import('./pages/laboratory/Labreport'), "labreport"))
const Labreportprint = React.lazy(() => lazyRetry(() => import('./pages/laboratory/Labreportprint'), "labreportprint"))
const Labmaster = React.lazy(() => lazyRetry(() => import('./pages/laboratory/LabMaster'), "labmaster"))

const laboratoryRoutes = [
    { path: '/laboratory', name: 'Laboratory', element: Labreport, exact: true },
    { path: '/laboratory/labmaster', name: 'Laboratory Master', element: Labmaster },
    { path: '/laboratory/labreport', name: 'Laboratory Reports', element: Labreport },
    { path: '/laboratory/labreport/labreportprint', name: 'Paitent Lab Report', element: Labreportprint },
]

export default laboratoryRoutes;
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