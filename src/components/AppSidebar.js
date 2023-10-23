/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable prettier/prettier */
/* eslint-disable import/first */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import hospitalimg from 'src/assets/images/hospitalerp.png'
import { sygnet } from 'src/assets/brand/sygnet'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
// sidebar nav config
import navigation from '../_nav'
import { selectChangeState, SET_STATE } from 'src/redux/slice/changeStateslice'
import medNav from '../_medNav'
import { selectIsLoggedIn, selectUsertype, selectpermissions } from 'src/redux/slice/authSlice'
import receptionNav from '../_receptionNav'
import laboratoryNav from '../_laboratoryNav'
import './appsidebar.css';
import { NavLink } from 'react-router-dom'
import adminnav from 'src/_adminNav'
import { selectHospitalLogo } from 'src/redux/slice/hospitalProfileSlice'
import ManagementNav from 'src/_managementNav'
import drNav from '../_drNav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(selectChangeState)
  const userType = useSelector(selectUsertype)
  const userpermissions = useSelector(selectpermissions)
  const isLoggesIn = useSelector(selectIsLoggedIn)
  const hospitslLogo = useSelector(selectHospitalLogo)


  // const permissionNav = navigation.map((item) => {
  //   const selectedmodule = userpermissions?.find((item1) => item.key === item1.module)
  //   if (selectedmodule && selectedmodule.module === item.key) {
  //     if (item.items?.length > 0) {
  //       const filteredarray = item.items?.map((item2) => {
  //         if (selectedmodule?.code.includes(item2.key)) {
  //           return item2
  //         } else {

  //         }
  //       }).filter((route1) => route1 !== undefined)
  //       if (filteredarray.length > 0) {
  //         return item.items = filteredarray
  //       }
  //     } else {

  //       return item
  //     }
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
  return (
    <CSidebar
      position="fixed"
      visible={isLoggesIn ? true : false}
      onVisibleChange={(visible) => {
        dispatch(SET_STATE(visible))
      }}
      className={sidebarShow ? 'sidebarW' : 'sidebarWn'}
    >
      <CSidebarBrand className='d-md-flex'>
        <NavLink to="/" className={sidebarShow ? 'd-block' : 'd-none'}><img src={hospitslLogo ? hospitslLogo : hospitalimg} className="sidebar-brand-full" width="70vw" height="70vh" /></NavLink>
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        {/* <SimpleBar> */}
        {
          (() => {
            switch (userType) {
              // case 'Admin':
              //   return (
              //     <AppSidebarNav items={adminnav} />
              //   )
              // case 'Medical':
              //   return (
              //     <AppSidebarNav items={medNav} />
              //   )
              // case 'Reception':
              //   return (
              //     <AppSidebarNav items={receptionNav} />
              //   )
              // case 'Laboratory':
              //   return (
              //     <AppSidebarNav items={laboratoryNav} />
              //   )
              case 'Management':
                return (
                  <AppSidebarNav items={ManagementNav} />
                )
              case 'Doctor':
                return (
                  <AppSidebarNav items={drNav} />
                )
              // case 'Super Admin':
              //   return (
              //     <AppSidebarNav items={navigation} />
              //   )

              default:
                return (
                  <AppSidebarNav items={permissionNav} />
                )
            }
          })()

        }
        {/* <AppSidebarNav items={permissionNav} /> */}

        {/* </SimpleBar> */}
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
     
      /> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
