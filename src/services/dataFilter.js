/* eslint-disable prettier/prettier */
import { ddMMyyyy, dd_mm_YYYY, formatDateYYYYMMDD, yyyyMMdd, yyyy_MM_dd } from "./dateFormate";

export const filterData = (data, startDate, endDate, date) => {
    console.log('data, startDate, endDate, date', data, startDate, endDate, date);
    const filteredData = data.filter(item => {
        const itemDate = new Date(formatDateYYYYMMDD(item[date]));
        // console.log('opdData', itemDate, itemDate >= ddMMyyyy(startDate) && itemDate <= ddMMyyyy(endDate));
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    return filteredData
    // You can do something with the filtered data here
};

export const filterDatainIndoor = (data, startDate, endDate, date) => {
    console.log('data, startDate, endDate, date', data, ddMMyyyy(startDate), ddMMyyyy(endDate), date);
    const filteredData = data.filter(item => {
        const itemDate = new Date(formatDateYYYYMMDD(item[date]));
        console.log('admitDate', itemDate, itemDate >= ddMMyyyy(startDate) && itemDate <= ddMMyyyy(endDate));
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
    console.log('filteredData', filteredData);

    return filteredData
    // You can do something with the filtered data here
}