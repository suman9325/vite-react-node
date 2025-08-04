import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';
import classnames from 'classnames';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const List = () => {

  const [tableData, setTableData] = useState([]);

  const dataSet = [
    {
      id: 1,
      name: 'John Doe',
      address: '123 Main St',
    },
    {
      id: 2,
      name: 'Jane Smith',
      address: '456 Elm St',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      address: '789 Oak St',
    },
    {
      id: 4,
      name: 'Bob Brown',
      address: '101 Pine St',
    },
    {
      id: 5,
      name: 'Charlie Davis',
      address: '202 Maple St',
    }
  ]

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
          } onClick={handleExport}>
            {cell.getValue()}
          </div>
        ),
      },
    ],
    []);

  const tableConfig = useMaterialReactTable({
    columns,
    data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  // to customize the excel sheet and download it

  // const handleExport = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('User Data');

  //   // Add Header Row
  //   const headerRow = (Object.keys(dataSet?.[0])).map(col => col);
  //   worksheet.addRow(headerRow);

  //   // Add Data Rows
  //   dataSet.forEach(row => {
  //     worksheet.addRow((Object.values(row)).map(item => item));
  //   });

  //   // Style Header Row
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };  // Bold text
  //     cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Center alignment
  //     cell.fill = {  // Background Color
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'FFCCE5FF' },  // Light Blue
  //     };
  //     cell.border = {  // Border around header cell
  //       top: { style: 'thin' },
  //       left: { style: 'thin' },
  //       bottom: { style: 'thin' },
  //       right: { style: 'thin' },
  //     };
  //   });

  //   // Auto Width for All Columns
  //   worksheet.columns.forEach(column => {
  //     let maxLength = 0;
  //     column.eachCell({ includeEmpty: true }, cell => {
  //       const columnLength = cell.value ? cell.value.toString().length : 10;
  //       if (columnLength > maxLength) {
  //         maxLength = columnLength;
  //       }
  //     });
  //     column.width = maxLength < 10 ? 10 : maxLength + 2;
  //   });

  //   // Create and Download File
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  //   const fileExtension = '.xlsx';

  //   const fileName = `User_${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}`;

  //   const data = new Blob([buffer], { type: fileType });
  //   saveAs(data, fileName + fileExtension);
  // };

  // normal export function using xlsx library
  
  const handleExport = () => {
    // Convert JSON data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
    XLSX.writeFile(workbook, `User_${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.xlsx`);
  };


  return (
    <Fragment>
      {/* <div className='d-flex justify-content-end mb-3'>
        <button className="btn btn-primary" onClick={handleExport}>Export to Excel</button>
      </div> */}
      <DataTable tableConfigData={tableConfig} />
    </Fragment>
  );
};

export default List;