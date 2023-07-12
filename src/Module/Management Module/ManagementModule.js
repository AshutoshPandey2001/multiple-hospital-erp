/* eslint-disable prettier/prettier */
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loaderspinner from 'src/comman/spinner/Loaderspinner'
import { AppFooter, AppHeader, AppSidebar } from 'src/components'
import { selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice'
import { selectChangeState } from 'src/redux/slice/changeStateslice'
import ManagementComponent from './ManagementComponent/ManagementComponent'

const ManagementModule = () => {
    const dispatch = useDispatch()
    const sidebarShow = useSelector(selectChangeState)
    const selectedMenu = useSelector(selectmenuStyle)

    const [isLoading, setIsLoading] = useState(false)
    return (
        <div>
            {isLoading ? <Loaderspinner /> :
                <div>
                    {selectedMenu === 'header' ? null : <AppSidebar />}
                    <div className={`d-flex flex-column min-vh-100 bg-light ${sidebarShow ? 'contentWrapper' : 'contentWrapperN'} ${selectedMenu === 'header' ? 'contentWrapperNot' : null}`}>
                        <AppHeader />
                        <div className="body flex-grow-1 " style={{ margin: '20px 20px 20px 20px' }}>
                            <ManagementComponent />
                        </div>
                        <AppFooter />
                    </div>
                </div>
            }
        </div>
    )
}

export default ManagementModule;