/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'

import admit_img from 'src/assets/images/admit_icon.svg'
import opd_img from 'src/assets/images/opd_icon.svg'
import staff_img from 'src/assets/images/staff_icon.svg'
import room_img from 'src/assets/images/room_icon.svg'

import { selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice'
import { useDispatch, useSelector } from 'react-redux'
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
import './dashboard.css'
import opdPatientsList, { selectOpdPatients } from 'src/redux/slice/opdPatientsList'
import { selectAllRooms } from 'src/redux/slice/roomMasterSlice'
import { selectAllDr } from 'src/redux/slice/doctorsSlice'
import ReactApexChart from 'react-apexcharts';
import { formatDateYYYYMMDD, yyyyMMdd, yyyy_MM_dd } from 'src/services/dateFormate'
import Dropdown from 'react-bootstrap/Dropdown';
import { FiFilter } from 'react-icons/fi'
import { date } from 'yup'
import { db } from 'src/firebaseconfig'
import { selectUserId } from 'src/redux/slice/authSlice'
import { constant } from 'lodash'
import moment from 'moment'
import Loaderspinner from 'src/comman/spinner/Loaderspinner'
import CommanTooltip from 'src/comman/comman tooltip/CommanTooltip'
import { Button } from 'react-bootstrap'
import { FILL_DASHBOARD_INDOOR_PATIENTS, FILL_DASHBOARD_OPD_PATIENTS, selectDashboardAdmitData, selectDashboardAdmitLastData, selectDashboardopdData, selectDashboardopdLastData } from 'src/redux/slice/dashboardSlice'
import firebase from 'firebase/compat/app'

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




const Dashboard = () => {

  const dispatch = useDispatch()
  const allRooms = useSelector(selectAllRooms)
  const allDoctors = useSelector(selectAllDr)
  const [timeFrame, setTimeFrame] = useState()
  const [totalRooms, setTotalRooms] = useState(0)
  const [totalOpdAmount, setTotalOpdAmount] = useState(0)
  const [totalIndoorAmount, setTotalIndoorAmount] = useState(0)
  const [totalOpdcount, setTotalOpdcount] = useState(0)
  const [totalIndoorcount, setTotalIndoorcount] = useState(0)
  const hospitaluid = useSelector(selectUserId)
  const [isLoading, setIsLoading] = useState(true)
  const [opdData, setOpdData] = useState([])
  const [indoorData, setIndoorDaat] = useState([])
  const [opdPatientsdata, setOpdPatientsdata] = useState([])
  const [admitPatientsdata, setAdmitPatientsdata] = useState([])
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const parentDocRefindoor = db.collection('admitPatients').doc('jSqDGnjO21bpPGhb6O2y');
  const subcollectionRefIndoor = parentDocRefindoor.collection('admitPatient').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);
  const parentDocRefopd = db.collection('opdPatients').doc('m5JHl3l4zhaBCa8Vihcb');
  const subcollectionRefopd = parentDocRefopd.collection('opdPatient').where('hospitaluid', '==', hospitaluid).where('deleted', '==', 0);


  const [chartDatapie, setChartDatapie] = useState({
    series: [0, 0, 0, 0],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Indoor', 'OPD', 'Doctors', 'Rooms'],
      colors: ['#3596f7', '#7047ee', '#ee3158', '#05825f'],
      tooltip: {
        theme: 'chart1-tooltip-theme',
      },
      dataLabels: {
        style: {
          colors: ['#80bfff', '#c4b8ff', '#ff839b', '#99f3e8'], // Specify the desired text color
        },
      },
      states: {
        hover: {
          enabled: true,
          filter: {
            type: 'darken',
            value: 0.5, // Adjust the value to change the level of darkening
          },
        },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  });
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Indoor',
        data: indoorData?.map((item) => item.count),
      },
      {
        name: 'OPD',
        data: opdData?.map((item) => item.count),
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
        categories: indoorData.map((item) => item.date),
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
      const query = subcollectionRefopd.where('consultingDate', '>=', moment(startDate).format('YYYY-MM-DD[Z]')).where('consultingDate', '<=', moment(endDate).format('YYYY-MM-DD[Z]'))
      const opdMonthdata = await retrieveData(query)
      const opdDataCount = await foruniqueOpdaDataCount(opdMonthdata)
      const opdDataAmount = await foruniqueOpdaDataAmount(opdMonthdata)
      const query1 = subcollectionRefIndoor.where('admitDate', '>=', `${moment(startDate).format('YYYY-MM-DD')}T00:00Z`).where('admitDate', '<=', `${moment(endDate).format('YYYY-MM-DD')}T23:59Z`)
      const indoorMonthData = await retrieveData(query1)
      const indoorDataCount = await foruniqueIndoorDataCount(indoorMonthData)
      const indoorDataAmount = await foruniqueIndooraDataAmount(indoorMonthData)
      const indoor = indoorDataCount.reduce((partialSum, a) => partialSum + a.count, 0)
      const opd = opdDataCount.reduce((partialSum, a) => partialSum + a.count, 0)
      setChartDatapie(prevState => ({
        ...prevState,
        series: [Number(indoor), Number(opd), allDoctors?.length, totalRooms]
      }));
      setTotalIndoorcount(Number(indoor))
      setTotalOpdcount(Number(opd))
      const indoormonthAmount = indoorDataAmount.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
      const opdmonthAmount = opdDataAmount.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
      setTotalIndoorAmount(Number(indoormonthAmount))
      setTotalOpdAmount(Number(opdmonthAmount))
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
    setTimeFrame('Day')
    let total_rooms = []
    allRooms?.map((room, i) => {
      total_rooms.push(room.rooms.length)

    })
    const totalNoofRoom = total_rooms.reduce((partialSum, a) => partialSum + a, 0)
    setTotalRooms(totalNoofRoom)
    pieChartFiltertoday(totalNoofRoom)

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

      // console.log('Selected Today Data', temp_data);
      return temp_data
    } catch (error) {
      setIsLoading(false)
      console.error('Error retrieving data:', error);
      return []
    }
  };

  const pieChartFiltertoday = async (totalNoofRoom) => {
    try {
      setTimeFrame('Day')
      setIsLoading(true);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);

      const query = subcollectionRefopd.where('consultingDate', '==', moment(formattedDate).format('YYYY-MM-DD[Z]'));
      const opdTodayData = await retrieveData(query);
      // console.log('opdTodayData', opdTodayData);

      const timeOpdData = await foruniqueOpdaDataCountTime(opdTodayData);
      const opdDataCount = await foruniqueOpdaDataCount(opdTodayData);
      const opdDataAmount = await foruniqueOpdaDataAmount(opdTodayData);
      // console.log('formatted date', formattedDate);

      const query1 = subcollectionRefIndoor.where('admitDate', '>=', `${formattedDate}T00:00Z`).where('admitDate', '<', `${formattedDate}T23:59Z`);
      const indoorTodayData = await retrieveData(query1);
      const timeDataIndoor = await foruniqueOpdaDataCountTime(indoorTodayData);
      // console.log('indoorTodayData', indoorTodayData);

      const indoorDataCount = await foruniqueIndoorDataCount(indoorTodayData);
      const indoorDataAmount = await foruniqueIndooraDataAmount(indoorTodayData);

      const indoortoday = indoorDataCount.find((item) => item.date === formattedDate);
      const opdtoday = opdDataCount.find((item) => item.date === formattedDate);

      setChartDatapie(prevState => ({
        ...prevState,
        series: [
          indoortoday?.count || 0,
          opdtoday?.count || 0,
          allDoctors?.length || 0,
          totalNoofRoom ? totalNoofRoom : totalRooms,
        ],
      }));

      setTotalIndoorcount(indoortoday?.count || 0);
      setTotalOpdcount(opdtoday?.count || 0);

      const indoortodayAmount = indoorDataAmount.find((item) => item.date === formattedDate);
      const opdtodayAmount = opdDataAmount.find((item) => item.date === formattedDate);

      setTotalIndoorAmount(indoortodayAmount?.payAbleAmount || 0);
      setTotalOpdAmount(opdtodayAmount?.payAbleAmount || 0);

      const temp_data = [];
      const temp_data1 = [];
      const processedTimes = new Set();
      const lastTwentyFourHours = new Date();
      lastTwentyFourHours.setHours(lastTwentyFourHours.getHours() - 24);

      // Set the start time to 12:00 AM (midnight)
      const startTime = new Date(lastTwentyFourHours);
      startTime.setHours(0, 0, 0, 0);

      // Set the end time to 11:00 PM
      const endTime = new Date();
      endTime.setHours(23, 0, 0, 0);
      if (opdTodayData && indoorTodayData && timeOpdData && timeDataIndoor) {
        for (let d = new Date(startTime); d <= endTime; d.setHours(d.getHours() + 1)) {
          // Format the time to 24-hour format (HH:mm)
          const timeString = moment(d).format('HH:mm'); // e.g., 00:00, 01:00, ..., 23:00

          // Check if the timeString has already been processed
          if (processedTimes.has(timeString)) {
            continue; // Skip this iteration if the timeString is a duplicate
          }

          const dataPoint = { time: timeString, count: 0 };
          const dataPoint1 = { time: timeString, count: 0 };
          const matchingData = timeOpdData?.find(item => item.time === timeString);
          if (matchingData) {
            dataPoint.count = matchingData.count;
          }
          temp_data.push(dataPoint);

          const matchingData1 = timeDataIndoor?.find(item => item.time === timeString);
          if (matchingData1) {
            dataPoint1.count = matchingData1.count;
          }
          temp_data1.push(dataPoint1);

          // Mark the timeString as processed to avoid duplicates
          processedTimes.add(timeString);
        }



        // console.log('temp_data1', temp_data1);
        // console.log('temp_data', temp_data);
        setOpdData(temp_data)
        setIndoorDaat(temp_data1)

      }


      if (opdTodayData && indoorTodayData && timeOpdData && timeDataIndoor && temp_data && temp_data1) {
        setChartData({
          series: [
            {
              name: 'Indoor',
              data: temp_data1?.map((item) => item.count),
            },
            {
              name: 'OPD',
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
    const query = subcollectionRefopd.where('consultingDate', '<=', moment(currentDateamountseven).format('YYYY-MM-DD[Z]')).where('consultingDate', '>=', moment(lastSevenDayss).format('YYYY-MM-DD[Z]'))
    // // .where('consultingDate', '>=', moment(startDate).format('YYYY-MM-DD[Z]'))
    const opdweekData = await retrieveData(query)
    // const opdweekData = opdPatientsdata.filter(item => {
    //   // const itemDate = new Date(item.date);
    //   return item.consultingDate <= moment(currentDateamountseven).format('YYYY-MM-DD[Z]') && item.consultingDate >= moment(lastSevenDayss).format('YYYY-MM-DD[Z]');
    // });
    // console.log('opdweekData', opdweekData);
    const opdDataCount = await foruniqueOpdaDataCount(opdweekData)
    const opdDataAmount = await foruniqueOpdaDataAmount(opdweekData)
    // console.log('opdDataCount', opdDataCount, opdDataAmount);

    // console.log('last 7 days', `${moment(currentDateamountseven).format('YYYY-MM-DD')}T00:00Z`, `${moment(lastSevenDayss).format('YYYY-MM-DD')}T23:59Z`);
    const query1 = subcollectionRefIndoor.where('admitDate', '<=', `${moment(currentDateamountseven).format('YYYY-MM-DD')}T23:59Z`).where('admitDate', '>=', `${moment(lastSevenDayss).format('YYYY-MM-DD')}T00:00Z`)

    // .where('consultingDate', '>=', moment(startDate).format('YYYY-MM-DD[Z]'))
    const indoorweekData = await retrieveData(query1)
    // const indoorweekData = admitPatientsdata.filter(item => {
    //   // const itemDate = new Date(item.date);
    //   return item.admitDate <= `${moment(currentDateamountseven).format('YYYY-MM-DD')}T23:59Z` && item.admitDate >= `${moment(lastSevenDayss).format('YYYY-MM-DD')}T00:00Z`;
    // });
    // console.log('indoorTodayData', indoorweekData);
    const indoorDataCount = await foruniqueIndoorDataCount(indoorweekData)
    const indoorDataAmount = await foruniqueIndooraDataAmount(indoorweekData)

    const indoor = indoorDataCount.reduce((partialSum, a) => partialSum + a.count, 0)
    const opd = opdDataCount.reduce((partialSum, a) => partialSum + a.count, 0)
    setChartDatapie(prevState => ({
      ...prevState,
      series: [Number(indoor), Number(opd), allDoctors?.length, totalRooms]
    }));
    setTotalIndoorcount(Number(indoor))
    setTotalOpdcount(Number(opd))
    const indoorweekAmount = indoorDataAmount.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    const opdWeekAmount = opdDataAmount.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    setTotalIndoorAmount(Number(indoorweekAmount))
    setTotalOpdAmount(Number(opdWeekAmount))
    setIsLoading(false)

    const temp_data = [];
    const temp_data1 = [];
    // last 7 days opd and indoor data
    for (let d = lastSevenDayss; d <= currentDateamountseven; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().slice(0, 10);
      const dataPoint = { date: dateString, count: 0 };
      const dataPoint1 = { date: dateString, count: 0 };
      const matchingData = opdDataCount?.find(item => item.date === dateString);
      if (matchingData) {
        dataPoint.count = matchingData.count;
      }
      temp_data.push(dataPoint);
      const matchingData1 = indoorDataCount?.find(item =>
        item.date === dateString);
      if (matchingData1) {
        dataPoint1.count = matchingData1.count;
      }
      temp_data1.push(dataPoint1);
    }



    setOpdData(temp_data)
    setIndoorDaat(temp_data1)

    setChartData({
      series: [
        {
          name: 'Indoor',
          data: temp_data1?.map((item) => item.count),
        },
        {
          name: 'OPD',
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


    const query = subcollectionRefopd.where('consultingDate', '<=', moment(currentDateamountthirtithe).format('YYYY-MM-DD[Z]')).where('consultingDate', '>=', moment(lastthirtitheDayss).format('YYYY-MM-DD[Z]'))
    const opdMonthdata = await retrieveData(query)
    const opdDataCount = await foruniqueOpdaDataCount(opdMonthdata)
    const opdDataAmount = await foruniqueOpdaDataAmount(opdMonthdata)
    const query1 = subcollectionRefIndoor.where('admitDate', '<=', `${moment(currentDateamountthirtithe).format('YYYY-MM-DD')}T23:59Z`).where('admitDate', '>=', `${moment(lastthirtitheDayss).format('YYYY-MM-DD')}T00:00Z`)
    const indoorMonthData = await retrieveData(query1)
    // console.log('indoorTodayData', indoorMonthData);
    const indoorDataCount = await foruniqueIndoorDataCount(indoorMonthData)
    const indoorDataAmount = await foruniqueIndooraDataAmount(indoorMonthData)


    const indoor = indoorDataCount.reduce((partialSum, a) => partialSum + a.count, 0)
    const opd = opdDataCount.reduce((partialSum, a) => partialSum + a.count, 0)
    setChartDatapie(prevState => ({
      ...prevState,
      series: [Number(indoor), Number(opd), allDoctors?.length, totalRooms]
    }));
    setTotalIndoorcount(Number(indoor))
    setTotalOpdcount(Number(opd))
    const indoormonthAmount = indoorDataAmount.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    const opdmonthAmount = opdDataAmount.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    setTotalIndoorAmount(Number(indoormonthAmount))
    setTotalOpdAmount(Number(opdmonthAmount))


    const temp_data = [];
    const temp_data1 = [];
    for (let d = lastthirtitheDayss; d <= currentDateamountthirtithe; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().slice(0, 10);
      const dataPoint = { date: dateString, count: 0 };
      const dataPoint1 = { date: dateString, count: 0 };
      const matchingData = opdDataCount?.find(item => item.date === dateString);
      if (matchingData) {
        dataPoint.count = matchingData.count;
      }
      temp_data.push(dataPoint);
      const matchingData1 = indoorDataCount?.find(item =>
        item.date === dateString);
      if (matchingData1) {
        dataPoint1.count = matchingData1.count;
      }
      temp_data1.push(dataPoint1);
    }
    setOpdData(temp_data)
    setIndoorDaat(temp_data1)
    // filterTodayData(opdfifteendaysdata, indoorfifteenDaysData, totalNoofRoom)

    setChartData({
      series: [
        {
          name: 'Indoor',
          data: temp_data1?.map((item) => item.count),
        },
        {
          name: 'OPD',
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

  const foruniqueOpdaDataAmount = async (opdData) => {


    const invoiceuidMap1 = new Map();
    for (const entry of opdData) {
      const { invoiceuid } = entry;
      if (invoiceuid) {
        invoiceuidMap1.set(parseInt(invoiceuid), entry);
      }
    }
    const filteredOPDDataUnique1 = await Array.from(invoiceuidMap1.values());


    const filteredOpdData1 = filteredOPDDataUnique1
      .filter(entry => entry.paymentStatus === "Completed")
      .reduce((result, entry) => {
        const date = formatDateYYYYMMDD(entry.consultingDate);
        const existingEntry = result.find(item => item.date === date);
        if (existingEntry) {
          existingEntry.payAbleAmount += entry.payAbleAmount;
        } else {
          result.push({ date, payAbleAmount: entry.payAbleAmount });
        }
        return result;
      }, []);
    return filteredOpdData1
  }

  const foruniqueOpdaDataCount = async (opdData) => {
    const data2 = await opdData?.map((patient) => ({
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

  const foruniqueIndooraDataAmount = async (admitData) => {
    const invoiceuidMapIndoor = new Map();
    for (const entry of admitData) {
      const { invoiceuid } = entry;
      if (invoiceuid) {
        invoiceuidMapIndoor.set(parseInt(invoiceuid), entry);
      }
    }
    const filteredIndoorDataUnique = Array.from(invoiceuidMapIndoor.values());


    const filteredIndoorData = filteredIndoorDataUnique
      .filter(entry => entry.paymentStatus === "Completed")
      .reduce((result, entry) => {
        // const date = yyyyMMdd(entry.admitDate);
        const date = formatDateYYYYMMDD(entry.admitDate);
        const existingEntry = result.find(item => item.date === date);
        if (existingEntry) {
          existingEntry.payAbleAmount += entry.payableAmount + (entry.deposit ? Number(entry.deposit) : 0);
        } else {
          result.push({ date, payAbleAmount: entry.payableAmount + (entry.deposit ? Number(entry.deposit) : 0) });
        }
        return result;
      }, []);

    return filteredIndoorData
  }

  const foruniqueIndoorDataCount = async (admitData) => {
    const data = admitData?.map((patient) => ({
      // date: yyyyMMdd(patient.admitDate),
      date: formatDateYYYYMMDD(patient.admitDate),
      count: 1,
    }));
    // Aggregate the data to get the total number of patients for each day
    const groupedData = data?.reduce((acc, cur) => {
      const index = acc.findIndex((item) => item.date === cur.date);
      if (index !== -1) {
        acc[index].count += cur.count;
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);


    return groupedData
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

  const timeFilter = (timestamp) => {
    const timestampWithNanoseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
    const dateObject = new Date(timestampWithNanoseconds);
    const timeString = moment(dateObject).format('HH');
    return timeString
  }


  return (

    <>
      {isLoading ? <Loaderspinner /> : <>
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
                  <Dropdown.Item onClick={() => allTimeData()}>Custom Date</Dropdown.Item>
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
            <div className='col-xl-3 col-lg-6 col-12'>
              <div className='box' style={{ backgroundColor: "#cce5ff ", color: '#3596f7' }}>
                <div className='box-body'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className='w-100 h-100'>
                      <img src={admit_img} alt="admit_img" width={100} height={100} />
                    </div>
                    <div className='text-end d-flex flex-column align-items-center'>
                      <h2 className='mb-0 fw-600 text-primary'>{totalIndoorcount}</h2>
                      <h5 className='mb-0 fw-600 text-primary mt-3 mb-0'>{'₹' + totalIndoorAmount.toFixed(2)}</h5>
                      <p className='text-fade mt-3 mb-0'>Indoor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-lg-6 col-12'>
              <div className='box' style={{ backgroundColor: "#e8e1ff ", color: '#7047ee' }}>
                <div className='box-body'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className=' w-100 h-100'>
                      <img src={opd_img} alt="opd_img" width={100} height={100} />
                    </div>
                    <div className='text-end d-flex flex-column align-items-center'>
                      <h2 className='mb-0 fw-600 text-primary'>{totalOpdcount}</h2>
                      <h5 className='mb-0 fw-600 text-primary mt-3 mb-0'>{'₹' + totalOpdAmount.toFixed(2)}</h5>
                      <p className='text-fade mt-3 mb-0'>OPD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-lg-6 col-12'>
              <div className='box' style={{ backgroundColor: "#ffd6de ", color: '#ee3158' }}>
                <div className='box-body '>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className=' w-100 h-100'>
                      <img src={staff_img} alt="staff_img" width={100} height={100} />
                    </div>
                    <div className='text-end'>
                      <h2 className='mb-0 fw-600 text-primary'>{allDoctors?.length}</h2>
                      <p className='text-fade mt-5 mb-0'>Doctors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-lg-6 col-12'>
              <div className='box' style={{ backgroundColor: "#ebf9f5 ", color: '#05825f' }}>
                <div className='box-body '>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className=' w-100 h-100'>
                      <img src={room_img} alt="room_img" width={100} height={100} />
                    </div>
                    <div className='text-end'>
                      <h2 className='mb-0 fw-600 text-primary'>{totalRooms}</h2>
                      <p className='text-fade mt-5 mb-0'>Rooms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-6'>
              <CCard className="box1"  >
                <CCardBody>
                  <CRow>
                    <CCol sm={5}>
                      <h4 id="traffic" className="card-title mb-0">
                        Indoor vs OPD
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

            <div className='col-lg-6'>
              <CCard className="box1"  >
                <CCardBody>
                  <CRow>
                    <CCol sm={5}>
                      <h6 id="traffic" className="card-title mb-0">
                        Indoor vs OPD vs Doctors vs Rooms
                      </h6>
                    </CCol>
                    <CCol sm={7} className="d-none d-md-block">

                    </CCol>
                  </CRow>
                  <ReactApexChart
                    options={chartDatapie.options}
                    series={chartDatapie.series}
                    type="pie"
                    height={350}
                  />
                </CCardBody>
              </CCard>
            </div>

          </div>
        </>
      </>}




    </>
  )
}

export default Dashboard
