import React, { Component, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Bold,
    Essentials,
    Heading,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    Table,
    Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const CKeditorComponent = () => {
    const [editorData, setEditorData] = useState('');

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
        console.log('Editor data: ', data); // This will print the editor content to console
    };

    return (
        <>
            {/* <CKEditor
                editor={ClassicEditor}
                onChange={handleEditorChange}
                config={{
                    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjYwMTU5OTksImp0aSI6IjllYjQyMWFiLTA1ZWYtNDQ1Mi04Y2IzLWJiMDE2MzY4NTA2YiIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiQk9YIl0sInZjIjoiNWZlZWVkY2IifQ.zyzxgurtz0_kqTMLdk-BWJAq-0dBaF7hwEIYOgJaEcXdUr3R6OMBtrYjhXv2GH7vjaKjO4NWIA_m_uEtX_8N1Q', // Or 'GPL'.
                    toolbar: [
                        'undo', 'redo', '|',
                        'heading', '|', 'bold', 'italic', '|',
                        'link', 'insertTable', 'mediaEmbed', '|',
                        'bulletedList', 'numberedList', 'indent', 'outdent'
                    ],
                    plugins: [
                        Bold,
                        Essentials,
                        Heading,
                        Indent,
                        IndentBlock,
                        Italic,
                        Link,
                        List,
                        MediaEmbed,
                        Paragraph,
                        Table,
                        Undo
                    ],
                    initialData: '<h1>Hello from CKEditor 5!</h1>',
                }}
            /> */}

            <CKEditor
                editor={ClassicEditor}
                data={'<h1>Hello from CKEditor 5!</h1>'}
                onChange={handleEditorChange}
                onReady={editor => {
                    console.log('Editor is ready to use!', editor);
                }}
            />
        </>
    );
}

export default CKeditorComponent;
