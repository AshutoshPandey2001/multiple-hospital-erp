/* eslint-disable prettier/prettier */
import { onAuthStateChanged } from 'firebase/auth'
import React, { Suspense } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { auth, db } from './firebaseconfig'
import MedicalModule from './Module/Medial Module/MedicalModule'
import PatientsReportmodel from './Module/Patients  module/PatientsReportmodel'
import ReceptionModule from './Module/Reception Module/ReceptionModule'
import Loaderspinner from './comman/spinner/Loaderspinner'
import { SET_ACTIVE_USER, selectUsertype, selectUserId } from './redux/slice/authSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './scss/style.scss'
import LaboratoryModule from './Module/Laboratory Module/LaboratoryModule'
import AdminModule from './Module/Admin Module/AdminModule'
import { startTransition } from 'react';
import ManagementModule from './Module/Management Module/ManagementModule'
import { getHospitalProfile } from 'src/services/firebasedb'
import moment from 'moment'
import { da } from 'date-fns/locale'
import DoctorModule from './Module/Doctor Module/DoctorModule'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('../src/pages/login/Login'))
const Register = React.lazy(() => import('../src/pages/register/Register'))

const Page404 = React.lazy(() => import('../src/pages/page404/Page404'))
const Page500 = React.lazy(() => import('../src/pages/page500/Page500'))


const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState()
  const userType = useSelector(selectUsertype)
  const hospitaluid = useSelector(selectUserId)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);

  const calCulateDays = (subscriptionExpireDate) => {
    let time_differ = (new Date(timeFilter(subscriptionExpireDate)) - new Date(formattedDate));
    const days = time_differ / (1000 * 60 * 60 * 24);
    return days
  }

  const timeFilter = (timestamp) => {
    const timestampWithNanoseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
    const dateObject = new Date(timestampWithNanoseconds);
    const timeString = moment(dateObject).format('YYYY-MM-DD');
    return timeString
  }
  useEffect(() => {
    startTransition(() => {
      // This code will not block the UI and will work correctly
      setUser(userType);
      console.log('userType', userType, hospitaluid);
      setIsLoading(false);
    });
  }, [userType])





  return (
    <>
      <ToastContainer />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
        </Routes>

        {isLoading ? <Loaderspinner /> :
          <>
            {user ?

              (() => {
                switch (userType) {
                  case 'Management':
                    return (
                      <ManagementModule />
                    )
                  case 'Doctor':
                    return (
                      <DoctorModule />
                    )
                  default:
                    return (
                      <DefaultLayout />
                    )
                }
              })()

              : <Login />}</>

        }
      </Suspense>

    </>

  )

}

export default App
