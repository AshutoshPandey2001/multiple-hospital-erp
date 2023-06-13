/* eslint-disable prettier/prettier */
export const yyyyMMdd = (date) => {
    const dateStr = date;// Original date string in "dd-mm-yyyy" format
    const dateParts = dateStr.split("-"); // Split date string into day, month, year components
    const yyyy_mm_dd = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` // Join components in "yyyy-mm-dd" format
    return yyyy_mm_dd
}

export const ddMMyyyy = (date) => {
    const dateStr = new Date(date); // Convert input value to Date object
    const dd_mm_yyyy = dateStr.toLocaleDateString("en-GB").split('/').join('-');
    return dd_mm_yyyy
}