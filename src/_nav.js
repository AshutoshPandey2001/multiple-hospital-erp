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
  cilTextSquare
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,

  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,

  },

  {
    component: CNavGroup,
    name: 'Patient Master',
    to: '/patients',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Patient Report',
        to: '/patients/patientslist',
      },

    ],
  },


  {
    component: CNavItem,
    name: 'OPD',
    to: '/opd',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Indoor',
    to: '/indoor',
    icon: <CIcon icon={cilBed} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Discharge',
    to: '/discharge',
    icon: <CIcon icon={cilArrowThickToLeft} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Rooms Master',
    to: '/rooms',
    icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Rooms',
        to: '/rooms',
      },

    ],
  },
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
  {
    component: CNavItem,
    name: 'User Master',
    to: '/usersmasters',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Doctors',
    to: '/drmaster',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Charges',
    to: '/charges',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tax',
    to: '/tax',
    icon: <CIcon icon={cilTextSquare} customClassName="nav-icon" />,
  },

]

export default _nav
