/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import PrintableComponentMedical from "./PrintablecomponentMedical";

const PrintButtonMedical = ({ content, sendData }) => {
  const componentRef = useRef();
  const printRef = useRef();

  useEffect(() => {
    // Automatically click on the print button when the component mounts
    const printButton = document.getElementById("print-button");
    printButton.click();
  }, [content]);

  return (
    <div>
      <div style={{ display: 'none' }}>
        <PrintableComponentMedical ref={componentRef} content={content} sendData={sendData} />
      </div>
      <ReactToPrint
        trigger={() => <button className='btn btn-primary mx-2' id="print-button">Print</button>}
        content={() => componentRef.current}
        pageStyle={`
          @page {
            size: A5 landscape;
            margin: 5.5mm 5mm 5mm 7mm; 
            padding: 0;
          }

          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            background-color: none;
          }

         

          .page-break {
            page-break-after: always;
            break-before: page;
          }
        `}
        ref={printRef}
      />
    </div>
  );
};

export default PrintButtonMedical;
