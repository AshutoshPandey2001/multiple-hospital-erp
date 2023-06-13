/* eslint-disable prettier/prettier */
import { ddMMyyyy } from "./dateFormate";

export const filterData = (data, startDate, endDate, date) => {
    console.log('data, startDate, endDate, date', data, startDate, endDate, date);
    const filteredData = data.filter(item => {
        const itemDate = item[date];
        console.log('admitDate', itemDate);
        return itemDate >= ddMMyyyy(startDate) && itemDate <= ddMMyyyy(endDate);
    });

    return filteredData
    // You can do something with the filtered data here
};