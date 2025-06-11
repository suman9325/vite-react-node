import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getAllCountryService } from '../../api/service/dropDownService';
import "./dropdown.scss";

const SearchableDropdown = () => {
    const [countryList, setCountryList] = useState([]);
    const [filteredStateList, setfilteredStateList] = useState([]);

    useEffect(() => {
        getAllCountryService().then(res => {
            const { success, data } = res
            if (success) {
                
                const updatedData = data.map(item => {
                    return {
                        value: item.cid,
                        label: item.cname
                    }
                })
                setCountryList(updatedData);
            } else {

            }

        })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const onCountryChange = (val) => {
            setfilteredStateList([]);
            if (!!val) {
                // setSelectedCountry(val);
                // formikObj.setFieldValue('cid', val.value);
                // formikObj.setFieldValue('cname', val.label);
                getAllStateByCountryService({ cid: val.value }).then(res => {
                    const { success, data } = res
                    if (success) {
                        const updatedData = data.map(item => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        })
                        setfilteredStateList(updatedData);
                    } else {
                    }
    
                })
                    .catch(err => {
                        console.log(err);
                    })
            }
            else {
                setfilteredStateList([]);
            }
        }

    return (
        <>
            <Select
                className="basic-single w-200"
                classNamePrefix="select"
                isSearchable={true}
                isMulti
                name="countryList"
                options={countryList}
                onChange={onCountryChange}
            />
        </>
    );
};

export default SearchableDropdown;