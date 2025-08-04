import react, { useMemo, useEffect, useState, useRef } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    TextField, Accordion, AccordionSummary, AccordionDetails, Typography, Button, Modal, Box,
    TextareaAutosize, IconButton, Stepper, Step, StepLabel, FormControl, InputLabel, MenuItem, Grid,
    Checkbox

} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { API_ENDPOINT_PSMSPaymentCopy } from '../../ApiServices/ApiConstant';
import apiService from '../../ApiServices/apiService';
import { useFormik } from 'formik';
import Select from 'react-select';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { FaEye } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Yup from "yup";
import axios from 'axios';


const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "50%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const InitialtransferFormvalues = {
    paymentMode: "",
    sourceAdjustment: "",
    transferDate: "",
    requestDate: "",
    orgIds: "",
    adjustmentAmount: "",
    otherDetails: "",
}

const PaymentAllowcationValue = {
    aucdocId: "",
    instrumentNo: "",
    payType: "",
    payAmt: "",
    payDt: "",
    installmentNo: "",
    instrumentDesc: "",
    paymentMode: ""
}
const interestChargeValue = {
    Org_ID: 14027,
    AdjusmentDate: "",
    AucDoc_ID: 117235,
    PayType: "",
    installmentType: "EMD",
    InstallmentNo: "",
    PaymentDueAmt: "",
    DelayDays: "",
    InterestAmt: "",
    auction_id: 1115483,
    Instrument_No: "GOLDEN_1234",
    instrument_desc: "Bank-Transfer",
    Remarks: "",
    PayMode: "RTGS",
    DPCMailAttachment: "",
    CatalogueType: "",
    File: ""
}

const InterestChargeValidationSchema = Yup.object().shape({

    PayType: Yup.string()
        .oneOf(['EMD', 'Installment'], 'Invalid Pay Type')
        .required('Pay Type is required'),
    InstallmentNo: Yup.string()
        .required('Installment Number is required'),
    PaymentDueAmt: Yup.string()
        .required('Payment Due Amount is required'),
    DelayDays: Yup.string()
        .required('Delay Days is required'),
    InterestAmt: Yup.string()
        .required('Interest Amount is required'),
    AdjusmentDate: Yup.date()
        .typeError('Adjustment Date must be a valid date')
        .required('Adjustment Date is required'),
    PayMode: Yup.string().required('Payment Mode is required'),
    Remarks: Yup.string().required('Remarks is required'),
    CatalogueType: Yup.string()
        .oneOf(['Within_Catalogue', 'Without_Catalogue'], 'Invalid Catalogue Type')
        .required('Catalogue Type is required'),
    File: Yup.mixed().when('CatalogueType', {
        is: 'Without_Catalogue',
        then: Yup.mixed().required('File is required for Without Catalogue'),
        // otherwise: Yup.mixed().nullable(),
    }),
});

let TempData = "";
const PaymentStatus = {
    Pending: "Pending",
    Allocated: "Allocated"
}

const CatalougeType = {
    Within_Catalogue: "Within_Catalogue",
    Without_Catalogue: "Without_Catalogue"
}

export default function Transfer() {
    const [organizations, setOrganizations] = useState([]);
    const [InstrumentData, SetInstrumentData] = useState([]);
    const [selecteductiondateto, setSelecteductiondateto] = useState(null);
    const [requestDate, setRequestDate] = useState(null);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [activeStep, setActiveStep] = useState(1);
    const [allocationData, setAllocationData] = useState([]);
    const [isAllocationTableVisible, setIsAllocationTableVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [SelectedOrgid, setSelectedOrgid] = useState("");
    const [LotData, setLotData] = useState([]);
    const [rowData, setRowData] = useState(null);
    const [RowInstrumentData, setRowInstrumentData] = useState(null);
    const [installList, SetinstallList] = useState([]);
    const [isModalDialougeOpen, SetisModalDialougeOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState([]);
    const [nextTableData, setNextTableData] = useState([]);
    const [textBoxData, setTextBoxData] = useState();
    const [Organisation, setOrganisation] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [payableAmount, setpayableAmount] = useState({
        payable_Amount: ''// this is your fixed due amount

    });
    const [isAmountInvalid, setIsAmountInvalid] = useState(false);
    const [installmentId, setInstallmentId] = useState(0);
    const [closeRemarks, setcloseRemarks] = useState('');
    const [auctionFromDate, setAuctionFromDate] = useState(null);
    const [auctionToDate, setAuctionToDate] = useState(null);
    const [adjusmentDate, setAdjusmentDate] = useState(null);
    const [adjustmentSource, setAdjustmentSource] = useState('');
    const [instrumentList, setInstrumentList] = useState([]);
    const [paymentList, setPaymentList] = useState([]);
    const [instrumentPayment, setInstrumentPayment] = useState([]);
    const [aucDocId, setaucDocId] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [tcs, setTcs] = useState('');
    const [notAllocatedAmount, setNotAllocatedAmount] = useState(0);
    const [originalNotAllocatedAmount, setOriginalNotAllocatedAmount] = useState(0);
    const [remainAmount, setRemainAmount] = useState(0);
    const [minDueAmount, setMinDueAmount] = useState(0);
    const [allocatedAmount, setAllocatedAmount] = useState(0);
    const [utrNo, setUtrNo] = useState('');
    const [excessQty, setExcessQty] = useState(0);
    const [excessQtyFormError, setExcessQtyFormError] = useState({
        quantity: false
    });

    const [excessQtyInterestChgFrmData, setExcessQtyInterestChgFrmData] = useState({
        auctionIdFrm: '',
        auctionDateFrm: '',
        auctionDateTo: '',
        lotNo: ''
    });
    const [excessQtyFormData, setExcessQtyFormData] = useState({
        aucDocId: 0,
        quantity: 0,
        instrumentNo: "",
        sapMrNo: "",
        paymentMode: "RTGS",
        createdBy: "2"
    });
    const excessQtyFormDataChange = (key, value) => {
        setExcessQtyFormData(prev => ({
            ...prev,
            [key]: value
        }));
        console.log(key);
        if (key == 'quantity') {
            const finalAmount = parseFloat(quantity * value);
            console.log(finalAmount);
            setAllocatedAmount(finalAmount);
            if (finalAmount > notAllocatedAmount) {
                setExcessQtyFormError({
                    quantity: true
                });
            }
            else {
                setExcessQtyFormError(prev => ({
                    ...prev,
                    quantity: false
                }));
            }
        }

    };



    const steps = [
        "Allocate",
        "Allocation Details - I",
        "Allocation Details - II",
        "Confirm",
    ];
    const InterestChargeformikObj = useFormik({
        enableReinitialize: true,
        validationSchema: InterestChargeValidationSchema,
        initialValues: interestChargeValue,
        onSubmit: async (values) => {
            console.log(values);
            const formdata = new FormData();
            formdata.append("instrument_desc", values.instrument_desc);
            formdata.append("auction_id", values.auction_id);
            formdata.append("Org_ID", values.Org_ID);
            formdata.append("AucDoc_ID", values.AucDoc_ID);
            formdata.append("Instrument_No", values.Instrument_No);
            formdata.append("PayType", values.PayType);
            formdata.append("InstallmentNo", values.InstallmentNo);
            formdata.append("PaymentDueAmt", values.PaymentDueAmt);
            formdata.append("DelayDays", values.DelayDays);
            formdata.append("InterestAmt", values.InterestAmt);
            formdata.append("AdjusmentDate", values.AdjusmentDate);
            formdata.append("PayMode", values.PayMode);
            formdata.append("Remarks", values.Remarks);
            formdata.append("CatalogueType", values.CatalogueType);
            formdata.append("DPCMailAttachment", values.DPCMailAttachment);
            formdata.append("File", values.File);
            axios.post("https://xyz.com", formdata);
            console.log(formdata);
        },
    });

    const PaymentAllowcationformikObj = useFormik({
        enableReinitialize: true,
        initialValues: PaymentAllowcationValue,
        onSubmit: async (values) => {
            if (selectedOption.value == 1) {
                values.payAmt = notAllocatedAmount;
                console.log(values);
                SaveMaterialValue(values);
            }
            else if ((selectedOption.value == 2) && (activeStep == 4)) {
                if ((excessQtyFormData.quantity === '') || (excessQtyFormData.quantity == 0)) {
                    setExcessQtyFormError({
                        quantity: (excessQtyFormData.quantity === '') || (excessQtyFormData.quantity == 0)
                    });
                }
                else {
                    if (!excessQtyFormError.quantity) {
                        SaveExcessQuantity();
                    }
                    else {
                        console.log("Error");
                    }
                }
            }
            else {
                InterestChargeformikObj.handleSubmit();
            }
        },
    });

    const SaveMaterialValue = async (values) => {
        const Response = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.SAVE_PAYMENT_ALLOCATION, values);
        if (Response.results == "Success") {
            toast.success("Payment Allowcation Saved Successfully.");
            GetAllinstrumentlist();
            // handleSourceClick(utrNo);
            // setSelectedOption(
            //     {
            //         "value": "1",
            //         "label": "MATERIAL VALUE"
            //     }
            // )
            // setActiveStep(2);
            setActiveStep(1);
            setAdjustmentSource('');
            LotTableconfig.resetRowSelection();
        }
        else {
            toast.error(Response?.results);
        }
    }

    const SaveExcessQuantity = async () => {
        const payLoad = { ...excessQtyFormData, allocateamtAmount: allocatedAmount };
        console.log(payLoad);

        const Response = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.SAVE_EXCESS_QTY, JSON.stringify(excessQtyFormData));
        console.log(Response?.results);
        if (Response?.results == "Success") {
            toast.success("Payment Allowcation Saved Successfully.");
            setActiveStep(1);
            setAdjustmentSource('');
        }
        else {
            toast.error(Response?.results);
        }
    }


    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const handleNext = () => {
        console.log("@@", activeStep);
        if ((activeStep == 2) && (selectedOption.value != 1)) {
            if (((excessQtyInterestChgFrmData.auctionIdFrm == '') &&
                (excessQtyInterestChgFrmData.lotNo == '') &&
                (excessQtyInterestChgFrmData.auctionDateFrm == '') &&
                (excessQtyInterestChgFrmData.auctionDateTo == ''))) {
                toast.error("Please Provide a Search Criteria.");
                return
            }
            else {
                GetInstrumentPaymentDetails();
            }
        }
        else if ((activeStep == 3) && (selectedOption.value != 1)) {
            if (aucDocId == null) {
                toast.error("Please check the below Search Details.");
            }
            else {
                GetQuantity();
            }

        }
        else if ((RowInstrumentData.length > 0) || (selectedOption.value != 1)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        else {
            toast.error("Please check the below LOT(S) OF THE BIDDER/ORGANIZATION.");
        }

    };
    useEffect(() => {
        console.log("@@", activeStep);
        if ((activeStep == 2) && (selectedOption.value != 1)) {
            GetTransferDtlsBySourceID();
        }

    }, [activeStep]);

    const GetQuantity = async () => {
        const RequestPayload = {
            aucDocId: aucDocId,
        };

        console.log("RequestPayload:", RequestPayload);

        const Response = await apiService(
            'POST',
            API_ENDPOINT_PSMSPaymentCopy.GET_QUANTITY_AMOUNT,
            JSON.stringify(RequestPayload)
        );

        if (Response?.results?.length > 0) {
            const qtyFromAPI = parseFloat(Response?.results?.[0]?.quantity);
            const tcsFromAPI = Response?.results?.[0]?.v_tcs;
            const amount = parseFloat(notAllocatedAmount);

            let calculatedExcessQty = 0;
            if (!isNaN(amount) && !isNaN(qtyFromAPI) && qtyFromAPI !== 0) {
                calculatedExcessQty = amount / qtyFromAPI;
            }


            setQuantity(qtyFromAPI);
            setTcs(tcsFromAPI);
            setExcessQty(parseFloat(calculatedExcessQty.toFixed(3)));
            setExcessQtyFormData(prev => ({
                ...prev,
                allocateamtAmount: amount,
                tcs: parseFloat(tcsFromAPI),
                quantity: parseFloat(calculatedExcessQty.toFixed(3)),
                aucDocId: parseInt(aucDocId),
                instrumentNo: adjustmentSource,
                createdBy: "2"
            }));
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const GetTransferDtlsBySourceID = async () => {
        const RequestPayload = {
            type: "",
            souceOfAdjustment: "",
            instrumentNo: adjustmentSource,
            orgId: "",
            instrumentUpdateFrm: "",
            instrumentUpdateTo: "",
            paymentFrm: "",
            paymentTo: "",
            clientId: 0
        };
        console.log(RequestPayload);
        const Response = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.GET_TRANSFER_DETAILS_BY_SOURCEID, JSON.stringify(RequestPayload));
        console.log(Response?.results?.[0]?.instrumentDtlsList[0]?.unallocated_amt);
        setNotAllocatedAmount(Response?.results?.[0]?.instrumentDtlsList[0]?.unallocated_amt);
        setAllocatedAmount(Response?.results?.[0]?.instrumentDtlsList[0]?.unallocated_amt);
        console.log(Response?.results?.[0]?.instrumentDtlsList);
        console.log(Response?.results?.[0]?.paymentList);
        if (Response.results?.length > 0) {
            setInstrumentList(Response?.results?.[0]?.instrumentDtlsList);
        }
        else {
            setInstrumentList([]);
        }
    }
    const GetInstrumentPaymentDetails = async () => {
        setExcessQtyInterestChgFrmData(prevData => ({ ...prevData, orgId: instrumentList?.[0]?.org_id }))
        const payload = { ...excessQtyInterestChgFrmData, orgId: instrumentList?.[0]?.org_id };
        const Response = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.GET_INSTRUMENT_PAYMENT, JSON.stringify(payload));
        console.log(Response);
        if (Response?.results?.length > 0) {
            setInstrumentPayment(Response?.results);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        else {
            toast.error("No Record Found!.");
            setInstrumentPayment([]);
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const InstrumentPaymentColumnData = useMemo(() =>
        [
            {
                accessorKey: "auction_id",
                header: "Auction ID",
                size: 150
            },
            {
                accessorKey: "auction_date",
                header: "Auction Date",
                size: 150
            },
            {
                accessorKey: "catalogue_name",
                header: "Catalouge",
                size: 150
            },
            {
                accessorKey: "lot_no",
                header: "Lot No",
                size: 150
            },
            {
                accessorKey: "confirm_date",
                header: "Confirmation Date",
                size: 150
            },
            {
                accessorKey: "org_name",
                header: "Bidder Name",
                size: 150
            },
            {
                accessorKey: "quantity",
                header: "Quantity",
                size: 150
            },
            {
                accessorKey: "last_bid_price",
                header: "H1 Price",
                size: 150
            }
        ],
        []);

    const InstrumentPaymentTableconfig = useMaterialReactTable({
        enableRowSelection: true,
        enableMultiRowSelection: false,
        columns: InstrumentPaymentColumnData,
        data: instrumentPayment,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#87CEEB',
            },
        },
    });

    useEffect(() => {
        const selectedRows = InstrumentPaymentTableconfig.getSelectedRowModel().flatRows;
        if (selectedRows.length > 0) {
            const aucDocId = selectedRows.map((row) => row?.original?.aucdoc_id);
            setaucDocId(aucDocId?.[0]);
            console.log("AucdocID", aucDocId?.[0]);
        } else {
            setaucDocId(null);
        }
    }, [InstrumentPaymentTableconfig.getState().rowSelection]);


    const InstrumentDetailsData = useMemo(() =>
        [
            {
                accessorKey: 'instrument_no',
                header: 'Adjustment Source',
                size: 150,
            },
            {
                accessorKey: 'instrument_amt',
                header: 'Amount',
                size: 150,
            },
            {
                accessorKey: 'unallocated_amt',
                header: 'Not Allocated Amount',
                size: 200,
            },
            {
                accessorKey: 'org_name',
                header: 'Bidder Name',
                size: 200,
            },
            {
                accessorKey: 'request_dt',
                header: 'Transfer/Pickup Date',
                size: 200,
            }
        ],
        []);

    const InstrumentDetailsTableconfig = useMaterialReactTable({
        columns: InstrumentDetailsData,
        data: instrumentList,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#87CEEB',
            },
        },
    });

    const paymentModeOptions = [
        { value: 'Transfer', label: 'TRANSFER' },
        { value: 'BuyerFinance', label: 'BUYER FINANCE' },
        { value: 'Other', label: 'OTHER' }
    ];

    const options = [
        { value: '', label: '--Select Payment Type--' },
        { value: '1', label: 'MATERIAL VALUE' },
        { value: '2', label: 'EXCESS QTY PAYMENT' },
        { value: '3', label: 'INTEREST CHARGES' },
    ];

    useEffect(() => {
        const fetchOrganizations = async () => {

            const data = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.GET_ORGANIZATION_LIST);
            const options = data.results.map(org => ({
                value: org.orgId,
                label: org.orgName
            }));
            setOrganizations(options);
        };
        fetchOrganizations();
        GetAllinstrumentlist();
        FormickObj.setFieldValue('paymentMode', 'Transfer');
        PaymentAllowcationformikObj.setFieldValue('instrumentDesc', 'Transfer');
    }, []);

    const handleOpenModal = (InstallmentId) => {
        console.log(InstallmentId);
        setInstallmentId(InstallmentId);
        setIsModalOpen(true);
    };

    const handleCloseModal = (row) => {
        setIsModalOpen(false);
        setInstallmentId(0);
        setcloseRemarks("");
    };
    const handleCloseModalDialouge = () => {
        SetisModalDialougeOpen(false);
    }


    const handleApply = () => {
        SaveCloseInstrumentDetails();

    };
    const SaveCloseInstrumentDetails = async () => {
        if (closeRemarks) {
            const RequestPayload = {
                "instrumentid": parseInt(installmentId) ? parseInt(installmentId) : 0,
                "resonclose": closeRemarks ? closeRemarks : "",
                "createdby": "2"
            };
            console.log(RequestPayload);
            const Response = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.PAYMENT_DEALLOCATION, JSON.stringify(RequestPayload));
            console.log(Response);
            if (Response.results == "Success" && Response.status == true && Response.statusCode == 200) {
                toast.success("Instrument Closed successfully");
                setIsModalOpen(false);
                setInstallmentId(0);
                setcloseRemarks("");
                GetAllinstrumentlist();
            }
            else {
                toast.error(Response.results);
            }
        }
        else {
            toast.error("Please Provide a Reason.");
        }
    }
    const validationSchema = Yup.object({
        paymentMode: Yup.string().required("Please Select PaymentMode"),
        sourceAdjustment: Yup.string().required("Please Enter  Adjustment Source").trim(),
        adjustmentAmount: Yup.string().required("Please Enter  Adjustment Amount").trim(),
        transferDate: Yup.string().required("Please Enter  Transfer Date").trim(),
        requestDate: Yup.string().required("Please Enter  Request Date").trim(),
        orgIds: Yup.string().required("Please Select  Organization").trim()
    });

    const FormickObj = useFormik({
        enableReinitialize: false,
        initialValues: InitialtransferFormvalues,
        validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            const res = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.SAVE_PAYMENT, values);
            console.log(res);
            if (res.results == "Success") {
                handleclear();
                toast.success("Data Submitted Successfully.");
                GetAllinstrumentlist();
            }
            else {
                toast.error("Failed to Save Payment.");
            }
        }
    });

    const excessQtyInterestChgFrmDataChange = (key, value) => {
        setExcessQtyInterestChgFrmData(prev => ({
            ...prev,
            [key]: value
        }));
    };
    const handleorgchange = async (e) => {
        const searchText = e.target.value;
        if (searchText == "" || searchText == null) {
            setOrganisation([]);
        }
        else {
            const res = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.GET_ALL_CUSTOMER_LIST, JSON.stringify({ searchText: searchText }));
            console.log(res.results);
            setOrganisation(res.results);
        }
    }

    const handleclear = () => {
        setSelecteductiondateto(null);
        setRequestDate(null);
        //setOrganisation([]);
        //setAutocompleteValue(null);
        // FormickObj.setValues(InitialtransferFormvalues);
        FormickObj.resetForm();
        setSelectedOrg(null); // Reset selected option
        FormickObj.setFieldValue("orgIds", "");

    };
    const GetAllinstrumentlist = async () => {
        const res = await apiService('GET', API_ENDPOINT_PSMSPaymentCopy.TRANSFER_DETAILS);
        if (res.status == true) {
            SetInstrumentData(res.results || []);
        }
    }
    const GetLotDetailslist = async (OrgIde) => {
        console.log("OrgIde", OrgIde);
        const res = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.GET_LOT_DETAILS, JSON.stringify({ orgId: OrgIde }));
        console.log(res.results);
        if (res.status == true) {
            setLotData(res.results);
        }
        else {
            setLotData([]);
        }
    }

    const handleSourceClick = async (sourceOfAdjustment) => {
        setAdjustmentSource(sourceOfAdjustment);
        GetLotDetailslist([]);
        setSelectedOption("");
        const requestPayload = { SourceOfAdjustment: sourceOfAdjustment };
        const res = await apiService('POST', API_ENDPOINT_PSMSPaymentCopy.GETALLOCATION, requestPayload)
        if (
            res.status === true
        ) {
            setOriginalNotAllocatedAmount(res.results[0].allocatedAmt);
            setRemainAmount(res.results[0].allocatedAmt);
            console.log('Results from API:', res.results);
            setAllocationData(res.results);
            console.log("$", res.results[0]);
            console.log(res.results[0].orgId);
            PaymentAllowcationformikObj.setFieldValue("instrumentNo", res.results[0].adjustmentSrc);
            setSelectedOrgid(res.results[0].orgId);
            setIsAllocationTableVisible(true);
            const steperElement = document.getElementById('steper');
            if (steperElement) {
                // Scroll to steper with a slight offset to ensure content below is visible
                const yOffset = steperElement.getBoundingClientRect().top + window.pageYOffset - 50; // Adjust offset as needed
                window.scrollTo({ top: yOffset, behavior: 'smooth' });
                // Optionally show extra content below
                //setShowExtraContent(true);
            }


        } else {
            console.error('Error in API response or no results:', res);
            setAllocationData([]);
            setIsAllocationTableVisible(false);
        }

    }
    const handlepaymenttypechange = (val) => {
        setSelectedOption(val);
        console.log(val);
        if (val.value == 1) {
            console.log("orgid", SelectedOrgid);
            GetLotDetailslist(SelectedOrgid);
        }
        else {
            setLotData([]);
        }

    }

    const ColumnData = useMemo(() =>
        [
            {
                accessorKey: "adjustmentSrc",
                header: "Source of Adjustment",
                size: 150,
                Cell: ({ cell }) => (
                    <Button color="primary" onClick={() => { handleSourceClick(cell.getValue()); setUtrNo(cell.getValue()) }}>
                        {cell.getValue()}
                    </Button>
                ),
            },
            {
                accessorKey: "instrumentAmt",
                header: "Adjustment Amt",
                size: 150
            },
            {
                accessorKey: "balanceAmt",
                header: "Balance Amt",
                size: 150
            },
            {
                accessorKey: "payDt",
                header: "Transfer Date",
                size: 150
            },
            {
                accessorKey: "requestDt",
                header: "Request Date",
                size: 150
            },
            {
                accessorKey: "orgName",
                header: "Organization Name",
                size: 150
            },
            {
                accessorKey: "createdOn",
                header: "Upload Date",
                size: 150
            },
            {
                header: "Action",
                size: 100,
                Cell: ({ row }) => {
                    return (
                        <IconButton onClick={() => handleOpenModal(row.original.instrumentId)}>
                            <ContentCutIcon color='primary' />
                        </IconButton>
                    );
                }
            }
        ],
        [])

    const LotcolumnData = useMemo(() =>
        [
            {
                accessorKey: 'installList',
                header: 'Action',
                size: 150,
                Cell: ({ cell }) => (
                    <Button color="primary" onClick={() => GetAuctionId(cell.getValue())}>
                        <FaEye style={{ marginRight: '8px', fontSize: 20 }} />
                    </Button>
                ),
            },
            {
                accessorKey: 'slNo',
                header: 'SlNo',
                size: 150,
            },
            {
                accessorKey: 'auction_Date',
                header: 'Auction Date',
                size: 150,
            },
            {
                accessorKey: 'auction_ID',
                header: 'Auction ID',
                size: 200,
            },
            {
                accessorKey: 'catalogue_Name',
                header: 'Catalogue Name',
                size: 200,
            },
            {
                accessorKey: 'lot_No',
                header: 'lot No',
                size: 200,
            },
            {
                accessorKey: 'confirm_Date',
                header: 'Confirm Date',
                size: 200,
            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
                size: 200,
            }
        ],
        []);
    const GetAuctionId = (val) => {
        //console.log(val);
        SetinstallList(val);
        SetisModalDialougeOpen(true);
    }

    const LotTableconfig = useMaterialReactTable({
        enableRowSelection: true,
        enableMultiRowSelection: false,
        columns: LotcolumnData,
        data: LotData,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#87CEEB',
            },
        },
    });

    useEffect(() => {
        const rowDetails = (LotTableconfig.getSelectedRowModel().flatRows.map((row) => row?.original)).map(item => { return item });
        const rowlist = (LotTableconfig.getSelectedRowModel().flatRows.map((row) => row?.original)).map(item => { return item.installList });
        console.log("LotData", rowlist[0]);
        setRowInstrumentData(rowlist); //LotData
        setRowData(rowDetails);

        if (rowlist.length > 0 && rowlist[0].length > 0) {
            const firstInstallment = (rowlist[0]?.filter(item => item.payment_Status == PaymentStatus.Pending))?.[0];
            PaymentAllowcationformikObj.setFieldValue("aucdocId", firstInstallment?.aucDoc_ID);
            PaymentAllowcationformikObj.setFieldValue("installmentNo", firstInstallment?.no_Of_Installment);
            PaymentAllowcationformikObj.setFieldValue("payType", firstInstallment?.payment_Head);
            PaymentAllowcationformikObj.setFieldValue("payAmt", firstInstallment?.payable_Calc_Amount);
            PaymentAllowcationformikObj.setFieldValue("payDt", firstInstallment?.due_Date);
            PaymentAllowcationformikObj.setFieldValue("paymentMode", "RTGS");
        }

    }, [LotTableconfig.getState().rowSelection]);



    useEffect(() => {
        if (RowInstrumentData?.length > 0) {
            console.log("##", RowInstrumentData);
            console.log("##", RowInstrumentData[0][0]);////payable_Calc_Amount
            console.log("##", RowInstrumentData[0][0].payable_Calc_Amount);
            const filterData = (RowInstrumentData[0]?.filter(item => item?.payment_Status == PaymentStatus.Pending))?.[0];
            setTextBoxData(filterData);
            setpayableAmount({
                payable_Amount: filterData?.payable_Calc_Amount
            });
            const minDueAmount = filterData?.payable_Calc_Amount < originalNotAllocatedAmount ? filterData?.payable_Calc_Amount : originalNotAllocatedAmount;

            setNotAllocatedAmount(parseFloat(minDueAmount));
            setMinDueAmount(parseFloat(minDueAmount));
        }
    }, [RowInstrumentData])

    const allocationColumns = useMemo(
        () => [
            { accessorKey: "adjustmentSrc", header: "Adjustment Source", size: 150 },
            { accessorKey: "instrumentAmt", header: "Amt", size: 150 },
            {
                accessorKey: "allocatedAmt", header: "Not Allocated Amt", size: 150,
                Cell: ({ cell }) => (
                    <>
                        {remainAmount == 0 ? cell.getValue() : remainAmount}
                    </>
                ),
            },
            { accessorKey: "orgName", header: "Organization Name", size: 150 },
            { accessorKey: "payDt", header: "Transfer/Pickup Date", size: 150 },
        ],
        [remainAmount]
    );

    const Tableconfig = useMaterialReactTable({
        columns: ColumnData,
        data: InstrumentData,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#87CEEB',
            },
        },
    });

    const CheckAllocationamt = (e) => {
        const newValue = parseFloat(e.target.value == '' ? 0 : e.target.value);
        //console.log(parseFloat(originalNotAllocatedAmount - (parseFloat(originalNotAllocatedAmount - textBoxData?.payable_Calc_Amount)) - newValue)).toFixed(2);
        const LeftAmount = parseFloat(
            originalNotAllocatedAmount -
            (originalNotAllocatedAmount - textBoxData?.payable_Calc_Amount) -
            newValue
        ).toFixed(2);
        setNotAllocatedAmount(newValue);
        setRemainAmount(LeftAmount);

        if (!isNaN(newValue) && newValue > minDueAmount) {
            setIsAmountInvalid(true);
            toast.error("Allocation Amount greater than Due Amount!");
        }
        else {
            setIsAmountInvalid(false);
        }
    };

    const GetCloseRemarks = (e) => {
        setcloseRemarks(e.target.value);
    }


    const UploadCatalougeFile = (e) => {
        console.log(e.target.files[0]);
        InterestChargeformikObj.setFieldValue("File", e.target.files[0]);
    }

    return (
        <>
            {(activeStep == 1) &&
                <>
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: "#3271a8" }}>
                                <b><span style={{ color: 'white' }}>Transfer/Finance/Other Details</span></b>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <label>Payment Mode <span className="text-danger">*</span></label>
                                        <Select
                                            className="w-100"
                                            name="paymentMode"
                                            options={paymentModeOptions}
                                            defaultValue={{ value: 'Transfer', label: 'TRANSFER' }}
                                            onChange={(selected) => {
                                                console.log(selected);
                                                FormickObj.setFieldValue('paymentMode', selected?.value || '');
                                                PaymentAllowcationformikObj.setFieldValue('instrumentDesc', selected?.value);
                                            }}
                                            placeholder="--Select--"
                                        />
                                        {FormickObj.touched.paymentMode && FormickObj.errors.paymentMode && (
                                            <div className="text-danger">{FormickObj.errors.paymentMode}</div>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label>Source of Adjustment <span className="text-danger">*</span></label>
                                        <input type="text" id="Txtsourceofadjustment"
                                            value={FormickObj.values.sourceAdjustment}
                                            name="sourceAdjustment"
                                            onChange={FormickObj.handleChange}
                                            className="form-control"
                                            autoComplete="off"
                                        />
                                        {FormickObj.touched.sourceAdjustment && FormickObj.errors.sourceAdjustment && (
                                            <div className="text-danger">{FormickObj.errors.sourceAdjustment}</div>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label>Adjustment Amount <span className="text-danger">*</span></label>
                                        <input type="number" id="Txtadjustmentamount"
                                            value={FormickObj.values.adjustmentAmount}
                                            name="adjustmentAmount"
                                            onChange={FormickObj.handleChange}
                                            className="form-control"
                                            autoComplete="off"
                                        />
                                        {FormickObj.touched.adjustmentAmount && FormickObj.errors.adjustmentAmount && (
                                            <div className="text-danger">{FormickObj.errors.adjustmentAmount}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-12 col-md-4">
                                        <label>Transfer Date/Pick-up Date <span className="text-danger">*</span></label>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                value={selecteductiondateto}
                                                onChange={(newValue) => {
                                                    setSelecteductiondateto(newValue ? dayjs(newValue) : null);
                                                    FormickObj.setFieldValue("transferDate", newValue ? newValue.format("YYYY-MM-DD") : "");
                                                    FormickObj.setFieldValue("requestDate", newValue ? newValue.format("YYYY-MM-DD") : "");
                                                }}
                                                renderInput={(params) => <TextField {...params} className="form-control" />}
                                            />
                                        </LocalizationProvider>
                                        {FormickObj.touched.transferDate && FormickObj.errors.transferDate && (
                                            <div className="text-danger">{FormickObj.errors.transferDate}</div>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label>Request Date <span className="text-danger">*</span></label>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                value={selecteductiondateto}
                                                renderInput={(params) => <TextField {...params} className="form-control" />}
                                            />
                                        </LocalizationProvider>
                                        {FormickObj.touched.requestDate && FormickObj.errors.requestDate && (
                                            <div className="text-danger">{FormickObj.errors.requestDate}</div>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label>Other Details</label>
                                        <input type="text" id="Txtotherdetails"
                                            value={FormickObj.values.otherDetails}
                                            name="otherDetails"
                                            onChange={FormickObj.handleChange}
                                            className="form-control"
                                            autoComplete="off"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-12">
                                        <label>Choose Organization <span className="text-danger">*</span></label>
                                        <Autocomplete
                                            options={Organisation}
                                            getOptionLabel={(item) => item.org_name}
                                            value={selectedOrg}
                                            onChange={(event, value) => {
                                                setSelectedOrg(value);
                                                FormickObj.setFieldValue("orgIds", value ? value.orgid : "");
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Search" onChange={handleorgchange} />
                                            )}
                                            sx={{
                                                width: "100%", // ✅ Fully responsive width
                                                '& .MuiAutocomplete-endAdornment': { display: 'none' }
                                            }}
                                        />
                                        {FormickObj.touched.orgIds && FormickObj.errors.orgIds && (
                                            <div className="text-danger">{FormickObj.errors.orgIds}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex flex-column flex-md-row justify-content-end mt-4">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        id="Btnsave"
                                        onClick={FormickObj.handleSubmit}
                                        sx={{ mr: 1, mb: { xs: 2, md: 0 } }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        type="button"
                                        id="Btnclear"
                                        onClick={handleclear}
                                        variant="contained"
                                        color="error"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{ marginTop: -20 }}>
                            <div className="card-body">
                                <Accordion sx={{ backgroundColor: '#3271a8' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} // set icon color to white
                                    >
                                        <Typography>
                                            <b><span style={{ color: 'white' }}>TRANSFER DETAILS</span></b>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div style={{ overflowX: 'auto' }}>
                                            <MaterialReactTable
                                                table={Tableconfig}
                                                columns={ColumnData}
                                                data={[InstrumentData]}
                                                enableSorting
                                                enablePagination
                                            />
                                        </div>
                                    </AccordionDetails>
                                </Accordion>


                                {/* Modal */}
                                <Modal open={isModalOpen} onClose={handleCloseModal}>
                                    <Box sx={{
                                        width: "90%",  // Adjust for smaller screens
                                        maxWidth: "500px",  // Limit width on larger screens
                                        margin: "auto",
                                        backgroundColor: "white",
                                        padding: "1.5rem",
                                        borderRadius: "8px",
                                        boxShadow: 24,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1rem"
                                    }}>
                                        <Typography variant="h6" component="h2">
                                            Close Instrument Details
                                        </Typography>
                                        <textarea
                                            rows="4"
                                            placeholder="Provide a reason for close"
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                fontSize: '1rem',
                                                borderRadius: '4px',
                                                borderColor: '#ccc',
                                                resize: 'vertical',
                                            }}
                                            onChange={GetCloseRemarks}
                                        ></textarea>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            <Button variant="outlined" color="secondary" onClick={handleCloseModal} fullWidth>
                                                CLOSE
                                            </Button>
                                            <Button variant="contained" color="primary" onClick={handleApply} fullWidth>
                                                APPLY
                                            </Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </>
            }
            <div>
                <BootstrapDialog
                    onClose={SetisModalDialougeOpen}
                    aria-labelledby="customized-dialog-title"
                    open={isModalDialougeOpen}
                    maxWidth="lg"
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} style={{ backgroundColor: '#98DEF8' }} id="customized-dialog-title">
                        Instrument Details
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalDialouge}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 10,
                            top: 8,
                            color: theme.palette.grey[500]
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-sm'>
                                <thead style={{ background: 'skyblue' }}>
                                    <tr>
                                        <th><b>Payment Head</b></th>
                                        <th><b>Actual Amount</b></th>
                                        <th><b>Payable Amount</b></th>
                                        <th><b>TCS %</b></th>
                                        <th><b>Due Date</b></th>
                                        <th><b>Payment Status</b></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {installList?.map((item, index) => (
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
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleCloseModalDialouge}>
                            Close
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </div>

            {adjustmentSource &&
                <>
                    <div className="card mt-3">
                        <div className="card-header">
                            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep}</Typography>
                        </div>
                        <div className="card-body">
                            <Stepper activeStep={activeStep}>
                                {steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <Box id="Steper" sx={{ marginTop: "2rem" }}>
                                {activeStep === 1 && (
                                    isAllocationTableVisible && (
                                        <>
                                            <MaterialReactTable columns={allocationColumns}
                                                data={allocationData}
                                                enableSorting
                                                enablePagination
                                                muiTableHeadCellProps={{
                                                    sx: {
                                                        backgroundColor: '#87CEEB', // SkyBlue
                                                        color: 'black', // Optional: text color
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                            />
                                            <div style={{ marginTop: "1rem", maxWidth: "1500" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="mui-select-label"></InputLabel>
                                                    <Select
                                                        id="react-select"
                                                        options={options}
                                                        value={selectedOption}
                                                        onChange={handlepaymenttypechange}
                                                        getOptionLabel={(e) => e.label}
                                                        getOptionValue={(e) => e.value}
                                                        placeholder="Select Payment Type"
                                                        menuPortalTarget={document.body}
                                                    />
                                                </FormControl>
                                                <Typography
                                                    style={{
                                                        marginTop: "1rem",
                                                        marginBottom: "1rem",
                                                        fontWeight: "bold",
                                                        marginLeft: "0rem",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                </Typography>


                                                {(selectedOption.value == 1) &&
                                                    <Typography
                                                        style={{
                                                            marginTop: "1rem",
                                                            marginBottom: "1rem",
                                                            fontWeight: "bold",
                                                            marginLeft: "0rem",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        LIST OF PENDING LOT(S) OF THE BIDDER/ORGANIZATION
                                                        <div style={{ overflowX: 'auto', width: "100%" }}>
                                                            <MaterialReactTable
                                                                table={LotTableconfig}
                                                                columns={LotcolumnData}
                                                                data={[LotData]}
                                                                enablePagination
                                                                muiTableHeadCellProps={{
                                                                    sx: {
                                                                        backgroundColor: '#87CEEB', // SkyBlue
                                                                        color: 'black', // Optional: text color
                                                                        fontWeight: 'bold',
                                                                    },
                                                                }}
                                                            />
                                                        </div>
                                                    </Typography>
                                                }

                                            </div>
                                        </>
                                    )
                                )}
                                {activeStep === 2 && (
                                    <>
                                        <h5 style={{ fontSize: '16px' }}>{(selectedOption.value == 1) ? 'Allocation Details -I' : 'TRANSFER DETAILS'}</h5>
                                        <div className='col-md-12' style={{ marginTop: 15 }}>
                                            <MaterialReactTable
                                                columns={(selectedOption.value == 1) ? allocationColumns : InstrumentDetailsData}
                                                data={(selectedOption.value == 1) ? allocationData : instrumentList}
                                                enableSorting
                                                enablePagination
                                                muiTableHeadCellProps={{
                                                    sx: {
                                                        backgroundColor: '#87CEEB',
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                            />
                                        </div>

                                        {(selectedOption.value == 1) && (
                                            <>
                                                <div className='row' style={{ marginTop: 15 }}>
                                                    <div className='col-md-6'>
                                                        <label>Auction Id:</label>
                                                        <input type='text' id='TxtAucide' value={rowData[0]?.auction_ID} disabled className='form-control' />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label>Auc  Id:</label>
                                                        <input type='text' id='TxtAucdocide' value={rowData[0]?.aucDoc_ID} disabled className='form-control' />
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <label>Lot No:</label>
                                                        <input type='text' id='Txtlotno' value={rowData[0]?.lot_No} disabled className='form-control' />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label>Auction Date:</label>
                                                        <input type='text' id='Txtauctiondate' value={rowData[0]?.confirm_Date} disabled className='form-control' />
                                                    </div>
                                                </div>
                                                <div className='row' style={{ marginTop: 15 }}>
                                                    <div className='table-responsive'>
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
                                                                {RowInstrumentData[0]
                                                                    ?.filter(item => item?.payment_Status == PaymentStatus.Pending)  // Filter rows where payable_Calc_Amount is not 0
                                                                    .map((item, index) => (
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
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {(selectedOption.value == 2 || selectedOption.value == 3) && (
                                            <>
                                                <h4 style={{ marginTop: 25, fontSize: '16px' }}>{selectedOption.value == 2 ? 'SEARCH LOTS FOR EXCESS/GROUND RENT PAYMENT' : 'INTEREST CHARGED DETAILS'}</h4>
                                                <div className="row mt-3" style={{ marginTop: 20 }}>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="TxtAuctionide" className="form-label">Auction Id:</label>
                                                        <input type="text" id="TxtAuctionide" name='auctionIdFrm' className="form-control" onChange={(e) => excessQtyInterestChgFrmDataChange(e.target.name, e.target.value)} />

                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="Txtlotnolike" className="form-label">Lot No Like:</label>
                                                        <input type="text" id="Txtlotnolike" name='lotNo' onChange={(e) => excessQtyInterestChgFrmDataChange(e.target.name, e.target.value)} className="form-control" />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Auction From Date:</label>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker
                                                                value={auctionFromDate}
                                                                name='auctionDateFrm'
                                                                format="DD/MM/YYYY"
                                                                onChange={(newValue) => {
                                                                    setAuctionFromDate(newValue ? dayjs(newValue) : null);
                                                                    excessQtyInterestChgFrmDataChange('auctionDateFrm', dayjs(newValue).format('YYYY-MM-DD'));
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} size="small" fullWidth />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Auction To Date:</label>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker
                                                                value={auctionToDate}
                                                                name='auctionDateTo'
                                                                format="DD/MM/YYYY"
                                                                onChange={(newValue) => {
                                                                    setAuctionToDate(newValue ? dayjs(newValue) : null);
                                                                    excessQtyInterestChgFrmDataChange('auctionDateTo', dayjs(newValue).format('YYYY-MM-DD'));
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} size="small" fullWidth />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    </>
                                )}
                                {activeStep === 3 && (
                                    <>
                                        <h5 style={{ fontSize: '16px' }}>{(selectedOption.value == 1) ? 'Allocation Details -II' : 'TRANSFER DETAILS'}</h5>
                                        <div className='col-md-12' style={{ marginTop: 15 }}>
                                            <MaterialReactTable
                                                columns={(selectedOption.value == 1) ? allocationColumns : InstrumentDetailsData}
                                                data={(selectedOption.value == 1) ? allocationData : instrumentList}
                                                enableSorting
                                                enablePagination
                                                muiTableHeadCellProps={{
                                                    sx: {
                                                        backgroundColor: '#87CEEB',
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                            />
                                        </div>

                                        {(selectedOption.value == 1) && (
                                            <>
                                                <div className='row' style={{ marginTop: 15 }}>
                                                    <div className='col-md-6'>
                                                        <label>Auction Id:</label>
                                                        <input type='text' id='TxtAucide1' value={rowData[0]?.auction_ID} disabled className='form-control' />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label>Auc  Id:</label>
                                                        <input type='text' id='TxtAucdocide1' name='aucdocId' value={rowData[0]?.aucDoc_ID} disabled className='form-control' />
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <label>Lot No:</label>
                                                        <input type='text' id='Txtlotno1' value={rowData[0]?.lot_No} disabled className='form-control' />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label>Auction Date:</label>
                                                        <input type='text' id='Txtauctiondate1' value={rowData[0]?.confirm_Date} disabled className='form-control' />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='row'>
                                                        <div className='col-md-6'>
                                                            <label>Payment Type:</label>
                                                            <input type='text' id='Txtpaymenttypr' value={textBoxData?.payment_Head} disabled className='form-control' />
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Payment Date:</label>
                                                            <input type='text' id='TxtPaymentdate' value={textBoxData?.due_Date} disabled className='form-control' />
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-md-6'>
                                                            <label>Actual Amount:</label>
                                                            <input type='text' id='Txtactualamt' value={textBoxData?.actual_Calc_Amount} disabled className='form-control' />
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>TCS(%):</label>
                                                            <input type='text' id='Txttcs' value={textBoxData?.tcsPer} disabled className='form-control' />
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-md-6'>
                                                            <label>Due Amount:</label>
                                                            <input type='text' id='TxtDueamt' value={textBoxData?.payable_Calc_Amount} disabled className='form-control' />
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Allocation Amount:</label>
                                                            <input type='number' id='TxtAllocationamt' onChange={(e) => CheckAllocationamt(e)} value={notAllocatedAmount} className='form-control' />
                                                            {/* <input type='text' id='TxtAllocationamt' onChange={CheckAllocationamt} value={payableAmount?.payable_Amount} className='form-control' /> */}
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-md-6'>
                                                            <label>Payment Mode:</label>
                                                            <input type='text' id='Txtpaymode' value="RTGS" disabled className='form-control' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {(selectedOption.value == 2 || selectedOption.value == 3) && (
                                            <>
                                                <h4 style={{ marginTop: 15, fontSize: '16px' }}>SEARCHED DETAILS</h4>
                                                <div className='row' style={{ marginTop: 15 }}>
                                                    <div className='table-responsive'>
                                                        <MaterialReactTable table={InstrumentPaymentTableconfig} />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    </>
                                )}
                                {activeStep === 4 && (
                                    <>
                                        {(selectedOption.value == 1) &&
                                            <>
                                                <MaterialReactTable
                                                    columns={allocationColumns}
                                                    data={allocationData}
                                                    enableSorting
                                                    enablePagination
                                                    muiTableHeadCellProps={{
                                                        sx: {
                                                            backgroundColor: '#87CEEB', // SkyBlue
                                                            color: 'black', // Optional: text color
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                />
                                                <div className='row' style={{ marginTop: 15 }}>
                                                    <div className='col-md-6'>
                                                        <label>Auction Id:</label>
                                                        <input type='text' id='TxtAucide2' value={rowData[0]?.auction_ID} disabled className='form-control' />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label>Auc  Id:</label>
                                                        <input type='text' id='TxtAucdocide2' value={rowData[0]?.aucDoc_ID} disabled className='form-control' />
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <label>Lot No:</label>
                                                        <input type='text' id='Txtlotno2' value={rowData[0]?.lot_No} disabled className='form-control' />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label>Auction Date:</label>
                                                        <input type='text' id='Txtauctiondate2' value={rowData[0]?.confirm_Date} disabled className='form-control' />
                                                    </div>
                                                </div>
                                                <div className='row' style={{ marginTop: 15 }}>
                                                    <div className='table-responsive'>
                                                        <table className='table table-striped table-sm'>
                                                            <thead style={{ backgroundColor: 'skyblue' }}>
                                                                <tr>
                                                                    <th className='text-center'><b>Select</b></th>
                                                                    <th className='text-center'><b>Payment Head</b></th>
                                                                    <th className='text-center'><b>Actual Amount</b></th>
                                                                    <th className='text-center'><b>Allocated Amount</b></th>
                                                                    <th className='text-center'><b>TCS %</b></th>
                                                                    <th className='text-center'><b>Due Date</b></th>
                                                                    <th className='text-center'><b>Left Amount</b></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {RowInstrumentData[0]?.filter(item => item?.payment_Status == PaymentStatus.Pending).map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td className='text-center'>
                                                                            <Checkbox
                                                                                checked={index === 0}
                                                                                disabled={index !== 0}
                                                                            />
                                                                        </td>
                                                                        <td className='text-center'>{item?.payment_Head}</td>
                                                                        <td className='text-center'>{item?.actual_Calc_Amount}</td>
                                                                        <td className='text-center'>{index === 0 ? notAllocatedAmount : item?.actual_Calc_Amount}</td>
                                                                        <td className='text-center'>{item?.tcsPer}</td>
                                                                        <td className='text-center'>{item?.due_Date}</td>
                                                                        <td className='text-center'>
                                                                            {
                                                                                index === 0
                                                                                    ? (Math.abs(
                                                                                        parseFloat(
                                                                                            item?.actual_Calc_Amount -
                                                                                            (item?.actual_Calc_Amount - textBoxData?.payable_Calc_Amount) -
                                                                                            notAllocatedAmount
                                                                                        )
                                                                                    ).toFixed(2))
                                                                                    : (Math.abs(item?.actual_Calc_Amount || 0).toFixed(2))
                                                                            }
                                                                        </td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        {(selectedOption.value == 2) &&
                                            <>
                                                <h5 style={{ fontSize: '16px' }}>EXCESS PAYMENT DETAILS</h5>
                                                <div className='col-md-12' style={{ marginTop: 15 }}>
                                                    <MaterialReactTable
                                                        columns={allocationColumns}
                                                        data={allocationData}
                                                        enableSorting
                                                        enablePagination
                                                    />
                                                </div>

                                                <div className="row mt-3" style={{ marginTop: 10 }}>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="Txttcs" className="form-label">TCS (%)</label>
                                                        <input type="text" id="Txttcs" name='tcs' disabled value={tcs} className="form-control" />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="TxtAllocationamt" className="form-label">Allocation Amount</label>
                                                        <input type="text" id="TxtAllocationamt" name='allocateamtAmount' disabled value={allocatedAmount?.toFixed(2)} className="form-control" />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="Txtexceqty" className="form-label">Excess Qty</label>
                                                        <input type="text" id="Txtexceqty" name='quantity' value={excessQtyFormData.quantity} className="form-control" onChange={(e) => excessQtyFormDataChange(e.target.name, e.target.value)} />
                                                        {excessQtyFormError.quantity && <span className='text-red'>Please Provide a Correct Excess Qty less than Not Allocated Amt</span>}
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="Txtsapmrno" className="form-label">SAP MR No</label>
                                                        <input type="text" id="Txtsapmrno" name='sapMrNo' className="form-control" onChange={(e) => excessQtyFormDataChange(e.target.name, e.target.value)} />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="paymentMode" className="form-label">Payment Mode</label>
                                                        <input type="text" id="Txtsapmrno" name='paymentMode' className="form-control" value={excessQtyFormData.paymentMode} disabled onChange={(e) => excessQtyFormDataChange(e.target.name, e.target.value)} />
                                                    </div>
                                                </div>

                                            </>
                                        }
                                        {(selectedOption.value == 3) &&
                                            <>
                                                <h5 style={{ fontSize: '16px' }}>INTEREST CHARGED DETAILS</h5>
                                                <div style={{ marginTop: 15 }} className='col-md-12'>
                                                    <MaterialReactTable
                                                        columns={allocationColumns}
                                                        data={allocationData}
                                                        enableSorting
                                                        enablePagination
                                                        muiTableHeadCellProps={{
                                                            sx: {
                                                                backgroundColor: '#87CEEB', // SkyBlue
                                                                color: 'black', // Optional: text color
                                                                fontWeight: 'bold',
                                                            },
                                                        }}
                                                    />
                                                </div>

                                                {/* <div className="row mt-3" style={{ marginTop: 10 }}>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Pay Type <span className="text-danger">*</span>
                                                        </label>
                                                        <select className="form-control" required name='PayType' onChange={InterestChargeformikObj.handleChange}>
                                                            <option value="-1">--Select</option>
                                                            <option value="EMD">EMD</option>
                                                            <option value="Installment">Installment</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Installment No <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" id="TxtInstallmentNo" name='InstallmentNo' onChange={InterestChargeformikObj.handleChange} className="form-control" required />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Payment Due Amt <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" id="TxtPayDueAmt" name='PaymentDueAmt' onChange={InterestChargeformikObj.handleChange} className="form-control" required />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Delay Days <span className="text-danger">*</span></label>
                                                        <input type="text" id="Txtdelayday" name='DelayDays' onChange={InterestChargeformikObj.handleChange} className="form-control" />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Interest Amt <span className="text-danger">*</span></label>
                                                        <input type="text" id="TxtinterestAmt" name='InterestAmt' onChange={InterestChargeformikObj.handleChange} className="form-control" />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Adjustment Date <span className="text-danger">*</span>
                                                        </label>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker
                                                                value={adjusmentDate}
                                                                onChange={(newValue) => {
                                                                    InterestChargeformikObj.setFieldValue("AdjusmentDate", newValue ? newValue.format("YYYY-MM-DD") : "");
                                                                    setAdjusmentDate(newValue ? dayjs(newValue) : null);
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} size="small" fullWidth required />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Payment Mode <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" id="Txtpaymode" name='PayMode' value={InterestChargeformikObj.values.PayMode} disabled className="form-control" />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Remarks <span className="text-danger">*</span></label>
                                                        <input type="text" id="Txtremarks" name='Remarks' onChange={InterestChargeformikObj.handleChange} className="form-control" />
                                                    </div>

                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Catalogue Type <span className="text-danger">*</span>
                                                        </label>
                                                        <select className="form-control" id="Ddlcataloguetype" required name='CatalogueType' onChange={InterestChargeformikObj.handleChange}>
                                                            <option value="-1">--Select</option>
                                                            <option value={CatalougeType.Within_Catalogue}>Within Catalogue</option>
                                                            <option value={CatalougeType.Without_Catalogue}>Without Catalogue</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Choose File {(InterestChargeformikObj.values.CatalogueType == CatalougeType.Without_Catalogue) && <span className="text-danger">*</span>}
                                                        </label>
                                                        <input type="file" id="uploadfile" onChange={(e) => UploadCatalougeFile(e)} className="form-control" required={(InterestChargeformikObj.values.CatalogueType == CatalougeType.Without_Catalogue)} />
                                                    </div>
                                                </div> */}

                                                <div className="row mt-3" style={{ marginTop: 10 }}>
                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">
                                                            PayType:<span class="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            className={`form-control col-sm-8 ${InterestChargeformikObj.touched.PayType && InterestChargeformikObj.errors.PayType ? 'is-invalid' : ''}`}
                                                            required
                                                            name="PayType"
                                                            onChange={InterestChargeformikObj.handleChange}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            value={InterestChargeformikObj.values.PayType}
                                                        >
                                                            <option value="-1">--Select--</option>
                                                            <option value="EMD">EMD</option>
                                                            <option value="Installment">Installment</option>
                                                        </select>
                                                        {InterestChargeformikObj.touched.PayType && InterestChargeformikObj.errors.PayType && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.PayType}</div>
                                                        )}
                                                    </div>
                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">
                                                            InstallmentNo: <span class="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="TxtInstallmentNo"
                                                            name="InstallmentNo"
                                                            onChange={InterestChargeformikObj.handleChange}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            value={InterestChargeformikObj.values.InstallmentNo}
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.InstallmentNo && InterestChargeformikObj.errors.InstallmentNo ? 'is-invalid' : ''}`}
                                                            required
                                                        />
                                                        {InterestChargeformikObj.touched.InstallmentNo && InterestChargeformikObj.errors.InstallmentNo && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.InstallmentNo}</div>
                                                        )}
                                                    </div>

                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">
                                                            PaymentDueAmt:<span class="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="TxtPayDueAmt"
                                                            name="PaymentDueAmt"
                                                            onChange={InterestChargeformikObj.handleChange}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            value={InterestChargeformikObj.values.PaymentDueAmt}
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.PaymentDueAmt && InterestChargeformikObj.errors.PaymentDueAmt ? 'is-invalid' : ''}`}
                                                            required
                                                        />
                                                        {InterestChargeformikObj.touched.PaymentDueAmt && InterestChargeformikObj.errors.PaymentDueAmt && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.PaymentDueAmt}</div>
                                                        )}
                                                    </div>
                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">DelayDays:<span class="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            id="Txtdelayday"
                                                            name="DelayDays"
                                                            onChange={InterestChargeformikObj.handleChange}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            value={InterestChargeformikObj.values.DelayDays}
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.DelayDays && InterestChargeformikObj.errors.DelayDays ? 'is-invalid' : ''}`}
                                                            required
                                                        />
                                                        {InterestChargeformikObj.touched.DelayDays && InterestChargeformikObj.errors.DelayDays && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.DelayDays}</div>
                                                        )}
                                                    </div>

                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">InterestAmt:<span class="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            id="TxtinterestAmt"
                                                            name="InterestAmt"
                                                            onChange={InterestChargeformikObj.handleChange}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            value={InterestChargeformikObj.values.InterestAmt}
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.InterestAmt && InterestChargeformikObj.errors.InterestAmt ? 'is-invalid' : ''}`}
                                                            required
                                                        />
                                                        {InterestChargeformikObj.touched.InterestAmt && InterestChargeformikObj.errors.InterestAmt && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.InterestAmt}</div>
                                                        )}
                                                    </div>
                                                    <div className="form-group col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Adjustment Date <span className="text-danger">*</span>
                                                        </label>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker
                                                                value={dayjs(InterestChargeformikObj.values.AdjusmentDate)}
                                                                onChange={(newValue) => {
                                                                    InterestChargeformikObj.setFieldValue('AdjusmentDate', newValue ? newValue.format('YYYY-MM-DD') : '');
                                                                }}
                                                                slotProps={{
                                                                    textField: {
                                                                        size: 'medium',
                                                                        fullWidth: true,
                                                                        required: true,
                                                                        name: 'AdjusmentDate',
                                                                        onBlur: InterestChargeformikObj.handleBlur,
                                                                        error: InterestChargeformikObj.touched.AdjusmentDate && Boolean(InterestChargeformikObj.errors.AdjusmentDate),
                                                                        helperText: InterestChargeformikObj.touched.AdjusmentDate && InterestChargeformikObj.errors.AdjusmentDate,
                                                                    },
                                                                }}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>

                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">
                                                            PayMode:<span class="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="Txtpaymode"
                                                            name="PayMode"
                                                            value={InterestChargeformikObj.values.PayMode}
                                                            disabled
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.PayMode && InterestChargeformikObj.errors.PayMode ? 'is-invalid' : ''}`}
                                                        />
                                                        {InterestChargeformikObj.touched.PayMode && InterestChargeformikObj.errors.PayMode && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.PayMode}</div>
                                                        )}
                                                    </div>
                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">Remarks <span class="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            id="Txtremarks"
                                                            name="Remarks"
                                                            onChange={InterestChargeformikObj.handleChange}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            value={InterestChargeformikObj.values.Remarks}
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.Remarks && InterestChargeformikObj.errors.Remarks ? 'is-invalid' : ''}`}
                                                            required
                                                        />
                                                        {InterestChargeformikObj.touched.Remarks && InterestChargeformikObj.errors.Remarks && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.Remarks}</div>
                                                        )}
                                                    </div>

                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">
                                                            CatalogueType:<span class="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.CatalogueType && InterestChargeformikObj.errors.CatalogueType ? 'is-invalid' : ''}`}
                                                            id="Ddlcataloguetype"
                                                            required
                                                            name="CatalogueType"
                                                            onChange={InterestChargeformikObj.handleChange}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            value={InterestChargeformikObj.values.CatalogueType}
                                                        >
                                                            <option value="-1">--Select--</option>
                                                            <option value="Within_Catalogue">Within Catalogue</option>
                                                            <option value="Without_Catalogue">Without Catalogue</option>
                                                        </select>
                                                        {InterestChargeformikObj.touched.CatalogueType && InterestChargeformikObj.errors.CatalogueType && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.CatalogueType}</div>
                                                        )}
                                                    </div>
                                                    <div class="form-group col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Choose File {(InterestChargeformikObj.values.CatalogueType === CatalougeType.Without_Catalogue) && <span className="text-danger">*</span>}
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="uploadfile"
                                                            onChange={(e) => {
                                                                UploadCatalougeFile(e);
                                                                InterestChargeformikObj.setFieldValue('File', e.currentTarget.files[0]);
                                                            }}
                                                            onBlur={InterestChargeformikObj.handleBlur}
                                                            className={`form-control col-sm-10 ${InterestChargeformikObj.touched.File && InterestChargeformikObj.errors.File ? 'is-invalid' : ''}`}
                                                        //required={(InterestChargeformikObj.values.CatalogueType === CatalougeType.Without_Catalogue)}
                                                        />
                                                        {/* {InterestChargeformikObj.touched.File && InterestChargeformikObj.errors.File && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.File}</div>
                                                        )} */}
                                                        {InterestChargeformikObj.touched.File && InterestChargeformikObj.errors.File && (
                                                            <div className="invalid-feedback">{InterestChargeformikObj.errors.File}</div>
                                                        )}
                                                    </div>
                                                </div>

                                            </>
                                        }
                                    </>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, width: '100%', justifyContent: 'space-between' }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 1}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {selectedOption && selectedOption.value !== '' && (
                                    <Button
                                        onClick={
                                            activeStep === steps.length
                                                ? () => PaymentAllowcationformikObj.handleSubmit()
                                                : handleNext
                                        }
                                        // disabled={selectedOption.value == 1 && (!payableAmount.payable_Amount || payableAmount.payable_Amount === '') || isAmountInvalid}
                                        disabled={selectedOption.value == 1 && isAmountInvalid}
                                    >
                                        {activeStep === steps.length ? 'Submit' : 'Next'}
                                    </Button>
                                )}
                            </Box>
                        </div>
                    </div>
                </>
            }

        </>
    )

}