/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilAccountLogout } from '@coreui/icons'
import navigation from '../_nav'
import hospitalimg from 'src/assets/images/hospitalerp.png'
import { AiFillSetting } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { AppBreadcrumb } from './index'
import { selectChangeState, SET_STATE } from 'src/redux/slice/changeStateslice'
import { auth } from 'src/firebaseconfig'
import { signOut } from 'firebase/auth'
import { REMOVE_ACTIVE_USER, selectEmail, selectUserName, selectUsertype } from 'src/redux/slice/authSlice'
import { confirmAlert } from 'react-confirm-alert';
import NavigationBar from './Navigationbar'
import { setTimeout } from 'core-js'
import { SET_MENU_STYLE, selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import medNav from '../_medNav'
import receptionNav from '../_receptionNav'
import laboratoryNav from 'src/_laboratoryNav'
import { startTransition } from 'react';
import adminnav from 'src/_adminNav'
import '../pages/admit/admit.css'
import { selectHospitalLogo, selectSubscriptionExpireDate } from 'src/redux/slice/hospitalProfileSlice'
import ManagementNav from 'src/_managementNav'
import { persistor } from 'src/redux/store'
import { RESET_PATIENTS } from 'src/redux/slice/patientMasterslice'
import { RESET_OPD } from 'src/redux/slice/opdPatientsList'
import moment from 'moment'
import { useEffect } from 'react'

const AppHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const sidebarShow = useSelector((state) => state.sidebarShow)
  const selectedMenu = useSelector(selectmenuStyle)
  const hospitslLogo = useSelector(selectHospitalLogo)
  const subscriptionExpireDate = useSelector(selectSubscriptionExpireDate)

  const sidebarShow = useSelector(selectChangeState)
  const userType = useSelector(selectUsertype)
  const userName = useSelector(selectUserName)
  const userEmail = useSelector(selectEmail)
  const [totalRemaningDays, setTotalRemaningDays] = useState();
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);

  const calCulateDays = () => {
    let time_differ = (new Date(timeFilter(subscriptionExpireDate)) - new Date(formattedDate));
    const days = time_differ / (1000 * 60 * 60 * 24);
    setTotalRemaningDays(days)
  }

  const timeFilter = (timestamp) => {
    const timestampWithNanoseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
    const dateObject = new Date(timestampWithNanoseconds);
    const timeString = moment(dateObject).format('YYYY-MM-DD');
    return timeString
  }

  useEffect(() => {
    calCulateDays()
  }, [])

  // const logOut = () => {
  //   confirmAlert({
  //     title: 'Confirm to Logout',
  //     message: 'Are you sure to do this.',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => {
  //           startTransition(() => {
  //             signOut(auth).then(() => {
  //               dispatch(REMOVE_ACTIVE_USER())
  //               dispatch(SET_STATE(false))
  //               // navigate('/login')
  //             }).catch((error) => {
  //               console.error(error);
  //             });
  //           });
  //           // setTimeout(() => {

  //           // }, 2000);

  //         }
  //       },
  //       {
  //         label: 'No',
  //       }
  //     ]
  //   });

  // }
  // const logOut = () => {
  //   confirmAlert({
  //     title: 'Confirm to Logout',
  //     message: 'Are you sure to do this.',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => {
  //           startTransition(() => {
  //             signOut(auth)
  //               .then(() => {
  //                 startTransition(() => {
  //                   dispatch(REMOVE_ACTIVE_USER());
  //                   dispatch(SET_STATE(false));
  //                   // navigate('/login')
  //                 });
  //               })
  //               .catch((error) => {
  //                 console.error(error);
  //               });
  //           });
  //         },
  //       },
  //       {
  //         label: 'No',
  //       },
  //     ],
  //   });
  // };
  const logOut = () => {
    startTransition(() => {
      confirmAlert({
        title: 'Confirm to Logout',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              signOut(auth)
                .then(() => {
                  startTransition(async () => {
                    await persistor.purge(
                      () => {
                        localStorage.removeItem('persist:Hospital_Data');
                        dispatch(REMOVE_ACTIVE_USER());
                        dispatch(SET_STATE(false));
                        dispatch(RESET_PATIENTS());
                        dispatch(RESET_OPD());
                        // navigate('/login')
                      }
                    );
                    // await persistor.purge();
                    // await dispatch(REMOVE_ACTIVE_USER());
                    // await dispatch(SET_STATE(false));
                    // navigate('/login')
                  });
                })
                .catch((error) => {
                  console.error(error);
                });
            },
          },
          {
            label: 'No',
          },
        ],
      });
    });
  };


  if (userType === 'Patient') {
    return (
      <CHeader position="sticky" className="mb-4" style={{ backgroundColor: '#fff' }}>
        <CContainer fluid >
          <CHeaderNav>
            <h5 style={{ color: '#5C607B' }}>Hospital Erp</h5>
          </CHeaderNav>
          <CHeaderNav className="ms-3">
            <CNavItem>
              <Button variant="light" >
                <CIcon icon={cilAccountLogout} size="lg" onClick={logOut} style={{ color: 'rgba(var(--bs-primary-rgb))' }} />
              </Button>
            </CNavItem>
          </CHeaderNav>
        </CContainer>
      </CHeader>
    )
  } else {
    return (
      <>

        {
          selectedMenu === 'header' ?
            <CHeader position="sticky" className="mb-4" style={{ backgroundColor: '#fff' }}>
              <CContainer fluid >
                <div className="ps-1">
                  <NavLink to="/" ><img src={hospitslLogo ? hospitslLogo : hospitalimg} className="sidebar-brand-full" width="80px" height="70px" alt="hospital_logo" /></NavLink>
                </div>
                <CHeaderNav className=" " >
                  {
                    (() => {
                      switch (userType) {

                        case 'Admin':
                          return (
                            <NavigationBar menuItems={adminnav} />)
                        case 'Medical':
                          return (
                            <NavigationBar menuItems={medNav} />)
                        case 'Reception':
                          return (
                            <NavigationBar menuItems={receptionNav} />)
                        case 'Laboratory':
                          return (
                            <NavigationBar menuItems={laboratoryNav} />)
                        case 'Management':
                          return (
                            <NavigationBar menuItems={ManagementNav} />)
                        default:
                          return (
                            <NavigationBar menuItems={navigation} />)
                      }
                    })()

                  }

                </CHeaderNav>
                <CHeaderNav className='align-items-center'>
                  <CNavItem>
                    <Dropdown autoClose="outside">
                      <Dropdown.Toggle variant="light" id="dropdown-autoclose-outside">
                        < CgProfile size={28} color='rgba(var(--bs-primary-rgb))' />
                      </Dropdown.Toggle>
                      <Dropdown.Menu >
                        <Dropdown.Item ><b>Name:-{userName}</b> </Dropdown.Item>
                        <Dropdown.Item ><b>Email:-{userEmail}</b> </Dropdown.Item>
                        <Dropdown.Item ><b>Type:-{userType}</b></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </CNavItem>
                  <CNavItem>
                    <Button variant="light" >
                      <CIcon icon={cilAccountLogout} size="lg" onClick={logOut} style={{ color: 'rgba(var(--bs-primary-rgb))' }} />
                    </Button>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>
                      <Dropdown autoClose="outside">
                        <Dropdown.Toggle variant="light" id="dropdown-autoclose-outside">
                          <AiFillSetting size={22} color='rgba(var(--bs-primary-rgb))' />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='text-center'>
                          <Dropdown.Item >
                            <Dropdown autoClose="outside">
                              <Dropdown.Toggle variant="light" id="dropdown-autoclose-outside">
                                Menu Settings
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item ><div className="form-check">
                                  <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="changemenu" value="sideMenu" checked={selectedMenu === 'sideMenu'} onChange={(e) => dispatch(SET_MENU_STYLE(e.target.value))} />Side Menu
                                  </label>
                                </div></Dropdown.Item>
                                <Dropdown.Item ><div className="form-check">
                                  <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="changemenu" value="header" checked={selectedMenu === 'header'} onChange={(e) => [dispatch(SET_MENU_STYLE(e.target.value)), dispatch(SET_STATE(false))]} />Header
                                  </label>
                                </div></Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Dropdown.Item>
                          {/* <Dropdown.Item >Dark Mode</Dropdown.Item> */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </CNavLink>
                  </CNavItem>
                </CHeaderNav>

              </CContainer>
              <CHeaderDivider />
              <CContainer fluid >
                <AppBreadcrumb />
              </CContainer>
            </CHeader> :
            <CHeader position="sticky" className="mb-4" style={{ backgroundColor: '#fff' }}>
              <CContainer fluid >
                <CHeaderToggler
                  className="ps-1"
                  onClick={() => dispatch(SET_STATE(!sidebarShow))}
                  style={{ color: 'rgba(var(--bs-primary-rgb))' }}>
                  <CIcon icon={cilMenu} size="lg" />
                </CHeaderToggler>
                <CHeaderNav className="d-none d-md-flex me-auto" >

                </CHeaderNav>
                <CHeaderNav className='align-items-center'>
                  <CNavItem>
                    <Dropdown autoClose="outside">
                      <Dropdown.Toggle className='dropdown-toggle' variant="light" id="dropdown-autoclose-outside">
                        < CgProfile size={28} color='rgba(var(--bs-primary-rgb))' />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className='text center'>
                        <Dropdown.Item ><b>Name:-{userName}</b> </Dropdown.Item>
                        <Dropdown.Item ><b>Email:-{userEmail}</b> </Dropdown.Item>
                        <Dropdown.Item ><b>User Type:-{userType}</b></Dropdown.Item>
                        {(userType === 'Admin' || userType === "Super Admin") ? <>
                          <Dropdown.Item ><b>Remaining Days:-{totalRemaningDays}</b></Dropdown.Item>
                          <Dropdown.Item className='d-flex justify-content-center'>
                            <Button onClick={() => { navigate('/subscription') }}>Subscribe</Button>
                          </Dropdown.Item></> : null
                        }

                      </Dropdown.Menu>
                    </Dropdown>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink >
                      <Button variant="light" >
                        <CIcon icon={cilAccountLogout} size="lg" onClick={logOut} style={{ color: 'rgba(var(--bs-primary-rgb))' }} />
                      </Button>
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>

                    <Dropdown autoClose="outside">
                      <Dropdown.Toggle variant="light" id="dropdown-autoclose-outside">
                        <AiFillSetting size={22} color='rgba(var(--bs-primary-rgb))' />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className='text-center'>
                        <Dropdown.Item >
                          <Dropdown autoClose="outside">
                            <Dropdown.Toggle variant="light" id="dropdown-autoclose-outside">
                              Menu Settings
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item ><div className="form-check">
                                <label className="form-check-label">
                                  <input type="radio" className="form-check-input" name="changemenu" value="sideMenu" checked={selectedMenu === 'sideMenu'} onChange={(e) => dispatch(SET_MENU_STYLE(e.target.value))} />Side Menu
                                </label>
                              </div></Dropdown.Item>
                              <Dropdown.Item ><div className="form-check">
                                <label className="form-check-label">
                                  <input type="radio" className="form-check-input" name="changemenu" value="header" checked={selectedMenu === 'header'} onChange={(e) => [dispatch(SET_MENU_STYLE(e.target.value)), dispatch(SET_STATE(false))]} />Header
                                </label>
                              </div></Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Dropdown.Item>
                        {/* <Dropdown.Item >Dark Mode</Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>


                  </CNavItem>
                </CHeaderNav>

              </CContainer>
              <CHeaderDivider />
              <CContainer fluid >
                <AppBreadcrumb width='100%' />
              </CContainer>
            </CHeader>
        }


      </>
    )
  }
}

export default AppHeader
