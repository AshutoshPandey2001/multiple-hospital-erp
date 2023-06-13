/* eslint-disable prettier/prettier */
import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  input,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilPhone } from '@coreui/icons'
import { registerpatientsSchema } from 'src/schema'
import { useFormik } from 'formik';
import { auth, db } from 'src/firebaseconfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const initalValues = {
  email: '',
  password: '',
  mobileNo: '',
  userType: 'Patient'
}

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: registerpatientsSchema,
    onSubmit: (Values, action) => {

      createUserWithEmailAndPassword(auth, Values.email, Values.password)
        .then((userCredential) => {
          var user = userCredential.user;

          db.collection('UserList').doc(user.uid).set({
            userEmail: Values.email,
            userType: Values.userType,
            userMobileNo: values.mobileNo
          }).then((res) => {

          }).catch((err) => {

          })
          navigate("/login")
        })
        .catch((error) => {

        });

    }
  });
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
  } = formik;
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <form onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <input className='form-control' placeholder="Email" autoComplete="email" name='email' onChange={handleChange} />

                  </CInputGroup>
                  {errors.email && touched.email ? (<p style={{ color: 'red' }}>*{errors.email}</p>) : null}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <input
                      className='form-control'
                      type="number"
                      placeholder="Enter Mobile No"
                      autoComplete="Mobile no"
                      name='mobileNo'
                      onChange={handleChange}
                    />

                  </CInputGroup>
                  {errors.mobileNo && touched.mobileNo ? (<p style={{ color: 'red' }}>*{errors.mobileNo}</p>) : null}
                  <CInputGroup className="mb-3">
                    <CInputGroupText >
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <input
                      className='form-control'
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name='password'
                      onChange={handleChange}
                    />

                  </CInputGroup>
                  {errors.password && touched.password ? (<p style={{ color: 'red' }}>*{errors.password}</p>) : null}
                  <div className="d-grid">
                    <CButton type='submit' color="success">Create Account</CButton>
                  </div>
                </form>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
