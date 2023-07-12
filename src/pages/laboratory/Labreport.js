/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import React from 'react'
import { useEffect } from 'react'
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import CommanTable from 'src/comman/table/CommanTable'
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import Table from 'react-bootstrap/Table';
import { taxSchema } from 'src/schema'
import { BiPlus } from 'react-icons/bi'
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { selectAllPatients } from 'src/redux/slice/patientMasterslice'
import { useDispatch, useSelector } from 'react-redux'
import { ImCross } from 'react-icons/im'
import { selectAllparameters } from 'src/redux/slice/laborataryMaster'
import Select from 'react-select';
import { ADD_LABORATORY_REPORT, DELETE_LABORATORY_REPORT, EDIT_LABORATORY_REPORT, selectAlllaboratoryReports } from 'src/redux/slice/patientsLaboratoryReportsSlice'
import { toast } from 'react-toastify';
import { selectAllDr } from 'src/redux/slice/doctorsSlice'
import { confirmAlert } from 'react-confirm-alert';
import { AiFillPrinter } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import Loaderspinner from 'src/comman/spinner/Loaderspinner'
import SearchAutocomplete from 'src/comman/searchAutocomplete/SearchAutocomplete'
import PrintButton from 'src/comman/printpageComponents/PrintButton'
import { ddMMyyyy, yyyyMMdd } from 'src/services/dateFormate'
import { selectUserId } from 'src/redux/slice/authSlice'
import { TfiReload } from 'react-icons/tfi'

const PrintComponent = ({ data }) => {
    const state = data.data1
    return (
        <div style={{ width: '800px', marginRight: '50px', height: 'auto' }} >
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6'>
                    <span><div><b>Patient id</b> : {state.pid}</div></span>
                    <span><div><b>Age/sex </b>: {state.page}Years / {state.pGender}</div></span>
                    <span><div><b>Date </b>: {state.date}</div> </span>
                    <span><div><b>Refered Dr. </b>: {state.drName}</div></span>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end'>
                    <div>
                        <span><div><b>Name </b>: {state.pName}</div> </span>
                        <span><div><b>Mobile No </b>: {state.pMobileNo}</div></span>
                        <span><div><b>Report id </b>: {state.labreportuid}</div> </span>
                        <span>
                            {state.reportMakeby.split('\n').map((item, key) => {
                                return <span key={key}> <b>{item}</b><br /></span>
                            })}
                        </span>
                    </div>

                </div>
            </div>
            <b><hr></hr></b>
            <div className='row text-center'> <h5>{state.reportName}</h5></div>
            <b><hr></hr></b>

            <div className='row text-center'>
                <Table >
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Result</th>
                            {state.isunitRequired ?
                                <th>Unit</th> : null
                            }
                            <th>Normal Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            state.pathalogyResults?.map((pathalogy, i) => {
                                return <>
                                    <tr key={i} style={{ border: 'white' }}>
                                        <td>{pathalogy.parameter}</td>
                                        <td>{pathalogy.result}</td>
                                        {pathalogy.unit ?
                                            <td>{pathalogy.unit}</td> : null
                                        }
                                        <td>{pathalogy.normalRange}</td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </Table>
            </div>

            <div className='row'>
                <span style={{ marginLeft: '50px' }}>
                    <b>Remark:-</b>
                    {state.remark.split('\n').map((item, key) => {
                        return <span key={key}> <b>{item}</b><br /></span>
                    })}
                </span>

            </div>
            <div className='exam '>
                <div className='row' style={{ paddingTop: '50px', marginLeft: '50px' }} >
                    <div className='col-lg-6'> <b>EXAMINED:-</b></div>
                    <div className='col-lg-6 justify-content-end'><b>{state.examinedBy}</b></div>
                </div>
            </div>
        </div>
    )
};
const initalValues = {
    pid: '',
    pName: '',
    page: '',
    pGender: '',
    pAddress: '',
    pMobileNo: '',
    labreportuid: '',
    drName: '',
    date: '',
    reportName: '',
    remark: '',
    isunitRequired: false,
    reportMakeby: '',
    examinedBy: '',
    reportPrice: '',
    paymentStatus: 'Pending',
    hospitaluid: '',
    pathalogyResults: [
        {
            parameter: '',
            result: '',
            normalRange: '',
        },
    ]
}
const Labreport = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const allDoctors = useSelector(selectAllDr)
    const allPatients = useSelector(selectAllPatients)
    const allReportType = useSelector(selectAllparameters)
    const allPatientsLaboratoryReports = useSelector(selectAlllaboratoryReports)
    const [parameters, setParameters] = useState([])
    const [show, setShow] = useState(false);
    const [allpatientsLabReports, setAllpatientsLabReports] = useState([]);
    const [allpatientsLabReportsfilter, setAllpatientsLabReportsfilter] = useState([]);
    const [autofocus, setAutofocus] = useState(false)
    const [update, setUpdate] = useState(false)
    const [isunitRequired, setIsunitRequired] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [printContent, setPrintContent] = useState(null);
    const hospitaluid = useSelector(selectUserId)

    const columns = [
        { name: 'Patient Id', selector: row => row.pid, sortable: true },
        { name: 'Report Id', selector: row => row.labreportuid, sortable: true },
        { name: 'Date', selector: row => row.date, sortable: true },
        { name: 'Name', selector: row => row.pName, sortable: true },
        { name: 'Report Name', selector: row => row.reportName, sortable: true },
        {
            name: 'Action', cell: row => <span><button onClick={() => editLoboratoryreport(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                <button onClick={() => deleteLaboratoryreport(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
                < button onClick={() => generateInvoice(row)} style={{ color: 'skyblue', border: 'none' }} > <AiFillPrinter size={25} /></button >

            </span>
        }
    ]
    useEffect(() => {
        setAllpatientsLabReports([...allPatientsLaboratoryReports].reverse())
        setAllpatientsLabReportsfilter(allPatientsLaboratoryReports)
        setIsLoading(false)

    }, [allPatientsLaboratoryReports])

    const handleClose = () => {
        formik.resetForm();
        setShow(false);
        setUpdate(false);
        clearForm()
        setIsunitRequired(false)
    }

    const handleShow = () => {
        setShow(true);
        formik.setFieldValue('date', new Date().toISOString().substr(0, 10));
    }

    const formik = useFormik({
        initialValues: initalValues,
        // validationSchema: taxSchema,
        onSubmit: async (Values, action) => {
            console.log('report values', Values);
            let report1 = [...allpatientsLabReportsfilter]
            values.date = values.date ? ddMMyyyy(values.date) : values.date
            if (!update) {
                values.labreportuid = Math.floor(2267 + Math.random() * 7395);
                let report = [...allpatientsLabReportsfilter, Values]
                try {
                    // await addSingltObject('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', values)
                    await addDatainsubcollection('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', values)

                    // await setData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', report)
                    dispatch(ADD_LABORATORY_REPORT(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    toast.success("Added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {
                let findindex = report1.findIndex((item) => item.labreportuid === Values.labreportuid)
                report1[findindex] = Values;
                try {
                    // await updateSingltObject('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', Values, 'labreportuid', 'hospitaluid')
                    await updateDatainSubcollection('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', Values, 'labreportuid', 'hospitaluid')

                    // await setData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', report1)
                    dispatch(EDIT_LABORATORY_REPORT(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Updated Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            }
        }
    });
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
            pid: '',
            pName: '',
            page: '',
            pGender: '',
            pAddress: '',
            pMobileNo: '',
            labreportuid: '',
            drName: '',
            date: '',
            reportName: '',
            reportMakeby: '',
            examinedBy: '',
            remark: '',
            isunitRequired: false,
            reportPrice: '',
            paymentStatus: 'Pending',
            hospitaluid: '',
            pathalogyResults: [
                {
                    parameter: '',
                    result: '',
                    normalRange: '',
                },
            ]

        });
        setIsunitRequired(false)
    };
    const editLoboratoryreport = (item) => {
        // filDatainsubcollection(allPatientsLaboratoryReports, 'PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports')
        values.pid = item.pid;
        values.pName = item.pName;
        values.pGender = item.pGender;
        values.page = item.page;
        values.pAddress = item.pAddress;
        values.pMobileNo = item.pMobileNo;
        values.labreportuid = item.labreportuid;
        values.date = item.date ? yyyyMMdd(item.date) : item.date;
        values.drName = item.drName;
        values.reportName = item.reportName;
        values.remark = item.remark;
        values.reportMakeby = item.reportMakeby;
        values.examinedBy = item.examinedBy;
        values.reportPrice = item.reportPrice;
        values.paymentStatus = item.paymentStatus;
        values.pathalogyResults = item.pathalogyResults;
        values.isunitRequired = item.isunitRequired;
        values.hospitaluid = item.hospitaluid;
        setIsunitRequired(item.isunitRequired)
        setShow(true)
        setUpdate(true)

    }
    const deleteLaboratoryreport = (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let report = allpatientsLabReportsfilter.filter((item) => item.labreportuid !== item1.labreportuid)
                        try {
                            // await deleteSingltObject('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', item1, 'labreportuid', 'hospitaluid')
                            await deleteDatainSubcollection('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', item1, 'labreportuid', 'hospitaluid')
                            // await setData('PatientslaboratoryReports', 'QmwQr1wDcFK6K04hKMYc', 'labReports', report)
                            dispatch(DELETE_LABORATORY_REPORT(item1))
                            toast.success("Deleted Successfully.......");
                        } catch (error) {
                            toast.error(error.message)
                            console.error(error.message);
                        }
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    const generateInvoice = (item) => {
        setPrintContent(<PrintComponent data={{
            data1: {
                ...item,
            }
        }} />)
        // navigate('/laboratory/labreport/labreportprint', { state: item })
    }

    const handleOnSelect = (item) => {
        // values.pid = item.pid;
        // values.pName = item.pName;
        // values.pMobileNo = item.pMobileNo;
        // values.pGender = item.pGender;
        // values.page = item.page;
        // values.pAddress = item.pAddress;

        // setAutofocus(!autofocus)
        formik.setFieldValue('pid', item.pid);
        formik.setFieldValue('pName', item.pName);
        formik.setFieldValue('pMobileNo', item.pMobileNo);
        formik.setFieldValue('pGender', item.pGender);
        formik.setFieldValue('page', item.page);
        formik.setFieldValue('pAddress', item.pAddress);
        formik.setFieldValue('hospitaluid', item.hospitaluid);

    };
    const handleOnSelectMobile = (item) => {
        values.pid = item.pid;
        values.pName = item.pName;
        values.pMobileNo = item.pMobileNo;
        values.pGender = item.pGender;
        values.page = item.page;
        values.pAddress = item.pAddress;

        setAutofocus(!autofocus)
    };
    const handleOnSelectName = (item) => {
        values.pid = item.pid;
        values.pName = item.pName;
        values.pMobileNo = item.pMobileNo;
        values.pGender = item.pGender;
        values.page = item.page;
        values.pAddress = item.pAddress;

        setAutofocus(!autofocus)
    };
    const handleOnClear = () => {
        clearForm()
    }
    const selectReportType = (item) => {
        values.reportName = item.reportName;
        values.reportPrice = item.reportPrice;
        setParameters(item.parameters)
        if (item.unit) {
            values.isunitRequired = item.isUnitRequired
            setIsunitRequired(item.isUnitRequired)
            values.pathalogyResults = [{
                parameter: '',
                result: '',
                normalRange: '',
                unit: '',
            }]
        } else {
            values.isunitRequired = item.isUnitRequired
            setIsunitRequired(item.isUnitRequired)
            values.pathalogyResults = [{
                parameter: '',
                result: '',
                normalRange: '',
            }]
        }
    }
    const selectparameterType = (item, pathalogy) => {
        if (isunitRequired) {
            pathalogy.parameter = item.parameterName;
            pathalogy.normalRange = item.normalRange;
            pathalogy.unit = item.unit;
        } else {
            pathalogy.parameter = item.parameterName;
            pathalogy.normalRange = item.normalRange;
        }
        setAutofocus(!autofocus)
    }
    const selectDoctor = (item) => {
        values.drName = item.drName;
    }

    return (
        <>
            {isLoading ? <Loaderspinner /> :
                <>
                    <div style={{ display: 'none' }}>  {printContent && <PrintButton content={printContent} />}</div>

                    <CommanTable
                        title={"Laboratory Reports"}
                        columns={columns}
                        data={allpatientsLabReports}
                        action={<button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button>}
                    />
                </>

            }

            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormikProvider value={formik}>
                        <form >

                            <div className='row'>

                                <div className='col-lg-3'>
                                    {
                                        update ? <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                            <input type="text" className="form-control" placeholder="Enter patient id" name='pid' readOnly value={values.pid} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}
                                        </div> :
                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label>Patient id<b style={{ color: 'red' }}>*</b>:</label>
                                                <SearchAutocomplete
                                                    allPatients={allPatients}
                                                    handleOnSelect={handleOnSelect}
                                                    inputsearch={values.pid}
                                                    placeholder={'Enter Patients id'}
                                                    handleClear={handleOnClear}
                                                    keyforSearch={"pid"}
                                                    style={{
                                                        height: '36px',
                                                        display: 'block',
                                                        width: '100%',
                                                        borderRadius: "0.375rem",
                                                        backgroundColor: "#fff",
                                                        boxShadow: "none",
                                                        padding: '0.375rem 0.75rem',
                                                        backgroundClip: 'padding-box',
                                                        hoverBackgroundColor: "lightgray",
                                                        color: '#212529',
                                                        fontSize: '1rem',
                                                        lineHeight: '1.5',
                                                        fontFamily: "inherit",
                                                        iconColor: "#212529",
                                                        fontWeight: "400",
                                                        lineColor: "lightgray",
                                                        placeholderColor: "#212529",
                                                        clearIconMargin: "3px 8px 0 0",
                                                        appearance: 'none',
                                                        zIndex: 2,
                                                        transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                                    }} />
                                                {errors.pid && touched.pid ? (<p style={{ color: 'red' }}>*{errors.pid}</p>) : null}

                                            </div>
                                    }
                                </div>
                                <div className='col-lg-3'>
                                    {update || values.pMobileNo ?
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label>Mobile No<b style={{ color: 'red' }}>*</b>:</label>
                                            <input type="text" className="form-control" placeholder="Enter patient Mobile No" name='pMobileNo' readOnly value={values.pMobileNo} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}
                                        </div> :
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label>Mobile No<b style={{ color: 'red' }}>*</b>: </label>
                                            <SearchAutocomplete
                                                allPatients={allPatients}
                                                handleOnSelect={handleOnSelect}
                                                inputsearch={values.pMobileNo}
                                                placeholder={'Enter Mobile No'}
                                                handleClear={handleOnClear}
                                                keyforSearch={"pMobileNo"}
                                                style={{
                                                    height: '36px',
                                                    display: 'block',
                                                    width: '100%',
                                                    borderRadius: "0.375rem",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "none",
                                                    padding: '0.375rem 0.75rem',
                                                    backgroundClip: 'padding-box',
                                                    hoverBackgroundColor: "lightgray",
                                                    color: '#212529',
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5',
                                                    fontFamily: "inherit",
                                                    iconColor: "#212529",
                                                    fontWeight: "400",
                                                    lineColor: "lightgray",
                                                    placeholderColor: "#212529",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    appearance: 'none',
                                                    zIndex: 2,
                                                    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                                }} />
                                            {/* <ReactSearchAutocomplete
                                                items={allPatients}
                                                fuseOptions={{ keys: ["pMobileNo"] }}
                                                resultStringKeyName="pMobileNo"
                                                onSelect={handleOnSelectMobile}
                                                inputSearchString={values.pMobileNo}
                                                inputDebounce={values.pMobileNo}
                                                placeholder='Enter Mobile No'
                                                showIcon={false}
                                                onClear={handleOnClear}
                                                showClear
                                                styling={{
                                                    height: "34px",
                                                    borderRadius: "4px",
                                                    backgroundColor: "white",
                                                    boxShadow: "none",
                                                    hoverBackgroundColor: "lightgray",
                                                    color: "black",
                                                    fontSize: "18px",
                                                    fontFamily: "Courier",
                                                    iconColor: "black",
                                                    lineColor: "lightgray",
                                                    placeholderColor: "black",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    zIndex: 2
                                                }}

                                            /> */}
                                            {errors.pMobileNo && touched.pMobileNo ? (<p style={{ color: 'red' }}>*{errors.pMobileNo}</p>) : null}

                                        </div>
                                    }
                                </div>
                                <div className='col-lg-3'>
                                    {update || values.pName ?
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label >Patient Name<b style={{ color: 'red' }}>*</b>:</label>
                                            <input name='pName'
                                                placeholder="Enter Patient Name"
                                                type="text" className="form-control" onChange={handleChange} defaultValue={values.pName} readOnly />
                                            {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                        </div>
                                        :
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label >Patient Name<b style={{ color: 'red' }}>*</b>:</label>
                                            <SearchAutocomplete
                                                allPatients={allPatients}
                                                handleOnSelect={handleOnSelect}
                                                inputsearch={values.pName}
                                                placeholder={'Enter Patient Name'}
                                                handleClear={handleOnClear}
                                                keyforSearch={"pName"}
                                                style={{
                                                    height: '36px',
                                                    display: 'block',
                                                    width: '100%',
                                                    borderRadius: "0.375rem",
                                                    backgroundColor: "#fff",
                                                    boxShadow: "none",
                                                    padding: '0.375rem 0.75rem',
                                                    backgroundClip: 'padding-box',
                                                    hoverBackgroundColor: "lightgray",
                                                    color: '#212529',
                                                    fontSize: '1rem',
                                                    lineHeight: '1.5',
                                                    fontFamily: "inherit",
                                                    iconColor: "#212529",
                                                    fontWeight: "400",
                                                    lineColor: "lightgray",
                                                    placeholderColor: "#212529",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    appearance: 'none',
                                                    zIndex: 1,
                                                    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                                }} />
                                            {errors.pName && touched.pName ? (<p style={{ color: 'red' }}>*{errors.pName}</p>) : null}

                                        </div>
                                    }
                                </div>
                                <div className='col-lg-3'>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Patient Age<b style={{ color: 'red' }}>*</b>:</label>
                                        <input name='page'
                                            placeholder="Enter Patient Age"
                                            type="number" className="form-control" onChange={handleChange} defaultValue={values.page} readOnly />
                                        {errors.page && touched.page ? (<p style={{ color: 'red' }}>*{errors.page}</p>) : null}

                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-lg-3'>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Date<b style={{ color: 'red' }}>*</b>:</label>
                                        <input name='date'
                                            placeholder="Enter Date"
                                            type="date" className="form-control" onChange={handleChange} defaultValue={values.date} />
                                        {errors.date && touched.date ? (<p style={{ color: 'red' }}>*{errors.date}</p>) : null}
                                    </div>
                                </div>
                                <div className='col-lg-3'>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                        <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='drName' value={values.drName} onChange={handleChange}>
                                            <option >Select Doctor</option>
                                            {allDoctors?.map((option) => (
                                                <option key={option.druid} value={option.drName}>
                                                    {option.drName}
                                                </option>
                                            ))}

                                        </select>
                                        {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}
                                    </div>
                                    {/* <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Dr Name<b style={{ color: 'red' }}>*</b>:</label>
                                        {update ?
                                            <input name='drName'
                                                placeholder="Enter Dr Name"
                                                type="text" className="form-control" onChange={handleChange} defaultValue={values.drName} readOnly /> :
                                            <Select options={allDoctors} getOptionValue={(option) => option.drName}
                                                getOptionLabel={(option) => option.drName}
                                                placeholder="Select Doctor"
                                                onChange={(e) => { selectDoctor(e) }} />}

                                        {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null}


                                    </div> */}
                                </div>
                                <div className='col-lg-3'>

                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Select Report Type<b style={{ color: 'red' }}>*</b>:</label>
                                        {update ?
                                            <input name='reportName'
                                                placeholder="Enter Report Name"
                                                type="text" className="form-control" onChange={handleChange} defaultValue={values.reportName} readOnly />
                                            :
                                            <Select options={allReportType} getOptionValue={(option) => option.reportName}
                                                getOptionLabel={(option) => option.reportName}
                                                placeholder="Select Report Type"
                                                onChange={(e) => { selectReportType(e) }} />}
                                        {/* <select className="form-control" style={{ height: '40px', fontSize: '18px' }} name='dischargeType' defaultValue={values.dischargeType} onChange={handleChange}>
                                            <option >Select Report Type</option>
                                            <option value='ROUTINE HEMATOLOGY REPORT'>ROUTINE HEMATOLOGY REPORT</option>
                                            <option value='ROUTINE URINE EXAMINATION REPORT' >ROUTINE URINE EXAMINATION REPORT</option>
                                            <option value='REPORT OF RANDOM BLOOD SUGER (RBS)' >REPORT OF RANDOM BLOOD SUGER (RBS)</option>
                                            <option value='REPORT OF GLYCOSYLATED HEMOGLOBIN (HbA1C)' >REPORT OF GLYCOSYLATED HEMOGLOBIN (HbA1C)</option>
                                            <option value='PROTHOMBIN TIME' >PROTHOMBIN TIME</option>
                                            <option value='BIOCHEMISTRY' >BIOCHEMISTRY</option>
                                        </select> */}

                                    </div>
                                </div>

                                <div className='col-lg-3'>

                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Report Make by<b style={{ color: 'red' }}>*</b>:</label>
                                        <textarea className="form-control" rows="1" id="reportMakeby" name='reportMakeby' defaultValue={values.reportMakeby} onChange={handleChange}></textarea>


                                    </div>
                                </div>
                            </div>
                            {
                                !isunitRequired ?
                                    <FieldArray name="pathalogyResults">
                                        {({ insert, remove, push }) => (
                                            <div>
                                                {values.pathalogyResults?.length > 0 &&
                                                    values.pathalogyResults.map((pathalogy, index) => (
                                                        <div className="card" key={index} style={{ padding: ' 0 10px 10px 10px', marginTop: '20px' }}>
                                                            <div className='d-flex justify-content-end'>
                                                                <span onClick={() => remove(index)}><ImCross /></span>

                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-lg-4'>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`pathalogyResults.${index}.parameter`}>Parameter</label>
                                                                        {update ?
                                                                            <input name={`pathalogyResults.${index}.parameter`}
                                                                                placeholder="Enter Parameter"
                                                                                type="text" className="form-control" defaultValue={pathalogy.parameter} onChange={handleChange} required />
                                                                            : <Select options={parameters} getOptionValue={(option) => option.parameterName}
                                                                                getOptionLabel={(option) => option.parameterName}
                                                                                placeholder="Select Parameter"
                                                                                onChange={(e) => { selectparameterType(e, pathalogy) }} />}
                                                                        {/* {errors.pathalogyResults && errors.pathalogyResults[index] && errors.pathalogyResults[index].medname && touched.pathalogyResults && touched.pathalogyResults[index] && touched.pathalogyResults[index].medname ? (
                                                                <p style={{ color: 'red' }}>*{errors.pathalogyResults[index].medname}</p>) : null} */}

                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-4'>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`pathalogyResults.${index}.result`}>Result</label>
                                                                        <input name={`pathalogyResults.${index}.result`}
                                                                            placeholder="Enter Result"
                                                                            type="text" className="form-control" defaultValue={pathalogy.result} onChange={handleChange} required />
                                                                        {/* {errors.pathalogyResults && errors.pathalogyResults[index] && errors.pathalogyResults[index].result && touched.pathalogyResults && touched.pathalogyResults[index] && touched.pathalogyResults[index].result ? (
                                                                <p style={{ color: 'red' }}>*{errors.pathalogyResults[index].result}</p>) : null} */}
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-4'>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`pathalogyResults.${index}.normalRange`}>Normal Range</label>
                                                                        <input name={`pathalogyResults.${index}.normalRange`}
                                                                            placeholder="Enter Normal Range"
                                                                            type="text" className="form-control" defaultValue={pathalogy.normalRange} onChange={handleChange} required />
                                                                        {/* {errors.pathalogyResults && errors.pathalogyResults[index] && errors.pathalogyResults[index].normalRange && touched.pathalogyResults && touched.pathalogyResults[index] && touched.pathalogyResults[index].normalRange ? (
                                                                <p style={{ color: 'red' }}>*{errors.pathalogyResults[index].normalRange}</p>) : null} */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                                    <button
                                                        type="button"
                                                        className='btn btn-success'
                                                        onClick={() => push({ parameter: '', result: '', normalRange: '' })}
                                                    >
                                                        <BiPlus size={25} />  Add Report
                                                    </button>
                                                </div>


                                            </div>
                                        )}
                                    </FieldArray> :
                                    <FieldArray name="pathalogyResults">
                                        {({ insert, remove, push }) => (
                                            <div>
                                                {values.pathalogyResults?.length > 0 &&
                                                    values.pathalogyResults.map((pathalogy, index) => (
                                                        <div className="card" key={index} style={{ padding: ' 0 10px 10px 10px', marginTop: '20px' }}>
                                                            <div className='d-flex justify-content-end'>
                                                                <span onClick={() => remove(index)}><ImCross /></span>

                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-lg-3'>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`pathalogyResults.${index}.parameter`}>Parameter</label>
                                                                        {update ?
                                                                            <input name={`pathalogyResults.${index}.parameter`}
                                                                                placeholder="Enter Parameter"
                                                                                type="text" className="form-control" defaultValue={pathalogy.parameter} onChange={handleChange} required />
                                                                            : <Select options={parameters} getOptionValue={(option) => option.parameterName}
                                                                                getOptionLabel={(option) => option.parameterName}
                                                                                placeholder="Select Parameter"
                                                                                onChange={(e) => { selectparameterType(e, pathalogy) }} />}
                                                                        {/* {errors.pathalogyResults && errors.pathalogyResults[index] && errors.pathalogyResults[index].medname && touched.pathalogyResults && touched.pathalogyResults[index] && touched.pathalogyResults[index].medname ? (
                                                                <p style={{ color: 'red' }}>*{errors.pathalogyResults[index].medname}</p>) : null} */}

                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-3'>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`pathalogyResults.${index}.result`}>Result</label>
                                                                        <input name={`pathalogyResults.${index}.result`}
                                                                            placeholder="Enter Result"
                                                                            type="text" className="form-control" defaultValue={pathalogy.result} onChange={handleChange} required />
                                                                        {/* {errors.pathalogyResults && errors.pathalogyResults[index] && errors.pathalogyResults[index].result && touched.pathalogyResults && touched.pathalogyResults[index] && touched.pathalogyResults[index].result ? (
                                                                <p style={{ color: 'red' }}>*{errors.pathalogyResults[index].result}</p>) : null} */}
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-3'>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`pathalogyResults.${index}.unit`}>Unit</label>
                                                                        <input name={`pathalogyResults.${index}.unit`}
                                                                            placeholder="Enter Unit"
                                                                            type="text" className="form-control" defaultValue={pathalogy.unit} onChange={handleChange} required />
                                                                        {/* {errors.pathalogyResults && errors.pathalogyResults[index] && errors.pathalogyResults[index].unit && touched.pathalogyResults && touched.pathalogyResults[index] && touched.pathalogyResults[index].unit ? (
                                                                <p style={{ color: 'red' }}>*{errors.pathalogyResults[index].unit}</p>) : null} */}
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-3'>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`pathalogyResults.${index}.normalRange`}>Normal Range</label>
                                                                        <input name={`pathalogyResults.${index}.normalRange`}
                                                                            placeholder="Enter Normal Range"
                                                                            type="text" className="form-control" defaultValue={pathalogy.normalRange} onChange={handleChange} required />
                                                                        {/* {errors.pathalogyResults && errors.pathalogyResults[index] && errors.pathalogyResults[index].normalRange && touched.pathalogyResults && touched.pathalogyResults[index] && touched.pathalogyResults[index].normalRange ? (
                                                                <p style={{ color: 'red' }}>*{errors.pathalogyResults[index].normalRange}</p>) : null} */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                <div style={{ display: 'flex', justifyContent: 'end', margin: '10px  0 0 10px' }}>
                                                    <button
                                                        type="button"
                                                        className='btn btn-success'
                                                        onClick={() => push({ parameter: '', result: '', normalRange: '', unit: '' })}
                                                    >
                                                        <BiPlus size={25} />  Add Report
                                                    </button>
                                                </div>


                                            </div>
                                        )}
                                    </FieldArray>
                            }
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div className="form-group">
                                        <label >Remark:</label>
                                        <textarea className="form-control" rows="5" id="remark" name='remark' defaultValue={values.remark} onChange={handleChange}></textarea>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label >Examined By<b style={{ color: 'red' }}>*</b>:</label>
                                        <input name='examinedBy'
                                            placeholder="Enter Examined doctor Name"
                                            type="text" className="form-control" onChange={handleChange} defaultValue={values.examinedBy} />

                                        {/* {errors.drName && touched.drName ? (<p style={{ color: 'red' }}>*{errors.drName}</p>) : null} */}


                                    </div>
                                </div>

                            </div>
                        </form>
                    </FormikProvider>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} >
                        {update ? 'Update' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Labreport