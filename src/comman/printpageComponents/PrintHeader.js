/* eslint-disable prettier/prettier */
import React from 'react'
import { useSelector } from 'react-redux'
import hospitalimg from 'src/assets/images/hospitalerp.png'
import { selectContactnumber, selectHospitalAddress, selectHospitalLogo, selectHospitalName } from 'src/redux/slice/hospitalProfileSlice'

const PrintHeader = () => {
    const hospitslLogo = useSelector(selectHospitalLogo)
    const hospitalAddress = useSelector(selectHospitalAddress)
    const hospitslName = useSelector(selectHospitalName)
    const contactNumber = useSelector(selectContactnumber)
    return (
        <>
            <div className="row justify-content-center w-100" >
                <div className='d-flex justify-content-center align-content-center'>
                    <img src={hospitslLogo ? hospitslLogo : hospitalimg} className="sidebar-brand-full" width="100px" height="100px" alt='Hosptal_logo' />
                    <h4 style={{ marginTop: '35px', marginLeft: '15px' }}>{hospitslName ? hospitslName : 'SHIVKRUPA HOSPITAL'}</h4>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <div> {hospitalAddress ? hospitalAddress : 'Mota Mandir Road, Tarsadi, Kosamba (R.S), Dist.Surat-394120'}</div>
                    <span>Contact: {contactNumber ? contactNumber : '+91 8238764801'}</span>
                </div>

            </div>
        </>
    )
}

export default PrintHeader;