/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { forwardRef } from "react";
import PrintHeader from "./PrintHeader";
import PrintFooter from "./PrintFooter";

const PrintableComponent = forwardRef((props, ref) => (
    <div ref={ref} style={{width:'100vw'}}>
        <table style={{ margin: "10px" }}>
            {/* <thead>
                <div className="header"> <PrintHeader /></div>
            </thead> */}
            <tbody style={{ fontSize: "12px" }}>
                {props.content}
            </tbody>
            {/* <tfoot style={{ backgroundColor: 'none' }}>
                <div style={{ marginTop: '10px' }}></div>
                <div className="footer" ><PrintFooter /></div>
            </tfoot> */}
        </table>
    </div>
));

export default PrintableComponent;
