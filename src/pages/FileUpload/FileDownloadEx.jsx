import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Stack } from "react-bootstrap";
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import { getAllFilesService, uploadFileService } from '../../api/service/fileUploadService';
import DataTable from '../../components/DataTable/DataTable';
import { useMaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

const FileDownloadEx = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        getAllFilesService().then(res => {
            const { success, data } = res;
            if (success) {
                setTableData(data);
            }
        })
            .catch(() => { console.error() })
    }, [])

    const columnData = useMemo(() =>
        [
            {
                accessorKey: 'id', //access nested data with dot notation
                header: 'ID',
                size: 150,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150,
            },
            {
                accessorKey: 'type',
                header: 'Type',
                size: 150,
            }
        ],
        []);

    const downloadFiles = async (file) => {
        try {
            // Fetch the file as a Blob

            const response = await fetch(file?.fullPath, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            const blob = await response.blob();
            saveAs(blob, file?.name); // Use FileSaver to trigger download
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    const downloadViewFile = (fileData) => {
        // console.log(`${import.meta.env.VITE_FILE_BASE_URL}/${fileData?.fullPath}`)
        switch (fileData?.type) {
            case "image/jpeg":
            case "application/pdf":
                window.open(fileData?.fullPath, '_blank');
                break;

            default:
                downloadFiles(fileData);
                break;
        }
    }

    const tableConfig = useMaterialReactTable({
        columns: columnData,
        data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableRowActions: true,
        initialState: {
            columnPinning: {
                right: ['mrt-row-actions'],
            },
        },
        renderRowActions: ({ row }) => (
            <Tooltip title="Download">
                <IconButton
                    onClick={() => downloadViewFile(row?.original)}
                >
                    <DownloadIcon />
                </IconButton>
            </Tooltip>
        ),
    });

    return (
        <Fragment>
            <Container fluid='md'>
                <Card>
                    <DataTable tableConfigData={tableConfig} />
                </Card>
            </Container>
        </Fragment>
    )
}

export default FileDownloadEx;