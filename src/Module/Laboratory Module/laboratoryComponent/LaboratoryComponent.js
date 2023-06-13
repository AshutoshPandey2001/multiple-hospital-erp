/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import laboratoryRoutes from 'src/laboratoryRoutes'
import LabMaster from 'src/pages/laboratory/LabMaster'
// routes config

const LaboratoryComponent = () => {
    return (
        <div>
            <div>
                <Suspense fallback={<CSpinner color="primary" />}>
                    <Routes>
                        {laboratoryRoutes.map((route, idx) => {
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
                        <Route path="/" element={<LabMaster />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    )
}

export default LaboratoryComponent;