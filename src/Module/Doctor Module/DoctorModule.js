/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { } from 'react'
import { AppFooter, AppHeader, AppSidebar } from 'src/components'
import DoctorComponent from './doctorComponent/DoctorComponent'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserId } from 'src/redux/slice/authSlice'
import { selectChangeState } from 'src/redux/slice/changeStateslice'
import { selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice'
const DoctorModule = () => {
    const dispatch = useDispatch()
    const sidebarShow = useSelector(selectChangeState)
    const selectedMenu = useSelector(selectmenuStyle)
    const hospitaluid = useSelector(selectUserId)

    return (
        <>
            {/* {isLoading ? <Loaderspinner /> : */}
            <div>
                {selectedMenu === 'header' ? null : <AppSidebar />}
                <div className={`d-flex flex-column min-vh-100 bg-light ${sidebarShow ? 'contentWrapper' : 'contentWrapperN'} ${selectedMenu === 'header' ? 'contentWrapperNot' : null}`}>
                    <AppHeader />
                    <div className="body flex-grow-1 " style={{ margin: '20px 20px 20px 20px' }}>
                        <DoctorComponent />
                    </div>
                    <AppFooter />
                </div>
            </div>
            {/* } */}
        </>

    )
}

export default DoctorModule