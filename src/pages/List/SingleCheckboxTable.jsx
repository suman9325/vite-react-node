import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Stack } from "react-bootstrap";
import { getAllFilesService, uploadFileService } from '../../api/service/fileUploadService';
import DataTable from '../../components/DataTable/DataTable';
import { useMaterialReactTable } from 'material-react-table';

const SingleCheckboxTable = () => {
    const [tableData, setTableData] = useState([]);
    const [rowIds, setRowIds] = useState("");

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
                accessorKey: "fullPath",
                header: "Profile",
                size: 150,
                Cell: ({ cell }) => (
                    <span>
                        <img src={cell.getValue()} style={{borderRadius: '50%'}} width={50}/>
                    </span>
                ),
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

    const tableConfig = useMaterialReactTable({
        enableRowSelection: true,
        enableMultiRowSelection: false, // Enforces single-row selection
        columns: columnData,
        data: tableData, 
    });

    useEffect(() => {
        const rowIds = (tableConfig.getSelectedRowModel().flatRows.map((row) => row.original)).map(item => {return item.id});
        setRowIds(rowIds);
      }, [tableConfig.getState().rowSelection]);

    return (
        <Fragment>
            <Container fluid='md'>
                <Card>
                    <DataTable tableConfigData={tableConfig} />
                </Card>
            </Container>
        </Fragment>
    )
};

export default SingleCheckboxTable;