import React, { Fragment, useState } from "react";
import { useFormik, FieldArray, FormikProvider, Form } from "formik";
import * as Yup from "yup";
import { Button, Icon, Input } from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";

const formFields = {
    userData: [
        {
            fullname: "",
            address: "",
            contact: "",
            mailId: ""
        }
    ]
}
const MultipleUserAdd = () => {

    const formikObj = useFormik({
        initialValues: formFields,
        // enableReinitialize: true,
        // validateOnChange: true,
        // validationSchema: Yup.object({
        //   users: Yup.array().of(
        //     Yup.object({
        //       fullname: Yup.string().required("Full Name is required"),
        //       address: Yup.string().required("Address is required"),
        //       contact: Yup.string().required("Contact is required"),
        //       mailId: Yup.string().email("Invalid Email").required("Email is required"),
        //     })
        //   ),
        // }),
        onSubmit: (values) => {
            console.log(values);
            // Handle form submission here
        },
    });

    return (
        <Fragment>
            <Card>
                <CardHeader>Add Multiple Users</CardHeader>
                <CardBody>
                    <FormikProvider value={formikObj}>
                        <table>
                            <FieldArray
                                name="userData"
                                render={arrayhelpers => (
                                    <>
                                        {
                                            formikObj.values.userData.map((field, index) => {
                                                const isLastRow = formikObj.values.userData?.length - 1 === index;
                                                const getFieldName = (fieldName) => `${arrayhelpers.name}[${index}][${fieldName}]`;
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <Input
                                                                type='text'
                                                                placeholder="Enter Name"
                                                                // required
                                                                name={getFieldName("fullname")}
                                                                id={getFieldName("fullname")}
                                                                onChange={(e) => {
                                                                    formikObj.handleChange(e)
                                                                }}
                                                                value={field.fullname}
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type='text'
                                                                placeholder="Enter Address"
                                                                // required
                                                                name={getFieldName("address")}
                                                                id={getFieldName("address")}
                                                                onChange={(e) => {
                                                                    formikObj.handleChange(e)
                                                                }}
                                                                value={field.address}
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type='text'
                                                                placeholder="Enter Contact"
                                                                // required
                                                                name={getFieldName("contact")}
                                                                id={getFieldName("contact")}
                                                                onChange={(e) => {
                                                                    formikObj.handleChange(e)
                                                                }}
                                                                value={field.contact}
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type='email'
                                                                placeholder="Enter Email"
                                                                // required
                                                                name={getFieldName("mailId")}
                                                                id={getFieldName("mailId")}
                                                                onChange={(e) => {
                                                                    formikObj.handleChange(e)
                                                                }}
                                                                value={field.mailId}
                                                                className="form-control"
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className='cursor-pointer d-flex'>
                                                                {formikObj.values?.userData?.length > 1 &&
                                                                    <Button color="warning" onClick={() => arrayhelpers.remove(index)}>
                                                                        <RemoveCircleOutlineOutlinedIcon />
                                                                    </Button>
                                                                }
                                                                {isLastRow &&
                                                                    <Button
                                                                        onClick={() => {
                                                                            arrayhelpers.push({
                                                                                fullname: "",
                                                                                address: "",
                                                                                contact: "",
                                                                                mailId: ""
                                                                            })
                                                                        }}>
                                                                        <AddCircleOutlineOutlinedIcon />
                                                                    </Button>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </>
                                )}

                            />
                        </table>
                    </FormikProvider>
                </CardBody>
                <CardFooter className="d-flex justify-content-end">
                    <Button type="submit" color="primary" variant="contained" onClick={formikObj.handleSubmit}>Submit</Button>
                </CardFooter>
            </Card>

        </Fragment>
    );
};

export default MultipleUserAdd;