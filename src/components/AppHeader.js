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
import { REMOVE_ACTIVE_USER, selectEmail, selectUserId, selectUserName, selectUsertype, selectpermissions } from 'src/redux/slice/authSlice'
import { confirmAlert } from 'react-confirm-alert';
import NavigationBar from './Navigationbar'
import { setTimeout } from 'core-js'
import { RESET_MENU_STYLE, SET_MENU_STYLE, selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import medNav from '../_medNav'
import drNav from '../_drNav'
import receptionNav from '../_receptionNav'
import laboratoryNav from 'src/_laboratoryNav'
import { startTransition } from 'react';
import adminnav from 'src/_adminNav'
import '../pages/admit/admit.css'
import { REMOVE_HOSPITAL_PROFILE, selectHospitalLogo, selectSubscriptionExpireDate } from 'src/redux/slice/hospitalProfileSlice'
import ManagementNav from 'src/_managementNav'
import { persistor } from 'src/redux/store'
import { RESET_PATIENTS } from 'src/redux/slice/patientMasterslice'
import { RESET_OPD } from 'src/redux/slice/opdPatientsList'
import moment from 'moment'
import { useEffect } from 'react'
import Loaderspinner from '../comman/spinner/Loaderspinner'
import { RESET_CHARGES } from 'src/redux/slice/chargesSlice'
import { RESET_DISCHARGE_PATIENTS } from 'src/redux/slice/dischargePatientSlice'
import { RESET_INDOOR } from 'src/redux/slice/admitPatientsSlice'
import { RESET_DASHBOARD } from 'src/redux/slice/dashboardSlice'
import { RESET_DR } from 'src/redux/slice/doctorsSlice'
import { RESET_MEDICINES } from 'src/redux/slice/medicinesMasterSlice'
import { RESET_PREV_INVOICE_NO } from 'src/redux/slice/prevBillNoSlice'
import { RESET_RETURN_PATIENTS_MEDICINES } from 'src/redux/slice/returnMedicineslice'
import { RESET_LABORATORY_REPORTS } from 'src/redux/slice/patientsLaboratoryReportsSlice'
import { RESET_ROOM } from 'src/redux/slice/roomMasterSlice'
import { CLEAR_FIELD } from 'src/redux/slice/invoiceSlice'
import { RESET_TAX } from 'src/redux/slice/taxSlice'
import { RESET_PARAMETERS } from 'src/redux/slice/laborataryMaster'
import { RESET_PATIENTS_MEDICINES } from 'src/redux/slice/patientsMedicinesSlice'
import { RESET_ROLE } from 'src/redux/slice/userRolesSlice'

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
  const [isLoading, setIsLoading] = useState(false)
  const userpermissions = useSelector(selectpermissions)

  // const permissionNav = navigation.map((item) => {
  //   const selectedmodule = userpermissions?.find((item1) => item.key === item1.module)
  //   if (selectedmodule && selectedmodule.module === item.key) {
  //     return item
  //   }
  // }).filter((route) => route !== undefined);
  const permissionNav = navigation.map(item => {
    const selectedModule = userpermissions?.find(item1 => item.key === item1.module);
    if (selectedModule) {
      if (item.items?.length > 0) {
        const filteredArray = item.items?.filter(item2 => selectedModule.code.includes(item2.key));
        if (filteredArray.length > 0) {
          item.items = filteredArray;
          return item;
        }
      } else {
        return item;
      }
    }
  }).filter(route => route !== undefined);
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
  // const logOut = () => {
  //   startTransition(() => {
  //     confirmAlert({
  //       title: 'Confirm to Logout',
  //       message: 'Are you sure to do this.',
  //       buttons: [
  //         {
  //           label: 'Yes',
  //           onClick: () => {
  //             setIsLoading(true)
  //             signOut(auth)
  //               .then(() => {
  //                 dispatch(REMOVE_ACTIVE_USER());
  //                 dispatch(SET_STATE(false));
  //                 dispatch(RESET_PATIENTS());
  //                 dispatch(RESET_OPD());
  //                 dispatch(RESET_INDOOR());
  //                 dispatch(RESET_CHARGES());
  //                 dispatch(RESET_DASHBOARD());
  //                 dispatch(RESET_DISCHARGE_PATIENTS());
  //                 dispatch(RESET_DR());
  //                 dispatch(RESET_LABORATORY_REPORTS());
  //                 dispatch(RESET_MEDICINES());
  //                 dispatch(RESET_PREV_INVOICE_NO());
  //                 dispatch(RESET_MENU_STYLE());
  //                 dispatch(RESET_ROOM());
  //                 dispatch(RESET_TAX());
  //                 dispatch(RESET_RETURN_PATIENTS_MEDICINES());
  //                 dispatch(CLEAR_FIELD());
  //                 dispatch(REMOVE_HOSPITAL_PROFILE());
  //                 dispatch(RESET_PARAMETERS());
  //                 dispatch(RESET_PATIENTS_MEDICINES());
  //                 // startTransition(async () => {
  //                 //   // await persistor.purge(
  //                 //   //   () => {
  //                 //   //     // localStorage.removeItem('persist:Hospital_Data');
  //                 //   //     dispatch(REMOVE_ACTIVE_USER());
  //                 //   //     dispatch(SET_STATE(false));
  //                 //   //     dispatch(RESET_PATIENTS());
  //                 //   //     dispatch(RESET_OPD());
  //                 //   //   }
  //                 //   // );
  //                 //   // navigate('/login')

  //                 //   setIsLoading(false)

  //                 // });
  //               })
  //               .catch((error) => {
  //                 setIsLoading(false)

  //                 console.error(error);
  //               });
  //           },
  //         },
  //         {
  //           label: 'No',
  //         },
  //       ],
  //     });
  //   });
  // };
  // const logOut = () => {
  //   startTransition(() => {
  //     confirmAlert({
  //       title: 'Confirm to Logout',
  //       message: 'Are you sure you want to do this?',
  //       buttons: [
  //         {
  //           label: 'Yes',
  //           onClick: () => {
  //             setIsLoading(true);
  //             signOut(auth)
  //               .then(() => {
  //                 // Dispatch all your reset actions here
  //                 dispatch(SET_STATE(false));
  //                 dispatch(RESET_PATIENTS());
  //                 dispatch(RESET_OPD());
  //                 dispatch(RESET_INDOOR());
  //                 dispatch(RESET_CHARGES());
  //                 dispatch(RESET_DASHBOARD());
  //                 dispatch(RESET_DISCHARGE_PATIENTS());
  //                 dispatch(RESET_DR());
  //                 dispatch(RESET_LABORATORY_REPORTS());
  //                 dispatch(RESET_MEDICINES());
  //                 dispatch(RESET_PREV_INVOICE_NO());
  //                 dispatch(RESET_MENU_STYLE());
  //                 dispatch(RESET_ROOM());
  //                 dispatch(RESET_RETURN_PATIENTS_MEDICINES());
  //                 dispatch(CLEAR_FIELD());
  //                 dispatch(REMOVE_HOSPITAL_PROFILE());
  //                 dispatch(RESET_PARAMETERS());
  //                 dispatch(RESET_PATIENTS_MEDICINES());
  //                 dispatch(REMOVE_ACTIVE_USER());
  //                 dispatch(RESET_TAX());
  //                 navigate('/')
  //                 setIsLoading(false);

  //               })
  //               .catch((error) => {
  //                 setIsLoading(false);
  //                 console.error(error);
  //               });
  //           },
  //         },
  //         {
  //           label: 'No',
  //         },
  //       ],
  //     });
  //   });
  // };
  const logOut = () => {
    startTransition(() => {
      confirmAlert({
        title: 'Confirm to Logout',
        message: 'Are you sure you want to do this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              setIsLoading(true);
              startTransition(() => {
                signOut(auth)
                  .then(() => {
                    dispatch(SET_STATE(false));
                    dispatch(RESET_PATIENTS());
                    dispatch(RESET_OPD());
                    dispatch(RESET_INDOOR());
                    dispatch(RESET_CHARGES());
                    dispatch(RESET_DASHBOARD());
                    dispatch(RESET_DISCHARGE_PATIENTS());
                    dispatch(RESET_DR());
                    dispatch(RESET_LABORATORY_REPORTS());
                    dispatch(RESET_MEDICINES());
                    dispatch(RESET_PREV_INVOICE_NO());
                    dispatch(RESET_MENU_STYLE());
                    dispatch(RESET_ROOM());
                    dispatch(RESET_RETURN_PATIENTS_MEDICINES());
                    dispatch(CLEAR_FIELD());
                    dispatch(REMOVE_HOSPITAL_PROFILE());
                    dispatch(RESET_PARAMETERS());
                    dispatch(RESET_PATIENTS_MEDICINES());
                    dispatch(REMOVE_ACTIVE_USER());
                    dispatch(RESET_TAX());
                    dispatch(RESET_ROLE())
                    navigate('/')
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    setIsLoading(false);
                    console.error(error);
                  });
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
      <CHeader position="sticky" style={{ backgroundColor: '#fff' }}>
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
        {isLoading ? <Loaderspinner /> : <>
          {
            selectedMenu === 'header' ?
              <CHeader position="sticky" style={{ backgroundColor: '#fff' }}>
                <CContainer fluid >
                  <div className="ps-1">
                    <NavLink to="/" ><img src={hospitslLogo ? hospitslLogo : hospitalimg} className="sidebar-brand-full" width="80px" height="70px" alt="hospital_logo" /></NavLink>
                  </div>
                  <CHeaderNav className=" " >
                    {
                      (() => {
                        switch (userType) {

                          // case 'Admin':
                          //   return (
                          //     <NavigationBar menuItems={adminnav} />)
                          // case 'Medical':
                          //   return (
                          //     <NavigationBar menuItems={medNav} />)
                          // case 'Reception':
                          //   return (
                          //     <NavigationBar menuItems={receptionNav} />)
                          // case 'Laboratory':
                          //   return (
                          //     <NavigationBar menuItems={laboratoryNav} />)
                          case 'Management':
                            return (
                              <NavigationBar menuItems={ManagementNav} />)
                          case 'Doctor':
                            return (
                              <NavigationBar menuItems={drNav} />)
                          default:
                            return (
                              <NavigationBar menuItems={permissionNav} />)
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
              <CHeader position="sticky" style={{ backgroundColor: '#fff' }}>
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
        </>}



      </>
    )
  }
}

export default AppHeader
