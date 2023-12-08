/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import DataTable from 'react-data-table-component';
import './table.css'
const CommanTable = ({ title, columns, data, action, subHeaderComponent, conditionalRowStyles, retrieveData, handlePerPageRowsChange, paginationTotalRows }) => {
    const customStyles = {
        tableWrapper: {
            display: 'flex',
            justifyContent: 'center', // horizontally center the table contents
        },
        subHeader: {
            paddingRight: 0, // Set padding-right to 0 in the subheader
        },
    };
    return (<>
        <DataTable
            title={title}
            columns={columns}
            data={data}
            conditionalRowStyles={conditionalRowStyles}
            pagination
            fixedHeader={true}
            noHeader={false}
            persistTableHead
            actions={action}
            highlightOnHover
            // subHeader={<div className='d-flex' style={{ justifyContent: 'space-between' }}></div>}
            subHeaderComponent={subHeaderComponent}
            customStyles={customStyles}
            onChangeRowsPerPage={handlePerPageRowsChange}

        />
    </>
    )
}

export default CommanTable