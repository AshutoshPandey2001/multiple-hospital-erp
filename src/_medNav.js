/* eslint-disable prettier/prettier */
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilSpeedometer,
    cilMedicalCross,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _medNav = [
    // {
    //     component: CNavItem,
    //     name: 'Dashboard',
    //     to: '/dashboard',
    //     icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,

    // },
    {
        component: CNavGroup,
        name: 'Medical',
        to: '/medical',
        icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Medicine Stock',
                to: '/medical/medicinemaster',
            },
            {
                component: CNavItem,
                name: 'Medicine Invoice',
                to: '/medical/medicine',
            },
            {
                component: CNavItem,
                name: 'Return Medicine',
                to: '/medical/medicinereturn',
            },

        ],
    },
]

export default _medNav;
