/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./searchstyle.css";
import { ddMMyyyy } from 'src/services/dateFormate';

const SearchAutocomplete = ({ allPatients, handleOnSelect, inputsearch, placeholder, handleClear, keyforSearch, resultstringkey, style }) => {
    const formatResult = (item) => {

        return (
            <div className="result-wrapper" >
                {(() => {
                    switch (keyforSearch) {

                        case 'pid':
                            return (
                                <span className="result-span">{item.pid} - {item.pName}</span>
                            )
                        case 'pMobileNo':
                            return (
                                <span className="result-span">{item.pMobileNo} - {item.pName}</span>
                            )
                        case 'pName':
                            return (
                                <span className="result-span">{item.pName}</span>
                            )
                        case 'medicineName':
                            return (
                                <span className="result-span">{item.medicineName} - {item.batchNumber} - {item.mfrsName}- {ddMMyyyy(item.expireDate)}</span>
                            )
                        default:
                            return (
                                <span className="result-span">{item.pMobileNo} - {item.pName}</span>
                            )
                    }
                })()}
            </div>
        )
    }
    return (
        <>
            <ReactSearchAutocomplete
                items={allPatients}
                fuseOptions={{ keys: [`${keyforSearch}`], threshold: 0.0, distance: 0, ignoreLocation: true, exact: true }}
                resultStringKeyName={keyforSearch}
                onSelect={handleOnSelect}
                onClear={handleClear}
                inputSearchString={inputsearch}
                placeholder={placeholder}
                showIcon={false}
                formatResult={formatResult}
                styling={style} />
        </>
    )
}

export default SearchAutocomplete