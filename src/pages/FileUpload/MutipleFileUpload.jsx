import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Stack } from "react-bootstrap";
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import { uploadFileService } from '../../api/service/fileUploadService';
import "./file.scss";

const MultipleFileUpload = () => {
    const [selectedFile, setSelectedFile] = useState([]);
    const fileInputRef = useRef(null);
    const [previewFiles, setPreviewFiles] = useState([]);
    // const supportedFile = ['image/jpeg', 'image/jpg', 'image/png']
    // const maxFileSize = 70000; //bytes

    const getFile = (e) => {

        const inputFile = Array.from(e.target.files);
        if (inputFile.length > 0) {
            const validFiles = [];
            for (const el of inputFile) {
                // if (el.size > maxFileSize) {
                //     toastAlert(TOAST_TYPE.ERROR, 'File size is large!');
                //     fileInputRef.current.value = ''; // Clear file input
                //     return; // Stop further checks
                // }
                // if (!supportedFile.includes(el.type)) {
                //     toastAlert(TOAST_TYPE.ERROR, 'File type is not supported!');
                //     fileInputRef.current.value = ''; // Clear file input
                //     return; // Stop further checks
                // }
                validFiles.push(el); // Add valid file to the list
            }

            setSelectedFile(validFiles);
        }

    }

    useEffect(() => {
        const previewURL = [];
        for (const el of selectedFile) {
            previewURL.push({
                srcURL: URL.createObjectURL(el),
                name: el.name,
                type: el.type
            });
        }
        setPreviewFiles(previewURL);
    }, [selectedFile])

    const uploadFile = () => {
        const formData = new FormData();
        // selectedFile.map((file, i) => formData.append('documents', file))
        selectedFile.map((file, i) => formData.append('documents[' + i + ']', file))
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
            .catch(() => toastAlert(TOAST_TYPE.ERROR, 'Something Went Wrong!'))
    }

    const removeFile = (fileName) => {
        setSelectedFile(prevFiles => prevFiles.filter(file => file.name !== fileName));
    }

    return (
        <Fragment>
            <Container fluid='md'>
                <Card>
                    <CardHeader>
                        <h5>Multiple File Upload</h5>
                    </CardHeader>
                    <CardBody>
                        <input type='file' multiple className='form-control mb-4' onChange={getFile} ref={fileInputRef} />
                        <div className="image-grid">
                            {previewFiles.map((item, idx) => (
                                <div key={idx} className="image-item">
                                    {/* Close button */}
                                    <button
                                        onClick={() => removeFile(item.name)}
                                        className='cross-btn'
                                        title="Remove image"
                                    >
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                    {item?.type?.startsWith('image/') &&
                                        <img src={item?.srcURL} height={200} width={200} />
                                    }
                                    {item?.type === 'application/pdf' &&
                                        <a
                                            href={item.srcURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {/* pdf icon */}
                                            <div className='pdf-preview'>
                                                <span style={{ fontSize: '48px' }}>
                                                    <i class="bi bi-file-earmark-pdf"></i>
                                                </span>
                                            </div>
                                        </a>
                                    }
                                </div>
                            ))}
                        </div>


                    </CardBody>
                    <CardFooter className='d-flex justify-content-center'>
                        <Button variant="primary" onClick={uploadFile} disabled={selectedFile.length === 0}>Upload</Button>
                    </CardFooter>
                </Card>
            </Container>
        </Fragment>
    )
}

export default MultipleFileUpload;