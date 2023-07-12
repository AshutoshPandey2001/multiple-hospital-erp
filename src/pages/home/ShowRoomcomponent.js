/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState, useRef, createRef } from 'react'
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { selectAdmitPatients } from 'src/redux/slice/admitPatientsSlice';
import { useSelector } from 'react-redux';

const ShowRoomcomponent = ({ roomType, selectedRoomDetails }) => {
    const bedRefs = useRef([]);
    const admitPatients = useSelector(selectAdmitPatients);
    const todayDate = new Date().toISOString().substr(0, 10);
    const [tooltipContent, setTooltipContent] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [selectedBedIndex, setSelectedBedIndex] = useState(null);

    const showPatientName = (item, index) => {
        const patientDetails = admitPatients.find((patient) => {
            return (
                patient.dischargeDate === "" &&
                patient.roomType === item.roomType &&
                Number(patient.roomNo) === Number(item.roomNo) &&
                Number(patient.bedNo) === Number(item.bedNo)
            );
        });
        if (patientDetails) {
            setTooltipContent(
                `Patient Name: ${patientDetails.pName}, Admit Date: ${patientDetails.admitDate}`
            );
            setSelectedBedIndex(index);

            setShowTooltip(patientDetails != null);
        }
    };
    const hideTooltip = () => {
        setSelectedBedIndex(null);
        setShowTooltip(false);
        setTooltipContent('')
    }

    return (
        <>
            <div className="card w-100">
                <div className="card-header">{roomType?.roomType}</div>
                <div className="card-body">
                    <div className="row">
                        {roomType.rooms?.map((room, i) => {
                            return (
                                <div className="col-lg-4 mb-4" key={room.roomNo}>
                                    <div className="card">
                                        <div className="card-header">Room No {room.roomNo}</div>
                                        <div className="card-body ">
                                            <div className="row text-center justify-content-center">
                                                {room.BEDS?.map((bedNo, j) => {
                                                    const bedRef = bedRefs.current[i]?.[j] || createRef();
                                                    bedRefs.current[i] = bedRefs.current[i] || [];
                                                    bedRefs.current[i][j] = bedRef;
                                                    return (
                                                        <div
                                                            className="col-lg-6 mb-2"
                                                            key={`${i}-${j}`}
                                                            style={{ position: "relative" }}
                                                        >
                                                            <div
                                                                className="card"
                                                                ref={bedRef}
                                                                style={{
                                                                    backgroundColor: bedNo.occupied
                                                                        ? "#dc3545"
                                                                        : "#28a745",
                                                                    color: "white",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    bedNo.occupied
                                                                        ? showPatientName(
                                                                            {
                                                                                roomType: roomType.roomType,
                                                                                roomNo: room.roomNo,
                                                                                bedNo: bedNo.bedNo,
                                                                            },
                                                                            `${i}-${j}`
                                                                        )
                                                                        : selectedRoomDetails({
                                                                            roomType: roomType.roomType,
                                                                            roomNo: room.roomNo,
                                                                            bedNo: bedNo.bedNo,
                                                                            priceperNignt: roomType.priceperNight,
                                                                            todayDate: todayDate,
                                                                        })
                                                                }
                                                                onMouseLeave={() => hideTooltip()}
                                                            >
                                                                <div className="card-body">{bedNo.bedNo}</div>
                                                            </div>
                                                            {bedNo.occupied && (
                                                                <Overlay
                                                                    target={bedRef}
                                                                    show={selectedBedIndex === `${i}-${j}` && showTooltip}
                                                                    placement="top"
                                                                >
                                                                    <Tooltip id={`tooltip-${i}-${j}`} >
                                                                        <div style={{ color: 'black' }}>

                                                                            {tooltipContent}
                                                                        </div>
                                                                    </Tooltip>
                                                                </Overlay>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};


export default ShowRoomcomponent