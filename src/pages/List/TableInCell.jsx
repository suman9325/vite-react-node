import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';
import { Button } from 'react-bootstrap';
import { Checkbox } from '@mui/material';

const jsonData =
    [
        {
            "slNo": 278,
            "auction_Date": "2024-02-23",
            "auction_ID": 1477554,
            "lot_No": "Lot No:-092",
            "last_Bid_Price": 46200,
            "confirm_Date": "2024-02-24",
            "quantity": 28.09,
            "catalogue_Name": "TATA STEEL-IBMD/ Sheet Cutting (Seconds Material) IBMD Marine Drive / Ludhiana STY / Faridabad STY / Palwal STY / Allied-5 Special Auction Dt 23rd Feb 24(Catalogid:128986)",
            "aucDoc_ID": 266938,
            "installList": [
                {
                    "aucDoc_ID": 266938,
                    "installment_ID": "565624",
                    "payment_Head": "Installment-1",
                    "actual_Calc_Amount": 500,
                    "payable_Calc_Amount": 602.25,
                    "tcsPer": 10,
                    "due_Date": "26-FEB-2024",
                    "payment_Status": "Allocated"
                },
                {
                    "aucDoc_ID": 266938,
                    "installment_ID": "1397933",
                    "payment_Head": "Installment-1",
                    "actual_Calc_Amount": 750,
                    "payable_Calc_Amount": 852,
                    "tcsPer": 26,
                    "due_Date": "26-FEB-2024",
                    "payment_Status": "Allocated"
                }
            ]
        },
        {
            "slNo": 558,
            "auction_Date": "2024-02-28",
            "auction_ID": 1479883,
            "lot_No": "L155",
            "last_Bid_Price": 48600,
            "confirm_Date": "2024-02-29",
            "quantity": 30.08,
            "catalogue_Name": "TATA STEEL-IBMD/ Sheet Cutting (Seconds Material) IBMD Marine Drive / Ludhiana STY / Faridabad STY / Palwal STY / Allied-5 Auction Dt 28th Feb 24(Catalogid:129435)",
            "aucDoc_ID": 267646,
            "installList": [
                {
                    "aucDoc_ID": 267646,
                    "installment_ID": "1399455",
                    "payment_Head": "Installment-1",
                    "actual_Calc_Amount": 777,
                    "payable_Calc_Amount": 741,
                    "tcsPer": 12,
                    "due_Date": "02-MAR-2024",
                    "payment_Status": "Pending"
                },
                {
                    "aucDoc_ID": 267646,
                    "installment_ID": "567147",
                    "payment_Head": "Installment-1",
                    "actual_Calc_Amount": 456,
                    "payable_Calc_Amount": 421,
                    "tcsPer": 25,
                    "due_Date": "02-MAR-2024",
                    "payment_Status": "Pending"
                }
            ]
        }
    ]

const TableInCell = () => {

    const [tableData, setTableData] = useState(jsonData);
    const [rowData, setRowData] = useState(null);
    const [nextTableData, setNextTableData] = useState([]);
    const [textBoxData, setTextBoxData] = useState();

    //should be memoized or stable
    const columnData = useMemo(() =>
        [
            {
                accessorKey: 'auction_Date', //access nested data with dot notation
                header: 'Auction Date',
                size: 150,
            },
            {
                accessorKey: 'last_Bid_Price',
                header: 'Price',
                size: 150,
            },
            {
                accessorKey: 'lot_No', //normal accessorKey
                header: 'lot_No',
                size: 200,
            },
            {
                accessorKey: 'quantity', //access nested data with dot notation
                header: 'quantity',
                size: 150,
            },
            {
                accessorKey: 'catalogue_Name',
                header: 'catalogue_Name',
                size: 150,
            },
            {
                accessorKey: 'aucDoc_ID', //normal accessorKey
                header: 'aucDoc_ID',
                size: 200,
            },
            {
                accessorKey: "installList",
                header: "installList",
                size: 150,
                Cell: ({ cell }) => (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Installment ID</th>
                                    <th>Payment Head</th>
                                    <th>Payment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(cell.getValue()).map(item => (
                                    <tr>
                                        <td>{item.installment_ID}</td>
                                        <td>{item.payment_Head}</td>
                                        <td>{item.payment_Status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ),
            },
        ],
        []);

    const tableConfig = useMaterialReactTable({
        enableRowSelection: true,
        enableMultiRowSelection: false, // Enforces single-row selection
        columns: columnData,
        data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

    useEffect(() => {
        const rowData = (tableConfig.getSelectedRowModel().flatRows.map((row) => row.original)).map(item => { return item });
        setRowData(rowData);
        setNextTableData((jsonData.filter(item => item.slNo === rowData[0]?.slNo))?.[0]);
    }, [tableConfig.getState().rowSelection]);

    const validateRowData = (e) => {
        if (rowData.length > 0) {
            toastAlert(TOAST_TYPE.SUCCESS, 'Row Selected!')
        }
        else {
            toastAlert(TOAST_TYPE.ERROR, 'Please select at least one row!')
        }

    }

    useEffect(() => {
        if (nextTableData?.installList?.length > 0) {
            setTextBoxData(nextTableData?.installList?.[0]);
            console.log(nextTableData?.installList?.[0]);
        }
    }, [nextTableData?.installList])

    return (
        <Fragment>
            <DataTable tableConfigData={tableConfig} />
            <div className='d-flex justify-content-end mb-4'>
                <Button style={{ width: '200px', marginTop: 20 }} onClick={validateRowData}>Submit</Button>
            </div>
            {nextTableData?.installList?.length > 0 &&
                <div>
                    <div className='card'>
                        <table className='table table-striped table-sm'>
                            <thead style={{ backgroundColor: 'skyblue' }}>
                                <tr>
                                    <th className='text-center'><b>Select</b></th>
                                    <th className='text-center'><b>Payment Head</b></th>
                                    <th className='text-center'><b>Actual Amount</b></th>
                                    <th className='text-center'><b>Payable Amount</b></th>
                                    <th className='text-center'><b>TCS %</b></th>
                                    <th className='text-center'><b>Due Date</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                {nextTableData?.installList?.map((item, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>
                                            <Checkbox
                                                checked={index === 0}
                                                disabled={index !== 0}
                                            />
                                        </td>
                                        <td className='text-center'>{item.payment_Head}</td>
                                        <td className='text-center'>{item.actual_Calc_Amount}</td>
                                        <td className='text-center'>{item.payable_Calc_Amount}</td>
                                        <td className='text-center'>{item.tcsPer}</td>
                                        <td className='text-center'>{item.due_Date}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='d-flex justify-content-end mb-4'>
                        <Button style={{ width: '200px', marginTop: 20 }}>Cont</Button>
                    </div>
                    {/* <input type='text' value={textBoxData?.payable_Calc_Amount} /> */}

                    <h3>next table</h3>
                    <div className='card'>
                        <table className='table table-striped table-sm'>
                            <thead style={{ backgroundColor: 'skyblue' }}>
                                <tr>
                                    <th className='text-center'><b>Select</b></th>
                                    <th className='text-center'><b>Payment Head</b></th>
                                    <th className='text-center'><b>Actual Amount</b></th>
                                    <th className='text-center'><b>Payable Amount</b></th>
                                    <th className='text-center'><b>TCS %</b></th>
                                    <th className='text-center'><b>Due Date</b></th>
                                    <th className='text-center'><b>Allocated Amount</b></th>
                                    <th className='text-center'><b>Left Amount</b></th>

                                </tr>
                            </thead>
                            <tbody>
                                {nextTableData?.installList?.map((item, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>
                                            <Checkbox
                                                checked={index === 0}
                                                disabled={index !== 0}
                                            />
                                        </td>
                                        <td className='text-center'>{item.payment_Head}</td>
                                        <td className='text-center'>{item.actual_Calc_Amount}</td>
                                        <td className='text-center'>{item.payable_Calc_Amount}</td>
                                        <td className='text-center'>{item.tcsPer}</td>
                                        <td className='text-center'>{item.due_Date}</td>
                                        {/* <td className='text-center'>{ index == 0 ? formikobj.values.allo_amt : '88888'}</td> */}
                                        <td className='text-center'>{ index == 0 ? 100 : 888}</td>
                                        <td className='text-center'>{index == 0 ? (item.actual_Calc_Amount- 100) : 888}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }

        </Fragment>
    );
};

export default TableInCell;