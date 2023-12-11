/* eslint-disable prettier/prettier */
import React from 'react'
import { useSelector } from 'react-redux'
import hospitalimg from 'src/assets/images/hospitalerp.png'
import { selectContactnumber, selectHospitalAddress, selectHospitalLogo, selectHospitalName } from 'src/redux/slice/hospitalProfileSlice'
import { selectLicenceNumber, selectMedicalAddress, selectMedicalContactnumber, selectMedicalLogo, selectMedicalName } from 'src/redux/slice/medicalProfileSlice'

const PrintHeaderMedical = () => {
    const medicalLogo = useSelector(selectMedicalLogo)
    const medicalAddress = useSelector(selectMedicalAddress)
    const medicalName = useSelector(selectMedicalName)
    const contactNumber = useSelector(selectMedicalContactnumber)
    const licenceNumber = useSelector(selectLicenceNumber)
    return (
        <>
            <div className="row justify-content-center w-100" >
                <div>
                    {licenceNumber &&
                        <span><b>Licence No. {licenceNumber}</b></span>}
                </div>
                <div className='d-flex justify-content-center align-content-center'>
                    {medicalLogo &&
                        <img src={medicalLogo ? medicalLogo : hospitalimg} className="sidebar-brand-full" width="100px" height="100px" alt='Hosptal_logo' />}
                    <h4 style={{ marginTop: '35px', marginLeft: '15px' }}>{medicalName ? medicalName : 'Medical Name'}</h4>
                </div>
                <div style={{ marginTop: '15px' }}>
                    {medicalAddress &&
                        <div> {medicalAddress ? medicalAddress : 'Mota Mandir Road, Tarsadi, Kosamba (R.S), Dist.Surat-394120'}</div>}
                    {contactNumber && <span>Contact: {contactNumber ? contactNumber : '+91 8238764801'}</span>}
                </div>

            </div>
        </>
    )
}

export default PrintHeaderMedical;