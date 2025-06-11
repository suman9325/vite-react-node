import React, { Fragment, useEffect, useMemo, useState } from "react";
import { getUserService, searchUserService } from "../../api/service/userService";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Button, CardBody, Col, Container, Row, Stack } from "react-bootstrap";
import { FilledInput, FormControl, InputAdornment, InputLabel } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Modal from 'react-bootstrap/Modal';
import { useFormik } from "formik";

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
const SearchUserInTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [cloneTableData, setCloneTableData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null); // Store the selected user ID

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        getUserService()
            .then((res) => {
                if (res.success) {
                    setTableData(res.data);
                    setCloneTableData(res.data);
                }
            })
            .catch((err) => { });
    };

    const setToggleModal = (userId) => {
        setSelectedUserId(userId); // Save the ID of the selected user
        setOpenModal(true); // Open the modal
    };

    const columnData = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Name",
                size: 150,
            },
            {
                accessorKey: "contact",
                header: "Contact",
                size: 150,
                Cell: ({ cell }) => (
                    <span
                        onClick={() => setToggleModal(cell.row.original.id)}
                        style={{
                            textDecoration: "none",
                            color: "blue",
                            cursor: "pointer",
                        }}
                    >
                        {cell.getValue()}
                    </span>
                ),
            },
            {
                accessorKey: "dob",
                header: "Birthdate",
                size: 150,
            },
            {
                accessorKey: "email",
                header: "Email",
                size: 150,
            },
            {
                accessorKey: "gender",
                header: "Gender",
                size: 150,
            },
            {
                accessorKey: "language",
                header: "Language",
                size: 150,
            },
            {
                accessorKey: "address",
                header: "Address",
                size: 150,
            },
        ],
        []
    );

    const tableConfig = useMaterialReactTable({
        columns: columnData,
        data: tableData,
    });

    const onSearchTextChange = (e) => {
        const searchParam = e.target.value;
        if (searchParam !== "") {
            searchUserService({ searchParam })
                .then((res) => {
                    res.success ? setTableData(res?.data) : setTableData([]);
                })
                .catch((err) => {
                    console.log(err);
                    setTableData([]);
                });
        } else {
            setTableData(cloneTableData);
        }
    };

    const formikObj = useFormik({
        enableReinitialize: true,
        initialValues: initialFormValues,
        onSubmit: (values) => {
            setIsLoading(true);
            values = { ...values, language: values.language.join(',') }
            console.log('formValues', values);
            // registerUserService(values).then(res => {
            //     if (res.success) {
            //         alert('Registration Successfull');
            //     }
            // })
            //     .catch(err => console.log('Error', err))
            //     .finally(() => setIsLoading(false))
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
                <FormControl sx={{ width: "40ch" }} variant="filled">
                    <InputLabel>Search</InputLabel>
                    <FilledInput
                        id="filled-adornment-password"
                        onChange={onSearchTextChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <div className="d-flex mt-3">
                    <MaterialReactTable table={tableConfig} />
                </div>

            <Modal show={openModal}  size="lg">
                <Modal.Header>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                            {/* <Row>
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

                            </Row> */}

                        </Stack>
                    </CardBody>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpenModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => setOpenModal(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default SearchUserInTable;
