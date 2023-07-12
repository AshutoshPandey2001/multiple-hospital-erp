/* eslint-disable prettier/prettier */
import moment from 'moment';

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

///ddMMyyyyTHHmm to yyyy_MM_dd
export const yyyy_MM_dd = (dateTime) => {
    const dateTimeStr = dateTime; // Original datetime string in "dd-mm-yyyyTHH:mm" format
    const dateTimeParts = dateTimeStr.split("T"); // Split datetime string into date and time components
    const dateStr = dateTimeParts[0]; // Extract date part
    const dateParts = dateStr.split("-"); // Split date part into day, month, year components
    const YYYY_MM_dd = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Join date components in "YYYY_MM_dd" format
    return YYYY_MM_dd;
};

//ddMMyyyyTHHmm to dd-mm-yyyy
export const dd_mm_YYYY = (dateTime) => {
    const dateTimeStr = dateTime; // Original datetime string in "dd-mm-yyyyTHH:mm" format
    const dateTimeParts = dateTimeStr.split("T"); // Split datetime string into date and time components
    const dateStr = dateTimeParts[0]; // Extract date part
    const dateParts = dateStr.split("-"); // Split date part into day, month, and year components
    const dd_mm_YYYY = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`; // Join date components in "dd-mm-YYYY" format
    return dd_mm_YYYY;
};

//ddMMyyyyTHHmm to yyyyMMddTHHmm
export const yyyyMMddTHHmm = (dateTime) => {
    const dateTimeStr = dateTime; // Original datetime string in "dd-MM-yyyyTHH:mm" format
    const dateTimeParts = dateTimeStr.split("T"); // Split datetime string into date and time components
    const dateStr = dateTimeParts[0]; // Extract date part
    const timeStr = dateTimeParts[1]; // Extract time part
    const dateParts = dateStr.split("-"); // Split date part into day, month, year components
    const yyyy_mm_dd = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Join date components in "yyyy-mm-dd" format
    const convertedDateTime = `${yyyy_mm_dd}T${timeStr}`; // Concatenate converted date and original time part
    return convertedDateTime;
}
//yyyyMMddTHHmm to ddMMyyyyTHHmm 
export const ddMMyyyyTHHmm = (dateTime) => {
    const dateStr = new Date(dateTime); // Convert input value to Date object
    const dd_mm_yyyy = dateStr.toLocaleDateString("en-GB").split('/').join('-');
    const HH_mm = dateStr.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
    return `${dd_mm_yyyy}T${HH_mm}`;
}

// dd/mm/yyyy

export const formatDateDDMMYYY = (inputDate) => {
    // Try to parse the input date string using different formats
    const formats = [
        'DD/MM/YYYY',
        'DD-MM-YYYY',
        'DD.MM.YYYY',
        'DD/MMM/YYYY',
        'DD-MMM-YYYY',
        'YYYY-MM-DD',
        'DD.MMM.YYYY',
        'YYYY-MM-DD[T]HH:mm',
        'YYYY-MM-DD[T]HH:mmZ',
        'DD-MM-YYYY[T]HH:mm',
        'YYYY-MM-DD[Z]'
        // Add more formats if needed
    ];

    let parsedDate = null;

    for (const formatStr of formats) {
        parsedDate = moment(inputDate, formatStr, true);
        if (parsedDate.isValid()) {
            // Format the date as DD/MM/YYYY
            const formatWithTime = formatStr.includes('HH:mm');
            const format = formatWithTime ? 'DD/MM/YYYY hh:mm A' : 'DD/MM/YYYY';
            const utcFormattedDate = formatWithTime ? parsedDate.utc().format(format) : parsedDate.format(format);
            return utcFormattedDate;
            // return parsedDate.format(format);
        }
    }

    // Return empty string if the input date couldn't be parsed
    return '';
};

export const formatDateYYYYMMDD = (inputDate) => {
    // Try to parse the input date string using different formats
    const formats = [
        'DD/MM/YYYY',
        'DD-MM-YYYY',
        'DD.MM.YYYY',
        'DD/MMM/YYYY',
        'DD-MMM-YYYY',
        'YYYY-MM-DD',
        'DD.MMM.YYYY',
        'YYYY-MM-DD[Z]',
        'YYYY-MM-DD[T]HH:mm',
        'YYYY-MM-DD[T]HH:mmZ',
        'DD-MM-YYYY[T]HH:mm'
        // Add more formats if needed
    ];

    let parsedDate = null;

    for (const formatStr of formats) {
        parsedDate = moment(inputDate, formatStr, true);
        if (parsedDate.isValid()) {
            // Format the date as DD/MM/YYYY
            return parsedDate.format('YYYY-MM-DD')
        }
    }

    // Return empty string if the input date couldn't be parsed
    return '';
};


export const formatDateyyyymmddUtc = (inputDate) => {
    const desiredFormat = 'YYYY-MM-DDTHH:mm[Z]';

    // Check if inputDate already matches the desired format
    if (moment(inputDate, desiredFormat, true).isValid()) {
        return inputDate;
    }

    const formats = [
        'DD/MM/YYYY',
        'DD-MM-YYYY',
        'DD.MM.YYYY',
        'DD/MMM/YYYY',
        'DD-MMM-YYYY',
        'YYYY-MM-DD',
        'DD.MMM.YYYY',
        'YYYY-MM-DD[T]HH:mm',
        'YYYY-MM-DD[T]HH:mmZ',
        'DD-MM-YYYY[T]HH:mm'
        // Add more formats if needed
    ];

    let parsedDate = null;

    for (const formatStr of formats) {
        parsedDate = moment(inputDate, formatStr, true);
        if (parsedDate.isValid()) {
            return parsedDate.format(desiredFormat);
        }
    }

    return '';
};

export const formatDateyyyymmddUtcopd = (inputDate) => {
    const desiredFormat = 'YYYY-MM-DD[Z]';

    // Check if inputDate already matches the desired format
    if (moment(inputDate, desiredFormat, true).isValid()) {
        return inputDate;
    }

    const formats = [
        'DD/MM/YYYY',
        'DD-MM-YYYY',
        'DD.MM.YYYY',
        'DD/MMM/YYYY',
        'DD-MMM-YYYY',
        'YYYY-MM-DD',
        'DD.MMM.YYYY',
        'YYYY-MM-DD[T]HH:mm',
        'YYYY-MM-DD[T]HH:mmZ',
        'DD-MM-YYYY[T]HH:mm'
        // Add more formats if needed
    ];

    let parsedDate = null;

    for (const formatStr of formats) {
        parsedDate = moment(inputDate, formatStr, true);
        if (parsedDate.isValid()) {
            return parsedDate.format(desiredFormat);
        }
    }

    return '';
};

export const calculateTotalDaysDifference = (admitDate, dischargeDate) => {
    const dischargeDateTime = new Date(dischargeDate); // Convert discharge datetime string to Date object
    const admitDateTime = new Date(admitDate); // Convert admit datetime string to Date object

    // const timeDifferenceMs = dischargeDateTime.getTime() - admitDateTime.getTime(); // Calculate time difference in milliseconds
    const dischargeDateOnly = new Date(dischargeDateTime.getFullYear(), dischargeDateTime.getMonth(), dischargeDateTime.getDate());
    const admitDateOnly = new Date(admitDateTime.getFullYear(), admitDateTime.getMonth(), admitDateTime.getDate());

    const timeDifferenceMs = dischargeDateOnly.getTime() - admitDateOnly.getTime(); // Calculate time difference in milliseconds
    let days = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    // Check if the discharge time is after 12:01 and increment days by 1 if true
    if (
        dischargeDateTime.getHours() >= 12 ||
        (dischargeDateTime.getHours() === 12 && dischargeDateTime.getMinutes() > 0)
    ) {
        days++;
    }
    if (days === 0) {
        return 1
    } else {

        return days;
    }
};
