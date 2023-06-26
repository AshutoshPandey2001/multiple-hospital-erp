/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import { CHANGE_STATUS_PATIENTS_MEDICINES, selectAllPatientsMedicines } from 'src/redux/slice/patientsMedicinesSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loaderspinner from '../../comman/spinner/Loaderspinner';
import { getData, setData, updateMultiDatainSubcollection, updatemultitObject, uploadArray } from 'src/services/firebasedb';
import { EDIT_ADMIT_PATIENTS, FILL_ADMIT_PATIENTS, selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice';
import { CLEAR_FIELD, selectAdvance, selectcgstamount, selectcgstValue, selectdiscount, selecthospitalcharges, selecticuCharge, selecticuUnit, selectnursingCharge, selectnursingUnit, selectotCharge, selectotUnit, selectsgstamount, selectsgstValue, selectsubTotalamount, selectTotalBillingAmount, selectTotalicuCharges, selecttotalMedicine, selectTotalNursingCharges, selectTotalotCharges, selectTotalpyableAmount, SET_ADVANCE, SET_DISCOUNT, SET_EXTRACHARGES_CHARGES, SET_HOSPITAL_CHARGES, SET_ICUCHARGE, SET_ICUUNIT, SET_INVOICE, SET_NURSINGCHARGE, SET_NURSINGUNIT, SET_OTCHARGE, SET_OTUNIT } from 'src/redux/slice/invoiceSlice';
import { toast } from 'react-toastify';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { FILL_LABORATORY_REPORTS, selectAlllaboratoryReports } from 'src/redux/slice/patientsLaboratoryReportsSlice';
import './invoice.css';
import { selectUserName } from 'src/redux/slice/authSlice';
import { FILL_OPD_PATIENTS, selectOpdPatients } from 'src/redux/slice/opdPatientsList';
import { number } from 'prop-types';
import { FieldArray, useFormik, FormikProvider } from 'formik';
import { ImCross } from 'react-icons/im'
import { BiPlus } from 'react-icons/bi'
import { selectAllCharges } from 'src/redux/slice/chargesSlice';
import { selectAlltax } from 'src/redux/slice/taxSlice';

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center'> <h3>Invoice</h3></div>
            <b><hr></hr></b>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6'>
                    <span><b>Indoor Case No : {state.indoorCaseNo}</b></span>
                    <span><div>Name: {state.pName} ({state.pGender})</div></span>
                    <span><div>Age: {state.page}</div></span>
                    <span><div>Address: {state.pAddress}</div></span>
                    <span><div>Mobile No: {state.pMobileNo}</div></span>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <span><b>Bill No: {state.invoiceuid}</b></span>
                        <span><div>Admission UID: {state.admituid}</div></span>
                        <span><div>Admit Date: {state.admitDate} </div></span>
                        <span><div>Discharge Date: {state.dischargeDate}</div></span>
                        <span><div>Consulting Dr.: {state.drName}</div></span>
                    </div>
                </div>
            </div>

            <b><hr></hr></b>
            <div className='row text-center'> <h3>Bill Summary</h3></div>
            <div className='row'>
                <Table striped bordered>
                    <thead>
                        <tr>

                            <th>Particular</th>
                            <th>Rate</th>
                            <th>Units</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.allprevRooms?.map((room, j) => {
                            return <>
                                <tr key={j}>
                                    <td>Room ({room.roomType})</td>
                                    <td>{room.roomPrice.toFixed(2)}</td>
                                    <td>{room.totaldays}(Days)</td>
                                    <td>{room.totalRoomrent.toFixed(2)}</td>
                                </tr>
                            </>
                        })}
                        {state.extraCharges?.map((charge, k) => {
                            return <>
                                <tr key={k}>
                                    <td>{charge.chargeName}</td>
                                    <td>{charge.rate.toFixed(2)}</td>
                                    <td>{charge.qty}</td>
                                    <td>{charge.total.toFixed(2)}</td>
                                </tr>
                            </>
                        })}
                        {/* <tr>

                            <td>Nursing Charges</td>
                            <td>{Number(state.nursingRate).toFixed(2)}</td>
                            <td>{Number(state.nursingUnits).toFixed(2)}</td>
                            <td>{state.totalNursing.toFixed(2)}</td>
                        </tr>
                        <tr>

                            <td>OT Charges</td>
                            <td>{Number(state.otRate).toFixed(2)}</td>
                            <td>{Number(state.otUnits).toFixed(2)}</td>
                            <td>{state.totalOt.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>ICU Charges</td>
                            <td>{Number(state.icuRate).toFixed(2)}</td>
                            <td>{Number(state.icuUnits).toFixed(2)}</td>
                            <td>{state.totalIcu.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td >Hospital Charges</td>
                            <td colSpan={2}>{state.hospitalCharges.toFixed(2)}</td>
                            <td>{state.hospitalCharges.toFixed(2)}</td>
                        </tr> */}
                        {/* {
                            state.pendingOpd?.map((opd, r) => {
                                return <>
                                    <tr key={r}>
                                        <td colSpan={3}>OPD({opd.drName})</td>
                                        <td>{opd.consultingCharges.toFixed(2)}</td>
                                    </tr>
                                </>
                            })
                        } */}
                        {
                            state.reportDetails?.map((report, i) => {
                                return <>
                                    <tr key={i}>
                                        <td >{report.reportName}</td>
                                        <td>{Number(report.reportPrice).toFixed(2)}</td>
                                        <td>1.00</td>
                                        <td>{Number(report.reportPrice).toFixed(2)}</td>
                                    </tr>
                                </>
                            })
                        }

                        {/* {!state.medicines.length ? null :
                            <tr>

                                <td colSpan={3}>
                                    <Table bordered hover>
                                        <thead>
                                            <tr>

                                                <th>Medicine</th>
                                                <th>Qty * Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state.medicines?.map((item, index) => {
                                                return <>
                                                    <tr key={index}>

                                                        <td>{item.medname}</td>
                                                        <td>{item.medQty} * {item.medPrice.toFixed(2)}</td>
                                                        <td>{item.totalmedPrice.toFixed(2)}</td>
                                                    </tr>
                                                </>;
                                            })}

                                        </tbody>
                                    </Table></td>
                                <td>{state.totalMedicines.toFixed(2)}</td>
                            </tr>
                        } */}
                        <tr>
                            <td colSpan={3}>Sub Total</td>
                            <td>{state.subtotal.toFixed(2)}</td>
                        </tr>
                        {
                            state.cgstValue === 0 ?
                                null
                                : <tr>
                                    <td colSpan={2}>CGST%</td>
                                    <td>{state.cgstValue}%</td>
                                    <td>{state.cgstAmount.toFixed(2)}</td>
                                </tr>
                        }

                        {
                            state.sgstValue === 0 ?
                                null
                                : <tr>
                                    <td colSpan={2} >SGST%</td>
                                    <td>{state.sgstValue}%</td>
                                    <td>{state.sgstAmount.toFixed(2)}</td>
                                </tr>
                        }
                        {/* <tr>
                            <td colSpan={2}>CGST%</td>
                            <td>{state.cgstValue}%</td>
                            <td>{state.cgstAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>SGST%</td>
                            <td>{state.sgstValue}%</td>
                            <td>{state.sgstAmount.toFixed(2)}</td>
                        </tr> */}

                    </tbody>
                </Table>
            </div>
            <div className='row'>
                <b><hr></hr></b>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                    <div>
                        <div>
                            <div><b>Invoice By :{state.userName}</b></div>
                            <span><b>Payment Type :{state.paymentType}</b></span>
                            <div><b>Payment Status :{state.paymentStatus}</b></div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <div><b>Total Bill Amount :{state.billingAmount.toFixed(2)}</b></div>
                        <span> <b>Advance:{Number(state.deposit).toFixed(2)}</b></span>
                        {state.discount ? <div><b>Discount :{Number(state.discount).toFixed(2)}</b></div> : null}
                        <div> <b>Payable Amount:{state.payableAmount.toFixed(2)}</b></div>
                    </div>
                </div>
                {/* <div className="form-check" style={{ marginTop: '20px' }}>
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='paid' checked={paid} onChange={(e) => setPaid(e.target.checked)} />If You Want to Paid the bill Please check the check box and cilck on Paid
                                        </label>
                                    </div> */}
                <b><hr></hr></b>
            </div>
            {/* <div className='row'>
                <b><hr></hr></b>
                <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                    <div>
                        <h6>Total Bill Amount :{state.billingAmount.toFixed(2)}</h6>
                        <span>Deposit: {Number(state.deposit).toFixed(2)}</span>
                        <h6>Payable Amount : {state.payableAmount.toFixed(2)}</h6>
                    </div>
                </div>
                <b><hr></hr></b>
            </div> */}


        </div>
    )
};
let initalValues = {
    extraCharges: [
        {
            chargeName: '',
            rate: '',
            qty: 1,
            total: '',
        },
    ],
    totalExtraCharges: '',
}
const Invoicepage = () => {

    const userName = useSelector(selectUserName)
    const navigate = useNavigate();
    // const { state } = useLocation()
    let state = undefined
    const location = useLocation();
    if (location.state === null) {
        state = JSON.parse(localStorage.getItem('indoorInvoiceData'));
    } else {
        localStorage.setItem('indoorInvoiceData', JSON.stringify(location.state));
        state = location.state
    }
    // if (state === null) {
    //     navigate('/indoor')
    //     return null;
    // }
    const allTaxs = useSelector(selectAlltax)

    const patientMedicine = useSelector(selectAllPatientsMedicines);
    const allPatientsLaboratoryReports = useSelector(selectAlllaboratoryReports)
    const allopdPatients = useSelector(selectOpdPatients)
    const cgstValue = useSelector(selectcgstValue)
    const sgstValue = useSelector(selectsgstValue)
    const cgstAmount = useSelector(selectcgstamount)
    const sgstAmount = useSelector(selectsgstamount)
    const totalMedicines = useSelector(selecttotalMedicine)
    // const paidMedicines = useSelector(selectpaidmedicine)
    const subtotal = useSelector(selectsubTotalamount)
    const billingAmount = useSelector(selectTotalBillingAmount)
    const totalNursing = useSelector(selectTotalNursingCharges)
    const nursingRate = useSelector(selectnursingCharge)
    const nursingUnits = useSelector(selectnursingUnit)
    const totalOt = useSelector(selectTotalotCharges)
    const otRate = useSelector(selectotCharge)
    const otUnits = useSelector(selectotUnit)
    const [allprevRooms, setAllprevRooms] = useState([])
    const totalIcu = useSelector(selectTotalicuCharges)
    const icuRate = useSelector(selecticuCharge)
    const icuUnits = useSelector(selecticuUnit)
    const advance = useSelector(selectAdvance)
    const discount = useSelector(selectdiscount)
    const hospitalCharges = useSelector(selecthospitalcharges)
    const payable = useSelector(selectTotalpyableAmount)
    const componentRef = useRef();
    const dispatch = useDispatch();
    const admtPatients = useSelector(selectAdmitPatients)
    const [mediciness, setMedicines] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [paid, setPaid] = useState(false)
    const [labReports, setLabReports] = useState([])
    const [printContent, setPrintContent] = useState(null);
    const [paymentType, setPaymentType] = useState()
    const [paymentStatus, setPaymentStatus] = useState('')
    const [pendingOpd, setPendingOpd] = useState([])
    const [invoiceuid, setInvoiceuid] = useState()
    const [autofocus, setAutofocus] = useState(false)
    const Allcharges = useSelector(selectAllCharges)
    const [charges, setCharges] = useState([])

    useEffect(() => {
        fetchData()
        setCharges([...Allcharges])
        clearForm()

        return () => {
            dispatch(CLEAR_FIELD())
            console.log('i am unmounting', values);
            setCharges([])
            clearForm()
        }
    }, [Allcharges, dispatch])

    const fetchData = async () => {
        let temp_data = [];
        setTimeout(async () => {
            // const medicineDetails = {};

            // for (const item of patientMedicine || []) {
            //     if (item.pid !== state.pid || item.paymentStatus !== 'Pending') continue;

            //     for (const medicine of item.medicines || []) {
            //         const existingMedicine = medicineDetails[medicine.medname];
            //         if (existingMedicine) {
            //             existingMedicine.medQty += parseInt(medicine.medQty);
            //             existingMedicine.totalmedPrice += medicine.totalmedPrice;
            //         } else {
            //             medicineDetails[medicine.medname] = {
            //                 medname: medicine.medname,
            //                 medPrice: medicine.medPrice,
            //                 medQty: parseInt(medicine.medQty),
            //                 totalmedPrice: medicine.totalmedPrice,
            //             };
            //         }
            //     }
            // }
            // const medicineDetailsArray = Object.values(medicineDetails);
            // setMedicines([...medicineDetailsArray]);
            // const totalmedicineCharge = await medicineDetailsArray.reduce((total, item) => total + item.totalmedPrice, 0);

            const prevRoom = admtPatients
                .filter(patient => patient.pid === state.pid && patient.paymentStatus === "Pending" && patient.dischargeDate)
                .map(patient => ({
                    roomType: patient.roomType,
                    roomNo: patient.roomNo,
                    totaldays: patient.totalDayes,
                    roomPrice: patient.priceperNignt,
                    totalRoomrent: patient.totalAmount,
                })
                );
            console.log('prevRoom', prevRoom);
            setAllprevRooms(prevRoom)
            const totalOfRooms = await prevRoom.reduce((total, item) => total + item.totalRoomrent, 0);

            // const pendingopd = allopdPatients
            //     .filter(patient => patient.pid === state.pid && patient.paymentStatus === "Pending")
            //     .map(patient => ({
            //         opduid: patient.opduid,
            //         drName: patient.drName,
            //         consultingCharges: patient.consultingCharge,
            //         consultingDate: patient.consultingDate
            //     }));
            // setPendingOpd(pendingopd)
            // const totalOfopd = await pendingopd.reduce((total, item) => total + item.consultingCharges, 0);

            // console.log('pending opd', pendingopd, totalOfopd);
            let labReportss = await allPatientsLaboratoryReports?.filter((item) => item.pid === state.pid && item.paymentStatus === "Pending")
            const reportDetails = await labReportss.map(report => {
                return {
                    reportName: report.reportName,
                    reportPrice: report.reportPrice
                };
            });
            await setLabReports(reportDetails)
            // console.log('reportDetails', reportDetails, labReportss, allPatientsLaboratoryReports);
            let totalOflabReports = await reportDetails.reduce((total, item) => total + Number(item.reportPrice), 0)
            let totalcgstpercentage = undefined;
            let totalsgstpercentage = undefined
            // await getData('Tax', 'LZnOzIOavFxXLPkmFaWc').then((res) => {
            //     let data3 = res.data().tax
            await allTaxs.forEach((item, i) => {
                if (item.taxName === "CGST") {
                    totalcgstpercentage = item.taxValue
                } else if (item.taxName === "SGST") {
                    totalsgstpercentage = item.taxValue
                }

            });
            // }).catch((err) => {
            //     console.error(err);
            // })
            dispatch(SET_INVOICE({
                cgstpercentage: totalcgstpercentage,
                sgstpercentage: totalsgstpercentage,
                totalRoom: totalOfRooms,
                // totalMedicine: totalmedicineCharge,
                totalOflabReports: totalOflabReports,
                // totalofOpd: totalOfopd,
                advance: state.deposit
            }))
            // let totalBill = (state.totalAmount + (totalmedicineCharge - paidmedicines) + totalsgst + totalcgst);
            // setBillamount(totalBill)
            // setPayableamount(totalBill

            setIsLoading(false)
        }, 3000);
    }

    const medMethod = (med) => {
        const findProductindex = mediciness.findIndex((item) => item.medname === med.medname)
        if (findProductindex >= 0) {
            mediciness[findProductindex].medQty = Number(mediciness[findProductindex].medQty) + Number(med.medQty);
            mediciness[findProductindex].totalmedPrice = mediciness[findProductindex].totalmedPrice + med.totalmedPrice;
        } else {
            mediciness.push({ ...med })
        }

    }

    const formik = useFormik({
        initialValues: initalValues,
        // validationSchema: padtientmedicineSchema,
        onSubmit: async (Values, action) => {

        }
    })

    const {
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
    } = formik;

    const clearForm = () => {
        formik.setValues({
            extraCharges: [
                {
                    chargeName: '',
                    rate: '',
                    qty: 1,
                    total: '',
                },
            ],
            totalExtraCharges: '',
        });
        // formik.resetForm();
    };
    const printInvoice = (item) => {
        if (item) {
            setPrintContent(<PrintComponent data={{
                data1: {
                    ...item,
                }
            }} />)
        } else {
            setPrintContent(<PrintComponent data={{
                data1: {
                    ...state,
                    deposit: advance,
                    discount: discount,
                    payableAmount: payable,
                    billingAmount: billingAmount,
                    subtotal: subtotal,
                    // totalMedicines: totalMedicines,
                    cgstValue: cgstValue,
                    cgstAmount: cgstAmount,
                    sgstValue: sgstValue,
                    sgstAmount: sgstAmount,
                    extraCharges: values.extraCharges,
                    // medicines: mediciness,
                    reportDetails: labReports,
                    userName: userName,
                    paymentType: paymentType,
                    allprevRooms,
                    // pendingOpd,
                    // hospitalCharges,
                    invoiceuid
                }
            }} />)
        }

    }


    /**
     * The function `saveInvoice` updates the payment status of a patient's medicines and laboratory
     * reports to "Complete" and saves the updated data to a database.
     */
    const saveInvoice = async () => {
        setIsLoading(true)
        const [patients, medicines, patientsLabReports, opdPatients] = await Promise.all([
            [...admtPatients],
            [...patientMedicine],
            [...allPatientsLaboratoryReports],
            [...allopdPatients]

        ]);

        const newObj = {
            // ...state,
            paymentStatus: 'Completed',
            deposit: advance,
            discount: discount,
            payableAmount: payable,
            billingAmount: billingAmount,
            subtotal: subtotal,
            // totalMedicines: totalMedicines,
            cgstValue: cgstValue,
            cgstAmount: cgstAmount,
            sgstValue: sgstValue,
            sgstAmount: sgstAmount,
            // nursingRate: nursingRate,
            // nursingUnits: nursingUnits,
            // totalNursing: totalNursing,
            // otRate: otRate,
            // otUnits: otUnits,
            // totalOt: totalOt,
            // totalIcu: totalIcu,
            // icuRate: icuRate,
            // icuUnits: icuUnits,
            extraCharges: values.extraCharges,
            // medicines: mediciness,
            reportDetails: labReports,
            userName: userName,
            paymentType: paymentType,
            allprevRooms,
            // pendingOpd,
            // hospitalCharges,
            invoiceuid,
        };
        // let newopdArray = await opdPatients.map((item) => (item.pid === state.pid && item.paymentStatus === "Pending" ? {
        //     ...item, paymentStatus: 'Complete', cgstValue, sgstValue, cgstAmount: cgstValue / 100 * item.consultingCharge, sgstAmount: cgstValue / 100 * item.consultingCharge, subTotalamount: item.consultingCharge,
        //     payAbleAmount: item.consultingCharge + cgstAmount + sgstAmount,
        //     paymentType,
        //     userName
        // } : item))
        // const newopdArray = await opdPatients.map((item) => {
        //     if (item.pid === state.pid && item.paymentStatus === "Pending") {
        //         const cgstAmountopd = cgstValue / 100 * item.consultingCharge;
        //         const sgstAmountopd = sgstValue / 100 * item.consultingCharge;
        //         const payAbleAmountopd = item.consultingCharge + cgstAmountopd + sgstAmountopd;
        //         return {
        //             ...item,
        //             paymentStatus: 'Completed',
        //             cgstValue,
        //             sgstValue,
        //             cgstAmount: cgstAmountopd,
        //             sgstAmount: sgstAmountopd,
        //             subTotalamount: item.consultingCharge,
        //             payAbleAmount: payAbleAmountopd,
        //             paymentType,
        //             userName,
        //             pendingOpd,
        //             invoiceuid,
        //         }
        //     } else {
        //         return item
        //     }
        // })

        // console.log('newopdArray', newopdArray);
        // let newObj = await { ...state, paymentStatus: 'Complete', deposit: advance, payableAmount: payable, billingAmount: billingAmount, subtotal: subtotal, totalMedicines: totalMedicines, cgstValue: cgstValue, cgstAmount: cgstAmount, sgstValue: sgstValue, sgstAmount: sgstAmount, nursingRate: nursingRate, nursingUnits: nursingUnits, totalNursing: totalNursing, otRate: otRate, otUnits: otUnits, totalOt: totalOt, icuRate: icuRate, icuUnits: icuUnits, totalIcu: totalIcu, medicines: mediciness }
        // const newMedarray = await medicines.map((item) => (item.pid === state.pid ? { ...item, paymentStatus: 'Completed' } : item))
        // const newMedarray = await medicines.map((item) => {
        //     if (item.pid === state.pid && item.paymentStatus === "Pending") {
        //         const cgstAmountmedicine = cgstValue / 100 * item.allMedTotalprice;
        //         const sgstAmountmedicine = sgstValue / 100 * item.allMedTotalprice;
        //         const payAbleAmountmedicine = item.allMedTotalprice + cgstAmountmedicine + sgstAmountmedicine;
        //         return {
        //             ...item,
        //             paymentStatus: 'Completed',
        //             cgstValue,
        //             sgstValue,
        //             cgstAmount: cgstAmountmedicine,
        //             sgstAmount: sgstAmountmedicine,
        //             subTotalamount: item.allMedTotalprice,
        //             payableAmount: payAbleAmountmedicine,
        //             paymentType,
        //             userName,
        //             invoiceuid
        //         }
        //     } else {
        //         return item
        //     }
        // })
        // console.log('newMedarray', newMedarray);
        const newLabobj = { paymentStatus: 'Completed' }
        const newLabReportsarray = patientsLabReports.map((item) =>
            item.pid === state.pid ? { ...item, paymentStatus: 'Completed' } : item
        );
        const newArray = await patients.map((item) => (item.pid === state.pid && item.paymentStatus === "Pending" && item.dischargeDate ? { ...item, ...newObj } : item))
        try {
            await Promise.all([
                // updatemultitObject('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newObj, 'pid', 'hospitaluid', 'paymentStatus', state),
                updateMultiDatainSubcollection('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newObj, 'pid', 'hospitaluid', 'paymentStatus', state),
                // uploadArray('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newArray, 'admituid', 'hospitaluid'),
                // setData('admitPatients', 'jSqDGnjO21bpPGhb6O2y', 'admitPatient', newArray),
                // setData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', newMedarray),
                // uploadArray('PatientslaboratoryReports',
                //     'QmwQr1wDcFK6K04hKMYc',
                //     'labReports', newLabReportsarray, 'labreportuid', 'hospitaluid')

                updateMultiDatainSubcollection('PatientslaboratoryReports',
                    'QmwQr1wDcFK6K04hKMYc',
                    'labReports', newLabobj, 'pid', 'hospitaluid', 'paymentStatus', state)
                // setData(
                //     'PatientslaboratoryReports',
                //     'QmwQr1wDcFK6K04hKMYc',
                //     'labReports',
                //     newLabReportsarray
                // ),
                // setData("opdPatients", 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', newopdArray)
            ]);

            dispatch(FILL_ADMIT_PATIENTS(newArray))
            // dispatch(CHANGE_STATUS_PATIENTS_MEDICINES(newMedarray))
            dispatch(FILL_LABORATORY_REPORTS(newLabReportsarray));
            // dispatch(FILL_OPD_PATIENTS(newopdArray))
            toast.success("All unpaid bill paid SuccessFully...")
            window.history.back()
        } catch (error) {
            console.error(error);
            setIsLoading(false)
        }
    }
    const totalextraChargesQty = (e, charge) => {
        charge.qty = Number(e);
        charge.total = Number(e) * charge.rate
        const extracharges = values.extraCharges.reduce((price, item) => price + item.rate * item.qty, 0);
        values.totalExtraCharges = extracharges
        dispatch(SET_EXTRACHARGES_CHARGES({ extracharges: extracharges }))
        setAutofocus(!autofocus)
        console.log('qty charges', e, charge, values, extracharges, isNaN(extracharges));
    }
    const totalextraChargesRate = (e, charge) => {
        charge.rate = Number(e);
        charge.total = Number(e) * charge.qty
        const extracharges = values.extraCharges.reduce((price, item) => price + item.rate * item.qty, 0);
        values.totalExtraCharges = extracharges
        dispatch(SET_EXTRACHARGES_CHARGES({ extracharges: extracharges }))
        setAutofocus(!autofocus)
        console.log('Rate charges', e, charge, values, extracharges, isNaN(extracharges));
    }

    const removeExtracharges = async (indexToRemove, extraCharge) => {
        values.extraCharges = values.extraCharges.filter((_, index) => index !== indexToRemove);
        let updatedCharges = undefined;

        if (extraCharge.chargeName) {
            updatedCharges = await charges.map((char) => (extraCharge.chargeName === char.chargeName ? { ...char, selected: false } : char));

        } else {
            updatedCharges = charges
        }

        setCharges([...updatedCharges])
        console.log('values.extraCharges', charges, updatedCharges);
        const extracharges = values.extraCharges.reduce((price, item) => price + item.rate * item.qty, 0);
        values.totalExtraCharges = extracharges
        dispatch(SET_EXTRACHARGES_CHARGES({ extracharges: extracharges }))
        setAutofocus(!autofocus)
        console.log('Rate charges', values, extracharges);
    }


    const selectCharge = async (e, extraCharge) => {
        let updatedCharges = undefined;
        if (extraCharge.chargeName) {
            updatedCharges = await charges.map((char) => (extraCharge.chargeName === char.chargeName ? { ...char, selected: false } : char));

        } else {
            updatedCharges = await charges.map((char) => (e === char.chargeName ? { ...char, selected: true } : char));
        }

        extraCharge.chargeName = await e;
        updatedCharges = await updatedCharges.map((char) => (e === char.chargeName ? { ...char, selected: true } : char));
        // console.log("charges", await values.extraCharges.map((charge) => charges.map((char) => (charge.chargeName === char.chargeName ? { ...char, selected: true } : { ...char, selected: false }))).flat());
        // const updatedCharges = await values.extraCharges.map((charge) => charges.map((char) => (charge.chargeName === char.chargeName ? { ...char, selected: true } : { ...char, selected: false }))).flat();

        // charges = updatedCharges.flat(); // Flattening the nested array


        // setCharges([...updatedCharges])
        setCharges([...updatedCharges])
        console.log('values.extraCharges', charges, updatedCharges);
        // Rest of your code...
    };
    // const selectCharge = async (e, extraCharge) => {
    //     extraCharge.chargeName = await e;

    //     const updatedCharges = values.extraCharges.flatMap((charge) =>
    //         charges.map((char) =>
    //             charge.chargeName === char.chargeName
    //                 ? { ...char, selected: true }
    //                 : { ...char, selected: false }
    //         )
    //     );

    //     setCharges(updatedCharges);
    //     console.log('values.extraCharges', values.extraCharges);
    //     // Rest of your code...
    // };


    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>
                {
                    state.paymentStatus === "Completed" ? <>
                        <div className='d-flex justify-content-center'>
                            <div style={{ width: '800px', height: 'auto', marginLeft: '50px', marginTop: '-20px' }} ref={componentRef}>
                                <b><hr></hr></b>
                                <div className='row text-center'> <h3>Invoice</h3></div>
                                <b><hr></hr></b>
                                <div className='row'>
                                    <div className='col-lg-6 col-md-6 col-sm-6'>
                                        <span><b>Indoor Case No : {state.indoorCaseNo}</b></span>
                                        <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                        <span><div>Age: {state.page}</div></span>
                                        <span><div>Address: {state.pAddress}</div></span>
                                        <span><div>Mobile No: {state.pMobileNo}</div></span>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                        <div>
                                            <span><b>Bill No: {state.invoiceuid}</b></span>
                                            <span><div>Admission UID: {state.admituid}</div></span>
                                            <span><div>Admit Date: {state.admitDate} </div></span>
                                            <span><div>Discharge Date: {state.dischargeDate}</div></span>
                                            <span><div>Consulting Dr.: {state.drName}</div></span>
                                        </div>

                                    </div>
                                </div>

                                <b><hr></hr></b>
                                <div className='row text-center'> <h3>Bill Summary</h3></div>
                                <b><hr></hr></b>

                                <div className='row'>
                                    <Table striped bordered>
                                        <thead>
                                            <tr>

                                                <th>Particular</th>
                                                <th>Rate</th>
                                                <th>Units / Days</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state.allprevRooms?.map((room, j) => {
                                                return <>
                                                    <tr key={j}>
                                                        <td>Room ({room.roomType})</td>
                                                        <td>{room.roomPrice.toFixed(2)}</td>
                                                        <td>{room.totaldays}(Days)</td>
                                                        <td>{room.totalRoomrent.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            })}
                                            {state.extraCharges?.map((charge, k) => {
                                                return <>
                                                    <tr key={k}>
                                                        <td>{charge.chargeName}</td>
                                                        <td>{charge.rate.toFixed(2)}</td>
                                                        <td>{charge.qty}</td>
                                                        <td>{charge.total.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            })}
                                            {/* <tr>
                                                <td>Nursing Charges</td>
                                                <td>{Number(state.nursingRate).toFixed(2)}</td>
                                                <td>{Number(state.nursingUnits).toFixed(2)}</td>
                                                <td>{state.totalNursing.toFixed(2)}</td>
                                            </tr>
                                            <tr>

                                                <td>OT Charges</td>
                                                <td>{Number(state.otRate).toFixed(2)}</td>
                                                <td>{Number(state.otUnits).toFixed(2)}</td>
                                                <td>{state.totalOt.toFixed(2)}</td>
                                            </tr>
                                            <tr>

                                                <td>ICU Charges</td>
                                                <td>{Number(state.icuRate).toFixed(2)}</td>
                                                <td>{Number(state.icuUnits).toFixed(2)}</td>
                                                <td>{Number(state.totalIcu).toFixed(2)}</td>
                                            </tr>


                                            <tr>
                                                <td >Hospital Charges</td>
                                                <td colSpan={2}>{state.hospitalCharges.toFixed(2)}</td>
                                                <td>{state.hospitalCharges.toFixed(2)}</td>
                                            </tr> */}
                                            {/* {
                                                state.pendingOpd?.map((opd, r) => {
                                                    return <>
                                                        <tr key={r}>
                                                            <td colSpan={3}>OPD({opd.drName})</td>
                                                            <td>{opd.consultingCharges.toFixed(2)}</td>
                                                        </tr>
                                                    </>
                                                })
                                            } */}
                                            {
                                                state.reportDetails?.map((report, i) => {
                                                    return <>
                                                        <tr key={i}>
                                                            <td >{report.reportName}</td>
                                                            <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                            <td>1.00</td>
                                                            <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                        </tr>
                                                    </>
                                                })
                                            }
                                            {/* {!state.medicines.length ? null :
                                                <tr>
                                                    <td colSpan={3}>
                                                        <Table bordered hover>
                                                            <thead>
                                                                <tr>

                                                                    <th>Medicine</th>
                                                                    <th>Qty * Price</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {state.medicines?.map((item, index) => {
                                                                    return <>
                                                                        <tr key={index}>

                                                                            <td>{item.medname}</td>
                                                                            <td>{item.medQty} * {item.medPrice.toFixed(2)}</td>
                                                                            <td>{item.totalmedPrice.toFixed(2)}</td>
                                                                        </tr>
                                                                    </>;
                                                                })}

                                                            </tbody>
                                                        </Table></td>
                                                    <td>{state.totalMedicines.toFixed(2)}</td>
                                                </tr>
                                            } */}

                                            <tr>
                                                <td colSpan={3}>Sub Total</td>
                                                <td>{state.subtotal.toFixed(2)}</td>
                                            </tr>
                                            {
                                                state.cgstValue === 0 ?
                                                    null
                                                    : <tr>
                                                        <td colSpan={2}>CGST%</td>
                                                        <td>{state.cgstValue}%</td>
                                                        <td>{state.cgstAmount.toFixed(2)}</td>
                                                    </tr>
                                            }

                                            {
                                                state.sgstValue === 0 ?
                                                    null
                                                    : <tr>
                                                        <td colSpan={2}>SGST%</td>
                                                        <td>{state.sgstValue}%</td>
                                                        <td>{state.sgstAmount.toFixed(2)}</td>
                                                    </tr>
                                            }

                                        </tbody>
                                    </Table>
                                </div>

                                <div className='row'>
                                    <b><hr></hr></b>
                                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                                        <div>
                                            <div>
                                                <div><b>Invoice By :{state.userName}</b></div>
                                                <span><b>Payment Type :{state.paymentType}</b></span>
                                                <div><b>Payment Status :{state.paymentStatus}</b></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                        <div>
                                            <div><b>Total Bill Amount :{state.billingAmount.toFixed(2)}</b></div>
                                            <span> <b>Advance:{Number(state.deposit).toFixed(2)}</b></span>
                                            {state.discount ? <div><b>Discount :{Number(state.discount).toFixed(2)}</b></div> : null}
                                            <div> <b>Payable Amount:{state.payableAmount.toFixed(2)}</b></div>
                                        </div>
                                    </div>
                                    {/* <div className="form-check" style={{ marginTop: '20px' }}>
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='paid' checked={paid} onChange={(e) => setPaid(e.target.checked)} />If You Want to Paid the bill Please check the check box and cilck on Paid
                                        </label>
                                    </div> */}
                                    <b><hr></hr></b>
                                </div>


                            </div>
                        </div>

                        <div className='d-flex justify-content-center'>
                            <button className='btn btn-primary mx-2' onClick={() => printInvoice(state)}>Print</button>

                            {/* <PrintButton content={
                                <div style={{ marginLeft: '20px', width: '800px', fontSize: "12px" }} >
                                    <div className='row text-center'> <h3>Invoice</h3></div>
                                    <b><hr></hr></b>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-6'>
                                            <span><b>Patient UID : {state.pid}</b></span>
                                            <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                            <span><div>Age: {state.page}</div></span>
                                            <span><div>Address: {state.pAddress}</div></span>
                                            <span><div>Mobile No: {state.pMobileNo}</div></span>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                            <div>
                                                <span><b>Admission UID: {state.admituid}</b></span>
                                                <span><div>Admit Date: {state.admitDate} </div></span>
                                                <span><div>Discharge Date: {state.dischargeDate}</div></span>
                                                <span><div>Bed No: {state.roomType}({state.roomNo})</div></span>
                                                <span><div>Consulting Dr.: {state.drName}</div></span>
                                            </div>

                                        </div>
                                    </div>

                                    <b><hr></hr></b>
                                    <div className='row text-center'> <h3>Bill Summary</h3></div>
                                    <div className='row'>
                                        <Table striped bordered>
                                            <thead>
                                                <tr>

                                                    <th>Particular</th>
                                                    <th>Rate</th>
                                                    <th>Units</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>

                                                    <td>Rooms</td>
                                                    <td>{state.priceperNignt.toFixed(2)}</td>
                                                    <td>{state.totalDayes}(Days)</td>
                                                    <td>{state.totalAmount.toFixed(2)}</td>
                                                </tr>
                                                <tr>

                                                    <td>Nursing Charges</td>
                                                    <td>{Number(state.nursingRate).toFixed(2)}</td>
                                                    <td>{Number(state.nursingUnits).toFixed(2)}</td>
                                                    <td>{state.totalNursing.toFixed(2)}</td>
                                                </tr>
                                                <tr>

                                                    <td>OT Charges</td>
                                                    <td>{Number(state.otRate).toFixed(2)}</td>
                                                    <td>{Number(state.otUnits).toFixed(2)}</td>
                                                    <td>{state.totalOt.toFixed(2)}</td>
                                                </tr>
                                                <tr>

                                                    <td>ICU Charges</td>
                                                    <td>{Number(state.icuRate).toFixed(2)}</td>
                                                    <td>{Number(state.icuUnits).toFixed(2)}</td>
                                                    <td>{state.totalIcu.toFixed(2)}</td>
                                                </tr>
                                                {
                                                    state.reportDetails?.map((report, i) => {
                                                        return <>
                                                            <tr key={i}>
                                                                <td >{report.reportName}</td>
                                                                <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                                <td>1.00</td>
                                                                <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                            </tr>
                                                        </>
                                                    })
                                                }
                                                {!state.medicines.length ? null :
                                                    <tr>

                                                        <td colSpan={3}>
                                                            <Table bordered hover>
                                                                <thead>
                                                                    <tr>

                                                                        <th>Medicine</th>
                                                                        <th>Qty * Price</th>
                                                                        <th>Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {state.medicines?.map((item, index) => {
                                                                        return <>
                                                                            <tr key={index}>

                                                                                <td>{item.medname}</td>
                                                                                <td>{item.medQty} * {item.medPrice.toFixed(2)}</td>
                                                                                <td>{item.totalmedPrice.toFixed(2)}</td>
                                                                            </tr>
                                                                        </>;
                                                                    })}

                                                                </tbody>
                                                            </Table></td>
                                                        <td>{state.totalMedicines.toFixed(2)}</td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <td colSpan={3}>Sub Total</td>
                                                    <td>{state.subtotal.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>CGST%</td>
                                                    <td>{state.cgstValue}%</td>
                                                    <td>{state.cgstAmount.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>SGST%</td>
                                                    <td>{state.sgstValue}%</td>
                                                    <td>{state.sgstAmount.toFixed(2)}</td>
                                                </tr>

                                            </tbody>
                                        </Table>
                                    </div>

                                    <div className='row'>
                                        <b><hr></hr></b>
                                        <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                            <div>
                                                <h6>Total Bill Amount :{state.billingAmount.toFixed(2)}</h6>
                                                <span>Deposit: {Number(state.deposit).toFixed(2)}</span>
                                                <h6>Payable Amount : {state.payableAmount.toFixed(2)}</h6>
                                            </div>
                                        </div>
                                        <b><hr></hr></b>
                                    </div>


                                </div>
                            } /> */}

                        </div>
                    </> : <>

                        <div className='d-flex justify-content-center'>
                            <div style={{ width: '800px', height: 'auto', marginLeft: '50px' }}>

                                <b><hr></hr></b>
                                <div className='row text-center'> <h3>Invoice</h3></div>
                                <b><hr></hr></b>
                                <div className='row'>
                                    <div className='col-lg-6 col-md-6 col-sm-6'>
                                        <span><h4>Indoor Case No : {state.indoorCaseNo}</h4></span>
                                        <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                        <span><div>Age: {state.page}</div></span>
                                        <span><div>Address: {state.pAddress}</div></span>
                                        <span><div>Mobile No: {state.pMobileNo}</div></span>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                        <div>
                                            <span><input type='number' className='form-control' placeholder={`Enter bill No*`} required onChange={(e) => setInvoiceuid(e.target.value)} /></span>
                                            <span><h4>Admission id: {state.admituid}</h4></span>
                                            <span><div>Admit Date: {state.admitDate} </div></span>
                                            <span><div>Discharge Date: {state.dischargeDate}</div></span>
                                            <span><div>Consulting Dr.: {state.drName}</div></span>
                                        </div>
                                    </div>
                                </div>

                                <b><hr></hr></b>
                                <div className='row text-center'> <h3>Bill Summary</h3></div>
                                <b><hr></hr></b>

                                <div className='row'>
                                    <Table striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Particular</th>
                                                <th>Rate</th>
                                                <th>Units</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allprevRooms?.map((room, j) => {
                                                return <>
                                                    <tr key={j}>
                                                        <td>Room ({room.roomType})</td>
                                                        <td>{room.roomPrice.toFixed(2)}</td>
                                                        <td>{room.totaldays}(Days)</td>
                                                        <td>{room.totalRoomrent.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            })}
                                            {/* 
                                            <tr>

                                                <td>Nursing Charges</td>
                                                <td><input type='number' style={{ width: '150px' }} onChange={(e) => dispatch(SET_NURSINGCHARGE({ nursingCharges: e.target.value }))
                                                } value={nursingRate} /></td>
                                                <td><input type='number' style={{ width: '150px' }} onChange={(e) => dispatch(SET_NURSINGUNIT({ nursingUnit: e.target.value }))
                                                } value={nursingUnits} /> </td>
                                                <td>{totalNursing.toFixed(2)}</td>
                                            </tr>
                                            <tr>

                                                <td>OT Charges</td>
                                                <td><input type='number' style={{ width: '150px' }} onChange={(e) => dispatch(SET_OTCHARGE({ otCharges: e.target.value }))
                                                } value={otRate} /></td>
                                                <td><input type='number' style={{ width: '150px' }} onChange={(e) => dispatch(SET_OTUNIT({ otUnit: e.target.value }))
                                                } value={otUnits} /> </td>
                                                <td>{totalOt.toFixed(2)}</td>
                                            </tr>
                                            <tr>

                                                <td>ICU Charges</td>
                                                <td><input type='number' style={{ width: '150px' }} onChange={(e) => dispatch(SET_ICUCHARGE({ icuCharges: e.target.value }))} value={icuRate} /></td>
                                                <td><input type='number' style={{ width: '150px' }} onChange={(e) => dispatch(SET_ICUUNIT({ icuUnit: e.target.value }))
                                                } value={icuUnits} /> </td>
                                                <td>{totalIcu.toFixed(2)}</td>
                                            </tr> */}

                                            <FormikProvider value={formik}>
                                                <FieldArray name="extraCharges">
                                                    {({ insert, remove, push }) => (
                                                        <>
                                                            {values.extraCharges?.length > 0 && values.extraCharges.map((extraCharge, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className="form-group">
                                                                            <label htmlFor={`extraCharges.${index}.chargeName`}>Charge Name<b style={{ color: 'red' }}>*</b>:</label>
                                                                            <select className="form-control" name={`extraCharges.${index}.chargeName`} value={extraCharge.chargeName} onChange={(e) => { selectCharge(e.target.value, extraCharge) }}>
                                                                                <option selected >Select Charge</option>
                                                                                {charges?.map((option) => (
                                                                                    <option key={option.chargeuid} value={option.chargeName} disabled={option.selected}>
                                                                                        {option.chargeName}
                                                                                    </option>
                                                                                ))}

                                                                            </select>
                                                                            {/* <input
                                                                                name={`extraCharges.${index}.chargeName`}
                                                                                placeholder="Enter Charge Name"
                                                                                type="text"
                                                                                value={extraCharge.chargeName}
                                                                                onChange={handleChange}
                                                                                className="form-control"
                                                                                required
                                                                            /> */}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="form-group">
                                                                            <label htmlFor={`extraCharges.${index}.rate`}>Rate<b style={{ color: 'red' }}>*</b>:</label>
                                                                            <input
                                                                                name={`extraCharges.${index}.rate`}
                                                                                placeholder="Enter Price"
                                                                                type="number"
                                                                                value={extraCharge.rate}
                                                                                onChange={(e) => totalextraChargesRate(e.target.value, extraCharge)}
                                                                                className="form-control"
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="form-group">
                                                                            <label htmlFor={`extraCharges.${index}.qty`}>Qty<b style={{ color: 'red' }}>*</b>:</label>
                                                                            <input
                                                                                name={`extraCharges.${index}.qty`}
                                                                                placeholder="Enter Qty"
                                                                                type="number"
                                                                                value={extraCharge.qty}
                                                                                className="form-control"
                                                                                onChange={(e) => totalextraChargesQty(e.target.value, extraCharge)}
                                                                                required

                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className='d-flex'>
                                                                        <div className="form-group">
                                                                            <label htmlFor={`extraCharges.${index}.total`}>Total<b style={{ color: 'red' }}>*</b>:</label>
                                                                            <input
                                                                                name={`extraCharges.${index}.total`}
                                                                                placeholder="Total"
                                                                                type="number"
                                                                                className="form-control"
                                                                                defaultValue={extraCharge.total}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        <span onClick={() => removeExtracharges(index, extraCharge)}><ImCross /></span></td>
                                                                </tr>
                                                            ))}
                                                            <tr>
                                                                <td colSpan="5" >
                                                                    <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                                                        <button type="button" className='btn btn-success' disabled={values.extraCharges && values.extraCharges.some(charge => !charge.chargeName || !charge.rate || !charge.qty)} onClick={() => push({ chargeName: '', rate: '', qty: 1 })}>
                                                                            <BiPlus size={25} />  Add Charges
                                                                        </button>
                                                                    </div>

                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                </FieldArray>

                                            </FormikProvider>


                                            {/* <tr>
                                                <td >Hospital Charges</td>
                                                <td colSpan={2}><input type='number' style={{ width: '150px' }} onChange={(e) => dispatch(SET_HOSPITAL_CHARGES({ hospitalCharge: Number(e.target.value) }))} defaultValue={hospitalCharges} /></td>
                                                <td>{hospitalCharges.toFixed(2)}</td>
                                            </tr> */}
                                            {/* {
                                                pendingOpd?.map((opd, r) => {
                                                    return <>
                                                        <tr key={r}>
                                                            <td colSpan={3}>OPD({opd.drName})</td>
                                                            <td>{opd.consultingCharges.toFixed(2)}</td>
                                                        </tr>
                                                    </>
                                                })
                                            } */}
                                            {
                                                labReports?.map((report, i) => {
                                                    return <>
                                                        <tr key={i}>
                                                            <td >{report.reportName}</td>
                                                            <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                            <td>1.00</td>
                                                            <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                        </tr>
                                                    </>
                                                })
                                            }
                                            {/* {!mediciness.length ? null :
                                                <tr>
                                                    <td colSpan={3}>
                                                        <Table bordered hover>
                                                            <thead>
                                                                <tr>

                                                                    <th>Medicine</th>
                                                                    <th>Qty * Price</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {mediciness?.map((item, index) => {
                                                                    return <>
                                                                        <tr key={index}>

                                                                            <td>{item.medname}</td>
                                                                            <td>{item.medQty} * {item.medPrice.toFixed(2)}</td>
                                                                            <td>{item.totalmedPrice.toFixed(2)}</td>
                                                                        </tr>
                                                                    </>;
                                                                })}

                                                            </tbody>
                                                        </Table></td>
                                                    <td>{totalMedicines.toFixed(2)}</td>
                                                </tr>
                                            } */}
                                            <tr>
                                                <td colSpan={3}>Sub Total</td>
                                                <td>{subtotal.toFixed(2)}</td>
                                            </tr>
                                            {
                                                cgstValue === 0 ?
                                                    null
                                                    : <tr>
                                                        <td colSpan={2}>CGST%</td>
                                                        <td>{cgstValue}%</td>
                                                        <td>{cgstAmount.toFixed(2)}</td>
                                                    </tr>
                                            }

                                            {
                                                sgstValue === 0 ?
                                                    null
                                                    : <tr>
                                                        <td colSpan={2}>SGST%</td>
                                                        <td>{sgstValue}%</td>
                                                        <td>{sgstAmount.toFixed(2)}</td>
                                                    </tr>
                                            }
                                            {/* <tr>
                                                <td colSpan={2}>CGST%</td>
                                                <td>{cgstValue}%</td>
                                                <td>{cgstAmount.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>SGST%</td>
                                                <td>{sgstValue}%</td>
                                                <td>{sgstAmount.toFixed(2)}</td>
                                            </tr> */}

                                        </tbody>
                                    </Table>
                                </div>

                                <div className='row'>
                                    <b><hr></hr></b>
                                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                                        <div>
                                            <div className="form-group" >
                                                <label >Payment Type:</label>
                                                <select className="form-control" name='paymentType' defaultValue={paymentType} onChange={(e) => [setPaymentType(e.target.value), console.log('payment Type', e.target.value)]}>
                                                    <option >Select Payment Type</option>
                                                    <option value='Cash'>Cash</option>
                                                    <option value='Card' >Card</option>
                                                    <option value='Online' >Online</option>
                                                </select>
                                            </div>
                                            <div className="form-group" >
                                                <label >Payment Status<b style={{ color: 'red' }}>*</b>:</label>
                                                <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='paymentStatus' value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                                                    <option >Select Payment Status</option>
                                                    <option value='Completed'>Completed</option>
                                                    <option value='Pending' selected>Pending</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                        <div>
                                            <h6>Total Bill Amount :{billingAmount.toFixed(2)}</h6>
                                            {/* <span>Advance : <input type='number' defaultValue={advance} onChange={(e) => dispatch(SET_ADVANCE({ advance: e.target.value }))} /></span>
                                            <p>Discount : <input type='number' className='form-control' defaultValue={discount} onChange={(e) => dispatch(SET_DISCOUNT({ discount: e.target.value }))} /></p> */}
                                            <div className="form-group" >
                                                <label >Advance:</label>
                                                <input type='number' defaultValue={advance} className='form-control' onChange={(e) => dispatch(SET_ADVANCE({ advance: Number(e.target.value) }))} />
                                            </div>
                                            <div className="form-group" >
                                                <label >Discount:</label>
                                                <input type='number' className='form-control' defaultValue={discount} onChange={(e) => dispatch(SET_DISCOUNT({ discount: Number(e.target.value) }))} />
                                            </div>
                                            <h6>Payable Amount : {payable.toFixed(2)}</h6>

                                        </div>
                                    </div>
                                    {/* <div className="form-check" style={{ marginTop: '20px' }}>
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='paid' checked={paid} onChange={(e) => setPaid(e.target.checked)} />If You Want to Paid the bill Please check the check box and cilck on Paid
                                        </label>
                                    </div> */}
                                    <b><hr></hr></b>
                                </div>


                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            {/* <PrintButton content={
                                <div style={{ marginLeft: '20px', width: '800px', justifyContent: 'center' }}>
                                    <div className='row text-center'> <h3>Invoice</h3></div>
                                    <b><hr></hr></b>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-6'>
                                            <span><h6>Patient UID : {state.pid}</h6></span>
                                            <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                            <span><div>Age: {state.page}</div></span>
                                            <span><div>Address: {state.pAddress}</div></span>
                                            <span><div>Mobile No: {state.pMobileNo}</div></span>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                            <div>
                                                <span><h6>Admission UID: {state.admituid}</h6></span>
                                                <span><div>Admit Date: {state.admitDate} </div></span>
                                                <span><div>Discharge Date: {state.dischargeDate}</div></span>
                                                <span><div>Bed No: {state.roomType}({state.roomNo})</div></span>
                                                <span><div>Consulting Dr.: {state.drName}</div></span>
                                            </div>

                                        </div>
                                    </div>

                                    <b><hr></hr></b>
                                    <div className='row text-center'> <h3>Bill Summary</h3></div>
                                    <div className='row'>
                                        <Table striped bordered>
                                            <thead>
                                                <tr>
                                                    <th>Particular</th>
                                                    <th>Rate</th>
                                                    <th>Units</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Rooms</td>
                                                    <td>{state.priceperNignt.toFixed(2)}</td>
                                                    <td>{state.totalDayes}(Days)</td>
                                                    <td>{state.totalAmount.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Nursing Charges</td>
                                                    <td>{nursingRate ? Number(nursingRate).toFixed(2) : 0.00}</td>
                                                    <td>{nursingUnits ? Number(nursingUnits).toFixed(2) : 0.00}</td>
                                                    <td>{totalNursing.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>OT Charges</td>
                                                    <td>{otRate ? Number(otRate).toFixed(2) : 0.00}</td>
                                                    <td>{otUnits ? Number(otUnits).toFixed(2) : 0.00}</td>
                                                    <td>{totalOt.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>ICU Charges</td>
                                                    <td>{icuRate ? Number(icuRate).toFixed(2) : 0.00}</td>
                                                    <td>{icuUnits ? Number(icuUnits).toFixed(2) : 0.00}</td>
                                                    <td>{totalIcu.toFixed(2)}</td>
                                                </tr>
                                                {
                                                    labReports.map((report, i) => {
                                                        return <>
                                                            <tr key={i}>
                                                                <td >{report.reportName}</td>
                                                                <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                                <td>1.00</td>
                                                                <td>{Number(report.reportPrice).toFixed(2)}</td>
                                                            </tr>
                                                        </>
                                                    })
                                                }
                                                {!mediciness.length ? null :
                                                    <tr>
                                                        <td colSpan={3}>
                                                            <Table bordered hover>
                                                                <thead>
                                                                    <tr>

                                                                        <th>Medicine</th>
                                                                        <th>Qty * Price</th>
                                                                        <th>Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {mediciness?.map((item, index) => {
                                                                        return <>
                                                                            <tr key={index}>

                                                                                <td>{item.medname}</td>
                                                                                <td>{item.medQty} * {item.medPrice.toFixed(2)}</td>
                                                                                <td>{item.totalmedPrice.toFixed(2)}</td>
                                                                            </tr>
                                                                        </>;
                                                                    })}

                                                                </tbody>
                                                            </Table></td>
                                                        <td>{totalMedicines.toFixed(2)}</td>
                                                    </tr>
                                                }
                                              
                                                <tr>
                                                    <td colSpan={3}>Sub Total</td>
                                                    <td>{subtotal.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>CGST%</td>
                                                    <td>{cgstValue}%</td>
                                                    <td>{cgstAmount.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>SGST%</td>
                                                    <td>{sgstValue}%</td>
                                                    <td>{sgstAmount.toFixed(2)}</td>
                                                </tr>

                                            </tbody>
                                        </Table>
                                    </div>

                                    <div className='row'>
                                        <b><hr></hr></b>
                                        <div className='col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end'>
                                            <div>
                                                <h6>Total Bill Amount :{billingAmount.toFixed(2)}</h6>
                                                <span>Deposit: {advance ? Number(advance).toFixed(2) : 0.00}</span>
                                                <h6>Payable Amount : {payable.toFixed(2)}</h6>
                                            </div>
                                        </div>
                                        <b><hr></hr></b>
                                    </div>
                                </div>
                            } /> */}

                            <button className='btn btn-primary mx-2' disabled={values.extraCharges && values.extraCharges.some(charge => !charge.chargeName || !charge.rate || !charge.qty)} onClick={() => printInvoice()}>Print</button>
                            <button className='btn btn-primary ' disabled={paymentStatus !== "Completed" || !invoiceuid || values.extraCharges && values.extraCharges.some(charge => !charge.chargeName || !charge.rate || !charge.qty)} onClick={saveInvoice}>Paid</button>
                        </div>
                    </>

                }
            </>
        }



    </>
}

export default Invoicepage
