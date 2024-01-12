/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { forwardRef } from "react";
import PrintHeader from "./PrintHeader";
import PrintFooter from "./PrintFooter";
import PrintHeaderMedical from "./PrintHeaderMedical";

const PrintableComponentMedical = forwardRef((props, ref) => (
    <div ref={ref} style={{ width: '100vw' }} className="page-break" >
        <table style={{ marginLeft: '30px', marginRight: '30px' }}>
            {/* <thead>
                <div className="header"> <PrintHeader /></div>
            </thead> */}
            <tbody style={{ fontSize: "12px" }}>
                {props.content}
            </tbody>
            {/* <tfoot style={{ backgroundColor: 'none' }}>
                <div style={{ marginTop: '50px' }}></div>
                <div className="footer" >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ marginLeft: '20px', fontSize: '12px' }}><b>Terms & Conditions:</b>Subject to SURAT Judrisdiction</span>
                        <span style={{ marginLeft: '20px', fontSize: '12px' }}> Authorised Signatory</span>
                    </div>
                </div>
            </tfoot> */}
        </table>
    </div>
));

export default PrintableComponentMedical;
