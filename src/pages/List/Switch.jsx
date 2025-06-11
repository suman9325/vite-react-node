import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';
import classnames from 'classnames';
import { getActiveInactiveUserService, toggleActiveInactiveUserService, updateActiveInactiveUserService } from '../../api/service/userService';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';

let toggleActive = false;

const Switch = () => {

    const [tableData, setTableData] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [rowData, setRowData] = useState({
        id: 0,
        isActive: false
    });

    useEffect(() => {
        getActiveInactiveUser(isActive);
    }, [])

    const getActiveInactiveUser = (isActive) => {
        getActiveInactiveUserService({ isActive }).then(res => {
            if (res.success) {
                // toastAlert(TOAST_TYPE.SUCCESS, 'Users Fetched Successfully!');
                setTableData(res.data);
            }
        })
            .catch(err => {
                console.log(err);
            })
    }

    //should be memoized or stable
    const columns = useMemo(() =>
        [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'First Name',
                size: 150,
            },
            {
                accessorKey: 'email', //normal accessorKey
                header: 'Email',
                size: 200,
            },
            {
                accessorKey: "password",
                header: "Salary",
                size: 200,
                Cell: ({ cell }) => (
                    <div className={
                        classnames('fw-bold', {
                            'text-success': (cell.getValue() >= 15000 && cell.getValue() < 30000),
                            'text-primary': (cell.getValue() >= 30000 && cell.getValue() < 45000),
                            'text-warning': (cell.getValue() >= 45000)
                        })
                    }>
                        {cell.getValue()}
                    </div>
                ),
            },
            {
                accessorKey: "isActive",
                header: "Action",
                size: 200,
                Cell: ({ cell }) => (
                    <div class="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            style={{ height: 20, width: 40 }}
                            checked={cell.getValue()}
                            onClick={() => {
                                toggleActive = cell.getValue();
                                setIsConfirmDialogOpen(true);
                                const { id, isActive } = { id: cell.row.original.id, isActive: !(cell.getValue()) }
                                setRowData({ id, isActive });
                            }}
                        />
                    </div>
                ),
            },
        ],
        []);

    const tableConfig = useMaterialReactTable({
        columns,
        data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

    const toggleData = () => {
        setIsActive(!isActive);
        getActiveInactiveUser(!isActive);
    }

    const updateActiveInactiveUser = () => {
        updateActiveInactiveUserService(rowData).then(res => {
            if (res.success) {
                toastAlert(TOAST_TYPE.SUCCESS, 'Updated Successfully');
                getActiveInactiveUser(isActive);
            }
            else {
                toastAlert(TOAST_TYPE.ERROR, 'Update Failed');
            }
        })
    }


    return (
        <Fragment>
            <div class="form-check form-switch mb-3">
                <input class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                    style={{ height: 40, width: 100 }}
                    checked={isActive}
                    onChange={toggleData}
                />
            </div>
            <DataTable tableConfigData={tableConfig} />

            {isConfirmDialogOpen && (
                <ConfirmDialog
                    open={isConfirmDialogOpen}
                    title={'Confirm?'}
                    message={toggleActive ? 'Are you sure to Deactive?' : 'Are you sure to Active?'}
                    onConfirm={() => {
                        setIsConfirmDialogOpen(false);
                        updateActiveInactiveUser()
                    }}
                    onClose={() => setIsConfirmDialogOpen(false)}
                    confirmText={'Yes'}
                    cancelText={'No'}
                />
            )
            }
        </Fragment>
    );
};

export default Switch;