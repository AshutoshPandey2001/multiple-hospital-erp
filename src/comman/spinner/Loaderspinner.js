/* eslint-disable prettier/prettier */
import React from 'react'
import ReactDOM from "react-dom"
import "./spinner.css"
const Loaderspinner = () => {
    return ReactDOM.createPortal(
        // <div className="loading-spinner">
        //     <div className="spinner">
        //         <div className="bounce1"></div>
        //         <div className="bounce2"></div>
        //         <div className="bounce3"></div>
        //     </div>
        // </div>,
        <div className='loading-spinner'>
            <div className="loader"></div>
        </div>,
        document.getElementById("loader")
    )
}

export default Loaderspinner