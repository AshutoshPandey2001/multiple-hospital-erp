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
import { SET_ACTIVE_USER, selectUsertype } from './redux/slice/authSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './scss/style.scss'
import LaboratoryModule from './Module/Laboratory Module/LaboratoryModule'
import { getDeviceToken } from './services/deviceToken'
import AdminModule from './Module/Admin Module/AdminModule'
import { startTransition } from 'react';

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
  // const [userType, setUserType] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    // setTimeout(() => {
    // getDeviceToken().then(token => {
    //   console.log('token', token);
    // }).catch(error => {
    //   console.error('token error ', error);
    // }); 
    startTransition(() => {
      onAuthStateChanged(auth, (user) => {
        let usertype = '';
        let mobileno = '';
        let userName = '';
        let hospitaluid = '';
        if (!user) {
          setUser('')
          setIsLoading(false)
        } else {
          setUser(user.uid)
          db.collection('UserList').doc(user.uid).get().then((res) => {
            usertype = !res.exists ? null : res.data().userType;
            mobileno = !res.exists ? null : res.data().userMobileNo;
            userName = !res.exists ? null : res.data().userName;
            hospitaluid = !res.exists ? null : res.data().hospitaluid;
            dispatch(SET_ACTIVE_USER({
              email: user.email,
              userName: userName,
              userID: hospitaluid,
              userType: usertype,
              mobileNo: mobileno,
            }))
            setIsLoading(false)
          }).catch((error) => {
            console.error("Error updating document: ", error);
            setIsLoading(false)

          });
        }

      })
    })

    // setIsLoading(false)
    // }, 3000)



  }, [dispatch, userType])

  return (
    <>
      <ToastContainer />
      <Suspense fallback={loading}>
        {startTransition(() => (
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
          </Routes>
        ))}
      </Suspense>

      {isLoading ? <Loaderspinner /> :
        <>
          {user ?

            (() => {
              switch (userType) {

                case 'Admin':
                  return (
                    <AdminModule />
                  )
                case 'Medical':
                  return (
                    <MedicalModule />
                  )
                case 'Reception':
                  return (
                    <ReceptionModule />
                  )
                case 'Laboratory':
                  return (
                    <LaboratoryModule />
                  )
                case 'Patient':
                  return (
                    <PatientsReportmodel />
                  )
                default:
                  return (
                    <DefaultLayout />
                  )
              }
            })()

            : <Login />}</>

      }

    </>

  )

}

export default App
