import React, { Fragment } from "react";

export default function Dropdown({optionList, isDisabled, onDropdownChange}) {
    
    const handleDropdownChange=(e)=>{
        onDropdownChange(e.target.value);
    }
    return (
        <Fragment>
            <select className="form-control mx-3" disabled={isDisabled} onChange={handleDropdownChange}>
                <option value="">Select</option>
                {optionList.map((item, index)=> <option key={index} value={item.id}>{item.name}</option>)}
            </select>
        </Fragment>
    )
}