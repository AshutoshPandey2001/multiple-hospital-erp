/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import receptionRoutes from 'src/receptionRoutes'
import Dashboard from 'src/dashboard/Dashboard'
import Addpatients from 'src/pages/patients master/addPatient/Addpatients'
import Home from 'src/pages/home/Home'
import adminroutes from 'src/adminRoutes'

const AdminComponent = () => {
    return (
        <div>
            <div>
                <Suspense fallback={<CSpinner color="primary" />}>
                    <Routes>
                        {adminroutes.map((route, idx) => {
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
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    )
}

export default AdminComponent