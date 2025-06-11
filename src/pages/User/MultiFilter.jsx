import { Button, Container } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from 'moment';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';

const MultiFilter = () => {

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [username, setUsername] = useState('')
    const [emailId, setEmailId] = useState('')

    const filterParam = () => {

        if (fromDate || toDate || username || emailId) {
            const payload= {
                "fromDate": fromDate ? moment(fromDate.toDate()).format('DD-MM-YYYY'):'',
                "toDate": toDate ? moment(toDate.toDate()).format('DD-MM-YYYY'):'',
                "username": username,
                "emailId": emailId
            }
            console.log(payload);
            
        }
        else {
            console.log("fromDate", fromDate);
            console.log("toDate", toDate);
            console.log("username", username);
            console.log("emailId", emailId);
            toastAlert(TOAST_TYPE.ERROR, 'Select One Field')
        }
    }

    const clearParam=()=>{
        setFromDate(null);
        setToDate(null);
        setUsername('');
        setEmailId('');
    }

    return (
        <Fragment>
            <Container maxWidth='xl'>
                <Card style={{ width: '1000px' }}>
                    <CardHeader>
                        <h4>Multi Filter</h4>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col sm={3}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Enter From Date"
                                        value={fromDate}
                                        onChange={(date) =>
                                            setFromDate(date)
                                        }
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col sm={3}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Enter To Date"
                                        value={toDate}
                                        onChange={(date) =>
                                            setToDate(date)
                                        }
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col sm={3}>
                                <input type="text" className='form-control' placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </Col>
                            <Col sm={3}>
                                <input type="text" className='form-control' placeholder='Enter EmailId' value={emailId} onChange={(e) => setEmailId(e.target.value)} />

                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color='warning' onClick={clearParam} variant='outlined' className='me-2'>Clear</Button>
                        <Button color='primary' onClick={filterParam} variant='contained' >Submit</Button>
                    </CardFooter>
                </Card>
            </Container>
        </Fragment>
    )
}

export default MultiFilter;