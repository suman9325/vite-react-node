import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Stack } from 'react-bootstrap';
import Select from 'react-select';
import { addUpdateCountryStateService, deleteLocationService, getAllCountryService, getAllLocationsService, getAllStateByCountryService, getCountryStateService } from '../../api/service/dropDownService';
import "./dropdown.scss";
import { useFormik } from "formik";
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, ListItemIcon, MenuItem, Tab } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { multiTableData } from '../../static/staticData';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';

const Test = () => {
    const [tabData, setTabData] = useState(multiTableData);
    const [value, setValue] = React.useState('1');

    // const [firstTable, setFirstTable] = useState(multiTableData?.results?.[0]);
    const [secondTable, setSecondTable] = useState(multiTableData?.results?.[1]);
    const [thirdTable, setThirdTable] = useState(multiTableData?.results?.[3]);
    const [lastTable, setLastTable] = useState(multiTableData?.results?.[8]);

    const firstTable = (multiTableData?.results?.[0]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <Container fluid style={{ width: '100%' }}>
                <div className=''>
                    <h3>MultiTable Breakdown</h3>
                </div>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Table 1" value="1" />
                                <Tab label="Table 2" value="2" />
                                <Tab label="Table 3" value="3" />
                                <Tab label="Table 4" value="4" />
                            </TabList>
                        </Box>
                        <TabPanel value={'1'}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Auction Id</th>
                                        <th>Lot No.</th>
                                        <th>Quantity</th>
                                        <th>H1 Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        firstTable?.tbl?.map(item => (
                                            <tr>
                                                <td>{item?.auction_id}</td>
                                                <td>{item?.lot_no}</td>
                                                <td>{item?.quantity}</td>
                                                <td>{item?.h1_price}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel value={'2'}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Pay type</th>
                                        <th>Tcs amount</th>
                                        <th>Tcs</th>
                                        <th>With Tcs</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        secondTable?.tbl?.map(item => (
                                            <tr>
                                                <td>{item?.pay_type}</td>
                                                <td>{item?.withouttcs_amount}</td>
                                                <td>{item?.tcs}</td>
                                                <td>{item?.with_tcs_amt}</td>
                                                <td>{item?.quantity}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                <tfoot>
                                    <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold", borderTop: "2px solid #000" }}>
                                        <td style={{ border: "1px solid #000", padding: "8px" }}>Total</td>
                                        <td style={{ border: "1px solid #000", padding: "8px" }}>
                                            {secondTable?.tbl?.length > 0 ? secondTable?.tbl?.reduce((accumulator, item) => accumulator + parseFloat(item?.withouttcs_amount), 0) : '0.00'}
                                        </td>
                                        <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        </td>
                                        <td style={{ border: "1px solid #000", padding: "8px" }}>
                                        </td>
                                        <td style={{ border: "1px solid #000", padding: "8px" }}>
                                            {secondTable?.tbl.length > 0 ? secondTable?.tbl?.reduce((accumulator, item) => accumulator + parseFloat(item?.quantity), 0) : '0.00'}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </TabPanel>
                        <TabPanel value={'3'}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Auc Doc Id</th>
                                        <th>Instrument Type</th>
                                        <th>Doc Name</th>
                                        <th>File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        thirdTable?.tbl?.map(item => (
                                            <tr>
                                                <td>{item?.aucdoc_id}</td>
                                                <td>{item?.instrument_type}</td>
                                                <td>{item?.doc_name}</td>
                                                <td>
                                                    {item?.file_refname !== "" ?
                                                        <a target='_blank' href={item?.file_refname} className='' >
                                                            <PictureAsPdfRoundedIcon />
                                                        </a>
                                                        :
                                                        <a onClick={(e) => {
                                                            e.preventDefault();
                                                            toastAlert(TOAST_TYPE.ERROR, 'No File Found!');
                                                        }} className='cursor-pointer'>
                                                            <PictureAsPdfRoundedIcon />
                                                        </a>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </TabPanel>
                        <TabPanel value={'4'}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Do no</th>
                                        <th>Bill No</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        lastTable?.tbl?.length > 0 && lastTable?.tbl?.map(item => (
                                            <tr>
                                                <td>{item?.aucdoc_id}</td>
                                                <td>{item?.instrument_type}</td>
                                                <td>{item?.doc_name}</td>
                                                <td>
                                                    {item?.file_refname !== "" ?
                                                        <a target='_blank' href={item?.file_refname} className='' >
                                                            <PictureAsPdfRoundedIcon />
                                                        </a>
                                                        :
                                                        <a onClick={(e) => {
                                                            e.preventDefault();
                                                            toastAlert(TOAST_TYPE.ERROR, 'No File Found!');
                                                        }} className='cursor-pointer'>
                                                            <PictureAsPdfRoundedIcon />
                                                        </a>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        lastTable?.tbl?.length === 0 &&
                                        <tr>
                                            <td colSpan={3}>
                                                No data found!
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Container>
        </Fragment>
    );
}

export default Test;