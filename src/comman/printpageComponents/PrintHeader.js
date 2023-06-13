/* eslint-disable prettier/prettier */
import React from 'react'
import hospitalimg from 'src/assets/images/hospitalerp.png'

const PrintHeader = () => {
    return (
        <>
            <div className="row justify-content-center w-100" >
                <div className='d-flex justify-content-center align-content-center'>
                    <img src={hospitalimg} className="sidebar-brand-full" width="100px" height="100px" alt='Hosptal_logo' />
                    <h4 style={{ marginTop: '35px', marginLeft: '15px' }}>SHIVKRUPA HOSPITAL</h4>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <div>Mota Mandir Road, Tarsadi, Kosamba (R.S), Dist.Surat-394120</div>
                    <span>Contact: +91 8238764801</span>
                </div>

            </div>
        </>
    )
}

export default PrintHeader;