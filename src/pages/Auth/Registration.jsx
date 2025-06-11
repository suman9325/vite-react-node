import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Stack } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import registerImg from '../../assets/images/register.jpg'
import './auth.scss'
import ButtonWithLoader from "../../components/Buttons/ButtonWithLoader";
import { useFormik } from "formik";
import moment from "moment";
import { registerUserService } from "../../api/service/authService";

const initialFormValues = {
    name: '',
    email: '',
    password: '',
    contact: '',
    gender: '',
    language: '',
    address: '',
    dob: '',
    country: ''
}
export default function Registrtation() {

    const [isLoading, setIsLoading] = useState(false);

    const formikObj = useFormik({
        enableReinitialize: true,
        initialValues: initialFormValues,
        onSubmit: (values) => {
            setIsLoading(true);
            values = { ...values, language: values.language.join(',') }
            console.log('formValues', values);
            registerUserService(values).then(res => {
                if (res.success) {
                    alert('Registration Successfull');
                }
            })
                .catch(err => console.log('Error', err))
                .finally(() => setIsLoading(false))
        }
    })

    const handleLanguage = (e) => {
        const { value, checked } = e.target;
        const updatedLanguages = checked
            ? [...formikObj.values.language, value]
            : formikObj.values.language.filter(lang => lang !== value);
        formikObj.setFieldValue('language', updatedLanguages);
    }

    return (
        <Fragment>
            <Container fluid='md'>
                <div className="d-flex">
                    <div style={{ width: '40rem' }}>
                        <img src={registerImg} height={500} width={500} />
                    </div>
                    <Card className="" style={{ width: '60rem' }}>
                        <CardHeader>
                            <h3>
                                Register Yourself
                            </h3>
                        </CardHeader>
                        <CardBody className="f-s-12">
                            <Stack gap={3}>
                                <Row>
                                    <Col md={6}>
                                        <input type="text" name="name" onChange={formikObj.handleChange} className="form-control" id="exampleFormControlInput1" placeholder="Enter your name" />
                                    </Col>
                                    <Col md={6}>
                                        <input type="text" name="contact" onChange={formikObj.handleChange} className="form-control" id="exampleFormControlInput1" placeholder="Enter your contact" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="d-flex text-align-start">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="gender" type="radio" id="inlineCheckbox1" value="M" onChange={formikObj.handleChange} />
                                            <label className="form-check-label" for="inlineCheckbox1">Male</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="gender" type="radio" id="inlineCheckbox2" value="F" onChange={formikObj.handleChange} />
                                            <label className="form-check-label" for="inlineCheckbox2">Female</label>
                                        </div>
                                    </Col>
                                    <Col md={6} className="d-flex text-align-start">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="language" type="checkbox" id="inlineCheckbox1" value="English" onChange={handleLanguage} />
                                            <label className="form-check-label" for="inlineCheckbox1">English</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="language" type="checkbox" id="inlineCheckbox2" value="Bengali" onChange={handleLanguage} />
                                            <label className="form-check-label" for="inlineCheckbox2">Bengali</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="language" type="checkbox" id="inlineCheckbox2" value="Hindi" onChange={handleLanguage} />
                                            <label className="form-check-label" for="inlineCheckbox2">Hindi</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <textarea class="form-control" name="address" onChange={formikObj.handleChange} id="exampleFormControlTextarea1" rows="3" placeholder="Enter your address"></textarea>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <input type="email" name="email" onChange={formikObj.handleChange} className="form-control" id="exampleFormControlInput1" placeholder="Enter your email" />
                                    </Col>
                                    <Col md={6}>
                                        <input type="password" name="password" onChange={formikObj.handleChange} className="form-control" id="exampleFormControlInput1" placeholder="********" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="">
                                        <Flatpickr
                                            style={{ width: '18rem', padding: '5px', borderRadius: '5px' }}
                                            placeholder="Enter DOB"
                                            // value={date}
                                            onChange={([date]) => {
                                                formikObj.setFieldValue('dob', moment(date).format('YYYY-MM-DD'))
                                            }}
                                        />

                                    </Col>
                                    <Col md={6}>
                                        <select class="form-select" name="country" aria-label="Default select example" onChange={formikObj.handleChange}>
                                            <option selected>Select Country</option>
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                            <option value="China">China</option>
                                        </select>
                                    </Col>

                                </Row>

                            </Stack>
                        </CardBody>
                        <CardFooter>
                            <ButtonWithLoader onBtnClick={formikObj.handleSubmit} isLoading={isLoading} style={'btn btn-primary'}>Click to Register!</ButtonWithLoader>
                        </CardFooter>
                    </Card>
                </div>
            </Container>
        </Fragment>
    )
}