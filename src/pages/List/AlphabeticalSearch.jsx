import React, { Fragment } from 'react';
const tabData = [
    {
        id: 1,
        name: 'suman',
        address: 'kolkata',
        phone: '878475646',
        dob: '02-02-1993'
    },
    {
        id: 2,
        name: 'madhu',
        address: 'delhi',
        phone: '87848767846',
        dob: '04-04-1993'
    },
]
const AlphabeticalSearch = () => {

    const searchTable = (searchText) => {
        console.log({searchText});
        
    }

    return (
        <Fragment>
            <div className="d-flex flex-wrap gap-2 p-2">
                <button
                    className="btn btn-secondary fw-bold p-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => searchTable('')}
                >
                    All
                </button>
                {[...Array(26)].map((item, i) => (
                    <button
                        key={i}
                        className="btn btn-primary fw-bold p-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => searchTable(String.fromCharCode(65 + i))}
                    >
                        {String.fromCharCode(65 + i)}
                    </button>
                ))}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Dob</th>
                    </tr>
                </thead>
                <tbody>
                    {tabData.map((item, i) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.address}</td>
                            <td>{item.phone}</td>
                            <td>{item.dob}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </Fragment>
    );
}

export default AlphabeticalSearch;