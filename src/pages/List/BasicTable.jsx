import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';

const BasicTable = () => {

  const [tableData, setTableData] = useState([]);

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
        accessorKey: 'firstName', //access nested data with dot notation
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'email', //normal accessorKey
        header: 'Email',
        size: 200,
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

export default BasicTable;