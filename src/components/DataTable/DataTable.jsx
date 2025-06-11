import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable
} from 'material-react-table';

const DataTable = ({tableConfigData}) => {
    return (
        <Fragment>
            <MaterialReactTable table={tableConfigData} />
        </Fragment>
    );
}

export default DataTable;