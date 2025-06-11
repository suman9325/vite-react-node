import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { getAllUsersService } from '../../api/service/tableService';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import DataTable from '../../components/DataTable/DataTable';
import ButtonWithLoader from '../../components/Buttons/ButtonWithLoader';
import { getInterestService, getPayslipListService } from '../../api/service/userService';

let tcsSum = 0;
let paidSum = 0
let paidTotalSum = 0;
let checkedInttArr = [];
const Payslip = () => {
    const [isShowBtn, setIsShowBtn] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [aucIdx, setAucIdx] = useState([]);
    const [tcsAmount, setTcsAmount] = useState(0);
    const [paidSubTotal, setPaidSubTotal] = useState(0);
    const [paidTotal, setPaidTotal] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    useEffect(() => {
        getPayslipListService().then(res => {
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

    const onToggleCheckBox = (e, item) => {
        if (e.target.checked) {
            setAucIdx(prev => { return [...prev, item] });
            tcsSum += parseInt(item?.tcsAmount);
            paidSum += parseInt(item?.paidAmount);
            checkedInttArr.push({ id: item?.id, auctionId: item?.auctionId });

            // if (((!!item?.approvalNote) && ((parseInt(item?.advPaymentDay)) < 0))) {
            //     checkedInttArr.push(item?.id);
            // }

        }
        else {
            setAucIdx(prev => prev.filter(val => val?.auctionId != item?.auctionId));
            checkedInttArr = checkedInttArr.filter(value => value.id != item?.id);
            tcsSum -= parseInt(item?.tcsAmount);
            paidSum -= parseInt(item?.paidAmount);
        }
        setTcsAmount(tcsSum);
        setPaidSubTotal(paidSum);
        getInterest();

    }

    const getInterest = () => {
        getInterestService(checkedInttArr.length > 0 ? checkedInttArr : []).then(res => {
            if (res?.success) {
                setTotalInterest(res?.totalInterest);
            }
        })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const result = aucIdx.some(item => {
            const advDay = parseInt(item.advPaymentDay);
            const note = item.approvalNote;
            return advDay < 0 && (!note || note.trim() === '');
        });

        setIsShowBtn((aucIdx.length === 0 || result) ? false : true);

    }, [aucIdx])

    const checkTableRow = () => {
        const aucIds = (aucIdx.map(item => item.auctionId)).join(',')
        if (aucIdx.length === 0) {
            toastAlert(TOAST_TYPE.WARNING, 'Please select at least one row')
        }
    }


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
                                <th></th>
                                <th>Auc Id</th>
                                <th>Pay Type</th>
                                <th>TCS Amt</th>
                                <th>Paid Amt</th>
                                <th>Adv Payment Day</th>
                                <th>Interest</th>
                                <th>Approval Note</th>
                            </thead>
                            <tbody>
                                {tableData.length > 0 ?
                                    <Fragment>
                                        {tableData?.map((item, i) => (
                                            <tr>
                                                <td>
                                                    <input type='checkbox' onChange={(e) => { onToggleCheckBox(e, item) }} />
                                                </td>
                                                <td>{item?.auctionId}</td>
                                                <td>{item?.payType}</td>
                                                <td>{item?.tcsAmount}</td>
                                                <td>{item?.paidAmount}</td>
                                                <td>{item?.advPaymentDay}</td>
                                                <td>{item?.interest}</td>
                                                <td>{item?.approvalNote}</td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <tr>
                                            <td colSpan={5}>
                                                No Data Found
                                            </td>
                                        </tr>
                                    </Fragment>
                                }
                            </tbody>
                            <tfoot>
                                <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold", borderTop: "2px solid #000" }}>
                                    <td></td>
                                    <td></td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>SubTotal</td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        {tcsAmount}
                                    </td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        {paidSubTotal}
                                    </td>
                                </tr>
                                <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold", borderTop: "2px solid #000" }}>
                                    <td></td>
                                    <td></td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>Interest Charge</td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>{totalInterest}</td>
                                </tr>
                                <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold", borderTop: "2px solid #000" }}>
                                    <td></td>
                                    <td></td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>Total</td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        {/* {tableData.length > 0 ? tableData?.reduce((accumulator, item) => accumulator + parseFloat(item?.tcsAmount), 0) : '0.00'} */}
                                        {tcsAmount}
                                    </td>
                                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        {totalInterest > 0 ? (parseInt(paidSubTotal) + parseInt(totalInterest)) : paidSubTotal}
                                    </td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                    {isShowBtn &&
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary" onClick={checkTableRow}>Print</button>
                        </div>
                    }
                </div>
            </div>

        </Fragment>
    );
};

export default Payslip;