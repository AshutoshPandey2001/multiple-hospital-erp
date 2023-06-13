/* eslint-disable prettier/prettier */
import React from 'react'
import skybanLogo from 'src/assets/images/skyban-logo.png'

const PrintFooter = () => {
    return (
        <>
            {/* <div className="row justify-content-center w-100" >
                <div className='d-flex justify-content-center align-content-center'>
                    <img src={hospitalimg} className="sidebar-brand-full" width="100px" height="100px" alt='Hosptal_logo' />
                    <h4 style={{ marginTop: '35px', marginLeft: '15px' }}> Skyban multispeciality hospital</h4>
                </div>
            </div> */}
            <div className="row w-100" >
                <div className='d-flex'>
                    <div >
                        <span className="me-1"><b>Powered by:</b> Skyban Technology Pvt Ltd</span>
                        {/* <a href="https://skyban.in/" target="_blank" rel="noopener noreferrer">
                            Skyban Technology Pvt Ltd
                        </a> */}
                    </div>
                </div>
            </div>

        </>
    )
}

export default PrintFooter