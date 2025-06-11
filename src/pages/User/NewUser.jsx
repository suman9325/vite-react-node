import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Stack } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import registerImg from '../../assets/images/register.jpg'
import './user.scss'
import ButtonWithLoader from "../../components/Buttons/ButtonWithLoader";
import { useFormik } from "formik";
import moment from "moment";
import { getAllUsersService } from "../../api/service/tableService";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { TOAST_TYPE, toastAlert } from "../../components/Toaster/toastify";
import { addUpdateUserService, getUserService } from "../../api/service/userService";
import { ListItemIcon, MenuItem } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { getAllCountryService, getAllStateByCountryService } from "../../api/service/dropDownService";
import Select from 'react-select';

const initialFormValues = {
    id: '',
    name: '',
    email: '',
    password: '',
    contact: '',
    gender: '',
    language: [],
    address: '',
    dob: '',
    avatar: '',
    cid: '',
    cname: '',
    sid: '',
    sname: ''
}

export default function NewUser() {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [filteredStateList, setfilteredStateList] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // State to hold selected file
    const fileInputRef = useRef(null); // Ref htmlFor file input element
    const supportedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxFileSize = 5000000; //bytes

    useEffect(() => {
        getAllUsers();
        getAllCountryList();
    }, [])

    const getAllCountryList = () => {
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
    }

    const getAllUsers = () => {
        getUserService().then(res => {
            if (res.success) {
                setTableData(res.data);
            }
        }).catch(err => {
            console.error('Error fetching users:', err);
        });
    }

    const columnData = useMemo(() =>
        [
            {
                accessorKey: "avatar",
                header: "Avatar",
                size: 80,
                Cell: ({ cell }) => (
                    <span>
                        <img src={`${import.meta.env.VITE_FILE_BASE_URL}/${cell.getValue()}`} style={{ borderRadius: '50%' }} width={50} />
                    </span>
                ),
            },
            { accessorKey: 'name', header: 'Name', size: 150 },
            { accessorKey: 'contact', header: 'Contact', size: 150 },
            { accessorKey: 'dob', header: 'Birthdate', size: 150 },
            { accessorKey: 'email', header: 'Email', size: 150 },
            { accessorKey: 'gender', header: 'Gender', size: 150 },
            { accessorKey: 'language', header: 'Language', size: 150 },
            { accessorKey: 'address', header: 'Address', size: 150 },
        ],
        []);

    const tableConfig = useMaterialReactTable({
        columns: columnData,
        data: tableData,
        enableRowActions: true,
        initialState: {
            columnPinning: {
                right: ['mrt-row-actions'],
            },
        },
        renderRowActionMenuItems: ({ closeMenu, row }) => [
            <MenuItem key={0} onClick={() => callUser(row.original.id)} sx={{ m: 0 }}>
                <ListItemIcon><Edit /></ListItemIcon> Edit
            </MenuItem>,
            <MenuItem key={1} onClick={() => closeMenu()} sx={{ m: 0 }}>
                <ListItemIcon><Delete /></ListItemIcon> Delete
            </MenuItem>,
        ],
    });

    const formikObj = useFormik({
        initialValues: initialFormValues,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('id', values.id);
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('contact', values.contact);
            formData.append('gender', values.gender);
            formData.append('language', values.language.join(','));
            formData.append('address', values.address);
            formData.append('dob', moment(values.dob).format('YYYY-MM-DD'));
            formData.append('cid', values.cid);
            formData.append('sid', values.sid);
            if (selectedFile) {
                formData.append('avatar', selectedFile); // Append file to form data
            }

            addUpdateUserService(formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {
                if (res.success) {
                    toastAlert(TOAST_TYPE.SUCCESS, res.message);
                    formikObj.resetForm();
                    getAllUsers();
                }
            }).catch(err => {
                console.error('Error submitting form:', err);
            }).finally(() => setIsLoading(false));
        }
    });

    const callUser = (id) => {
        getUserService({ id }).then(res => {
            if (res.success) {
                setIsEdit(true);
                const languageArray = res.data.language.split(',');
                const updatedValues = { ...initialFormValues, ...res.data, language: languageArray };
                formikObj.setValues(updatedValues);
                const country = (countryList.filter(item => item.value == res.data.cid))?.[0];
                onCountryChange(country);
            }
        }).catch(err => {
            console.error('Error fetching user details:', err);
        });
    }

    const handleLanguage = (e) => {
        const { value, checked } = e.target;
        const updatedLanguages = checked
            ? [...formikObj.values.language, value]
            : formikObj.values.language.filter(lang => lang !== value);
        formikObj.setFieldValue('language', updatedLanguages);
    }

    useEffect(() => {
        if (!!formikObj.values.id && filteredStateList.length > 0) {
            const state = (filteredStateList.filter(item => item.value == formikObj.values.sid))?.[0];
            setSelectedState(state);
        }
    }, [formikObj.values, filteredStateList])

    const getFile = (e) => {
        const inputFile = e.target.files[0];
        console.log(inputFile);

        if (inputFile.size > maxFileSize) {
            toastAlert(TOAST_TYPE.ERROR, 'File size is too large!');
            fileInputRef.current.value = ''; // Clear file input
            setSelectedFile(null);
            return;
        } else if (!supportedFileTypes.includes(inputFile.type)) {
            toastAlert(TOAST_TYPE.ERROR, 'File type not supported!');
            fileInputRef.current.value = ''; // Clear file input
            setSelectedFile(null);
            return;
        }
        setSelectedFile(inputFile);
    }

    const onCountryChange = (val) => {
        setfilteredStateList([]);
        if (!!val) {
            formikObj.setFieldValue('cid', val.value);
            formikObj.setFieldValue('cname', val.label);
            setSelectedCountry(val);
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

    const onStateChange = (val) => {
        setSelectedState(val); // Update selected state
        formikObj.setFieldValue('sid', val.value);
        formikObj.setFieldValue('sname', val.label);
    };

    return (
        <Fragment>
            <Container fluid='md'>
                <div className="d-flex">
                    <Card className="me-3" style={{ width: '800px' }}>
                        <CardHeader>
                            <h3>{isEdit ? 'Edit User' : 'Add User'}</h3>
                        </CardHeader>
                        <CardBody className="f-s-12">
                            <Stack gap={3}>
                                <Row>
                                    <Col sm={12}>
                                        <input type='file' className='form-control' onChange={getFile} ref={fileInputRef} />
                                    </Col>
                                </Row>
                                {/* Other form inputs */}
                                <Row>
                                    <Col sm={12}>
                                        <input type="text" name="name" value={formikObj.values.name} onChange={formikObj.handleChange} className="form-control" placeholder="Enter your name" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <input type="text" name="contact" value={formikObj.values.contact} onChange={formikObj.handleChange} className="form-control" id="exampleFormControlInput1" placeholder="Enter your contact" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} className="d-flex text-align-start">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="gender" type="radio" id="inlineCheckbox1" value="M" onChange={formikObj.handleChange} checked={formikObj.values.gender == 'M'} />
                                            <label className="form-check-label" htmlFor="inlineCheckbox1">Male</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="gender" type="radio" id="inlineCheckbox2" value="F" onChange={formikObj.handleChange} checked={formikObj.values.gender == 'F'} />
                                            <label className="form-check-label" htmlFor="inlineCheckbox2">Female</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} className="d-flex text-align-start">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="language" type="checkbox" id="inlineCheckbox1" value="English" onChange={handleLanguage} checked={formikObj.values.language.includes('English')} />
                                            <label className="form-check-label" htmlFor="inlineCheckbox1">English</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="language" type="checkbox" id="inlineCheckbox2" value="Bengali" onChange={handleLanguage} checked={formikObj.values.language.includes('Bengali')} />
                                            <label className="form-check-label" htmlFor="inlineCheckbox2">Bengali</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" name="language" type="checkbox" id="inlineCheckbox2" value="Hindi" onChange={handleLanguage} checked={formikObj.values.language.includes('Hindi')} />
                                            <label className="form-check-label" htmlFor="inlineCheckbox2">Hindi</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <textarea className="form-control" name="address" value={formikObj.values.address} onChange={formikObj.handleChange} id="exampleFormControlTextarea1" rows="3" placeholder="Enter your address"></textarea>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <input type="email" name="email" onChange={formikObj.handleChange} value={formikObj.values.email} className="form-control" id="exampleFormControlInput1" placeholder="Enter your email" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <input type="password" name="password" onChange={formikObj.handleChange} value={formikObj.values.password} className="form-control" id="exampleFormControlInput1" placeholder="********" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} className="">
                                        <Flatpickr
                                            style={{ width: '-webkit-fill-available', padding: '5px', borderRadius: '5px' }}
                                            placeholder="Enter DOB"
                                            value={formikObj.values.dob}
                                            onChange={([date]) => {
                                                formikObj.setFieldValue('dob', moment(date).format('YYYY-MM-DD'))
                                            }}
                                        />

                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        {/* <select className="form-select" name="country" aria-label="Default select example" onChange={formikObj.handleChange} value={formikObj.values.country}>
                                            <option selected>Select Country</option>
                                            {countryList?.map(item =>
                                                <option value={item?.id}>{item?.name}</option>
                                            )
                                            }
                                        </select> */}
                                        <div className='d-flex justify-content-between'>
                                            <label className='me-1'>Country</label>
                                            <Select
                                                className="w-300 me-3"
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                // isMulti
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
                                                // isMulti
                                                name="stateList"
                                                options={filteredStateList}
                                                onChange={onStateChange}
                                                value={selectedState}
                                            />
                                        </div>
                                    </Col>

                                </Row>
                            </Stack>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={formikObj.resetForm} variant="secondary" className="me-2">Cancel</Button>
                            <ButtonWithLoader onBtnClick={formikObj.handleSubmit} isLoading={isLoading} style={'btn btn-primary'}>
                                {isEdit ? 'Update' : 'Save'}
                            </ButtonWithLoader>
                        </CardFooter>
                    </Card>
                    <MaterialReactTable table={tableConfig} />
                </div>
            </Container>
        </Fragment>
    );
}
