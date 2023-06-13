/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
// routes config
import Dashboard from 'src/dashboard/Dashboard'
import medroutes from 'src/medRoutes'
import MedicineMaster from 'src/pages/medical/medicine msater/MedicineMaster'

const MedicalComponent = () => {
    return (
        <div>
            <div>
                <Suspense fallback={<CSpinner color="primary" />}>
                    <Routes>
                        {medroutes.map((route, idx) => {
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
                        <Route path="/" element={<MedicineMaster />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    )
}

export default MedicalComponent;