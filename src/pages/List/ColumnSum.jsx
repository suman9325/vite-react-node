import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';
import ButtonWithLoader from '../../components/Buttons/ButtonWithLoader';

const ColumnSum = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [rowIds, setRowIds] = useState("");

    useEffect(() => {
        getAllUsersService().then(res => {
            if (res.success) {
                toastAlert(TOAST_TYPE.SUCCESS, 'Users Fetched Successfully!');
                setTableData(res.data);
                // setTableData([]);
            }
        })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <Fragment>
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <h3>Column Sum Example</h3>
                    </div>
                    <div className="card-body">
                        <table>
                            <thead>
                                <th>Name</th>
                                <th>CTC Salary</th>
                                <th>In Hand Salary</th>
                            </thead>
                            <tbody>
                                {tableData.length > 0 ?
                                    <Fragment>
                                        {tableData?.map((item, i) => (
                                            <tr>
                                                <td>{item?.name}</td>
                                                <td>{item?.contact}</td>
                                                <td>{item?.password}</td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <tr>
                                            <td colSpan={3}>
                                                No Data Found
                                            </td>
                                        </tr>
                                    </Fragment>
                                }
                            </tbody>
                            <tfoot>
                                <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold", borderTop: "2px solid #000" }}>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>Total</td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        {tableData.length > 0 ? tableData?.reduce((accumulator, item) => accumulator + parseFloat(item?.contact), 0) : '0.00'}
                                    </td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        {tableData.length > 0 ? tableData?.reduce((accumulator, item) => accumulator + parseFloat(item?.password), 0) : '0.00'}
                                    </td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default ColumnSum;