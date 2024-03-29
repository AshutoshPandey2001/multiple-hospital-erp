/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useRef, forwardRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import PrintableComponent from "./PrintableComponent";
// const PrintableComponent = forwardRef((props, ref) => (
//     <div ref={ref}>
//         {props.content}
//     </div>
// ));

const PrintButton = ({ content }) => {
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
        <PrintableComponent ref={componentRef} content={content} />
      </div>
      <ReactToPrint
        trigger={() => <button className='btn btn-primary mx-2' id="print-button">Print</button>}
        content={() => componentRef.current}
        pageStyle={`
                        @page {
                          size: A4;
                          margin: 0;
                        }
                        @media print {
                          body {
                            margin: 0;
                          }
                          .header {                           
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            text-align: center;
                            background-color: transparent;
                          }
                          .footer {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            text-align: center;
                            background-color: none;    
                          }
                        }
                      `}
        ref={printRef}
      />
    </div>
  );
};

export default PrintButton;