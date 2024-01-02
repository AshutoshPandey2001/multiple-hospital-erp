/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { forwardRef } from "react";
import PrintHeader from "./PrintHeader";
import PrintFooter from "./PrintFooter";
import PrintHeaderMedical from "./PrintHeaderMedical";

const PrintableComponentMedical = forwardRef((props, ref) => (
    <div ref={ref}>
        <table style={{ marginLeft: '30px', marginTop: '20px', marginRight: '30px' }}>
            {/* <thead>
                <div className="header"> <PrintHeaderMedical /></div>
            </thead> */}
            <tbody style={{ fontSize: "12px" }}>
                {props.content}
            </tbody>
            {/* <tfoot style={{ backgroundColor: 'none' }}>
                <div style={{ marginTop: '50px' }}></div>
                <div className="footer" ><PrintFooter /></div>
            </tfoot> */}
        </table>
    </div>
));

export default PrintableComponentMedical;
