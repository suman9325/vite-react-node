import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const PopOver = () => {

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const mockUsers = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                address: '123 Main St, New York, NY',
                profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
                contact: '+1-555-1234',
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                address: '456 Elm St, Los Angeles, CA',
                profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
                contact: '+1-555-5678',
            },
            {
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                address: '789 Oak St, Chicago, IL',
                profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg',
                contact: '+1-555-9012',
            },
            {
                firstName: 'Bob',
                lastName: 'Williams',
                email: 'bob.williams@example.com',
                address: '321 Pine St, Houston, TX',
                profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
                contact: '+1-555-3456',
            },
        ];

        setTableData(mockUsers);
        toastAlert(TOAST_TYPE.SUCCESS, 'Mock users loaded!');
    }, []);


    //should be memoized or stable
    const columnData = useMemo(() =>
        [
            {
                accessorKey: 'firstName',
                header: 'First Name',
                size: 150,
                Cell: ({ cell, row }) => (
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="right"
                        overlay={
                            <Popover id="popover-trigger-hover-focus" title="Popover bottom" style={{ padding: '10px' }}>
                                <div className="d-flex flex-column">
                                    <img src={row.original.profilePicture} height={40} width={40}/>
                                    <span>Name: {row.original.firstName}{row.original.lastName}</span>
                                    <span>Email: {row.original.email}</span>
                                </div>
                            </Popover>
                        }
                    >
                        <a href='#' onClick={(e) => e.preventDefault()}>
                            {cell.getValue()}
                        </a>
                    </OverlayTrigger>
                )
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
                size: 150,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 200,
            },
            {
                accessorKey: 'address',
                header: 'Address',
                size: 300,
            },
            {
                accessorKey: 'profilePicture',
                header: 'Profile Picture',
                size: 150,
                Cell: ({ cell }) => (
                    <div class="">
                        <img src={cell.getValue()} height={50} width={50} />
                    </div>
                ),
                // Render profile picture using a custom renderer if needed
                // render: (rowData) => <img src={rowData.profilePicture} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />,
            },
            {
                accessorKey: 'contact',
                header: 'Contact',
                size: 150,
            },
        ],
        []);



    const tableConfig = useMaterialReactTable({
        columns: columnData,
        data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

    return (
        <Fragment>
            <DataTable tableConfigData={tableConfig} />
        </Fragment>
    );
};

export default PopOver;