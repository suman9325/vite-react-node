import React, { Fragment, useState } from "react";
import axios from "axios";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Stack } from "react-bootstrap";
import registerImg from "../../assets/images/register.jpg";
import "./auth.scss";
import ButtonWithLoader from "../../components/Buttons/ButtonWithLoader";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { registerUserService } from "../../api/service/authService";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";

// Initial form values
const initialFormValues = {
    name: "",
    email: "",
    password: "",
    contact: "",
    gender: "",
    language: [],
    address: "",
    dob: "",
    country: "",
    profilePicture: null, // For file upload
};

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    contact: Yup.string()
        .matches(/^\d{10}$/, "Contact must be a 10-digit number")
        .required("Contact is required"),
    gender: Yup.string().required("Gender is required"),
    language: Yup.array().min(1, "Select at least one language"),
    address: Yup.string().required("Address is required"),
    dob: Yup.string().required("Date of Birth is required"),
    country: Yup.string().required("Country is required"),
});

export default function RegistrationMUI() {
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const formikObj = useFormik({
        enableReinitialize: true,
        initialValues: initialFormValues,
        validationSchema, // Attach the Yup validation schema
        onSubmit: (values) => {
            values = { ...values, language: values.language.join(",") };
            const formData = new FormData();
            for (let key in values) {
                formData.append(key, values[key]);
            }
            // console.log("Form Data", formData);
            // console.log("Form Values", values);
            console.log("Form Data (key-value pairs):");
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            setIsConfirmDialogOpen(true)
        },
    });

    const submitForm = () => {
        setIsLoading(true);
        registerUserService(formikObj.values)
            .then((res) => {
                if (res.success) {
                    alert("Registration Successful");
                }
            })
            .catch((err) => console.log("Error", err))
            .finally(() => setIsLoading(false));
    }

    const handleLanguage = (e) => {
        const { value, checked } = e.target;
        const updatedLanguages = checked
            ? [...formikObj.values.language, value]
            : formikObj.values.language.filter((lang) => lang !== value);
        formikObj.setFieldValue("language", updatedLanguages);
    };

    const getFile = (e) => {
        const inputFile = e.target.files[0];
        console.log(inputFile);
        formikObj.setFieldValue("profilePicture", inputFile);
    }

    return (
        <Fragment>
            <Container fluid="md">
                <div className="d-flex">
                    <div style={{ width: "40rem" }}>
                        <img src={registerImg} height={500} width={500} alt="Register" />
                    </div>
                    <Card className="" style={{ width: "60rem" }}>
                        <CardHeader>
                            <h3>Register Yourself</h3>
                        </CardHeader>
                        <CardBody className="f-s-12">
                            <Stack gap={3}>
                                <Row>
                                    <Col md={6}>
                                        <input
                                            type="text"
                                            name="name"
                                            onChange={formikObj.handleChange}
                                            onBlur={formikObj.handleBlur}
                                            value={formikObj.values.name}
                                            className="form-control"
                                            placeholder="Enter your name"
                                        />
                                        {formikObj.touched.name && formikObj.errors.name && (
                                            <div className="text-danger">{formikObj.errors.name}</div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        <input
                                            type="text"
                                            name="contact"
                                            onChange={formikObj.handleChange}
                                            onBlur={formikObj.handleBlur}
                                            value={formikObj.values.contact}
                                            className="form-control"
                                            placeholder="Enter your contact"
                                        />
                                        {formikObj.touched.contact && formikObj.errors.contact && (
                                            <div className="text-danger">{formikObj.errors.contact}</div>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="d-flex text-align-start">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                name="gender"
                                                type="radio"
                                                value="M"
                                                onChange={formikObj.handleChange}
                                            />
                                            <label className="form-check-label">Male</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                name="gender"
                                                type="radio"
                                                value="F"
                                                onChange={formikObj.handleChange}
                                            />
                                            <label className="form-check-label">Female</label>
                                        </div>
                                        {formikObj.touched.gender && formikObj.errors.gender && (
                                            <div className="text-danger">{formikObj.errors.gender}</div>
                                        )}
                                    </Col>
                                    <Col md={6} className="d-flex text-align-start">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                name="language"
                                                type="checkbox"
                                                value="English"
                                                onChange={handleLanguage}
                                            />
                                            <label className="form-check-label">English</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                name="language"
                                                type="checkbox"
                                                value="Bengali"
                                                onChange={handleLanguage}
                                            />
                                            <label className="form-check-label">Bengali</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                name="language"
                                                type="checkbox"
                                                value="Hindi"
                                                onChange={handleLanguage}
                                            />
                                            <label className="form-check-label">Hindi</label>
                                        </div>
                                        {formikObj.touched.language && formikObj.errors.language && (
                                            <div className="text-danger">{formikObj.errors.language}</div>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            onChange={formikObj.handleChange}
                                            onBlur={formikObj.handleBlur}
                                            value={formikObj.values.address}
                                            rows="3"
                                            placeholder="Enter your address"
                                        ></textarea>
                                        {formikObj.touched.address && formikObj.errors.address && (
                                            <div className="text-danger">{formikObj.errors.address}</div>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <input
                                            type="email"
                                            name="email"
                                            onChange={formikObj.handleChange}
                                            onBlur={formikObj.handleBlur}
                                            value={formikObj.values.email}
                                            className="form-control"
                                            placeholder="Enter your email"
                                        />
                                        {formikObj.touched.email && formikObj.errors.email && (
                                            <div className="text-danger">{formikObj.errors.email}</div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={formikObj.handleChange}
                                            onBlur={formikObj.handleBlur}
                                            value={formikObj.values.password}
                                            className="form-control"
                                            placeholder="********"
                                        />
                                        {formikObj.touched.password && formikObj.errors.password && (
                                            <div className="text-danger">{formikObj.errors.password}</div>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Enter DOB"
                                                value={formikObj.values.dob ? moment(formikObj.values.dob, "YYYY-MM-DD") : null}
                                                onChange={(date) =>
                                                    formikObj.setFieldValue("dob", date ? moment(date).format("YYYY-MM-DD") : "")
                                                }
                                            />
                                        </LocalizationProvider>
                                        {formikObj.touched.dob && formikObj.errors.dob && (
                                            <div className="text-danger">{formikObj.errors.dob}</div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        <select
                                            className="form-select"
                                            name="country"
                                            onChange={formikObj.handleChange}
                                            onBlur={formikObj.handleBlur}
                                            value={formikObj.values.country}
                                        >
                                            <option value="">Select Country</option>
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                            <option value="China">China</option>
                                        </select>
                                        {formikObj.touched.country && formikObj.errors.country && (
                                            <div className="text-danger">{formikObj.errors.country}</div>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <div className='row mt-3'>
                                            <input type='file' className='form-control' onChange={getFile} />
                                        </div>
                                    </Col>
                                    {/* <Col md={6}>
                                        <div className='row mt-3'>
                                            {selectedFile?.type?.startsWith("image/") && (
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Preview"
                                                    style={{ width: "200px", marginTop: "10px" }}
                                                />
                                            )}
                                        </div>
                                    </Col> */}
                                </Row>
                            </Stack>
                        </CardBody>
                        <CardFooter>
                            <ButtonWithLoader
                                onBtnClick={() => formikObj.handleSubmit()}
                                isLoading={isLoading}
                                style="btn btn-primary"
                            >
                                Click to Register!
                            </ButtonWithLoader>
                        </CardFooter>
                    </Card>
                </div>
            </Container>

            {isConfirmDialogOpen && (
                <ConfirmDialog
                    open={isConfirmDialogOpen}
                    title={'Confirm Registration'}
                    message={'Are you sure you want to register?'}
                    onConfirm={() => {
                        setIsConfirmDialogOpen(false);
                        submitForm();
                        formikObj.resetForm();
                    }}
                    onClose={() => setIsConfirmDialogOpen(false)}
                    confirmText={'Yes'}
                    cancelText={'No'}
                />
            )
            }
        </Fragment>
    );
}
