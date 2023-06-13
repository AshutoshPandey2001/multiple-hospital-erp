/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginSchema } from 'src/schema'
import { useFormik } from 'formik';
import { auth } from 'src/firebaseconfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import hospitalimg from 'src/assets/images/hospitalerp.png'
import { AppFooter } from 'src/components'
import { CFooter } from '@coreui/react'
import skybanLogo from 'src/assets/images/skyban-logo.png'
import background from 'src/assets/images/background_img_Hospitalerp-min.jpg'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'

const initalValues = {
  email: '',
  password: '',
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [passwordVisible, setPasswordVisible] = useState(false);


  const formik = useFormik({
    initialValues: initalValues,
    validationSchema: loginSchema,
    onSubmit: (Values, action) => {

      signInWithEmailAndPassword(auth, Values.email, Values.password)
        .then((userCredential) => {
          var user = userCredential.user;
          // dispatch(SET_ACTIVE_USER(user))
          toast.success("Login successful.....");
          navigate('/')

        })
        .catch((error) => {
          toast.error(error.message);
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
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center" style={{
        backgroundImage: `url(${background})`, backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
      }} loading="lazy">
        <div className='container'>
          <div className='row justify-content-end'>
            <div className='col-md-5' >
              <CCard className="p-4" style={{ borderRadius: "25px" }}>
                <div className="row justify-content-center" style={{ marginBottom: '30px' }}>
                  <div className=" col-md-12 align-content-center">
                    <div className='d-flex justify-content-center'>
                      <img src={hospitalimg} className="sidebar-brand-full" width="100px" height="100px" alt='Hosptal_logo' />
                      <h4 style={{ marginTop: '35px', marginLeft: '15px' }}>SHIVKRUPA HOSPITAL</h4>
                    </div>
                  </div>
                </div>
                <CRow className="justify-content-center">
                  <CCol md={12}>
                    <CCardGroup>
                      <CCardBody>
                        <form onSubmit={handleSubmit}>
                          <h1>Login</h1>
                          <p className="text-medium-emphasis">Sign In to your account</p>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <input className='form-control' placeholder="Username" autoComplete="username" name='email' onChange={handleChange} />
                            {errors.email && touched.email ? (<p style={{ color: 'red' }}>*{errors.email}</p>) : null}
                          </CInputGroup>
                          <CInputGroup className="mb-4">
                            <CInputGroupText>
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <input
                              className='form-control'
                              type={passwordVisible ? 'text' : 'password'}
                              placeholder="Password"
                              name='password'
                              autoComplete="current-password"
                              onChange={handleChange}
                            />
                            <CInputGroupText onClick={togglePasswordVisibility}>
                              {passwordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}

                              {/* <CIcon icon={cilLockLocked} /> */}
                            </CInputGroupText>
                            {errors.password && touched.password ? (<p style={{ color: 'red' }}>*{errors.password}</p>) : null}

                          </CInputGroup>
                          <CRow>
                            <CCol xs={12} className='text-center'>
                              <button type='submit' className="btn btn-primary px-4" >
                                Login
                              </button>
                            </CCol>
                            {/* <CCol xs={6} className="text-right">
            <CButton color="link" className="px-0">
              Forgot password?
            </CButton>
          </CCol> */}
                          </CRow>
                        </form>
                      </CCardBody>
                      {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
    <CCardBody className="text-center">
      <div>
        <h2>Sign up</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Link to="/register">
          <CButton color="primary" className="mt-3" active tabIndex={-1}>
            Register Now!
          </CButton>
        </Link>
      </div>
    </CCardBody>
  </CCard> */}
                    </CCardGroup>
                  </CCol>
                </CRow>
              </CCard>
            </div>
          </div>

        </div>
      </div>
      <div style={{ position: 'fixed', bottom: '1px', width: '100%' }}>
        {/* <CFooter > */}
        <div className='row'>
          <div className='d-flex justify-content-end'>
            {/* <span className="me-1 text-white"><b>Software by:</b></span> */}
            <a href="https://skyban.in/" target="_blank" rel="noopener noreferrer">
              <img src={skybanLogo} alt='skyban_logo' width="auto" height="35px" />
            </a>
          </div>
        </div>

        {/* </CFooter> */}
      </div>

    </div>
  )
}

export default Login
