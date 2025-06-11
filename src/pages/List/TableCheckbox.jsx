import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';
import ButtonWithLoader from '../../components/Buttons/ButtonWithLoader';

const TableCheckbox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [rowIds, setRowIds] = useState("");

  useEffect(() => {
    getAllUsersService().then(res => {
      if (res.success) {
        toastAlert(TOAST_TYPE.SUCCESS, 'Users Fetched Successfully!');
        setTableData(res.data)
      }
    })
      .catch(err => {
        console.log(err);
      })
  }, [])

  //should be memoized or stable
  const columnData = useMemo(() =>
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
        accessorKey: 'contact', //normal accessorKey
        header: 'Contact',
        size: 200,
      },
    ],
    []);



  const tableConfig = useMaterialReactTable({
    enableRowSelection: true,
    getRowId: (row) => row.id,
    columns: columnData,
    data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  useEffect(() => {
    console.log('Selected rows:', tableConfig.getSelectedRowModel().flatRows.map((row) => row.original));
    const rowIds = (tableConfig.getSelectedRowModel().flatRows.map((row) => row.original)).map(item => {return item.id}).join();
    setRowIds(rowIds);
  }, [tableConfig.getState().rowSelection]);

  const submitForm = () => {
    if (rowIds==''){
      toastAlert(TOAST_TYPE.ERROR, 'Please Select at least one row');
    }
    else {
      setIsLoading(true);
      console.log(rowIds);
      setTimeout(() => {
          setIsLoading(false);
      }, 3000);
    }

  }

  return (
    <Fragment>
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h3>Table Example</h3>
          </div>
          <div className="card-body">
            <DataTable tableConfigData={tableConfig} />
          </div>
          <div className="card-footer d-flex justify-content-end">
            <ButtonWithLoader style={'btn btn-primary'} onBtnClick={submitForm} isLoading={isLoading} >Delete</ButtonWithLoader>
          </div>
        </div>
      </div>

    </Fragment>
  );
};

export default TableCheckbox;