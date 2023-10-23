/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import doctorRoutes from 'src/doctorRoutes'
import DoctarDashboard from 'src/pages/doctors/DoctarDashboard'
// routes config

const DoctorComponent = () => {
    return (
        <div>
            <div>
                <Suspense fallback={<div>Loading...</div>}>

                    <Routes>
                        {doctorRoutes.map((route, idx) => {
                            return (
                                route.element && (
                                    <Route
                                        key={idx}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        element={<route.element />}
                                    />
                                )
                            )
                        })}
                        <Route path="/" element={<DoctarDashboard />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    )
}

export default DoctorComponent;