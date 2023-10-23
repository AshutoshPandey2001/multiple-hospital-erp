/* eslint-disable prettier/prettier */
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilSpeedometer,
    cilGroup,
    cilFolderOpen,

} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
const _drnav = [

    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/doctordashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,

    },
    {
        component: CNavItem,
        name: 'Today Patients',
        to: '/todayAppoinments',
        icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'All Patient',
        to: '/allcheckpatients',
        icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,

    },
]

export default _drnav
