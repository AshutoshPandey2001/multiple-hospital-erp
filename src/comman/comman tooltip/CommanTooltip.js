/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Button } from '@coreui/coreui';
import React from 'react';
import { Tooltip, Overlay } from 'react-bootstrap';
const CommanTooltip = ({ target, show, placement, content, setStartDate, setEndDate, filtertheData, clearfilterData, startDate, endDate }) => {

    return (
        <Overlay target={target} show={show} placement={placement}>
            {(props) => (
                <Tooltip {...props}>{content}</Tooltip>
                // <Tooltip ><div >
                //     <div className='row'>
                //         <div className='col-lg-12'>
                //             <div className="form-group" >
                //                 <label >Form<b style={{ color: 'red' }}>*</b>:</label>
                //                 <input name='startDate'
                //                     type="date" className="form-control" defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)} />

                //             </div>
                //         </div>
                //         <div className='col-lg-12'>
                //             <div className="form-group" >
                //                 <label >To<b style={{ color: 'red' }}>*</b>:</label>
                //                 <input name='endDate'
                //                     type="date" className="form-control" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
                //             </div>
                //         </div>
                //     </div>
                //     <div className='d-flex mt-2 mb-1 justify-content-end'>
                //         <Button variant="secondary" onClick={clearfilterData}>
                //             Clear
                //         </Button>
                //         <Button variant="primary" style={{ marginLeft: '10px' }} onClick={() => filtertheData('consultingDate')}>
                //             Filter
                //         </Button>
                //     </div>


                // </div></Tooltip>

            )}
        </Overlay>
    )
}

export default CommanTooltip