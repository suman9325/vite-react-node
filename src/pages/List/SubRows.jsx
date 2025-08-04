import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';

export const data = [
    {
        "slNo": 1,
        "auction_Date": "18-Jul-2019",
        "auction_ID": 886656,
        "lot_No": "JCAP/EX WORKS/1807/12",
        "last_Bid_Price": 34700,
        "confirm_Date": "22-Jul-2019",
        "quantity": 63.22,
        "catalogue_Name": "JCAPCPL EX JSR WORKS SECONDS AUCTION DATED 18 JULY 2019",
        "aucDoc_ID": 19167,
        "installList": [
            {
                "aucDoc_ID": 19167,
                "installment_ID": "974183",
                "payment_Head": "EMD",
                "no_Of_Installment": 0,
                "actual_Calc_Amount": 50000,
                "payable_Calc_Amount": 0,
                "tcsPer": 0,
                "due_Date": "06-MAR-2025",
                "payment_Status": "Allocated"
            },
            {
                "aucDoc_ID": 19167,
                "installment_ID": "974184",
                "payment_Head": "Installment-1",
                "no_Of_Installment": 1,
                "actual_Calc_Amount": 2546066,
                "payable_Calc_Amount": 2546066,
                "tcsPer": 0,
                "due_Date": "06-MAR-2025",
                "payment_Status": "Pending"
            }
        ]
    },
    {
        "slNo": 1,
        "auction_Date": "18-Jul-2019",
        "auction_ID": 999999,
        "lot_No": "JCAP/EX WORKS/1807/12",
        "last_Bid_Price": 34700,
        "confirm_Date": "22-Jul-2019",
        "quantity": 63.22,
        "catalogue_Name": "testttt ",
        "aucDoc_ID": 19167,
        "installList": [
            {
                "aucDoc_ID": 19167,
                "installment_ID": "974184",
                "payment_Head": "Installment-2",
                "no_Of_Installment": 1,
                "actual_Calc_Amount": 2546066,
                "payable_Calc_Amount": 2546066,
                "tcsPer": 0,
                "due_Date": "06-MAR-2025",
                "payment_Status": "Pending"
            }
        ]
    }
]

const SubRows = () => {

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(data);
    }, [])

    //should be memoized or stable
    const columnData = useMemo(() =>
        [
            {
                accessorKey: 'auction_ID', //access nested data with dot notation
                header: 'Auction ID',
                size: 150,
            },
            {
                accessorKey: 'catalogue_Name',
                header: 'Catalogue Name',
                size: 150,
            }
        ],
        []);



    const tableConfig = useMaterialReactTable({
        columns: columnData,
        data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        // enableExpanding: true,
        renderDetailPanel: ({ row }) =>
            row.original.installList ?
                <Fragment>
                    <div className='table-responsive'>
                        <table className='table table-bordered table-sm'>
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: '#2798F5' }}><b>Payment Head</b></th>
                                    <th><b>Actual Amount</b></th>
                                    <th><b>Payable Amount</b></th>
                                    <th><b>TCS %</b></th>
                                    <th><b>Due Date</b></th>
                                    <th><b>Payment Status</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                {row.original.installList?.map((item, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>{item.payment_Head}</td>
                                        <td className='text-center'>{item.actual_Calc_Amount}</td>
                                        <td className='text-center'>{item.payable_Calc_Amount}</td>
                                        <td className='text-center'>{item.tcsPer}</td>
                                        <td className='text-center'>{item.due_Date}</td>
                                        <td className='text-center'>{item.payment_Status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Fragment> :
                null,
    });

    return (
        <Fragment>
            <DataTable tableConfigData={tableConfig} />
        </Fragment>
    );
};

export default SubRows;