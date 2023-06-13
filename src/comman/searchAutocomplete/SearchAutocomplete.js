/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./searchstyle.css";
const SearchAutocomplete = ({ allPatients, handleOnSelect, inputsearch, placeholder, handleClear, keyforSearch, resultstringkey, style }) => {
    // let searchAutocompleteStyle = {};
    // let style = {
    //     height: '36px',
    //     display: 'block',
    //     width: '100%',
    //     borderRadius: "0.375rem",
    //     backgroundColor: "#fff",
    //     boxShadow: "none",
    //     padding: '0.375rem 0.75rem',
    //     backgroundClip: 'padding-box',
    //     hoverBackgroundColor: "lightgray",
    //     color: '#212529',
    //     fontSize: '1rem',
    //     lineHeight: '1.5',
    //     fontFamily: "inherit",
    //     iconColor: "#212529",
    //     fontWeight: "400",
    //     lineColor: "lightgray",
    //     placeholderColor: "#212529",
    //     clearIconMargin: "3px 8px 0 0",
    //     appearance: 'none',
    //     transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
    // }

    const formatResult = (item) => {
        // switch (keyforSearch) {
        //     case 'pid':
        //         searchAutocompleteStyle = {
        //             zIndex: 2
        //         };
        //         break;
        //     case 'pMobileNo':
        //         searchAutocompleteStyle = {
        //             zIndex: 2
        //         };
        //         break;
        //     case 'pName':
        //         searchAutocompleteStyle = {
        //             zIndex: 1
        //         };
        //         break;
        //     case 'medicineName':
        //         searchAutocompleteStyle = {
        //             zIndex: 0
        //         };
        //         break;
        //     default:
        //         break;
        // }
        return (
            <div className="result-wrapper">
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
                                <span className="result-span">{item.medicineName}</span>
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