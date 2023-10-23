/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react'
import opd_img from 'src/assets/images/opd_icon.svg'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ReactApexChart from 'react-apexcharts';
import Dropdown from 'react-bootstrap/Dropdown';
import { FiFilter } from 'react-icons/fi'
import CommanTooltip from 'src/comman/comman tooltip/CommanTooltip'
import { selectUserId, selectdoctoruid } from 'src/redux/slice/authSlice';
import '../../dashboard/dashboard.css'
import { db } from 'src/firebaseconfig';
import moment from 'moment'
import { formatDateYYYYMMDD, yyyyMMdd, yyyy_MM_dd } from 'src/services/dateFormate'
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);
const DoctarDashboard = () => {
    const target = useRef(null);
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [showTooltip, setShowTooltip] = useState(false);
    const hospitaluid = useSelector(selectUserId)
    const druid = useSelector(selectdoctoruid)
    const [patientsData, setPatientsData] = useState([])
    const [patientsDatacount, setPatientsDatacount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [timeFrame, setTimeFrame] = useState()

    const parentDocRefpatients = db.collection('opdPatients').doc('m5JHl3l4zhaBCa8Vihcb');
    const subcollectionRefpatients = parentDocRefpatients.collection('opdPatient').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0).where('druid', '==', druid);
    const [chartData, setChartData] = useState({
        series: [

            {
                name: 'Patients',
                data: patientsData?.map((item) => item.count),
            },
        ],
        options: {
            chart: {
                type: 'bar',
                zoom: {
                    enabled: false
                },
            },
            dataLabels: {
                enabled: false
            },
            tooltip: {
                theme: 'chart2-tooltip-theme',// Change the theme to 'light' for a light background tooltip        
            },
            xaxis: {
                type: 'datetime',
                categories: patientsData.map((item) => item.date),
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
        },
    }
    );

    const filtertheData = async () => {
        if (startDate && endDate) {
            const query = subcollectionRefpatients.where('consultingDate', '>=', moment(startDate).format('YYYY-MM-DD[Z]')).where('consultingDate', '<=', moment(endDate).format('YYYY-MM-DD[Z]'))
            const patientsData = await retrieveData(query)
            const patientsDataCount = await foruniqueOpdaDataCount(patientsData)
            const patient = patientsDataCount.reduce((partialSum, a) => partialSum + a.count, 0)
            setPatientsDatacount(Number(patient))
        }

    }
    const clearfilterData = () => {
        setShowTooltip(false);
        pieChartFiltertoday()
        setStartDate()
        setEndDate()

    }
    const tooltipContent = (
        <div>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className="form-group" >
                        <label>Form<b style={{ color: 'red' }}>*</b>:</label>
                        <input
                            name='startDate'
                            type="date"
                            className="form-control"
                            defaultValue={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className='col-lg-12'>
                    <div className="form-group" >
                        <label>To<b style={{ color: 'red' }}>*</b>:</label>
                        <input
                            name='endDate'
                            type="date"
                            className="form-control"
                            defaultValue={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                        />
                    </div>
                </div>
            </div>
            <div className='d-flex mt-2 mb-1 justify-content-end'>
                <Button variant="secondary" onClick={clearfilterData}>
                    Clear
                </Button>
                <Button
                    variant="primary"
                    style={{ marginLeft: '10px' }} disabled={!startDate && !endDate}
                    onClick={() => filtertheData()}
                >
                    Filter
                </Button>
            </div>
        </div>
    );
    useEffect(() => {

        pieChartFiltertoday()

        return () => {
            setChartData([])
        }
    }, [])
    const retrieveData = async (query) => {
        try {

            const querySnapshot = await query.get();
            let temp_data = [];
            querySnapshot.forEach((doc) => {
                temp_data.push(doc.data());
            });
            return temp_data
        } catch (error) {
            setIsLoading(false)
            console.error('Error retrieving data:', error);
            return []
        }
    };
    const timeFilter = (timestamp) => {
        const timestampWithNanoseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
        const dateObject = new Date(timestampWithNanoseconds);
        const timeString = moment(dateObject).format('HH');
        return timeString
    }
    const pieChartFiltertoday = async () => {
        try {
            setTimeFrame('Day')
            setIsLoading(true);
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10);

            const query = subcollectionRefpatients.where('consultingDate', '==', moment(formattedDate).format('YYYY-MM-DD[Z]'));
            const patientsTodaydata = await retrieveData(query);
            // console.log('patientsTodaydata', patientsTodaydata);

            const timePatientsData = await foruniqueOpdaDataCountTime(patientsTodaydata);
            const patientsDataCount = await foruniqueOpdaDataCount(patientsTodaydata);


            const patientstoday = patientsDataCount.find((item) => item.date === formattedDate);

            setPatientsDatacount(patientstoday?.count || 0);

            const temp_data = [];
            const processedTimes = new Set();
            const lastTwentyFourHours = new Date();
            lastTwentyFourHours.setHours(lastTwentyFourHours.getHours() - 24);

            // Set the start time to 12:00 AM (midnight)
            const startTime = new Date(lastTwentyFourHours);
            startTime.setHours(0, 0, 0, 0);

            // Set the end time to 11:00 PM
            const endTime = new Date();
            endTime.setHours(23, 0, 0, 0);
            if (patientsTodaydata && timePatientsData) {
                for (let d = new Date(startTime); d <= endTime; d.setHours(d.getHours() + 1)) {
                    // Format the time to 24-hour format (HH:mm)
                    const timeString = moment(d).format('HH:mm'); // e.g., 00:00, 01:00, ..., 23:00

                    // Check if the timeString has already been processed
                    if (processedTimes.has(timeString)) {
                        continue; // Skip this iteration if the timeString is a duplicate
                    }

                    const dataPoint = { time: timeString, count: 0 };
                    const matchingData = timePatientsData?.find(item => item.time === timeString);
                    if (matchingData) {
                        dataPoint.count = matchingData.count;
                    }
                    temp_data.push(dataPoint);



                    // Mark the timeString as processed to avoid duplicates
                    processedTimes.add(timeString);
                }



                // console.log('temp_data1', temp_data1);
                // console.log('temp_data', temp_data);
                setPatientsData(temp_data)

            }


            if (patientsTodaydata && timePatientsData && temp_data) {
                setChartData({
                    series: [

                        {
                            name: 'Patients',
                            data: temp_data?.map((item) => item.count),
                        },
                    ],
                    options: {
                        chart: {
                            type: 'bar',
                            zoom: {
                                enabled: false
                            },
                        },
                        dataLabels: {
                            enabled: false
                        },
                        tooltip: {
                            theme: 'chart2-tooltip-theme',
                        },
                        xaxis: {
                            type: 'time',
                            categories: temp_data.map((item) => item.time),
                        },
                        stroke: {
                            show: true,
                            width: 2,
                            colors: ['transparent']
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '55%',
                                endingShape: 'rounded'
                            },
                        },
                    },
                }
                );
            }


            setIsLoading(false);
        } catch (error) {
            console.error('Error in pieChartFiltertoday:', error);
            setIsLoading(false);
        }
    };

    const pieChartFilterweek = async () => {
        // last 7 days opd and indoor Amount
        setIsLoading(true)
        setTimeFrame('Weeek')
        const currentDateamountseven = new Date();
        const lastSevenDayss = new Date();
        lastSevenDayss.setDate(currentDateamountseven.getDate() - 6);
        const query = subcollectionRefpatients.where('consultingDate', '<=', moment(currentDateamountseven).format('YYYY-MM-DD[Z]')).where('consultingDate', '>=', moment(lastSevenDayss).format('YYYY-MM-DD[Z]'))
        // // .where('consultingDate', '>=', moment(startDate).format('YYYY-MM-DD[Z]'))
        const patientsweek = await retrieveData(query)

        const patientsDataCount = await foruniqueOpdaDataCount(patientsweek)

        const patients = patientsDataCount.reduce((partialSum, a) => partialSum + a.count, 0)

        setPatientsDatacount(Number(patients))

        setIsLoading(false)

        const temp_data = [];
        // last 7 days patients and indoor data
        for (let d = lastSevenDayss; d <= currentDateamountseven; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().slice(0, 10);
            const dataPoint = { date: dateString, count: 0 };
            const matchingData = patientsDataCount?.find(item => item.date === dateString);
            if (matchingData) {
                dataPoint.count = matchingData.count;
            }
            temp_data.push(dataPoint);

        }



        setPatientsData(temp_data)

        setChartData({
            series: [

                {
                    name: 'Patients',
                    data: temp_data?.map((item) => item.count),
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    zoom: {
                        enabled: false
                    },
                },
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                    theme: 'chart2-tooltip-theme',// Change the theme to 'light' for a light background tooltip        
                },
                xaxis: {
                    type: 'datetime',
                    categories: temp_data.map((item) => item.date),
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
            },
        }
        );
    }

    const pieChartFiltermonth = async () => {
        setIsLoading(true)
        setTimeFrame('Month')

        const currentDateamountthirtithe = new Date();
        const lastthirtitheDayss = new Date();
        lastthirtitheDayss.setDate(currentDateamountthirtithe.getDate() - 29);


        const query = subcollectionRefpatients.where('consultingDate', '<=', moment(currentDateamountthirtithe).format('YYYY-MM-DD[Z]')).where('consultingDate', '>=', moment(lastthirtitheDayss).format('YYYY-MM-DD[Z]'))
        const patientsmonthData = await retrieveData(query)
        const patientsDataCount = await foruniqueOpdaDataCount(patientsmonthData)

        const patients = patientsDataCount.reduce((partialSum, a) => partialSum + a.count, 0)

        setPatientsDatacount(Number(patients))


        const temp_data = [];
        for (let d = lastthirtitheDayss; d <= currentDateamountthirtithe; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().slice(0, 10);
            const dataPoint = { date: dateString, count: 0 };
            const matchingData = patientsDataCount?.find(item => item.date === dateString);
            if (matchingData) {
                dataPoint.count = matchingData.count;
            }
            temp_data.push(dataPoint);

        }
        setPatientsData(temp_data)

        setChartData({
            series: [

                {
                    name: 'Patients',
                    data: temp_data?.map((item) => item.count),
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    zoom: {
                        enabled: false
                    },
                },
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                    theme: 'chart2-tooltip-theme',// Change the theme to 'light' for a light background tooltip        
                },
                xaxis: {
                    type: 'datetime',
                    categories: temp_data.map((item) => item.date),
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
            },
        }
        );
        setIsLoading(false)

    }
    const allTimeData = () => {
        setShowTooltip(true);
    }
    const foruniqueOpdaDataCountTime = async (data) => {
        const data2 = await data?.map((patient) => ({
            time: `${timeFilter(patient.timestamp)}:00`,
            count: 1,
        }));

        // Aggregate the data to get the total number of patients for each day
        const groupedDataopd2 = await data2?.reduce((acc, cur) => {
            // const timeOnly = moment(cur.time, 'HH').format('HH:mm'); // Extract only the hour (HH) part

            const index = acc.findIndex((item) => item.time === cur.time);
            if (index !== -1) {
                acc[index].count += cur.count;
            } else {
                acc.push(cur);
            }
            return acc;
        }, []);

        console.log('groupedDataopd2', groupedDataopd2);
        return groupedDataopd2
    }
    const foruniqueOpdaDataCount = async (patients) => {
        const data2 = await patients?.map((patient) => ({
            date: formatDateYYYYMMDD(patient.consultingDate),
            count: 1,
        }));

        // Aggregate the data to get the total number of patients for each day
        const groupedDataopd2 = await data2?.reduce((acc, cur) => {
            const index = acc.findIndex((item) => item.date === cur.date);
            if (index !== -1) {
                acc[index].count += cur.count;
            } else {
                acc.push(cur);
            }
            return acc;
        }, []);


        return groupedDataopd2
    }
    return (
        <div>
            <>
                <div className='row'>
                    <div className='col-lg-12 d-flex justify-content-end'>
                        <Dropdown style={{ marginBottom: '20px' }} ref={target}>
                            <Dropdown.Toggle variant="primary">
                                <FiFilter size={22} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => pieChartFiltertoday()}>Today</Dropdown.Item>
                                <Dropdown.Item onClick={() => pieChartFilterweek()}>Last 7 Days</Dropdown.Item>
                                <Dropdown.Item onClick={() => pieChartFiltermonth()}>Last 30 Days</Dropdown.Item>
                                {/* <Dropdown.Item onClick={() => allTimeData()}>Custom Date</Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>

                        <CommanTooltip
                            target={target.current}
                            show={showTooltip}
                            placement="bottom-start"
                            content={tooltipContent}
                        />

                    </div>
                </div>
                <div className='row'>

                    <div className='col-xl-4 col-lg-6 col-12'>
                        <div className='box' style={{ backgroundColor: "#e8e1ff ", color: '#7047ee' }}>
                            <div className='box-body'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className=' w-100 h-100'>
                                        <img src={opd_img} alt="opd_img" width={100} height={100} />
                                    </div>
                                    <div className='text-end d-flex flex-column align-items-center'>
                                        <h2 className='mb-0 fw-600 text-primary'>{patientsDatacount}</h2>
                                        <p className='text-fade mt-3 mb-0'>Patients</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-lg-12'>
                        <CCard className="box1"  >
                            <CCardBody>
                                <CRow>
                                    <CCol sm={5}>
                                        <h4 id="traffic" className="card-title mb-0">
                                            PATIENTS
                                        </h4>
                                    </CCol>
                                    <CCol sm={7} className="d-none d-md-block">
                                    </CCol>
                                </CRow>

                                :
                                <ReactApexChart
                                    options={chartData.options}
                                    series={chartData.series}
                                    type="bar"
                                    height={350}

                                />
                            </CCardBody>
                        </CCard>
                    </div>



                </div>
            </>
        </div>
    )
}

export default DoctarDashboard