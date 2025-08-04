import { useState } from "react";
import * as XLSX from "xlsx";

const ExcelViewUpload = () => {
    const [data, setData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [payloadData, setPayloadData] = useState([]);
    const colHeads = ['date', 'name', 'title'];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const parsedData = XLSX.utils.sheet_to_json(sheet); // raw=true gives Excel serial numbers

                parsedData.forEach((item) => {
                    for (let key in item) {
                        const val = item[key];
                        if (typeof val === "number" && key.toLowerCase().includes("date")) {
                            const dateObj = XLSX.SSF.parse_date_code(val);
                            if (dateObj) {
                                const jsDate = new Date(Date.UTC(dateObj.y, dateObj.m - 1, dateObj.d));
                                item[key] = jsDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
                            }
                        }
                    }
                });

                setData(parsedData);
            };
        }
    };




    const handleSubmit = async () => {
        data.map((item) => {
            const arr = Object.values(item);  // Extract values from item
            let obj = {};  // Initialize an empty object

            for (let i = 0; i < colHeads.length; i++) {
                obj[colHeads[i]] = arr[i];  // Map column headers to values
            }

            payloadData.push(obj);  // Push a copy of the object
        });
        console.log(payloadData);
    };

    const handleClear = () => {
        setPayloadData([]);
        setData([]);
        setFileName('');
    }

    return (
        <div>
            <div>
                <h3>Excel File Upload</h3>
            </div>
            <div className="d-flex mb-2">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </div>
            {data.length > 0 && (
                <>
                    <table border="1">
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((item, i) => (
                                    <th key={i}>{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((val, i) => (
                                        <td key={i}>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-end mt-2">
                        <button onClick={handleClear} className="me-2">Clear</button>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExcelViewUpload;