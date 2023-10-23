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
  cilHome,
  cilTextSquare,
  cilHeader,
  cilUser
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    key: 'HOME'
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    key: 'DASHBOARD'
  },

  {
    component: CNavItem,
    name: 'Patients',
    to: '/patients',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    key: 'PATIENTS',

    // items: [
    //   {
    //     component: CNavItem,
    //     name: 'Patient Report',
    //     to: '/patients/patientslist',
    //   },

    // ],
  },


  {
    component: CNavItem,
    name: 'OPD',
    to: '/opd',
    key: 'OPD',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Indoor',
    to: '/indoor',
    key: 'INDOOR',

    icon: <CIcon icon={cilBed} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Discharge',
    to: '/discharge',
    key: 'DISCHARGE',
    icon: <CIcon icon={cilArrowThickToLeft} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Rooms Master',
    to: '/rooms',
    icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    key: 'ROOMS',

    // items: [
    //   {
    //     component: CNavItem,
    //     name: 'Rooms',
    //     to: '/rooms',
    //   },

    // ],
  },
  {
    component: CNavGroup,
    name: 'Laboratory',
    to: '/laboratory',
    icon: <CIcon icon={cilSave} customClassName="nav-icon" />,
    key: 'LABORATORY',
    items: [
      {
        component: CNavItem,
        name: 'Laboratory Master',
        to: '/laboratory/labmaster',
        key: 'VIEW_LAB_MASTER',

      },
      {
        component: CNavItem,
        name: 'Laboratory Reports',
        to: '/laboratory/labreport',
        key: 'VIEW_LAB_REPORTS',

      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Medical',
    to: '/medical',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
    key: 'MEDICAL',

    items: [
      {
        component: CNavItem,
        name: 'Medicine Stock',
        to: '/medical/medicinemaster',
        key: 'VIEW_MEDICINE_STOCK',
      },
      {
        component: CNavItem,
        name: 'Medicine Invoice',
        to: '/medical/medicine',
        key: 'VIEW_MEDICINE_INVOICE',
      },
      {
        component: CNavItem,
        name: 'Return Medicine',
        to: '/medical/medicinereturn',
        key: 'VIEW_RETURN_MEDICINE',
      },


    ],
  },
  {
    component: CNavItem,
    name: 'User Master',
    to: '/usersmasters',
    key: 'USERSMASTER',

    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Role Master',
    to: '/rolemaster',
    key: 'ROLEMASTER',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Doctors',
    to: '/drmaster',
    key: 'DOCTORS',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Charges',
    to: '/charges',
    key: 'CHARGES',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tax',
    to: '/tax',
    key: 'TAX',

    icon: <CIcon icon={cilTextSquare} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Hospital Master',
    to: '/hospitalprofile',
    key: 'HOSPITALPROFILE',
    icon: <CIcon icon={cilHeader} customClassName="nav-icon" />,
  },
]

export default _nav
