import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './file.scss';

const ImageCrop = () => {

    const cropperRef = useRef(null);
    const [image, setImage] = useState(null);
    const [croppedDataUrl, setCroppedDataUrl] = useState(null);
    const [originalFile, setOriginalFile] = useState(null); // track the original file

    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOriginalFile(file);
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const cropImage = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            if (canvas) {
                const croppedUrl = canvas.toDataURL('image/jpeg');
                setCroppedDataUrl(croppedUrl);
            }
        }
    };

    const uploadImage = async () => {

        const blob = await (await fetch(croppedDataUrl)).blob();
        const croppedFile = new File([blob], `cropped-${originalFile.name}`, { type: blob.type });

        const formData = new FormData();
        formData.append('file', croppedFile); // real File object
        console.log(croppedFile);
        
        // api .......
    };

    return (
        <div style={{ padding: 10 }}>
            <div className='d-flex w-25 mb-5'>
                <input type="file" className='form-control' onChange={onImageChange} />
            </div>
            <div className='d-flex justify-content-between padding-x'>
                {image && (
                    <div>
                        <Cropper
                            src={image}
                            style={{ height: 400, width: 400 }}
                            initialAspectRatio={NaN} // Freeform
                            // viewMode={1}
                            guides={true}
                            ref={cropperRef}
                        />
                        <div className='d-flex mt-3 justify-content-center'>
                            <button onClick={cropImage} className='btn btn-secondary'>Crop</button>
                        </div>
                    </div>
                )}
                {croppedDataUrl && (
                    <div className=''>
                        <img src={croppedDataUrl} alt="Cropped Preview" style={{ maxWidth: 500, height: 400 }} />
                        <div className='d-flex mt-3 justify-content-center'>
                            <button className='btn btn-primary' onClick={uploadImage}>Upload</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCrop;
