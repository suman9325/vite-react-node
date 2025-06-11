import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Stack } from 'react-bootstrap';
import Select from 'react-select';
import { addUpdateCountryStateService, deleteLocationService, getAllCountryService, getAllLocationsService, getAllStateByCountryService, getCountryStateService } from '../../api/service/dropDownService';
import "./dropdown.scss";
import Loader from '../../components/Loader/Loader';

const MultiSelectBox = () => {
    const [countryList, setCountryList] = useState([]);
    const [filteredStateList, setfilteredStateList] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isLoading, setIsloading] = useState(false);

    useEffect(() => {
        getAllCountryList();
    }, [])

    const getAllCountryList = () => {
        setIsloading(true);
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
            .finally(() => setIsloading(false))
    }

    const onCountryChange = (val) => {
        setIsloading(true);
        setfilteredStateList([]);
        if (!!val) {
            setSelectedCountry(val);
            const cIDx = (val.map(item => item.value)).join();
            getAllStateByCountryService({ cid: cIDx }).then(res => {
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
                .finally(() => setIsloading(false))

        }
        else {
            setfilteredStateList([]);
        }
    }

    const onStateChange = (val) => {
        setSelectedState(val); // Update selected state
    };

    return (
        <Fragment>
            <Container fluid className='d-flex'>
                <Card className="me-3">
                    <CardHeader>
                        <h3>
                            Dependable Dropdown
                        </h3>
                    </CardHeader>
                    <CardBody className="">
                        <div className='d-flex justify-content-between'>
                            <label className='me-1'>Country</label>
                            <Select
                                className="w-300 me-3"
                                classNamePrefix="select"
                                isSearchable={true}
                                isMulti
                                name="countryList"
                                options={countryList}
                                onChange={onCountryChange}
                                placeholder='select'
                                value={selectedCountry}
                            />

                            <label className='me-1'>State</label>
                            <Select
                                className="w-300"
                                classNamePrefix="select"
                                isSearchable={true}
                                isMulti
                                name="stateList"
                                options={filteredStateList}
                                onChange={onStateChange}
                                value={selectedState}
                            />
                            <Loader visible={isLoading} />

                        </div>
                    </CardBody>
                </Card>
            </Container>
        </Fragment>
    );
}

export default MultiSelectBox;