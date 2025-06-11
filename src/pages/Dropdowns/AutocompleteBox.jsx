import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { searchUserService } from '../../api/service/userService';
import { useDebounce } from 'use-debounce';
import { Box } from "@mui/material";

const AutocompleteBox = () => {

    const [filterArray, setFilterArray] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedValue, setSelectedValue] = useState(null);
    const debounceText = useDebounce(searchValue, 1000);

    useEffect(() => {
        if ((searchValue !== "")) {
            searchUserService({ searchParam: debounceText[0] }).then(res => {
                if (res.success) {
                    setFilterArray(res?.data);
                }
                else {
                    setFilterArray([]);
                }
            })
                .catch(err => {
                    console.log(err);
                    setFilterArray([]);
                })
        }
        else {
            setFilterArray([]);
        }
    }, [debounceText[0]])

    return (
        <Fragment>
            <Container fluid='md'>
                <h4 className="mt-4">With Debounce</h4>
                <div className="d-flex">
                    <Autocomplete
                        options={filterArray}
                        getOptionLabel={(option) => option.name || ""}
                        value={selectedValue}
                        onChange={(event, value) => {
                            setSelectedValue(value);
                            if (value) {
                                console.log("Selected ID:", value.id);
                            } else {
                                console.log("No option selected");
                            }
                        }}
                        // if want any customization wuth the search result then "renderOption" needed
                        renderOption={(props, option) => (
                            <Box component="li" {...props} key={option.id}> {/* Spread props properly */}
                                <img
                                    loading="lazy"
                                    width="30"
                                    style={{ borderRadius: '50%', marginRight: 10 }}
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}/${option?.avatar}`}
                                    alt=""
                                />
                                {option.name}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search"
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        )}
                        sx={{
                            width: 400,
                            '& .MuiAutocomplete-endAdornment': {
                                display: 'none',
                            }
                        }}
                    />


                </div>
            </Container>
        </Fragment>
    )
}
export default AutocompleteBox;




{/* <h4>Without Debounce</h4>
                <div className="d-flex">
                    <Autocomplete
                        options={filterArray} // Pass the entire array of objects
                        getOptionLabel={(option) => option.name} // Specify which property to display
                        onChange={(event, value) => {
                            if (value) {
                                console.log("Selected ID:", value.id); // Access the id of the selected option
                            } else {
                                console.log("No option selected");
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search"
                                onChange={onSearchTextChange} // Handles input change for filtering
                            />
                        )}
                        sx={{
                            width: 400,
                            '& .MuiAutocomplete-endAdornment': {
                                display: 'none', // Hides the dropdown arrow
                            }
                        }}
                    />

                </div> */}