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
const _laboratoryNav = [
    {
        component: CNavGroup,
        name: 'Laboratory',
        to: '/laboratory',
        icon: <CIcon icon={cilSave} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Laboratory Master',
                to: '/laboratory/labmaster',
            },
            {
                component: CNavItem,
                name: 'Laboratory Reports',
                to: '/laboratory/labreport',
            },

        ],
    },

]

export default _laboratoryNav
