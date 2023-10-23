/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { drSchema } from 'src/schema';
import { MdEdit } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { addDatainsubcollection, addSingltObject, deleteDatainSubcollection, deleteSingltObject, filDatainsubcollection, getSubcollectionData, setData, updateDatainSubcollection, updateSingltObject } from 'src/services/firebasedb';
import CommanTable from 'src/comman/table/CommanTable';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import Loaderspinner from 'src/comman/spinner/Loaderspinner';
import { ADD_DR, DELETE_DR, EDIT_DR, FILL_DR, selectAllDr } from 'src/redux/slice/doctorsSlice';
import { ImCross } from 'react-icons/im'
import { selectUserId } from 'src/redux/slice/authSlice';
import { TfiReload } from 'react-icons/tfi'
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from 'src/firebaseconfig';
import Accordion from 'react-bootstrap/Accordion';
import TransferList from 'src/comman/CommanTransferList/CommanTransferList';
import { ADD_ROLE, DELETE_ROLE, EDIT_ROLE, selectAllRoles } from 'src/redux/slice/userRolesSlice';

const initalValues = {
    roleuid: '',
    role: '',
    hospitaluid: '',
    permissions: []
}
const Rolesmaster = () => {
    const dispatch = useDispatch()
    const allRoles = useSelector(selectAllRoles)
    const [show, setShow] = useState(false);
    const [rolesList, setRolesList] = useState([]);
    const [rolesFilter, setRolesFilter] = useState([]);
    const [permissions, setPermissions] = useState([])
    const [update, setUpdate] = useState(false)
    const [dashboardCheckbox, setDashboardCheckbox] = useState(false)
    const [homecheckbox, setHomecheckbox] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const hospitaluid = useSelector(selectUserId)
    const [patienstPermissions, setPatienstPermissions] = useState({ left: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"], right: [] });
    const [opdPermissions, setOpdPermissions] = useState({ left: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"], right: [] });
    const [indoorPermissions, setIndoorPermissions] = useState({ left: ["ADD_INDOOR", "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"], right: [] });
    const [roomPermissions, setRoomPermissions] = useState({ left: ['ADD_ROOMS', "VIEW_ROOMS", "EDIT_ROOMS", "DELETE_ROOMS", "INVOICE_ROOMS"], right: [] });
    const [dischargePermissions, setDischargePermissions] = useState({ left: ['ADD_DISCHARGE', "VIEW_DISCHARGE", "EDIT_DISCHARGE", "DELETE_DISCHARGE", "INVOICE_DISCHARGE"], right: [] });
    const [medicalPermissions, setMedicalPermissions] = useState({ left: ['ADD_MEDICAL', "VIEW_MEDICINE_STOCK", "VIEW_MEDICINE_INVOICE", "VIEW_RETURN_MEDICINE", "EDIT_MEDICAL", "DELETE_MEDICAL", "INVOICE_MEDICAL"], right: [] });
    const [laboratoryPermissions, setLaboratoryPermissions] = useState({ left: ['ADD_LABORATORY', "VIEW_LAB_MASTER", "VIEW_LAB_REPORTS", "EDIT_LABORATORY", "DELETE_LABORATORY", "INVOICE_LABORATORY"], right: [] });
    const [chargesPermissions, setChargesPermissions] = useState({ left: ['ADD_CHARGES', "VIEW_CHARGES", "EDIT_CHARGES", "DELETE_CHARGES"], right: [] });
    const [usersPermissions, setUsersPermissions] = useState({ left: ['ADD_USER', "VIEW_USER", "EDIT_USER", "DELETE_USER", "INVOICE_USER"], right: [] });
    const [doctorsPermissions, setDoctorsPermissions] = useState({ left: ['ADD_DOCTORS', "VIEW_DOCTORS", "EDIT_DOCTORS", "DELETE_DOCTORS"], right: [] });
    const [taxPermissions, setTaxPermissions] = useState({ left: ['ADD_TAX', "VIEW_TAX", "EDIT_TAX", "DELETE_TAX"], right: [] });
    const [hospitalprofilePermissions, setHospitalprofilePermissions] = useState({ left: ['ADD_HOSPITALPROFILE', "VIEW_HOSPITALPROFILE", "EDIT_HOSPITALPROFILE", "DELETE_HOSPITALPROFILE"], right: [] });
    const [rolesPermissions, setRolesPermissions] = useState({ left: ['ADD_ROLES', "VIEW_ROLES", "EDIT_ROLES", "DELETE_ROLES"], right: [] });

    const handlePatientsTransfer = (items, direction) => {
        // Handle item transfer for the first TransferList
        if (direction === "right") {
            const newLeft = patienstPermissions.left.filter((item) => !items.includes(item));
            // const newRight = patienstPermissions.right.concat(items);
            const newRight = [...new Set(patienstPermissions.right.concat(items))];
            setPatienstPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "PATIENTS");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "PATIENTS", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "PATIENTS", code: newRight }]);
            }
            // setPermissions((prevPermissions) => [...prevPermissions, { module: "PATIENTS", code: newRight }])
        } else if (direction === "left") {
            const newRight = patienstPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = patienstPermissions.left.concat(items);
            const newLeft = [...new Set(patienstPermissions.left.concat(items))];
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "PATIENTS");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "PATIENTS", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "PATIENTS", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "PATIENTS" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "PATIENTS");
                setPermissions(filteredPermissions); // Update the state
            }
            setPatienstPermissions({ left: newLeft, right: newRight });
        }
    };
    const handleOpdTransfer = (items, direction) => {
        console.log('items', items);
        // Handle item transfer for the second TransferList
        if (direction === "right") {

            const newLeft = opdPermissions.left.filter((item) => !items.includes(item));
            // const newRight = opdPermissions.right.concat(items);
            const newRight = [...new Set(opdPermissions.right.concat(items))];
            setOpdPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "OPD");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "OPD", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "OPD", code: newRight }]);
            }

            console.log('newRight', newRight);
        } else if (direction === "left") {
            const newRight = opdPermissions.right.filter((item) => !items.includes(item));
            const newLeft = [...new Set(opdPermissions.left.concat(items))];
            setOpdPermissions({ left: newLeft, right: newRight });
            console.log('newLeft', newLeft);
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "OPD");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "OPD", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "OPD", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "OPD" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "OPD");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleIndoorTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = indoorPermissions.left.filter((item) => !items.includes(item));
            // const newRight = indoorPermissions.right.concat(items);
            const newRight = [...new Set(indoorPermissions.right.concat(items))];
            setIndoorPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "INDOOR");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "INDOOR", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "INDOOR", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = indoorPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = indoorPermissions.left.concat(items);
            const newLeft = [...new Set(indoorPermissions.left.concat(items))];
            setIndoorPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "INDOOR");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "INDOOR", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "INDOOR", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "INDOOR" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "INDOOR");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleMedicalTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = medicalPermissions.left.filter((item) => !items.includes(item));
            // const newRight = medicalPermissions.right.concat(items);
            const newRight = [...new Set(medicalPermissions.right.concat(items))];

            setMedicalPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "MEDICAL");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "MEDICAL", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "MEDICAL", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = medicalPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = medicalPermissions.left.concat(items);
            const newLeft = [...new Set(medicalPermissions.left.concat(items))];

            setMedicalPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "MEDICAL");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "MEDICAL", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "MEDICAL", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "MEDICAL" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "MEDICAL");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleLaboratoryTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = laboratoryPermissions.left.filter((item) => !items.includes(item));
            // const newRight = laboratoryPermissions.right.concat(items);
            const newRight = [...new Set(laboratoryPermissions.right.concat(items))];

            setLaboratoryPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "LABORATORY");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "LABORATORY", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "LABORATORY", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = laboratoryPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = laboratoryPermissions.left.concat(items);
            const newLeft = [...new Set(laboratoryPermissions.left.concat(items))];
            setLaboratoryPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "LABORATORY");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "LABORATORY", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "LABORATORY", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "LABORATORY" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "LABORATORY");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleRoomTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = roomPermissions.left.filter((item) => !items.includes(item));
            // const newRight = roomPermissions.right.concat(items);
            const newRight = [...new Set(roomPermissions.right.concat(items))];

            setRoomPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "ROOMS");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "ROOMS", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "ROOMS", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = roomPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = roomPermissions.left.concat(items);
            const newLeft = [...new Set(roomPermissions.left.concat(items))];
            setRoomPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "ROOMS");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "ROOMS", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "ROOMS", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "ROOMS" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "ROOMS");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleDischargeTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = dischargePermissions.left.filter((item) => !items.includes(item));
            // const newRight = dischargePermissions.right.concat(items);
            const newRight = [...new Set(dischargePermissions.right.concat(items))];

            setDischargePermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "DISCHARGE");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "DISCHARGE", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "DISCHARGE", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = dischargePermissions.right.filter((item) => !items.includes(item));
            // const newLeft = dischargePermissions.left.concat(items);
            const newLeft = [...new Set(dischargePermissions.left.concat(items))];
            setDischargePermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "DISCHARGE");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "DISCHARGE", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "DISCHARGE", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "DISCHARGE" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "DISCHARGE");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleChargesTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = chargesPermissions.left.filter((item) => !items.includes(item));
            // const newRight = chargesPermissions.right.concat(items);
            const newRight = [...new Set(chargesPermissions.right.concat(items))];

            setChargesPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "CHARGES");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "CHARGES", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "CHARGES", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = chargesPermissions.right.filter((item) => !items.includes(item));
            const newLeft = [...new Set(chargesPermissions.left.concat(items))];

            // const newLeft = chargesPermissions.left.concat(items);
            setChargesPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "CHARGES");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "CHARGES", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "CHARGES", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "CHARGES" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "CHARGES");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleUsersTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = usersPermissions.left.filter((item) => !items.includes(item));
            // const newRight = usersPermissions.right.concat(items);
            const newRight = [...new Set(usersPermissions.right.concat(items))];

            setUsersPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "USERSMASTER");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "USERSMASTER", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "USERSMASTER", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = usersPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = usersPermissions.left.concat(items);
            const newLeft = [...new Set(usersPermissions.left.concat(items))];

            setUsersPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "USERSMASTER");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "USERSMASTER", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "USERSMASTER", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "USERSMASTER" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "USERSMASTER");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleDoctorsTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = doctorsPermissions.left.filter((item) => !items.includes(item));
            // const newRight = doctorsPermissions.right.concat(items);
            const newRight = [...new Set(doctorsPermissions.right.concat(items))];

            setDoctorsPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "DOCTORS");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "DOCTORS", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "DOCTORS", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = doctorsPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = doctorsPermissions.left.concat(items);
            const newLeft = [...new Set(doctorsPermissions.left.concat(items))];

            setDoctorsPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "DOCTORS");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "DOCTORS", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "DOCTORS", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "DOCTORS" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "DOCTORS");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleTaxTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = taxPermissions.left.filter((item) => !items.includes(item));
            // const newRight = taxPermissions.right.concat(items);
            const newRight = [...new Set(taxPermissions.right.concat(items))];

            setTaxPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "TAX");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "TAX", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "TAX", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = taxPermissions.right.filter((item) => !items.includes(item));
            // const newLeft = taxPermissions.left.concat(items);
            const newLeft = [...new Set(taxPermissions.left.concat(items))];

            setTaxPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "TAX");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "TAX", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "TAX", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "TAX" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "TAX");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleHospitalprofileTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = hospitalprofilePermissions.left.filter((item) => !items.includes(item));
            // const newRight = hospitalprofilePermissions.right.concat(items);
            const newRight = [...new Set(hospitalprofilePermissions.right.concat(items))];

            setHospitalprofilePermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "HOSPITALPROFILE");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "C", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "HOSPITALPROFILE", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = hospitalprofilePermissions.right.filter((item) => !items.includes(item));
            // const newLeft = hospitalprofilePermissions.newLeft.concat(items);
            const newLeft = [...new Set(hospitalprofilePermissions.newLeft.concat(items))];

            setHospitalprofilePermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "HOSPITALPROFILE");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "HOSPITALPROFILE", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "HOSPITALPROFILE", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "HOSPITALPROFILE" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "HOSPITALPROFILE");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleRolesTransfer = (items, direction) => {
        // Handle item transfer for the second TransferList
        if (direction === "right") {
            const newLeft = rolesPermissions.left.filter((item) => !items.includes(item));
            // const newRight = rolesPermissions.right.concat(items);
            const newRight = [...new Set(rolesPermissions.right.concat(items))];

            setRolesPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            const existingIndex = prevPermissions.findIndex((permission) => permission.module === "ROLEMASTER");
            if (existingIndex !== -1) {
                // Replace the existing object with the new one
                prevPermissions[existingIndex] = { module: "C", code: newRight };
                setPermissions([...prevPermissions]); // Update the state
            } else {
                // Add the new object to the array
                setPermissions([...prevPermissions, { module: "ROLEMASTER", code: newRight }]);
            }
        } else if (direction === "left") {
            const newRight = hospitalprofilePermissions.right.filter((item) => !items.includes(item));
            // const newLeft = hospitalprofilePermissions.newLeft.concat(items);
            const newLeft = [...new Set(hospitalprofilePermissions.newLeft.concat(items))];

            setRolesPermissions({ left: newLeft, right: newRight });
            const prevPermissions = permissions
            if (newRight.length > 0) {
                const existingIndex = prevPermissions.findIndex((permission) => permission.module === "ROLEMASTER");
                if (existingIndex !== -1) {
                    // Replace the existing object with the new one
                    prevPermissions[existingIndex] = { module: "ROLEMASTER", code: newRight };
                    setPermissions([...prevPermissions]); // Update the state
                } else {
                    // Add the new object to the array
                    setPermissions([...prevPermissions, { module: "ROLEMASTER", code: newRight }]);
                }
            } else {
                // If newRight has no value, remove the object with module "ROLEMASTER" if it exists
                const filteredPermissions = prevPermissions.filter((permission) => permission.module !== "ROLEMASTER");
                setPermissions(filteredPermissions); // Update the state
            }
        }
    };
    const handleDashboardcheckbox = (e) => {
        console.log('Dashboardcheckbo', e.target.checked);
        setDashboardCheckbox(e.target.checked)
        if (e.target.checked) {
            setPermissions((prevPermissions) => ([
                ...prevPermissions,
                {
                    module: "DASHBOARD",
                    code: []
                }]
            ));
        } else {
            const filteredPermissions = permissions.filter((permission) => permission.module !== "DASHBOARD");
            setPermissions(filteredPermissions); // Update the state
        }

    }
    const handleHomecheckbox = (e) => {
        console.log('Homecheckbox', e.target.checked);
        setHomecheckbox(e.target.checked)
        if (e.target.checked) {
            setPermissions((prevPermissions) => ([
                ...prevPermissions,
                {
                    module: "HOME",
                    code: []
                }]
            ));
        } else {
            const filteredPermissions = permissions.filter((permission) => permission.module !== "HOME");
            setPermissions(filteredPermissions); // Update the state
        }

    }
    const columns = [

        { name: 'Role', selector: row => row.role, sortable: true },
        { name: 'Permissions', selector: row => row.permissions?.map((permission) => permission.module).toString(), sortable: true },
        {
            name: 'Action', cell: row => <span><button onClick={() => editRole(row)} style={{ color: 'orange', border: 'none' }}><MdEdit size={25} /></button>
                <button onClick={() => deleteRole(row)} style={{ color: 'red', border: 'none' }} ><AiFillDelete size={25} /></button>
            </span>
        }
    ]
    const handleClose = () => {
        formik.resetForm();
        clearForm()
        setShow(false);
        setUpdate(false)
    }
    const handleShow = () => setShow(true);
    // useEffect(() => {
    //     getSubcollectionData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid, (data) => {
    //         // Handle the updated data in the callback function
    //         dispatch(FILL_DR(data))
    //         setIsLoading(false)
    //         console.log('Received real-time data:', data);
    //     }).catch((error) => {
    //         setIsLoading(false)
    //         console.error('Error:', error);
    //     })
    // }, [])
    useEffect(() => {
        setRolesList(allRoles)
        setRolesFilter(allRoles)
        setIsLoading(false)


    }, [allRoles])


    const formik = useFormik({
        initialValues: initalValues,
        // validationSchema: drSchema,
        onSubmit: async (Values, action) => {
            values.permissions = permissions

            if (!update) {
                values.roleuid = Math.floor(2000 + Math.random() * 7945);
                values.hospitaluid = hospitaluid;
                try {

                    await addSingltObject('Roles', 'd3ryEUt65hfqA2FMa0fEyxde', 'roles', values)
                    // await addDatainsubcollection('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', values)
                    dispatch(ADD_ROLE(Values))
                    action.resetForm();
                    clearForm()
                    setShow(false)
                    toast.success("Role added Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            } else {

                try {
                    // await setData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', doctor1)
                    // await updateDatainSubcollection('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', Values, 'druid', 'hospitaluid')
                    await updateSingltObject('Roles', 'd3ryEUt65hfqA2FMa0fEyxde', 'roles', Values, 'roleuid', 'hospitaluid')
                    dispatch(EDIT_ROLE(Values))
                    action.resetForm()
                    clearForm()
                    setShow(false)
                    setUpdate(false)
                    toast.success("Doctor Details Updated Successfully.......");
                } catch (error) {
                    toast.error(error.message)
                    console.error(error.message);
                }

            }



        }
    });
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik
    const clearForm = () => {
        formik.setValues({
            roleuid: '',
            role: '',
            hospitaluid: '',
            permissions: []
        });
        setPermissions([])
        setPatienstPermissions({ left: ['ADD_PATIENTS', "VIEW_PATIENTS", "EDIT_PATIENTS", "DELETE_PATIENTS", "PRINT_PATIENTS"], right: [] })
        setOpdPermissions({ left: ['ADD_OPD', "VIEW_OPD", "EDIT_OPD", "DELETE_OPD", "INVOICE_OPD"], right: [] })
        setIndoorPermissions({ left: ["ADD_INDOOR", "VIEW_INDOOR", "EDIT_INDOOR", "DELETE_INDOOR", "INVOICE_INDOOR"], right: [] })
        setRoomPermissions({ left: ['ADD_ROOMS', "VIEW_ROOMS", "EDIT_ROOMS", "DELETE_ROOMS", "INVOICE_ROOMS"], right: [] })
        setDischargePermissions({ left: ['ADD_DISCHARGE', "VIEW_DISCHARGE", "EDIT_DISCHARGE", "DELETE_DISCHARGE", "PRINT_DISCHARGE"], right: [] });
        setMedicalPermissions({ left: ['ADD_MEDICAL', "VIEW_MEDICAL", "EDIT_MEDICAL", "DELETE_MEDICAL", "INVOICE_MEDICAL"], right: [] })
        setLaboratoryPermissions({ left: ['ADD_LABORATORY', "VIEW_LABORATORY", "EDIT_LABORATORY", "DELETE_LABORATORY", "PRINT_LABORATORY"], right: [] });
        setChargesPermissions({ left: ['ADD_CHARGES', "VIEW_CHARGES", "EDIT_CHARGES", "DELETE_CHARGES"], right: [] });
        setUsersPermissions({ left: ['ADD_USER', "VIEW_USER", "EDIT_USER", "DELETE_USER", "INVOICE_USER"], right: [] });
        setDoctorsPermissions({ left: ['ADD_DOCTORS', "VIEW_DOCTORS", "EDIT_DOCTORS", "DELETE_DOCTORS"], right: [] });
        setTaxPermissions({ left: ['ADD_TAX', "VIEW_TAX", "EDIT_TAX", "DELETE_TAX"], right: [] })
        setHospitalprofilePermissions({ left: ['ADD_HOSPITALPROFILE', "VIEW_HOSPITALPROFILE", "EDIT_HOSPITALPROFILE", "DELETE_HOSPITALPROFILE"], right: [] })
        setRolesPermissions({ left: ['ADD_ROLES', "VIEW_ROLES", "EDIT_ROLES", "DELETE_ROLES"], right: [] })
        setHomecheckbox(false)
        setDashboardCheckbox(false)
    }
    // const editRole = async (item) => {
    //     console.log('item', item);
    //     values.role = item.role;
    //     values.roleuid = item.roleuid;
    //     values.hospitaluid = item.hospitaluid
    //     setPermissions(values.permissions)
    //     await values.permissions?.map((item) => {
    //         console.log('item PATIENTS', item);
    //         if (item.module === "PATIENTS") {

    //             const newLeft = patienstPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = patienstPermissions.right.concat(items);
    //             const newRight = [...new Set(patienstPermissions.right.concat(item.code))];
    //             setPatienstPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "OPD") {
    //             const newLeft = opdPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = opdPermissions.right.concat(item.code);
    //             const newRight = [...new Set(opdPermissions.right.concat(item.code))];
    //             setOpdPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "INDOOR") {
    //             const newLeft = indoorPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = indoorPermissions.right.concat(item.code);
    //             const newRight = [...new Set(indoorPermissions.right.concat(item.code))];
    //             setIndoorPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "DISCHARGE") {
    //             const newLeft = dischargePermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = dischargePermissions.right.concat(item.code);
    //             const newRight = [...new Set(dischargePermissions.right.concat(item.code))];

    //             setDischargePermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "MEDICAL") {
    //             const newLeft = medicalPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = medicalPermissions.right.concat(item.code);
    //             const newRight = [...new Set(medicalPermissions.right.concat(item.code))];

    //             setMedicalPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "ROOMS") {
    //             const newLeft = roomPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = roomPermissions.right.concat(item.code);
    //             const newRight = [...new Set(roomPermissions.right.concat(item.code))];

    //             setRoomPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "DOCTORS") {
    //             const newLeft = doctorsPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = doctorsPermissions.right.concat(item.code);
    //             const newRight = [...new Set(doctorsPermissions.right.concat(item.code))];

    //             setDoctorsPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "CHARGES") {
    //             const newLeft = chargesPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = chargesPermissions.right.concat(item.code);
    //             const newRight = [...new Set(chargesPermissions.right.concat(item.code))];

    //             setChargesPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "LABORATORY") {
    //             const newLeft = laboratoryPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = laboratoryPermissions.right.concat(item.code);
    //             const newRight = [...new Set(laboratoryPermissions.right.concat(item.code))];

    //             setLaboratoryPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "USERSMASTER") {
    //             const newLeft = usersPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = usersPermissions.right.concat(item.code);
    //             const newRight = [...new Set(usersPermissions.right.concat(item.code))];

    //             setUsersPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "TAX") {
    //             const newLeft = taxPermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = taxPermissions.right.concat(item.code);
    //             const newRight = [...new Set(taxPermissions.right.concat(item.code))];

    //             setTaxPermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "HOSPITALPROFILE") {
    //             const newLeft = hospitalprofilePermissions.left.filter((item1) => !item.code.includes(item1));
    //             // const newRight = hospitalprofilePermissions.right.concat(item.code);
    //             const newRight = [...new Set(hospitalprofilePermissions.right.concat(item.code))];

    //             setHospitalprofilePermissions({ left: newLeft, right: newRight });
    //         } else if (item.module === "HOME") {
    //             setHomecheckbox(true)
    //         } else if (item.module === "DASHBOARD") {
    //             setDashboardCheckbox(true)

    //         }
    //     })
    //     setShow(true)
    //     setUpdate(true)
    // }
    // const editRole = (item) => {
    //     console.log('item', item);
    //     values.role = item.role;
    //     values.roleuid = item.roleuid;
    //     values.hospitaluid = item.hospitaluid
    //     setPermissions(values.permissions)
    //     // Assuming values.permissions is an array of objects
    //     if (Array.isArray(values.permissions)) {
    //         const updatedPatienstPermissions = { ...patienstPermissions };
    //         const updatedOpdPermissions = { ...opdPermissions };
    //         const updatedIndoorPermissions = { ...indoorPermissions };
    //         const updatedDischargePermissions = { ...dischargePermissions };
    //         const updatedMedicalPermissions = { ...medicalPermissions };
    //         const updatedRoomPermissions = { ...roomPermissions };
    //         const updatedDoctorsPermissions = { ...doctorsPermissions };
    //         const updatedChargesPermissions = { ...chargesPermissions };
    //         const updatedLaboratoryPermissions = { ...laboratoryPermissions };
    //         const updatedUsersPermissions = { ...usersPermissions };
    //         const updatedTaxPermissions = { ...taxPermissions };
    //         const updatedHospitalprofilePermissions = { ...hospitalprofilePermissions };
    //         let homeCheckbox = false;
    //         let dashboardCheckbox = false;

    //         values.permissions.forEach((permission) => {
    //             console.log('item PATIENTS', permission);
    //             switch (permission.module) {
    //                 case 'PATIENTS':
    //                     updatedPatienstPermissions.left = patienstPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedPatienstPermissions.right = [...new Set(patienstPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'OPD':
    //                     updatedOpdPermissions.left = opdPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedOpdPermissions.right = [...new Set(opdPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'INDOOR':
    //                     updatedIndoorPermissions.left = indoorPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedIndoorPermissions.right = [...new Set(indoorPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'ROOMS':
    //                     updatedRoomPermissions.left = roomPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedRoomPermissions.right = [...new Set(roomPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'DISCHARGE':
    //                     updatedDischargePermissions.left = dischargePermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedDischargePermissions.right = [...new Set(dischargePermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'MEDICAL':
    //                     updatedMedicalPermissions.left = medicalPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedMedicalPermissions.right = [...new Set(medicalPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'LABORATORY':
    //                     updatedLaboratoryPermissions.left = laboratoryPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedLaboratoryPermissions.right = [...new Set(laboratoryPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'CHARGES':
    //                     updatedChargesPermissions.left = chargesPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedChargesPermissions.right = [...new Set(chargesPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'DOCTORS':
    //                     updatedDoctorsPermissions.left = doctorsPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedDoctorsPermissions.right = [...new Set(doctorsPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'TAX':
    //                     updatedTaxPermissions.left = taxPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedTaxPermissions.right = [...new Set(taxPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'USERSMASTER':
    //                     updatedUsersPermissions.left = usersPermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedUsersPermissions.right = [...new Set(usersPermissions.right.concat(permission.code))];
    //                     break;
    //                 case 'HOSPITALPROFILE':
    //                     updatedHospitalprofilePermissions.left = hospitalprofilePermissions.left.filter((item1) => !permission.code.includes(item1));
    //                     updatedHospitalprofilePermissions.right = [...new Set(hospitalprofilePermissions.right.concat(permission.code))];
    //                     break;
    //                 // Add cases for other modules
    //                 case 'HOME':
    //                     homeCheckbox = true;
    //                     break;
    //                 case 'DASHBOARD':
    //                     dashboardCheckbox = true;
    //                     break;
    //                 default:
    //                     // Handle unknown module or do nothing
    //                     break;
    //             }
    //         });

    //         // Set the updated state outside the loop
    //         setPatienstPermissions(updatedPatienstPermissions);
    //         setOpdPermissions(updatedOpdPermissions);
    //         setIndoorPermissions(updatedIndoorPermissions)
    //         setDischargePermissions(updatedDischargePermissions)
    //         setRoomPermissions(updatedRoomPermissions)
    //         setChargesPermissions(updatedChargesPermissions)
    //         setDoctorsPermissions(updatedDoctorsPermissions)
    //         setTaxPermissions(updatedTaxPermissions)
    //         setUsersPermissions(updatedUsersPermissions)
    //         setHospitalprofilePermissions(updatedHospitalprofilePermissions)
    //         setMedicalPermissions(updatedMedicalPermissions)
    //         setLaboratoryPermissions(updatedLaboratoryPermissions)
    //         // Set states for other modules similarly

    //         setHomecheckbox(homeCheckbox);
    //         setDashboardCheckbox(dashboardCheckbox);
    //     }

    //     setShow(true);
    //     setUpdate(true);
    // };

    const editRole = async (item) => {
        // ... other code
        console.log('item', item);
        values.role = item.role;
        values.roleuid = item.roleuid;
        values.hospitaluid = item.hospitaluid
        setPermissions(item.permissions)
        if (Array.isArray(item.permissions)) {
            try {
                const updatedPermissions = await processPermissions(item.permissions);

                // Set the updated state outside the permission processing
                console.log('updatedPermissions.updatedPatienstPermissions', updatedPermissions.updatedPatienstPermissions);
                setPatienstPermissions(updatedPermissions.updatedPatienstPermissions);
                setOpdPermissions(updatedPermissions.updatedOpdPermissions);
                setIndoorPermissions(updatedPermissions.updatedIndoorPermissions);
                setDischargePermissions(updatedPermissions.updatedDischargePermissions);
                setRoomPermissions(updatedPermissions.updatedRoomPermissions);
                setChargesPermissions(updatedPermissions.updatedChargesPermissions);
                setDoctorsPermissions(updatedPermissions.updatedDoctorsPermissions);
                setTaxPermissions(updatedPermissions.updatedTaxPermissions);
                setUsersPermissions(updatedPermissions.updatedUsersPermissions);
                setHospitalprofilePermissions(updatedPermissions.updatedHospitalprofilePermissions);
                setMedicalPermissions(updatedPermissions.updatedMedicalPermissions);
                setLaboratoryPermissions(updatedPermissions.updatedLaboratoryPermissions);
                setRolesPermissions(updatedPermissions.updatedRolesPermissions)
                // Set other states for modules similarly
                setHomecheckbox(updatedPermissions.homeCheckbox);
                setDashboardCheckbox(updatedPermissions.dashboardCheckbox);
            } catch (error) {
                // Handle any errors that may occur during permission processing
                console.error('Error processing permissions:', error);
            }
        }
        // setTimeout(() => {
        setShow(true);
        setUpdate(true);
        // }, 5000);
        // After permissions processing, set Show and Update to true

    };
    const processPermissions = (permissions) => {
        console.log('permission', permissions);

        return new Promise((resolve, reject) => {
            const updatedPatienstPermissions = { ...patienstPermissions };
            const updatedOpdPermissions = { ...opdPermissions };
            const updatedIndoorPermissions = { ...indoorPermissions };
            const updatedDischargePermissions = { ...dischargePermissions };
            const updatedMedicalPermissions = { ...medicalPermissions };
            const updatedRoomPermissions = { ...roomPermissions };
            const updatedDoctorsPermissions = { ...doctorsPermissions };
            const updatedChargesPermissions = { ...chargesPermissions };
            const updatedLaboratoryPermissions = { ...laboratoryPermissions };
            const updatedUsersPermissions = { ...usersPermissions };
            const updatedTaxPermissions = { ...taxPermissions };
            const updatedHospitalprofilePermissions = { ...hospitalprofilePermissions };
            const updatedRolesPermissions = { ...rolesPermissions };
            let homeCheckbox = false;
            let dashboardCheckbox = false;

            permissions.forEach((permission) => {
                switch (permission.module) {
                    case 'PATIENTS':
                        updatedPatienstPermissions.left = patienstPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedPatienstPermissions.right = [...new Set(patienstPermissions.right.concat(permission.code))];
                        console.log(patienstPermissions.left.filter((item1) => !permission.code.includes(item1)), 'patienstPermissions.left.filter((item1) => !permission.code.includes(item1))');
                        break;
                    case 'OPD':
                        updatedOpdPermissions.left = opdPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedOpdPermissions.right = [...new Set(opdPermissions.right.concat(permission.code))];
                        break;
                    case 'INDOOR':
                        updatedIndoorPermissions.left = indoorPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedIndoorPermissions.right = [...new Set(indoorPermissions.right.concat(permission.code))];
                        break;
                    case 'ROOMS':
                        updatedRoomPermissions.left = roomPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedRoomPermissions.right = [...new Set(roomPermissions.right.concat(permission.code))];
                        break;
                    case 'DISCHARGE':
                        updatedDischargePermissions.left = dischargePermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedDischargePermissions.right = [...new Set(dischargePermissions.right.concat(permission.code))];
                        break;
                    case 'MEDICAL':
                        updatedMedicalPermissions.left = medicalPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedMedicalPermissions.right = [...new Set(medicalPermissions.right.concat(permission.code))];
                        break;
                    case 'LABORATORY':
                        updatedLaboratoryPermissions.left = laboratoryPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedLaboratoryPermissions.right = [...new Set(laboratoryPermissions.right.concat(permission.code))];
                        break;
                    case 'CHARGES':
                        updatedChargesPermissions.left = chargesPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedChargesPermissions.right = [...new Set(chargesPermissions.right.concat(permission.code))];
                        break;
                    case 'DOCTORS':
                        updatedDoctorsPermissions.left = doctorsPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedDoctorsPermissions.right = [...new Set(doctorsPermissions.right.concat(permission.code))];
                        break;
                    case 'TAX':
                        updatedTaxPermissions.left = taxPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedTaxPermissions.right = [...new Set(taxPermissions.right.concat(permission.code))];
                        break;
                    case 'USERSMASTER':
                        updatedUsersPermissions.left = usersPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedUsersPermissions.right = [...new Set(usersPermissions.right.concat(permission.code))];
                        break;
                    case 'ROLEMASTER':
                        updatedRolesPermissions.left = rolesPermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedRolesPermissions.right = [...new Set(rolesPermissions.right.concat(permission.code))];
                        break;
                    case 'HOSPITALPROFILE':
                        updatedHospitalprofilePermissions.left = hospitalprofilePermissions.left.filter((item1) => !permission.code.includes(item1));
                        updatedHospitalprofilePermissions.right = [...new Set(hospitalprofilePermissions.right.concat(permission.code))];
                        break;
                    // Add cases for other modules
                    case 'HOME':
                        homeCheckbox = true;
                        break;
                    case 'DASHBOARD':
                        dashboardCheckbox = true;
                        break;
                    default:
                        // Handle unknown module or do nothing
                        break;
                }
            });
            console.log(updatedPatienstPermissions, 'updatedPatienstPermissions');
            resolve({
                updatedPatienstPermissions,
                updatedOpdPermissions,
                updatedIndoorPermissions,
                updatedDischargePermissions,
                updatedRoomPermissions,
                updatedChargesPermissions,
                updatedDoctorsPermissions,
                updatedTaxPermissions,
                updatedUsersPermissions,
                updatedHospitalprofilePermissions,
                updatedMedicalPermissions,
                updatedLaboratoryPermissions,
                updatedRolesPermissions,
                homeCheckbox,
                dashboardCheckbox,
            });
        });
    };
    const deleteRole = async (item1) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let room = rolesFilter.filter((item) => item.roleuid !== item1.roleuid)
                        try {
                            await deleteSingltObject('Roles', 'd3ryEUt65hfqA2FMa0fEyxde', 'roles', item1, 'roleuid', 'hospitaluid')
                            // await deleteDatainSubcollection('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', item1, 'druid', 'hospitaluid')
                            // await setData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', room)
                            dispatch(DELETE_ROLE(item1))
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

    const reloadData = () => {
        setIsLoading(true)
        getSubcollectionData('Doctors', 'd3ryEUfqA2FMa0fEyxde', 'doctors', hospitaluid, (data) => {
            // Handle the updated data in the callback function
            dispatch(FILL_DR(data))
            setIsLoading(false)

            console.log('Received real-time data:', data);
        }).catch((error) => {
            setIsLoading(false)

            console.error('Error:', error);
        })
    }
    return <>
        {isLoading ? <Loaderspinner /> :
            <div>
                <CommanTable
                    title={"Roles"}
                    columns={columns}
                    data={rolesList}
                    action={<> <button className='btn btn-primary' onClick={handleShow}><span>  <BiPlus size={25} /></span></button></>}
                />
            </div>
        }
        <Modal show={show} onHide={handleClose} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title> {update ? "Update Role" : "Add Role"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormikProvider value={formik}>
                    <form >
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <label style={{ fontWeight: 'bold' }}>Role<b style={{ color: 'red' }}>*</b>:</label>
                            <input className="form-control" placeholder='Enter Role' name='role' defaultValue={values.role} onChange={handleChange} />
                            {errors.role && touched.role ? (<p style={{ color: 'red' }}>*{errors.role}</p>) : null}
                        </div>
                        <div className='mt-3 mb-1' style={{ fontWeight: 'bold' }}>
                            Permissions
                        </div>

                        <Accordion>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Patients</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={patienstPermissions} onTransfer={handlePatientsTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Opd</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={opdPermissions} onTransfer={handleOpdTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Indoor</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={indoorPermissions} onTransfer={handleIndoorTransfer} />

                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>Discharge</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={dischargePermissions} onTransfer={handleDischargeTransfer} />

                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="5">
                                <Accordion.Header>Medical</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={medicalPermissions} onTransfer={handleMedicalTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="6">
                                <Accordion.Header>Laboratory</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={laboratoryPermissions} onTransfer={handleLaboratoryTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="7">
                                <Accordion.Header>Rooms</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={roomPermissions} onTransfer={handleRoomTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="8">
                                <Accordion.Header>Doctors</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={doctorsPermissions} onTransfer={handleDoctorsTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="9">
                                <Accordion.Header>Charges</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={chargesPermissions} onTransfer={handleChargesTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="10">
                                <Accordion.Header>Users</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={usersPermissions} onTransfer={handleUsersTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="11">
                                <Accordion.Header>Roles</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={rolesPermissions} onTransfer={handleRolesTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="12">
                                <Accordion.Header>Tax</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={taxPermissions} onTransfer={handleTaxTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="13">
                                <Accordion.Header>Hospital Profile</Accordion.Header>
                                <Accordion.Body>
                                    <TransferList items={hospitalprofilePermissions} onTransfer={handleHospitalprofileTransfer} />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="14">
                                <Accordion.Header>Home</Accordion.Header>
                                <Accordion.Body>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='homecheckbox' checked={homecheckbox} onChange={(e) => handleHomecheckbox(e)} />Home
                                        </label>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="15">
                                <Accordion.Header>Dashboard</Accordion.Header>
                                <Accordion.Body>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name='dashboardCheckbox' checked={dashboardCheckbox} onChange={(e) => handleDashboardcheckbox(e)} />Dashboard
                                        </label>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>


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


}

export default Rolesmaster;