/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
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
import { useSelector } from 'react-redux'
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
import { selectOpdPatients } from 'src/redux/slice/opdPatientsList'
import { selectAllRooms } from 'src/redux/slice/roomMasterSlice'
import { selectAllDr } from 'src/redux/slice/doctorsSlice'
import ReactApexChart from 'react-apexcharts';
import { formatDateYYYYMMDD, yyyyMMdd, yyyy_MM_dd } from 'src/services/dateFormate'
import Dropdown from 'react-bootstrap/Dropdown';
import { FiFilter } from 'react-icons/fi'
import { date } from 'yup'

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
  // const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const admitPatientsdata = useSelector(selectAdmitPatients)
  const opdPatientsdata = useSelector(selectOpdPatients)
  const allRooms = useSelector(selectAllRooms)
  const allDoctors = useSelector(selectAllDr)
  const [timeFrame, setTimeFrame] = useState()
  const [totalRooms, setTotalRooms] = useState(0)
  const [totalOpdAmount, setTotalOpdAmount] = useState(0)
  const [totalIndoorAmount, setTotalIndoorAmount] = useState(0)
  const [totalOpdcount, setTotalOpdcount] = useState(0)
  const [totalIndoorcount, setTotalIndoorcount] = useState(0)

  const invoiceuidMap = new Map();
  for (const entry of opdPatientsdata) {
    const { invoiceuid } = entry;
    if (invoiceuid) {
      invoiceuidMap.set(parseInt(invoiceuid), entry);
    }
  }
  const filteredOPDDataUnique = Array.from(invoiceuidMap.values());


  const filteredOpdData = filteredOPDDataUnique
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

  const invoiceuidMapIndoor = new Map();
  for (const entry of admitPatientsdata) {
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
  const data = admitPatientsdata?.map((patient) => ({
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

  const data1 = opdPatientsdata?.map((patient) => ({
    date: formatDateYYYYMMDD(patient.consultingDate),
    count: 1,
  }));

  // Aggregate the data to get the total number of patients for each day
  const groupedDataopd = data1?.reduce((acc, cur) => {
    const index = acc.findIndex((item) => item.date === cur.date);
    if (index !== -1) {
      acc[index].count += cur.count;
    } else {
      acc.push(cur);
    }
    return acc;
  }, []);

  const indoorData = [];
  const opdData = [];

  const indoorDataweek = [];
  const opdDataweek = [];
  const indoorDatamonth = [];
  const opdDatamonth = [];
  const currentDate = new Date();
  const lastFifteenDays = new Date();
  lastFifteenDays.setDate(currentDate.getDate() - 14);
  const lastSevenDays = new Date();
  lastSevenDays.setDate(currentDate.getDate() - 6);
  const lastthirtiethDays = new Date();

  lastthirtiethDays.setDate(currentDate.getDate() - 29);
  const formattedDate = currentDate.toISOString().slice(0, 10)
  // last 15 days opd and indoor data
  for (let d = lastFifteenDays; d <= currentDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().slice(0, 10);
    const dataPoint = { date: dateString, count: 0 };
    const dataPoint1 = { date: dateString, count: 0 };
    const matchingData = groupedDataopd?.find(item => item.date === dateString);
    if (matchingData) {
      dataPoint.count = matchingData.count;
    }
    opdData.push(dataPoint);
    const matchingData1 = groupedData?.find(item =>
      item.date === dateString);
    if (matchingData1) {
      dataPoint1.count = matchingData1.count;
    }
    indoorData.push(dataPoint1);
  }

  // last 7 days opd and indoor data
  for (let d = lastSevenDays; d <= currentDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().slice(0, 10);
    const dataPoint = { date: dateString, count: 0 };
    const dataPoint1 = { date: dateString, count: 0 };
    const matchingData = groupedDataopd?.find(item => item.date === dateString);
    if (matchingData) {
      dataPoint.count = matchingData.count;
    }
    opdDataweek.push(dataPoint);
    const matchingData1 = groupedData?.find(item =>
      item.date === dateString);
    if (matchingData1) {
      dataPoint1.count = matchingData1.count;
    }
    indoorDataweek.push(dataPoint1);
  }




  // last 30 days opd and indoor data
  for (let d = lastthirtiethDays; d <= currentDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().slice(0, 10);
    const dataPoint = { date: dateString, count: 0 };
    const dataPoint1 = { date: dateString, count: 0 };
    const matchingData = groupedDataopd?.find(item => item.date === dateString);
    if (matchingData) {
      dataPoint.count = matchingData.count;
    }
    opdDatamonth.push(dataPoint);
    const matchingData1 = groupedData?.find(item =>
      item.date === dateString);
    if (matchingData1) {
      dataPoint1.count = matchingData1.count;
    }
    indoorDatamonth.push(dataPoint1);
  }
  // last 7 days opd and indoor Amount
  const currentDateamountseven = new Date();
  const lastSevenDayss = new Date();
  lastSevenDayss.setDate(currentDateamountseven.getDate() - 6);



  const totalopdAmountweek = [];
  const totalindoorAmountweek = [];
  for (let d = lastSevenDayss; d <= currentDateamountseven; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().slice(0, 10);
    const dataPoint = { date: dateString, payAbleAmount: 0 };
    const dataPoint1 = { date: dateString, payAbleAmount: 0 };
    const matchingData = filteredOpdData?.find(item => item.date === dateString);
    if (matchingData) {
      dataPoint.payAbleAmount = matchingData.payAbleAmount;
    }
    totalopdAmountweek.push(dataPoint);

    const matchingData1 = filteredIndoorData?.find(item => item.date === dateString);
    if (matchingData1) {
      dataPoint1.payAbleAmount = matchingData1.payAbleAmount;
    }
    totalindoorAmountweek.push(dataPoint1);
  }

  // last 30 days opd and indoor Amount
  const currentDateamountthirtithe = new Date();
  const lastthirtitheDayss = new Date();
  lastthirtitheDayss.setDate(currentDateamountthirtithe.getDate() - 29);



  const totalopdAmountmonth = [];
  const totalindoorAmountmonth = [];
  for (let d = lastthirtitheDayss; d <= currentDateamountthirtithe; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().slice(0, 10);
    const dataPoint = { date: dateString, payAbleAmount: 0 };
    const dataPoint1 = { date: dateString, payAbleAmount: 0 };
    const matchingData = filteredOpdData?.find(item => item.date === dateString);
    if (matchingData) {
      dataPoint.payAbleAmount = matchingData.payAbleAmount;
    }
    totalopdAmountmonth.push(dataPoint);

    const matchingData1 = filteredIndoorData?.find(item => item.date === dateString);
    if (matchingData1) {
      dataPoint1.payAbleAmount = matchingData1.payAbleAmount;
    }
    totalindoorAmountmonth.push(dataPoint1);
  }

  const [chartDatapie, setChartDatapie] = useState({
    series: [admitPatientsdata?.length, opdPatientsdata?.length, allDoctors?.length, totalRooms],
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

  useEffect(() => {
    setTimeFrame('Day')
    // setOption({
    //   scales: {
    //     x: {
    //       type: 'time',
    //       time: {
    //         unit: 'day'
    //       },
    //     },
    //     y: {
    //       beginAtZero: true
    //     }
    //   }
    // })
    let total_rooms = []
    allRooms?.map((room, i) => {
      total_rooms.push(room.rooms.length)

    })
    const totalNoofRoom = total_rooms.reduce((partialSum, a) => partialSum + a, 0)
    setTotalRooms(totalNoofRoom)
    // const totalopd = opdPatientsdata.reduce((partialSum, a) => {
    //   if (a.paymentStatus === "Completed") {
    //     return partialSum + a.payAbleAmount;
    //   }
    //   return partialSum;
    // }, 0);
    const totalopd = filteredOpdData.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0);

    setTotalOpdAmount(totalopd)
    setTotalOpdcount(opdPatientsdata.length)
    // const totalIndoor = admitPatientsdata.reduce((partialSum, a) => {
    //   if (a.paymentStatus === "Completed") {
    //     return partialSum + a.payableAmount;
    //   }
    //   return partialSum;
    // }, 0);
    const totalIndoor = filteredIndoorData.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0);

    setTotalIndoorAmount(totalIndoor)
    setTotalIndoorcount(admitPatientsdata.length)
    pieChartFiltertoday()
    setChartData(prevState => ({
      ...prevState,
      series: [
        {
          name: 'Indoor',
          data: indoorData?.map((item) => item.count),
        },
        {
          name: 'OPD',
          data: opdData?.map((item) => item.count),
        },
      ]
    }));

    setChartDatapie(prevState => ({
      ...prevState,
      series: [admitPatientsdata?.length, opdPatientsdata?.length, allDoctors?.length, totalNoofRoom]
    }));

    return () => {
      setChartData([])
    }
  }, [admitPatientsdata, allRooms])



  const pieChartFiltertoday = () => {
    const indoortoday = groupedData.find((item) => item.date === formattedDate)
    const opdtoday = groupedDataopd.find((item) => item.date === formattedDate)
    setChartDatapie(prevState => ({
      ...prevState,
      series: [
        indoortoday === undefined ? 0 : indoortoday.count,
        opdtoday === undefined ? 0 : opdtoday.count,
        allDoctors?.length,
        totalRooms
      ]
    }));
    setTotalIndoorcount(indoortoday === undefined ? 0 : indoortoday.count)
    setTotalOpdcount(opdtoday === undefined ? 0 : opdtoday.count)
    const indoortodayAmount = filteredIndoorData.find((item, a) => item.date === formattedDate)
    const opdtodayAmount = filteredOpdData.find((item, a) => item.date === formattedDate)
    setTotalIndoorAmount(indoortodayAmount === undefined ? 0 : indoortodayAmount.payAbleAmount)
    setTotalOpdAmount(opdtodayAmount === undefined ? 0 : opdtodayAmount.payAbleAmount)
  }


  const pieChartFilterweek = () => {

    const indoor = indoorDataweek.reduce((partialSum, a) => partialSum + a.count, 0)
    const opd = opdDataweek.reduce((partialSum, a) => partialSum + a.count, 0)
    setChartDatapie(prevState => ({
      ...prevState,
      series: [Number(indoor), Number(opd), allDoctors?.length, totalRooms]
    }));
    setTotalIndoorcount(Number(indoor))
    setTotalOpdcount(Number(opd))
    const indoorweekAmount = totalindoorAmountweek.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    const opdWeekAmount = totalopdAmountweek.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    setTotalIndoorAmount(Number(indoorweekAmount))
    setTotalOpdAmount(Number(opdWeekAmount))
  }

  const pieChartFiltermonth = () => {
    const indoor = indoorDatamonth.reduce((partialSum, a) => partialSum + a.count, 0)
    const opd = opdDatamonth.reduce((partialSum, a) => partialSum + a.count, 0)
    setChartDatapie(prevState => ({
      ...prevState,
      series: [Number(indoor), Number(opd), allDoctors?.length, totalRooms]
    }));
    setTotalIndoorcount(Number(indoor))
    setTotalOpdcount(Number(opd))
    const indoormonthAmount = totalindoorAmountmonth.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    const opdmonthAmount = totalopdAmountmonth.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0)
    setTotalIndoorAmount(Number(indoormonthAmount))
    setTotalOpdAmount(Number(opdmonthAmount))
  }
  const allTimeData = () => {
    const totalIndoor = filteredIndoorData.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0);

    setTotalIndoorAmount(totalIndoor)
    setTotalIndoorcount(admitPatientsdata.length)
    const totalopd = filteredOpdData.reduce((partialSum, a) => partialSum + a.payAbleAmount, 0);

    setTotalOpdAmount(totalopd)
    setTotalOpdcount(opdPatientsdata.length)
  }

  return (
    <>
      <div className='row'>
        <div className='col-lg-12 d-flex justify-content-end'>
          <Dropdown style={{ marginBottom: '20px' }}>
            <Dropdown.Toggle variant="primary" >
              <FiFilter size={22} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={pieChartFiltertoday}>Today</Dropdown.Item>
              <Dropdown.Item onClick={pieChartFilterweek}>Last 7 Days</Dropdown.Item>
              <Dropdown.Item onClick={pieChartFiltermonth}>Last 30 Days</Dropdown.Item>
              <Dropdown.Item onClick={allTimeData}>All Time</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
                  {/* <CButtonGroup className="float-end me-3">
                    {['Day', 'Weekly', 'Month'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        onClick={() => { changeTimeFrame(value) }}
                        className="mx-0"
                        active={value === timeFrame}
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup> */}
                </CCol>
              </CRow>
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
              />
              {/* <Bar data={chartData} options={option} height={150} /> */}
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
        {/* <div className='col-lg-6'>
          <CCard className="box1"  >
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    OPD Patients
                  </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  
                  <CButtonGroup className="float-end me-3">
                    {['Day', 'Weekly', 'Month'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        onClick={() => { changeTimeFrame(value) }}
                        className="mx-0"
                        active={value === timeFrame}
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup>
                </CCol>
              </CRow>
              <Bar data={chartData} options={option} height={150} />
            </CCardBody>
          </CCard>
        </div> */}

      </div>



    </>
  )
}

export default Dashboard
