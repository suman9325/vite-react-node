import React, { Fragment, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFileService } from '../../api/service/fileUploadService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import './file.scss';

const DragDropFile = () => {
    const [files, setFiles] = useState([]);

    // if want to clear prev files and then load new files---------
    // const onDrop = useCallback((acceptedFiles) => {
    //     setFiles(acceptedFiles.map(file => Object.assign(file, {
    //         preview: URL.createObjectURL(file)
    //     })));
    // }, []);

    // if want to retain prev files and then load new files---------
    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prevFiles => [
            ...prevFiles,
            ...acceptedFiles.map(file => ({
                file, // keep original file reference if needed later
                preview: URL.createObjectURL(file),
                name: file.name,
                type: file.type
            }))
        ]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const uploadFile = () => {
        console.log('files', files);
        const formData = new FormData();
        // selectedFile.map((file, i) => formData.append('documents', file))
        files.map((file, i) => formData.append('documents[' + i + ']', file))
        uploadFileService(formData).then(res => {
            const { success, message } = res
            if (success) {
                setFiles([]);
                // fileInputRef.current.value = '';
                toastAlert(TOAST_TYPE.SUCCESS, message);
            }
            else {
                toastAlert(TOAST_TYPE.ERROR, message);
            }
        })
            .catch(() => toastAlert(TOAST_TYPE.ERROR, 'Something Went Wrong!'))
    }

    const removeFile = (fileName) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };


    return (
        <Fragment>
            <div style={{ padding: '20px', fontFamily: 'Arial' }}>
                <div
                    {...getRootProps()}
                    style={{
                        border: '2px dashed #888',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isDragActive ? '#eee' : '#fafafa'
                    }}
                >
                    <input {...getInputProps()} />
                    {
                        isDragActive
                            ? <p>Drop the files here ...</p>
                            : <p>Drag 'n' drop some files here, or click to select files</p>
                    }
                </div>

                {files.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <div><button type="button" className='btn btn-primary mb-3' onClick={uploadFile}>Upload</button></div>
                        <div className='grid-style'>
                            {files.map(file => (
                                <div
                                    key={file.name}
                                    className='file-layout'
                                >
                                    {/* Close button */}
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        className='close-btn'
                                        title="Remove image"
                                    >
                                        <i class="bi bi-x-circle"></i>
                                    </button>

                                    {/* Image */}
                                    {file?.type?.startsWith('image/') && (
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className='img-preview'
                                            onLoad={() => URL.revokeObjectURL(file.preview)}
                                        />
                                    )}

                                    {/* PDF */}
                                    {file?.type === 'application/pdf' && (
                                        <a
                                            href={file.preview}
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
                                    )}

                                    {/* File name */}
                                    <div className='file-name'>
                                        {file?.name?.substr(0, 10) + '...'}
                                    </div>
                                </div>
                            ))}

                        </div>


                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default DragDropFile;