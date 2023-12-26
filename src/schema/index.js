/* eslint-disable prettier/prettier */
import * as Yup from 'yup'


export const masterUserRegistration = Yup.object({
    name: Yup.string().required("Name is Required"),
    email: Yup.string().email().required("Email is Required"),
    userType: Yup.string().required("Type of User is Required"),
    password: Yup.string().required("Password is Required"),
})

export const loginSchema = Yup.object({
    email: Yup.string().email().required("Email is Required"),
    password: Yup.string().required("Password is Required"),
})

export const registerpatientsSchema = Yup.object({
    email: Yup.string().email().required("Email is Required"),
    mobileNo: Yup.string().required("Mobile No is Required"),
    userType: Yup.string().required(),
    password: Yup.string().required("Password is Required"),

})

export const addpatientsSchema = Yup.object({
    pName: Yup.string().required("Patient Name is Required"),
    age: Yup.string().required("Patient Age is Required"),
    pGender: Yup.string().required("Gendre is Required"),
    pAddress: Yup.string().required("Address is Required"),
    // pMobileNo: Yup.string().required("Patient Mobile No is Required").matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),

})


export const opdformSchema = Yup.object({
    pid: Yup.string().required("Patient id is Required"),
    pName: Yup.string().required("Patient Name is Required"),
    page: Yup.string().required("Patient Age is Required"),
    pGender: Yup.string().required("Gendre is Required"),
    pAddress: Yup.string().required("Address is Required"),
    // pMobileNo: Yup.string().required("Patient Mobile No is Required"),
    drName: Yup.string().required("Doctor Name is Required"),
    consultingDate: Yup.date().required("Consulting Date is Required"),
    consultingCharge: Yup.number().required("Consulting Charge is Required"),
    // paymentStatus: Yup.string().required("Payment Status is Required")
})


export const admitformSchema = Yup.object({
    pid: Yup.string().required("Patient id is Required"),
    pName: Yup.string().required("Patient Name is Required"),
    page: Yup.string().required("Patient Age is Required"),
    pGender: Yup.string().required("Gendre is Required"),
    pAddress: Yup.string().required("Address is Required"),
    // pMobileNo: Yup.string().required("Patient Mobile No is Required"),
    drName: Yup.string().required("Doctor Name is Required"),
    admitDate: Yup.date().required("Admit Date is Required"),
    dischargeDate: Yup.date(),
    roomType: Yup.string().required("Type Of Room is Required"),
    priceperNignt: Yup.number().required('Room Charges is Required'),
    roomNo: Yup.string().required("Room No. is Reqired"),
    bedNo: Yup.string().required("Bed No. is Reqired"),
    diagnosis: Yup.string().required("Diagnosis is Reqired"),
    paymentStatus: Yup.string().required("Payment Status in Reuired"),
})


export const roomSchema = Yup.object({
    roomType: Yup.string().required("Room Type is Reuired"),
    priceperNight: Yup.number().required("Charges is Required"),
    rooms: Yup.array().of(Yup.object({
        roomNo: Yup.number().required("Room Number is Required"),
        BEDS: Yup.array().of(Yup.object({
            bedNo: Yup.number().required("Bed Number is Required")
        }))
    })),


})



export const medicineSchema = Yup.object({
    // medicineuid: Yup.number().required("Medicine UID is Required"),
    medicineName: Yup.string().required("Medicine Name is Required"),
    availableStock: Yup.number().required("Stock Required"),
    batchNumber: Yup.string().required("Batch Number is Required"),
    medicinePrice: Yup.number().required("Price is Reuired"),
    mfrsName: Yup.string().required("Manufacturer Name is Required"),
    expireDate: Yup.string().required("Expire date is Required"),

})

export const padtientmedicineSchema = Yup.object({
    pid: Yup.string().required("Patient id is required"),
    pName: Yup.string().required("Patient Name is required"),
    // pMobileNo: Yup.string().required("Patient Mobile No is required"),
    medicineDate: Yup.string().required("Date is required"),
    paymentStatus: Yup.string().required("Payment Status in Required"),
    medicines: Yup.array()
        .of(
            Yup.object({
                medname: Yup.string().required("Medicine Name is required"),
                medQty: Yup.number().required("Medicine quantity is required"),
                medPrice: Yup.number().required("Price is required"),
                totalmedPrice: Yup.number().required("Total Medicine is required")
            })
        ),
    allMedTotalprice: Yup.number().required("Total Amount is Required")
})


export const returnpadtientmedicineSchema = Yup.object({
    pid: Yup.string().required("Patient id is required"),
    pName: Yup.string().required("Patient Name is required"),
    // pMobileNo: Yup.string().required("Patient Mobile No is required"),
    returnDate: Yup.string().required("Date is required"),
    medicines: Yup.array()
        .of(
            Yup.object({
                medname: Yup.string().required("Medicine Name is required"),
                medQty: Yup.number().required("Medicine quantity is required"),
                medPrice: Yup.number().required("Price is required"),
                totalmedPrice: Yup.number().required("Total Medicine is required")
            })
        ),
    allMedTotalprice: Yup.number().required("Total Amount is Required")
})
export const taxSchema = Yup.object({
    taxName: Yup.string().required("Tax Name is Required"),
    taxValue: Yup.number().required("Value of Tax is Required")
})

export const drSchema = Yup.object({
    drName: Yup.string().required("Dr Name is required"),
    consultingCharges: Yup.array().of(
        Yup.object().shape({
            visit: Yup.string().required('Visit is required'),
            charge: Yup.number()
                .typeError('Charge must be a number')
                .required('Charge is required')
        })
    ),
    email: Yup.string()
        .email('Invalid email format') // Add email validation here
        .required('Email is required')
})

export const dischargeSchema = Yup.object({
    pid: Yup.string().required("Patient id is Required"),
    pName: Yup.string().required("Patient Name is Required"),
    page: Yup.string().required("Patient Age is Required"),
    // pMobileNo: Yup.string().required("Patient Mobile No is Required"),
    drName: Yup.string().required("Doctor Name is Required"),
    admitDate: Yup.date().required("Admit Date is Required"),
    dischargeDate: Yup.date().required("Discharge Date is Required"),
    roomType: Yup.string().required("Type Of Room is Required"),
    roomNo: Yup.string().required("Room No. is Reqired"),
    bedNo: Yup.string().required("Bed No. is Reqired"),
    diagnosis: Yup.string().required("Diagnosis is Reqired"),
    investigation: Yup.string().required("Investigation is Reqired"),
    adviceonDischarge: Yup.string().required("Advice On discharge is Reqired"),
    conditionOnDischarge: Yup.string().required("Condition On discharge is Reqired"),
    dischargeType: Yup.string().required("Discharge Type is Reqired"),
    advices: Yup.array()
        .of(Yup.string())
        .min(1, "At least one advice is required."),
})



export const laboratoryMasterhema = Yup.object({
    reportName: Yup.string().required('Report name is required'),
    reportPrice: Yup.number().required('Report price is required'),
    parameters: Yup.array().of(
        Yup.object({
            parameterName: Yup.string().required('Parameter name is required'),
        })
    ),
});

export const laboratoryReportschema = Yup.object({
    pid: Yup.string().required('Patient ID is required.'),
    pName: Yup.string().required('Patient name is required.'),
    page: Yup.string().required('Patient age is required.'),
    pGender: Yup.string().required('Patient gender is required.'),
    pAddress: Yup.string().required('Patient address is required.'),
    // pMobileNo: Yup.string().required('Patient mobile number is required.'),
    drName: Yup.string().required('Doctor name is required.'),
    date: Yup.string().required('Date is required.'),
    reportName: Yup.string().required('Report name is required.'),
    remark: Yup.string().required('Remark is required.'),
    isunitRequired: Yup.boolean().required(),
    reportMakeby: Yup.string().required('Report maker name is required.'),
    examinedBy: Yup.string().required('Examined by is required.'),
    reportPrice: Yup.string().required('Report price is required.'),
    paymentStatus: Yup.string().required('Payment status is required.'),
    pathalogyResults: Yup.array().of(
        Yup.object({
            parameter: Yup.string().required('Parameter is required.'),
            result: Yup.string().required('Result is required.'),
            normalRange: Yup.string().required('Normal range is required.'),
        })
    ),
});

