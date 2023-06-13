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
import { selectIsLoggedIn, selectUsertype } from 'src/redux/slice/authSlice'
import receptionNav from '../_receptionNav'
import laboratoryNav from '../_laboratoryNav'
import './appsidebar.css';
import { NavLink } from 'react-router-dom'
import adminnav from 'src/_adminNav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(selectChangeState)
  const userType = useSelector(selectUsertype)
  const isLoggesIn = useSelector(selectIsLoggedIn)
  return (
    <CSidebar
      position="fixed"
      visible={isLoggesIn ? true : false}
      onVisibleChange={(visible) => {
        dispatch(SET_STATE(visible))
      }}
      className={sidebarShow ? 'sidebarW' : 'sidebarWn'}
    >
      <CSidebarBrand className=" d-md-flex">
        <NavLink to="/" ><img src={hospitalimg} className="sidebar-brand-full" width="70vw" height="70vh" /></NavLink>
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          {
            (() => {
              switch (userType) {

                case 'Admin':
                  return (
                    <AppSidebarNav items={adminnav} />
                  )
                case 'Medical':
                  return (
                    <AppSidebarNav items={medNav} />
                  )
                case 'Reception':
                  return (
                    <AppSidebarNav items={receptionNav} />
                  )
                case 'Laboratory':
                  return (
                    <AppSidebarNav items={laboratoryNav} />
                  )

                default:
                  return (
                    <AppSidebarNav items={navigation} />
                  )
              }
            })()

          }

        </SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
     
      /> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
