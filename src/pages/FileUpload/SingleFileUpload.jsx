import React, { Fragment, useRef, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Stack } from "react-bootstrap";
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import { uploadFileService } from '../../api/service/fileUploadService';
import { useFormik } from "formik";

const initialFormValues = {
    category: '',
    is_default: 0
}

const SingleFileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const supportedFile = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    ]
    const maxFileSize = 5000000; //bytes

    const formikObj = useFormik({
        enableReinitialize: true,
        initialValues: initialFormValues,
    })

    const toggleCheck = (e) => {
        const { value, checked } = e.target;
        checked ? formikObj.setFieldValue('is_default', 1) : formikObj.setFieldValue('is_default', 0)
    }

    const getFile = (e) => {
        const inputFile = e.target.files[0];
        console.log(inputFile);

        if (inputFile.size > maxFileSize) {
            toastAlert(TOAST_TYPE.ERROR, 'File size is large!');
            fileInputRef.current.value = ''; // Clear file input
            setSelectedFile(null);
            return;
        }
        else if (!supportedFile.includes(inputFile.type)) {
            toastAlert(TOAST_TYPE.ERROR, 'File type is not supported!');
            fileInputRef.current.value = ''; // Clear file input
            setSelectedFile(null);
            return;
        }
        else setSelectedFile(inputFile);

    }

    const uploadFile = () => {
        const formData = new FormData();
        formData.append('documents', selectedFile);
        formData.append('category', formikObj.values.category);
        formData.append('is_default', formikObj.values.is_default);
        uploadFileService(formData).then(res => {
            const { success, message } = res
            if (success) {
                setSelectedFile([]);
                fileInputRef.current.value = '';
                toastAlert(TOAST_TYPE.SUCCESS, message);
            }
            else {
                toastAlert(TOAST_TYPE.ERROR, message);
            }
        })
    }

    return (
        <Fragment>
            <Container fluid='md'>
                <Card>
                    <CardHeader>
                        <h5>Single File Upload</h5>
                    </CardHeader>
                    <CardBody>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <label>Category</label>
                                <input type='text' name='category' className='form-control' onChange={formikObj.handleChange} />
                            </div>
                            <div className='col-sm-6'>
                                <label>Is Default</label>
                                <input type='checkbox' name='is_default' className="form-check-input" onChange={toggleCheck} />
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <input type='file' className='form-control' onChange={getFile} ref={fileInputRef} />
                        </div>
                        <div className='row mt-3'>
                            {/* Preview for Images */}
                            {selectedFile?.type?.startsWith("image/") && (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Preview"
                                    style={{ width: "200px", marginTop: "10px" }}
                                />
                            )}
                        </div>
                    </CardBody>
                    <CardFooter className='d-flex justify-content-center'>
                        <Button variant="primary" onClick={uploadFile} disabled={selectedFile === null}>Upload</Button>
                    </CardFooter>
                </Card>
            </Container>
        </Fragment>
    )
}

export default SingleFileUpload;