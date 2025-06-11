import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';
import Dropdown from '../../components/SelectBox/Dropdown';
import { getAllUsersService, getFilteredUsersService } from '../../api/service/tableService';
import { getAllCountryService, getAllStateByCountryService } from '../../api/service/dropDownService';

const FilterTable = () => {

    const [tableData, setTableData] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [filteredStateList, setfilteredStateList] = useState([]);
    const [isDisabled, setisDisabled] = useState(true);
    const [cid, setCid] = useState();

    useEffect(() => {
        getAllCountry();
        getAllUsers();
    }, [])

    const getAllCountry = () => {
        getAllCountryService().then(res => {
            const { success, data } = res.data
            if (success) {
                const updatedData = data.map(item => {
                    return {
                        id: item.cid,
                        name: item.cname
                    }
                })
                setCountryList(updatedData);
            } else {

            }

        })
            .catch(err => {
                console.log(err);
            })
    }

    const getAllUsers = (cid = null, sid = null) => {
        getFilteredUsersService({ cid, sid }).then(res => {
            if (res.success) {
                // toastAlert(TOAST_TYPE.SUCCESS, 'Users Fetched Successfully!');
                setTableData(res.data)
            }
        })
            .catch(err => {
                console.log(err);
            })
    }

    //should be memoized or stable
    const columns = useMemo(() =>
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
            {
                accessorKey: 'country', //normal accessorKey
                header: 'Country',
                size: 200,
            },
            {
                accessorKey: 'state', //normal accessorKey
                header: 'State',
                size: 200,
            },
        ],
        []);



    const tableConfig = useMaterialReactTable({
        columns,
        data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

    const onCountryChange = (cid) => {
        setCid(cid);
        getAllUsers(cid);
        if (!!cid) {
            getAllStateByCountryService({ cid }).then(res => {
                const { success, data } = res.data
                if (success) {
                    setisDisabled(false);
                    setfilteredStateList(data);
                } else {
                    setisDisabled(true);
                }

            })
                .catch(err => {
                    console.log(err);
                    setisDisabled(true);
                })
        }
        else {
            setfilteredStateList([]);
            setisDisabled(true);
        }
    }

    const onStateChange = (sid) => {
        getAllUsers(cid, sid)
    }

    return (
        <Fragment>
            <div className='d-flex justify-content-between mb-3'>
                <label className=''>Country</label>
                <Dropdown
                    optionList={countryList}
                    onDropdownChange={onCountryChange}
                />

                <label className=''>State</label>
                <Dropdown
                    optionList={filteredStateList}
                    isDisabled={isDisabled}
                    onDropdownChange={onStateChange}
                />
            </div>
            <MaterialReactTable table={tableConfig} />
        </Fragment>
    );
};

export default FilterTable;