import React, { lazy } from "react";
import SecurityIcon from '@mui/icons-material/Security';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TableViewIcon from '@mui/icons-material/TableView';
import Person3Icon from '@mui/icons-material/Person3';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import DashboardIcon from '@mui/icons-material/Dashboard';


export const pageRoutes = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: <DashboardIcon/>,
        element: lazy(() => import('./pages/Dashboard/AppDashboard')),
    },
    // AUTH
    {
        path: '/login',
        label: 'Login',
        icon: <SecurityIcon/>,
        element: lazy(() => import('./pages/Auth/Login')),
    },
    {
        path: '/registration',
        label: 'Registration',
        icon: <SecurityIcon/>,
        element: lazy(() => import('./pages/Auth/Registration')),
    },
    {
        path: '/registration-mui',
        label: 'Registration MUI',
        icon: <SecurityIcon/>,
        element: lazy(() => import('./pages/Auth/RegistrationMUI')),
    },

    // DROPDOWNS
    {
        path: '/autocomplete-box',
        label: 'Autocomplete Box (Debounce)',
        icon: <SystemUpdateAltIcon/>,
        element: lazy(() => import('./pages/Dropdowns/AutocompleteBox')),
    },
    {
        path: '/dependable-dropdown',
        label: 'Dependable Dropdown',
        icon: <SystemUpdateAltIcon/>,
        element: lazy(() => import('./pages/Dropdowns/DependableDropdown')),
    },
    {
        path: '/dependable-using-library',
        label: 'Dependable Using Lib',
        icon: <SystemUpdateAltIcon/>,
        element: lazy(() => import('./pages/Dropdowns/DependableUsingPkg')),
    },
    {
        path: '/multiSelect-dropdown',
        label: 'MultiSelect Dropdown',
        icon: <SystemUpdateAltIcon/>,
        element: lazy(() => import('./pages/Dropdowns/MultiSelectBox')),
    },
    {
        path: '/searchable-dropdown',
        label: 'Searchable Dropdown',
        icon: <SystemUpdateAltIcon/>,
        element: lazy(() => import('./pages/Dropdowns/SearchableDropdown')),
    },
    
    // File 

    {
        path: '/file-download',
        label: 'File Download',
        icon: <CloudDownloadIcon/>,
        element: lazy(() => import('./pages/FileUpload/FileDownloadEx')),
    },
    {
        path: '/mutiple-file-upload',
        label: 'Mutiple File Upload',
        icon: <CloudDownloadIcon/>,
        element: lazy(() => import('./pages/FileUpload/MutipleFileUpload')),
    },
    {
        path: '/single-file-upload',
        label: 'Single File Upload',
        icon: <CloudDownloadIcon/>,
        element: lazy(() => import('./pages/FileUpload/SingleFileUpload')),
    },
    {
        path: '/excel-file-handle',
        label: 'Excel File',
        icon: <CloudDownloadIcon/>,
        element: lazy(() => import('./pages/FileUpload/ExcelViewUpload')),
    },
    {
        path: '/drag-drop-file',
        label: 'Drag-Drop File',
        icon: <CloudDownloadIcon/>,
        element: lazy(() => import('./pages/FileUpload/DragDropFile')),
    },
    {
        path: '/image-crop-file',
        label: 'Image Crop File',
        icon: <CloudDownloadIcon/>,
        element: lazy(() => import('./pages/FileUpload/ImageCrop')),
    },

    // List

    {
        path: '/basic-table',
        label: 'BasicTable',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/BasicTable')),
    },
    {
        path: '/filter-table',
        label: 'FilterTable',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/FilterTable')),
    },
    {
        path: '/list',
        label: 'List (Export to Excel)',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/List')),
    },
    {
        path: '/list-switch',
        label: 'Switch',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/Switch')),
    },
    {
        path: '/single-checkbox-table',
        label: 'Single Checkbox Table',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/SingleCheckboxTable')),
    },
    {
        path: '/table-checkbox',
        label: 'Table Checkbox',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/TableCheckbox')),
    },
    {
        path: '/table-in-cell',
        label: 'Table In Cell',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/TableInCell')),
    },
    {
        path: '/alphabetical-search',
        label: 'Alphabetical Search',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/AlphabeticalSearch')),
    },
    {
        path: '/column-sum',
        label: 'Column Sum',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/ColumnSum')),
    },
    {
        path: '/payslip',
        label: 'Payslip',
        icon: <TableViewIcon/>,
        element: lazy(() => import('./pages/List/Payslip')),
    },

    // User
    {
        path: '/new-user',
        label: 'New User',
        icon: <Person3Icon/>,
        element: lazy(() => import('./pages/User/NewUser')),
    },
    {
        path: '/search-user-table',
        label: 'Search User Table',
        icon: <Person3Icon/>,
        element: lazy(() => import('./pages/User/SearchUserInTable')),
    },
    {
        path: '/multiple-user-add',
        label: 'Multiple User Add',
        icon: <Person3Icon/>,
        element: lazy(() => import('./pages/User/MultipleUserAdd')),
    },
    {
        path: '/linear-stepper',
        label: 'Linear Stepper',
        icon: <Person3Icon/>,
        element: lazy(() => import('./pages/User/LinearStepper')),
    },
    {
        path: '/multi-filter',
        label: 'Multi Filter',
        icon: <Person3Icon/>,
        element: lazy(() => import('./pages/User/MultiFilter')),
    },

    // Tabs
    {
        path: '/basic-tab',
        label: 'Basic Tab',
        icon: <Person3Icon/>,
        element: lazy(() => import('./pages/Tabs/TabView')),
    },
    // Accordion
    {
        path: '/basic-accordion',
        label: 'Basic Accordion',
        icon: <Person3Icon/>,
        element: lazy(() => import('./pages/Accordion/AccordionPage')),
    },

    // Test Run

    {
        path: '/test',
        label: 'Test',
        icon: <ContentPasteSearchIcon/>,
        element: lazy(() => import('./pages/TestRuns/Test')),
    },
]