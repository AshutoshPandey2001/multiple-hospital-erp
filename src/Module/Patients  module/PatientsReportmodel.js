/* eslint-disable prettier/prettier */
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PatientsReport from './PatientsReport/PatientsReport'

const PatientsReportmodel = () => {
    ('i am on this page');
    return (
        <div>
            <Routes>
                {/* <Route path='' element={<Navigate to="patientreport" />} /> */}
                <Route path="/" element={<PatientsReport />} />
            </Routes>
        </div>
    )
}

export default PatientsReportmodel