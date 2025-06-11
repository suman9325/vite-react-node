import React, { Fragment, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Container, Stack } from 'react-bootstrap';
import Dropdown from '../../components/SelectBox/Dropdown';
import { getAllCountryService, getAllStateByCountryService } from '../../api/service/dropDownService';

const DependableDropdown = () => {

    const [isDisabled, setisDisabled] = useState(true);
    const [countryList, setCountryList] = useState([]);
    const [filteredStateList, setfilteredStateList] = useState([]);

    useEffect(() => {
        getAllCountryService().then(res => {
            console.log(res);

            const { success, data } = res.data
            if (success) {
                const updatedData = data.map(item => {
                    return {
                        id: item.cid,
                        name: item.cname
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

    const onDropdownChange = (val) => {
        if (!!val) {
            getAllStateByCountryService({ cid: val }).then(res => {
                const { success, data } = res.data
                if (success) {
                    setisDisabled(false);
                    setfilteredStateList(data);
                } else {
                    setisDisabled(true);
                }

            })
                .catch(err => {
                    console.log(err);
                    setisDisabled(true);
                })
        }
        else {
            setfilteredStateList([]);
            setisDisabled(true);
        }
    }

    return (
        <Fragment>
            <Container fluid>
                <Card className="" style={{ width: '50rem' }}>
                    <CardHeader>
                        <h3>
                            Dependable Dropdown
                        </h3>
                    </CardHeader>
                    <CardBody className="">
                        <div className='d-flex justify-content-between'>
                            <label className=''>Country</label>
                            <Dropdown
                                optionList={countryList}
                                onDropdownChange={onDropdownChange}
                            />

                            <label className=''>State</label>
                            <Dropdown
                                optionList={filteredStateList}
                                isDisabled={isDisabled}
                            />

                        </div>
                    </CardBody>
                </Card>
            </Container>
        </Fragment>
    );
}

export default DependableDropdown;