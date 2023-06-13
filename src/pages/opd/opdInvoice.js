/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Loaderspinner from '../../comman/spinner/Loaderspinner';
import { getData, setData } from 'src/services/firebasedb';
import Table from 'react-bootstrap/Table';
import ReactToPrint from 'react-to-print';
import { storage } from 'src/firebaseconfig';
import html2pdf from 'html2pdf.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_OPD_PATIENTS, FILL_OPD_PATIENTS, selectOpdPatients } from 'src/redux/slice/opdPatientsList';
import { toast } from 'react-toastify';
import PrintHeader from 'src/comman/printpageComponents/PrintHeader';
import PrintFooter from 'src/comman/printpageComponents/PrintFooter';
import { TfiArrowCircleLeft } from 'react-icons/tfi'
import { selectUserName } from 'src/redux/slice/authSlice';
import { FILL_LABORATORY_REPORTS, selectAlllaboratoryReports } from 'src/redux/slice/patientsLaboratoryReportsSlice';
import { selectAlltax } from 'src/redux/slice/taxSlice';
import PrintButton from 'src/comman/printpageComponents/PrintButton';
import { CHANGE_STATUS_PATIENTS_MEDICINES, selectAllPatientsMedicines } from 'src/redux/slice/patientsMedicinesSlice';
import { selectAllCharges } from 'src/redux/slice/chargesSlice';
import { FieldArray, useFormik, FormikProvider } from 'formik';
import { ImCross } from 'react-icons/im'
import { BiPlus } from 'react-icons/bi'
let initalValues = {
    extraCharges: [
        {
            chargeName: '',
            rate: '',
            total: '',
        },
    ],
    totalExtraCharges: '',
}
const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px' }} >
            <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>INVOICE</h4></div>
            <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                        <span><div><b>OPD Case No : {state.opdCaseNo}</b></div></span>
                        <span><div>Name: {state.pName}</div></span>
                        <span><div>Age /Sex : {state.page}/{state.pGender}</div></span>
                        <span><div>Address: {state.pAddress}</div></span>
                        <span><div>Mobile No: {state.pMobileNo}</div></span>

                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                        <div>
                            <span><b>Bill No: {state.invoiceuid}</b></span>
                            <span><div><b>OPD id: {state.opduid}</b></div></span>
                            <span><div>Date: {state.consultingDate} </div></span>
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
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.pendingOpd?.map((item, i) => {
                                return (<tr key={i}>
                                    <td>Consulting Charge({item.drName})</td>
                                    <td>{item.consultingCharges.toFixed(2)}</td>
                                    <td>{item.consultingCharges.toFixed(2)}</td>
                                </tr>)
                            })}
                            {state.extraCharges?.map((charge, k) => {
                                return <>
                                    <tr key={k}>
                                        <td>{charge.chargeName}</td>
                                        <td>{charge.rate.toFixed(2)}</td>
                                        <td>{charge.total.toFixed(2)}</td>
                                    </tr>
                                </>
                            })}
                            {/* {state.consultingChargesHospital !== undefined ?
                                <tr>
                                    <td>Consulting Charge(Hos.)</td>
                                    <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                    <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                </tr> : null} */}
                            {state.reportDetails?.map((item, i) => {
                                return (<tr key={i}>
                                    <td>{item.reportName}</td>
                                    <td>{Number(item.reportPrice).toFixed(2)}</td>
                                    <td>{Number(item.reportPrice).toFixed(2)}</td>
                                </tr>)
                            })}
                            {!state.medicineDetails.length ? null :
                                <tr>
                                    <td colSpan={2}>
                                        <Table bordered hover>
                                            <thead>
                                                <tr>

                                                    <th>Medicine</th>
                                                    <th>Qty * Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {state.medicineDetails?.map((item, index) => {
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
                                    <td>{state.totalAmountofMedicines.toFixed(2)}</td>
                                </tr>
                            }
                            <tr>
                                <td colSpan={2}>Sub Total</td>
                                <td>{state.subTotalamount.toFixed(2)}</td>
                            </tr>
                            {
                                state.cgstValue === 0 ?
                                    null
                                    : <tr>
                                        <td>CGST%</td>
                                        <td>{state.cgstValue}%</td>
                                        <td>{state.cgstAmount.toFixed(2)}</td>
                                    </tr>
                            }

                            {
                                state.sgstValue === 0 ?
                                    null
                                    : <tr>
                                        <td >SGST%</td>
                                        <td>{state.sgstValue}%</td>
                                        <td>{state.sgstAmount.toFixed(2)}</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>

                <div className='row'>
                    <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                        <div>
                            <span>Payment Type <b>:{state.paymentType}</b></span>
                            <div><b>Invoice By :{state.userName}</b></div>
                        </div>


                    </div>
                    <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                        <div className='row' style={{ width: '200px', marginRight: '70px' }}>
                            <div className='col-lg-6 '><div>Total</div>
                                <span>Recived</span></div>
                            <div className='col-lg-6'><div>:{state.payAbleAmount.toFixed(2)}</div>
                                <h6>:{state.payAbleAmount.toFixed(2)}</h6></div>
                        </div>

                    </div>
                    <b><hr></hr></b>
                    <div className='row'>
                        <div className='col-lg-6'>
                            {state.advices.length ? <div className='row'>
                                <span className='row '> <h5>Advice :-</h5></span>
                                <div className='row'>
                                    {
                                        state.advices?.map((advice, i) => {
                                            return <>
                                                <span key={i}>{advice}</span>
                                            </>
                                        })
                                    }
                                </div> </div> : null}
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                            <div><b>Payment Status :{state.paymentStatus}</b></div>
                        </div>
                    </div>
                    {/* {state.advices ? <div className='row'>

                        <span className='row text-center'> <h3>Advice</h3></span>

                        <div className='row'>
                            {
                                state.advices?.map((advice, i) => {
                                    return <>
                                        <span key={i}>{advice}</span>
                                    </>
                                })
                            }
                        </div> </div> : null} */}

                </div>
            </div>

        </div>
    )
};

const opdInvoice = () => {
    const navigate = useNavigate()
    const currentDate = new Date();
    const patientMedicine = useSelector(selectAllPatientsMedicines);
    let state = undefined
    const location = useLocation();
    if (location.state === null) {
        state = JSON.parse(localStorage.getItem('opdInvoiceData'));
    } else {
        localStorage.setItem('opdInvoiceData', JSON.stringify(location.state));
        state = location.state
    }
    // const { state } = useLocation();
    // if (state === null) {
    //     navigate('/opd')
    //     return null;
    // }
    const dispatch = useDispatch();
    const allPatientsLaboratoryReports = useSelector(selectAlllaboratoryReports)
    const allTaxs = useSelector(selectAlltax)
    const userName = useSelector(selectUserName)
    const opdPatient = useSelector(selectOpdPatients)
    const [consultingChargesHospital, setConsultingChargesHospital] = useState(0)
    const [cgstAmount, setCgstamount] = useState(0)
    const [sgstAmount, setSgstamount] = useState(0)
    const [cgstValue, setCgstValue] = useState(0)
    const [sgstValue, setSgstValue] = useState(0)
    const [payAbleAmount, setPayableamount] = useState(0)
    const [labReports, setLabReports] = useState([])
    const [subTotalamount, setSubtotalamount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [paymentType, setPaymentType] = useState()
    const [paymentStatus, setPaymentStatus] = useState('')
    const [medicineDetails, setMedicineDetails] = useState([])
    const [totalAmountofMedicines, setTotalAmountofMedicines] = useState(0)
    const [printContent, setPrintContent] = useState(null);
    const [pendingOpd, setPendingopd] = useState([])
    const [invoiceuid, setInvoiceuid] = useState()
    const Allcharges = useSelector(selectAllCharges)
    const [charges, setCharges] = useState([])
    const [autofocus, setAutofocus] = useState(false)
    const [totalAmountofOpd, setTotalAmountofOpd] = useState(0)
    const [totalAmountoflab, setTotalAmountoflab] = useState(0)

    useEffect(() => {
        fetchData()
        setCharges([...Allcharges])
        clearForm()

        return () => {
            clearForm()
        }
    }, [])
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const pendingopd = opdPatient.filter(patient => patient.pid === state.pid && patient.paymentStatus === "Pending")
                .map(patient => ({
                    opduid: patient.opduid,
                    drName: patient.drName,
                    consultingCharges: patient.consultingCharge,
                    consultingDate: patient.consultingDate
                }));
            setPendingopd(pendingopd)
            const totalOfopd = await pendingopd.reduce((total, item) => total + item.consultingCharges, 0);
            setTotalAmountofOpd(totalOfopd)
            const labReportss = await allPatientsLaboratoryReports?.filter((item) => item.pid === state.pid && item.paymentStatus === "Pending");

            const medicineDetails = {};

            for (const item of patientMedicine || []) {
                if (item.pid !== state.pid || item.paymentStatus !== 'Pending') continue;

                for (const medicine of item.medicines || []) {
                    const existingMedicine = medicineDetails[medicine.medname];
                    if (existingMedicine) {
                        existingMedicine.medQty += parseInt(medicine.medQty);
                        existingMedicine.totalmedPrice += medicine.totalmedPrice;
                    } else {
                        medicineDetails[medicine.medname] = {
                            medname: medicine.medname,
                            medPrice: medicine.medPrice,
                            medQty: parseInt(medicine.medQty),
                            totalmedPrice: medicine.totalmedPrice,
                        };
                    }
                }
            }

            const medicineDetailsArray = Object.values(medicineDetails);

            setMedicineDetails([...medicineDetailsArray]);

            const totalOfallMedicines = medicineDetailsArray.reduce((total, item) => total + item.totalmedPrice, 0);

            setTotalAmountofMedicines(totalOfallMedicines);

            console.log('SEPARATE MEDICINE DETAILS', medicineDetailsArray, totalOfallMedicines);

            const reportDetails = labReportss?.map(report => {
                return {
                    reportName: report.reportName,
                    reportPrice: report.reportPrice
                };
            });

            await setLabReports(reportDetails);
            const totalOflabReports = reportDetails.reduce((total, item) => total + Number(item.reportPrice), 0);
            setTotalAmountoflab(totalOflabReports)

            const subTotal = totalOflabReports + totalOfopd + totalOfallMedicines;

            setSubtotalamount(subTotal);

            let totalcgst = undefined;
            let totalsgst = undefined;

            allTaxs?.forEach((item, i) => {
                if (item.taxName === "CGST") {
                    setCgstValue(item.taxValue)
                    totalcgst = item.taxValue / 100 * subTotal
                    setCgstamount(totalcgst)
                } else if (item.taxName === "SGST") {
                    setSgstValue(item.taxValue)
                    totalsgst = item.taxValue / 100 * subTotal
                    setSgstamount(totalsgst)
                }
            });

            const totalBill = subTotal + totalcgst + totalsgst;

            await setPayableamount(totalBill);

            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
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
                    total: '',
                },
            ],
            totalExtraCharges: '',
        });
    };
    // const fetchData = async () => {
    //     let labReportss = await allPatientsLaboratoryReports?.filter((item) => item.pid === state.pid && item.paymentStatus === "Pending")
    //     const medicineDetails = {};

    //     for (const item of patientMedicine || []) {
    //         if (item.pid !== state.pid || item.paymentStatus !== 'Pending') continue;

    //         for (const medicine of item.medicines || []) {
    //             const existingMedicine = medicineDetails[medicine.medname];
    //             if (existingMedicine) {
    //                 existingMedicine.medQty += parseInt(medicine.medQty);
    //                 existingMedicine.totalmedPrice += medicine.totalmedPrice;
    //             } else {
    //                 medicineDetails[medicine.medname] = {
    //                     medname: medicine.medname,
    //                     medPrice: medicine.medPrice,
    //                     medQty: parseInt(medicine.medQty),
    //                     totalmedPrice: medicine.totalmedPrice,
    //                 };
    //             }
    //         }
    //     }
    //     const medicineDetailsArray = Object.values(medicineDetails);
    //     setMedicineDetails([...medicineDetailsArray])
    //     let totalOfallMedicines = await medicineDetailsArray.reduce((total, item) => total + item.totalmedPrice, 0)
    //     setTotalAmountofMedicines(totalOfallMedicines)

    //     console.log('SEPARATE MEDICINE DETAILS', medicineDetailsArray, totalOfallMedicines);
    //     // let totalPendingReports = await labReportss?.filter((item) => item.paymentStatus === "Pending")
    //     const reportDetails = await labReportss.map(report => {
    //         return {
    //             reportName: report.reportName,
    //             reportPrice: report.reportPrice
    //         };
    //     });
    //     await setLabReports(reportDetails)
    //     let totalOflabReports = await reportDetails.reduce((total, item) => total + Number(item.reportPrice), 0)
    //     let subTotal = await totalOflabReports + state.consultingCharge + consultingChargesHospital + totalOfallMedicines;
    //     setSubtotalamount(subTotal)
    //     let totalcgst = undefined;
    //     let totalsgst = undefined;
    //     await allTaxs.forEach((item, i) => {
    //         if (item.taxName === "CGST") {
    //             setCgstValue(item.taxValue)
    //             totalcgst = item.taxValue / 100 * subTotal
    //             setCgstamount(totalcgst)
    //         } else if (item.taxName === "SGST") {
    //             setSgstValue(item.taxValue)
    //             totalsgst = item.taxValue / 100 * subTotal
    //             setSgstamount(totalsgst)
    //         }
    //         else {

    //         }
    //     });

    //     let totalBill = await subTotal + totalcgst + totalsgst;
    //     await setPayableamount(totalBill)
    //     setIsLoading(false)

    //     // }, 3000);
    // }
    const saveInvoice = async () => {
        const [patients, patientsLabReports, medicines] = await Promise.all([
            [...opdPatient],
            [...allPatientsLaboratoryReports],
            [...patientMedicine]
        ]);

        const newObj = {
            // ...state,
            paymentStatus: 'Completed',
            consultingChargesHospital,
            extraCharges: values.extraCharges,
            reportDetails: labReports,
            cgstValue,
            medicineDetails,
            totalAmountofMedicines,
            cgstAmount,
            sgstValue,
            sgstAmount,
            subTotalamount,
            payAbleAmount,
            paymentType,
            userName,
            pendingOpd,
            invoiceuid
        };

        const newLabReportsarray = patientsLabReports.map((item) =>
            item.pid === state.pid ? { ...item, paymentStatus: 'Completed' } : item
        );
        // let newMedarray = await medicines.map((item) => (item.pid === state.pid ? { ...item, paymentStatus: 'Completed' } : item))
        const newMedarray = await medicines.map((item) => {
            if (item.pid === state.pid && item.paymentStatus === "Pending") {
                const cgstAmountmedicine = cgstValue / 100 * item.allMedTotalprice;
                const sgstAmountmedicine = sgstValue / 100 * item.allMedTotalprice;
                const payAbleAmountmedicine = item.allMedTotalprice + cgstAmountmedicine + sgstAmountmedicine;
                return {
                    ...item,
                    paymentStatus: 'Completed',
                    cgstValue,
                    sgstValue,
                    cgstAmount: cgstAmountmedicine,
                    sgstAmount: sgstAmountmedicine,
                    subTotalamount: item.allMedTotalprice,
                    payableAmount: payAbleAmountmedicine,
                    paymentType,
                    userName,
                    invoiceuid,
                }
            } else {
                return item
            }
        })
        const newArray = await patients.map((item) => (item.pid === state.pid && item.paymentStatus === "Pending" ? { ...item, ...newObj } : item))
        // const newArray = patients.map((item) =>

        //     item.opduid === state.opduid ? { ...newObj } : item
        // );

        try {
            await Promise.all([
                setData('opdPatients', 'm5JHl3l4zhaBCa8Vihcb', 'opdPatient', newArray),
                setData(
                    'PatientslaboratoryReports',
                    'QmwQr1wDcFK6K04hKMYc',
                    'labReports',
                    newLabReportsarray
                ),
                setData('PatientsMedicines', 'GoKwC6l5NRWSonfUAal0', 'patientsMedicines', newMedarray),

            ]);
            dispatch(FILL_OPD_PATIENTS(newArray));
            dispatch(FILL_LABORATORY_REPORTS(newLabReportsarray));
            dispatch(CHANGE_STATUS_PATIENTS_MEDICINES(newMedarray))
            toast.success('Invoice Saved SuccessFully...');
            window.history.back();
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
        // const element = componentRef.current;
        // const options = {
        //     margin: [10, 10, 0, 0],
        //     filename: 'opdinvoice.pdf' + state.opduid,
        //     image: { type: 'jpeg', quality: 0.98 },
        //     enableLinks: true,
        //     html2canvas: { scale: 2 },
        //     jsPDF: { format: 'letter', orientation: 'portrait' },
        // };
        // let pdf = html2pdf().from(element).set(options).toPdf();
        // // pdf.save()
        // const blob = pdf.output('blob');
        // blob.then((value) => {
        //     var storagePath = 'Invoices/' + options.filename;
        //     const storageRef = ref(storage, storagePath);
        //     const uploadTask = uploadBytesResumable(storageRef, value);
        //     uploadTask.on('state_changed', (snapshot) => {
        //         // progrss function ....
        //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     }, (error) => {
        //         console.error(error);
        //         // error function ....

        //     }, () => {
        //         // complete function ....
        //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {



        //         })
        //     })
        // });


    }
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
                    consultingChargesHospital: consultingChargesHospital,
                    extraCharges: values.extraCharges,
                    reportDetails: labReports,
                    cgstValue: cgstValue,
                    medicineDetails: medicineDetails,
                    totalAmountofMedicines: totalAmountofMedicines,
                    cgstAmount: cgstAmount,
                    sgstValue: sgstValue,
                    sgstAmount: sgstAmount,
                    subTotalamount: subTotalamount,
                    payAbleAmount: payAbleAmount,
                    paymentType: paymentType,
                    userName: userName,
                    pendingOpd,
                }
            }} />)
        }

    }

    const hospitacharges = (value) => {
        setConsultingChargesHospital(value)
        const subtotal = subTotalamount + value
        setSubtotalamount(subtotal)
        const totalcgst = cgstValue / 100 * subtotal
        const totalsgst = sgstValue / 100 * subtotal
        setCgstamount(totalcgst)
        setSgstamount(totalsgst)
        const totalBill = subtotal + totalcgst + totalsgst;
        setPayableamount(totalBill);
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
    // const totalextraChargesQty = (e, charge) => {
    //     charge.qty = Number(e);
    //     charge.total = Number(e) * charge.rate
    //     const extracharges = values.extraCharges.reduce((price, item) => price + item.rate * item.qty, 0);
    //     values.totalExtraCharges = extracharges

    //     const subtotal = subTotalamount + extracharges
    //     setSubtotalamount(subtotal)
    //     const totalcgst = cgstValue / 100 * subtotal
    //     const totalsgst = sgstValue / 100 * subtotal
    //     setCgstamount(totalcgst)
    //     setSgstamount(totalsgst)
    //     const totalBill = subtotal + totalcgst + totalsgst;
    //     setPayableamount(totalBill);
    //     // dispatch(SET_EXTRACHARGES_CHARGES({ extracharges: extracharges }))
    //     setAutofocus(!autofocus)
    //     console.log('qty charges', e, charge, values, extracharges, isNaN(extracharges));
    // }


    // const totalextraChargesRate = async (e, charge) => {
    //     charge.rate = Number(e);
    //     charge.total = Number(e)
    //     const extracharges = values.extraCharges.reduce((price, item) => price + item.rate, 0);
    //     values.totalExtraCharges = extracharges

    //     const subtotal = subTotalamount + extracharges
    //     setSubtotalamount(subtotal)
    //     const totalcgst = cgstValue / 100 * subtotal
    //     const totalsgst = sgstValue / 100 * subtotal
    //     setCgstamount(totalcgst)
    //     setSgstamount(totalsgst)
    //     const totalBill = subtotal + totalcgst + totalsgst;
    //     setPayableamount(totalBill);
    //     // dispatch(SET_EXTRACHARGES_CHARGES({ extracharges: extracharges }))
    //     setAutofocus(!autofocus)
    //     console.log('Rate charges', e, charge, values, extracharges, isNaN(extracharges), subTotalamount, extracharges);
    // }

    const totalextraChargesRate = async (e, charge) => {
        charge.rate = Number(e);
        charge.total = Number(e);

        const extracharges = values.extraCharges.reduce((price, item) => price + Number(item.rate), 0);
        values.totalExtraCharges = extracharges;

        const subtotal = totalAmountofOpd + totalAmountofMedicines + totalAmountoflab + extracharges;
        setSubtotalamount(subtotal);

        const totalcgst = cgstValue / 100 * subtotal;
        const totalsgst = sgstValue / 100 * subtotal;
        setCgstamount(totalcgst);
        setSgstamount(totalsgst);

        const totalBill = subtotal + totalcgst + totalsgst;
        setPayableamount(totalBill);

        // dispatch(SET_EXTRACHARGES_CHARGES({ extracharges: extracharges }))

        setAutofocus(!autofocus);

        console.log(
            'Rate charges',
            e,
            charge,
            values,
            extracharges,
            isNaN(extracharges),
            subTotalamount,
            extracharges
        );
    }

    const removeExtracharges = async (indexToRemove, extraCharge) => {
        // values.extraCharges.splice(index, 1);
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

        const subtotal = totalAmountofOpd + totalAmountofMedicines + totalAmountoflab + extracharges;
        setSubtotalamount(subtotal)
        const totalcgst = cgstValue / 100 * subtotal
        const totalsgst = sgstValue / 100 * subtotal
        setCgstamount(totalcgst)
        setSgstamount(totalsgst)
        const totalBill = subtotal + totalcgst + totalsgst;
        setPayableamount(totalBill);
        // dispatch(SET_EXTRACHARGES_CHARGES({ extracharges: extracharges }))
        setAutofocus(!autofocus)
        console.log('Rate charges', values, extracharges);
    }
    return <>
        {isLoading ? <Loaderspinner /> :
            <>
                <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>

                {state.paymentStatus === "Completed" ?
                    <>
                        <div className='d-flex justify-content-center'>
                            <div style={{ width: '600px', height: 'auto', marginLeft: '50px' }} >
                                <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>INVOICE</h4></div>
                                <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-6'>
                                            <span><h6>OPD Case No : {state.opdCaseNo}</h6></span>
                                            <span><div>Name: {state.pName}</div></span>
                                            <span><div>Age/Sex: {state.page}/{state.pGender}</div></span>
                                            <span><div>Address: {state.pAddress}</div></span>
                                            <span><div>Mobile No: {state.pMobileNo}</div></span>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                            <div>
                                                <span><b>Bill No: {state.invoiceuid}</b></span>
                                                <span><h6>OPD id: {state.opduid}</h6></span>
                                                <span><div>Date: {state.consultingDate} </div></span>
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
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {state.pendingOpd?.map((item, i) => {
                                                    return (<tr key={i}>
                                                        <td>Consulting Charge({item.drName})</td>
                                                        <td>{item.consultingCharges.toFixed(2)}</td>
                                                        <td>{item.consultingCharges.toFixed(2)}</td>
                                                    </tr>)
                                                })}
                                                {state.extraCharges?.map((charge, k) => {
                                                    return <>
                                                        <tr key={k}>
                                                            <td>{charge.chargeName}</td>
                                                            <td>{charge.rate.toFixed(2)}</td>
                                                            <td>{charge.total.toFixed(2)}</td>
                                                        </tr>
                                                    </>
                                                })}
                                                {/* {state.consultingChargesHospital !== undefined ?
                                <tr>
                                    <td>Consulting Charge(Hos.)</td>
                                    <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                    <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                </tr> : null} */}
                                                {state.reportDetails?.map((item, i) => {
                                                    return (<tr key={i}>
                                                        <td>{item.reportName}</td>
                                                        <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                        <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                    </tr>)
                                                })}
                                                {!state.medicineDetails?.length ? null :
                                                    <tr>
                                                        <td colSpan={2}>
                                                            <Table bordered hover>
                                                                <thead>
                                                                    <tr>

                                                                        <th>Medicine</th>
                                                                        <th>Qty * Price</th>
                                                                        <th>Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {state.medicineDetails?.map((item, index) => {
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
                                                        <td>{state.totalAmountofMedicines.toFixed(2)}</td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <td colSpan={2}>Sub Total</td>
                                                    <td>{state.subTotalamount.toFixed(2)}</td>
                                                </tr>
                                                {
                                                    state.cgstValue === 0 ?
                                                        null
                                                        : <tr>
                                                            <td>CGST%</td>
                                                            <td>{state.cgstValue}%</td>
                                                            <td>{state.cgstAmount.toFixed(2)}</td>
                                                        </tr>
                                                }

                                                {
                                                    state.sgstValue === 0 ?
                                                        null
                                                        : <tr>
                                                            <td >SGST%</td>
                                                            <td>{state.sgstValue}%</td>
                                                            <td>{state.sgstAmount.toFixed(2)}</td>
                                                        </tr>
                                                }


                                            </tbody>
                                        </Table>
                                    </div>

                                    <div className='row '>
                                        <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                                            <div>
                                                <span>Payment Type <b>:{state.paymentType}</b></span>
                                                <div><b>Invoice By :{state.userName}</b></div>
                                            </div>
                                        </div>
                                        <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                            <div className='row' style={{ width: '200px', marginRight: '28px' }}>
                                                <div className='col-lg-6 '><div>Total</div>
                                                    <span>Recived</span></div>
                                                <div className='col-lg-6'><div>:{state.payAbleAmount.toFixed(2)}</div>
                                                    <h6>:{state.payAbleAmount.toFixed(2)}</h6></div>
                                            </div>
                                        </div>
                                        <b><hr></hr></b>
                                        {state.advices.length ? <div className='row'>

                                            <span className='row text-center'> <h3>Advice</h3></span>

                                            <div className='row'>
                                                {
                                                    state.advices?.map((advice, i) => {
                                                        return <>
                                                            <span key={i}>{advice}</span>
                                                        </>
                                                    })
                                                }
                                            </div> </div> : null}
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center mt-5'>
                            {/* <PrintButton content={<div >
                                <div style={{ width: '800px' }} >
                                    <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>INVOICE</h4></div>
                                    <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                                <span><div><b>Patient UID :{state.pid}</b></div></span>
                                                <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                                <span><div>Age: {state.page}</div></span>
                                                <span><div>Address: {state.pAddress}</div></span>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                                <div>
                                                    <span><div><b>OPD UID: {state.opduid}</b></div></span>
                                                    <span><div>Date: {state.consultingDate} </div></span>
                                                    <span><div>Consulting Dr.: {state.drName}</div></span>
                                                    <span><div>Mobile No: {state.pMobileNo}</div></span>

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
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Consulting Charge(Dr.)</td>
                                                        <td>{state.consultingCharge.toFixed(2)}</td>
                                                        <td>{state.consultingCharge.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Consulting Charge(Hos.)</td>
                                                        <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                                        <td>{state.consultingChargesHospital.toFixed(2)}</td>
                                                    </tr>
                                                    {state.reportDetails?.map((item, i) => {
                                                        return (<tr key={i}>
                                                            <td>{item.reportName}</td>
                                                            <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                            <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                        </tr>)
                                                    })}
                                                    {!state.medicineDetails.length ? null :
                                                        <tr>
                                                            <td colSpan={2}>
                                                                <Table bordered hover>
                                                                    <thead>
                                                                        <tr>

                                                                            <th>Medicine</th>
                                                                            <th>Qty * Price</th>
                                                                            <th>Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {state.medicineDetails?.map((item, index) => {
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
                                                            <td>{state.totalAmountofMedicines.toFixed(2)}</td>
                                                        </tr>
                                                    }
                                                    <tr>
                                                        <td colSpan={2}>Sub Total</td>
                                                        <td>{state.subTotalamount.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>CGST%</td>
                                                        <td>{state.cgstValue}%</td>
                                                        <td>{state.cgstAmount.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td >SGST%</td>
                                                        <td>{state.sgstValue}%</td>
                                                        <td>{state.sgstAmount.toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>

                                        <div className='row'>
                                            <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                                                <div>
                                                    <span>Payment Type <b>:{state.paymentType}</b></span>
                                                    <div><b>Enter By :{userName}</b></div>
                                                </div>


                                            </div>
                                            <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                                <div className='row' style={{ width: '200px', marginRight: '70px' }}>
                                                    <div className='col-lg-6 '><div>Total</div>
                                                        <span>Recived</span></div>
                                                    <div className='col-lg-6'><div>:{state.payAbleAmount.toFixed(2)}</div>
                                                        <h6>:{state.payAbleAmount.toFixed(2)}</h6></div>
                                                </div>

                                            </div>
                                            <b><hr></hr></b>
                                            {state.advices ? <div className='row'>

                                                <span className='row text-center'> <h3>Advice</h3></span>

                                                <div className='row'>
                                                    {
                                                        state.advices?.map((advice, i) => {
                                                            return <>
                                                                <span key={i}>{advice}</span>
                                                            </>
                                                        })
                                                    }
                                                </div> </div> : null}

                                        </div>
                                    </div>

                                </div>
                            </div>} /> */}
                            <button className='btn btn-primary mx-2' onClick={() => printInvoice(state)}>Print</button>

                        </div>
                    </> :
                    <>
                        <div className='d-flex justify-content-center'>
                            <div style={{ width: '800px', height: 'auto', marginLeft: '50px' }} >
                                <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>INVOICE</h4></div>
                                <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-6'>
                                            <span><h6>OPD Case No : {state.opdCaseNo}</h6></span>
                                            <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                            <span><div>Age: {state.page}</div></span>
                                            <span><div>Address: {state.pAddress}</div></span>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                            <div>
                                                <span><input type='number' className='form-control' placeholder={`Enter bill No*`} required onChange={(e) => setInvoiceuid(e.target.value)} /></span>
                                                <span><h6>OPD id: {state.opduid}</h6></span>
                                                <span><div>Date: {state.consultingDate} </div></span>
                                                <span><div>Consulting Dr.: {state.drName}</div></span>
                                                <span><div>Mobile No: {state.pMobileNo}</div></span>
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
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingOpd?.map((item, i) => {
                                                    return (<tr key={i}>
                                                        <td>Consulting Charge({item.drName})</td>
                                                        <td>{item.consultingCharges.toFixed(2)}</td>
                                                        <td>{item.consultingCharges.toFixed(2)}</td>
                                                    </tr>)
                                                })}
                                                {/* <tr>
                                                    <td>Consulting Charge(Dr.)</td>
                                                    <td>{state.consultingCharge.toFixed(2)}</td>
                                                    <td>{state.consultingCharge.toFixed(2)}</td>
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
                                                                        {/* <td>
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
                                                                        </td> */}
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
                                                                            <button type="button" className='btn btn-success' disabled={values.extraCharges && values.extraCharges.some(charge => !charge.chargeName || !charge.rate)} onClick={() => push({ chargeName: '', rate: '' })}>
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
                                                    <td>Consulting Charge(Hos.)</td>
                                                    <td ><input type='number' style={{ width: '150px' }} placeholder='Enter Hospital charges' onChange={(e) => hospitacharges(Number(e.target.value))} defaultValue={consultingChargesHospital} /></td>
                                                    <td>{consultingChargesHospital.toFixed(2)}</td>
                                                </tr> */}
                                                {labReports?.map((item, i) => {
                                                    return (<tr key={i}>
                                                        <td>{item.reportName}</td>
                                                        <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                        <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                    </tr>)
                                                })}
                                                {!medicineDetails.length ? null :
                                                    <tr>
                                                        <td colSpan={2}>
                                                            <Table bordered hover>
                                                                <thead>
                                                                    <tr>

                                                                        <th>Medicine</th>
                                                                        <th>Qty * Price</th>
                                                                        <th>Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {medicineDetails?.map((item, index) => {
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
                                                        <td>{totalAmountofMedicines.toFixed(2)}</td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <td colSpan={2}>Sub Total</td>
                                                    <td>{subTotalamount.toFixed(2)}</td>
                                                </tr>
                                                {
                                                    cgstValue === 0 ?
                                                        null
                                                        : <tr>
                                                            <td>CGST%</td>
                                                            <td>{cgstValue}%</td>
                                                            <td>{cgstAmount.toFixed(2)}</td>
                                                        </tr>
                                                }

                                                {
                                                    sgstValue === 0 ?
                                                        null
                                                        : <tr>
                                                            <td >SGST%</td>
                                                            <td>{sgstValue}%</td>
                                                            <td>{sgstAmount.toFixed(2)}</td>
                                                        </tr>
                                                }


                                            </tbody>
                                        </Table>
                                    </div>

                                    <div className='row '>
                                        <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                                            <div className="form-group" >
                                                <label >Payment Type:</label>
                                                <select className="form-control" name='paymentType' defaultValue={paymentType} onChange={(e) => [setPaymentType(e.target.value), console.log('payment Type', e.target.value)]}>
                                                    <option >Select Payment Type</option>
                                                    <option value='Cash'>Cash</option>
                                                    <option value='Card' >Card</option>
                                                    <option value='Online' >Online</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                            <div className='row' style={{ width: '200px', marginRight: '28px' }}>
                                                <div className='col-lg-6 '><div>Total</div>
                                                    <span>Recived</span></div>
                                                <div className='col-lg-6'><div>:{payAbleAmount.toFixed(2)}</div>
                                                    <h6>:{payAbleAmount.toFixed(2)}</h6></div>
                                            </div>
                                        </div>
                                        {/* <div className="form-check" style={{ marginTop: '20px' }}>
                                            <label className="form-check-label">
                                                <input type="checkbox" className="form-check-input" name='paid' checked={paid} onChange={(e) => setPaid(e.target.checked)} />If You Want to Paid the bill Please check the check box and cilck on Paid
                                            </label>
                                        </div> */}
                                        <b><hr></hr></b>
                                        <div className='row'>
                                            <div className='col-lg-6'>
                                                {state.advices.length ? <div className='row'>
                                                    <span className='row '> <h5>Advice :-</h5></span>
                                                    <div className='row'>
                                                        {
                                                            state.advices?.map((advice, i) => {
                                                                return <>
                                                                    <span key={i}>{advice}</span>
                                                                </>
                                                            })
                                                        }
                                                    </div> </div> : null}
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
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

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center mt-5'>
                            {/* <PrintButton content={<div >
                                <div style={{ width: '800px' }}>
                                    <div className='row text-center' style={{ backgroundColor: 'gainsboro', borderRadius: '8px', marginLeft: '1px', marginRight: '1px' }}><h4>INVOICE</h4></div>
                                    <div className='card' style={{ border: "2px solid black", padding: '20px' }}>
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                                <span><div><b>Patient UID :{state.pid}</b></div></span>
                                                <span><div>Name: {state.pName} ({state.pGender})</div></span>
                                                <span><div>Age: {state.page}</div></span>
                                                <span><div>Address: {state.pAddress}</div></span>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                                <div>
                                                    <span><div><b>OPD UID: {state.opduid}</b></div></span>
                                                    <span><div>Date: {state.consultingDate} </div></span>
                                                    <span><div>Consulting Dr.: {state.drName}</div></span>
                                                    <span><div>Mobile No: {state.pMobileNo}</div></span>

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
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Consulting Charge(Dr.)</td>
                                                        <td>{state.consultingCharge.toFixed(2)}</td>
                                                        <td>{state.consultingCharge.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Consulting Charge(Hos.)</td>
                                                        <td>{consultingChargesHospital.toFixed(2)}</td>
                                                        <td>{consultingChargesHospital.toFixed(2)}</td>
                                                    </tr>
                                                    {labReports?.map((item, i) => {
                                                        return (<tr key={i}>
                                                            <td>{item.reportName}</td>
                                                            <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                            <td>{Number(item.reportPrice).toFixed(2)}</td>
                                                        </tr>)
                                                    })}
                                                    {!medicineDetails.length ? null :
                                                        <tr>
                                                            <td colSpan={2}>
                                                                <Table bordered hover>
                                                                    <thead>
                                                                        <tr>

                                                                            <th>Medicine</th>
                                                                            <th>Qty * Price</th>
                                                                            <th>Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {medicineDetails?.map((item, index) => {
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
                                                            <td>{totalAmountofMedicines.toFixed(2)}</td>
                                                        </tr>
                                                    }
                                                    <tr>
                                                        <td colSpan={2}>Sub Total</td>
                                                        <td>{subTotalamount.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>CGST%</td>
                                                        <td>{cgstValue}%</td>
                                                        <td>{cgstAmount.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td >SGST%</td>
                                                        <td>{sgstValue}%</td>
                                                        <td>{sgstAmount.toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>

                                        <div className='row'>
                                            <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-start'>
                                                <div>
                                                    <span>Payment Type <b>:{paymentType}</b></span>
                                                    <div><b>Enter By :{userName}</b></div>
                                                </div>


                                            </div>
                                            <div className=' col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                                                <div className='row' style={{ width: '200px', marginRight: '70px' }}>
                                                    <div className='col-lg-6 '><div>Total</div>
                                                        <span>Recived</span></div>
                                                    <div className='col-lg-6'><div>:{payAbleAmount.toFixed(2)}</div>
                                                        <h6>:{payAbleAmount.toFixed(2)}</h6></div>
                                                </div>

                                            </div>
                                            <b><hr></hr></b>
                                            {state.advices ? <div className='row'>

                                                <span className='row '> <h5>Advice :-</h5></span>

                                                <div className='row'>
                                                    {
                                                        state.advices?.map((advice, i) => {
                                                            return <>
                                                                <span key={i}>{advice}</span>
                                                            </>
                                                        })
                                                    }
                                                </div> </div> : null}
                                        </div>
                                    </div>

                                </div>
                            </div>} /> */}
                            <button className='btn btn-primary mx-2' onClick={() => printInvoice()}>Print</button>

                            <button className='btn btn-primary ' disabled={paymentStatus !== "Completed" || !invoiceuid || values.extraCharges && values.extraCharges.some(charge => !charge.chargeName || !charge.rate)} onClick={saveInvoice}>Paid</button>

                        </div>
                    </>
                }
            </>
        }
    </>
}

export default opdInvoice;