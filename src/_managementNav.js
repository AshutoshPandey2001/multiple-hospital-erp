/* eslint-disable prettier/prettier */
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilSpeedometer,
    cilGroup,
    cilUserPlus,
    cilMedicalCross,
    cilHospital,
    cilAddressBook,
    cilFolderOpen,
    cilMoney,
    cilBed,
    cilArrowThickToLeft,
    cilSave,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
const _managementNav = [
    {
        component: CNavItem,
        name: 'Management',
        to: '/management',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
]

export default _managementNav
