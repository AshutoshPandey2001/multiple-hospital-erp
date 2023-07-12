/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { CSpinner } from '@coreui/react'
import managementRoutes from 'src/managementRoutes'
import Management from 'src/pages/management/Management'

const ManagementComponent = () => {
    return (
        <div>
            <Suspense fallback={<CSpinner color="primary" />}>
                <Routes>
                    {managementRoutes.map((route, idx) => {
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
                    <Route path="/" element={<Management />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default ManagementComponent;