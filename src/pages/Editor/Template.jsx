import React, { Fragment, useEffect, useState } from "react";
import { getAllFieldsService } from "../../api/service/editorService";
import { useFormik } from "formik";
import { Button, Card } from "react-bootstrap";
import { getAllCountryService } from "../../api/service/dropDownService";
import Select from 'react-select';
import { addUpdateTemplateService, getTamplateService } from "../../api/service/templateService";
import { TOAST_TYPE, toastAlert } from "../../components/Toaster/toastify";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const initialFormValues = {
    template_name: "",
    template_country: "",
    template_type: ""
}
const Template = () => {

    const [initialFieldValues, setInitialFieldValues] = useState({ ...initialFormValues })
    const [checkBoxFields, setCheckBoxFields] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [templateList, setTemplateList] = useState([]);
    const [templateData, setTemplateData] = useState(null);
    const [checkedFields, setCheckedFields] = useState([]);

    useEffect(() => {
        getAllFields();
        getAllCountryList();
    }, [])

    const getAllFields = () => {
        getAllFieldsService().then(res => {
            if (res.success) {
                setCheckBoxFields(res.data);
            }
        })
            .catch(err => console.error(err))
    }

    const getAllCountryList = () => {
        getAllCountryService().then(res => {
            const { success, data } = res
            if (success) {
                const updatedData = data.map(item => {
                    return {
                        value: item.cid,
                        label: item.cname
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

    const formikObj = useFormik({
        enableReinitialize: true,
        initialValues: initialFieldValues,
        onSubmit: (values) => {
            addUpdateTemplateService(values).then(res => {
                if (res.success) {
                    toastAlert(TOAST_TYPE.SUCCESS, res.message);
                    getTemplateData();
                    formikObj.resetForm();
                    setCheckedFields([]);
                    setSelectedCountry([]);
                    setTemplateData(null);
                }
            })
                .catch(err => console.log('Error', err))
        }
    })

    const onCountryChange = (val) => {
        if (!!val) {
            setSelectedCountry(val);
            const cIDx = (val.map(item => item.value)).join();
            formikObj.setFieldValue("template_country", cIDx)
        }
    }

    const handleCheckedFields = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setCheckedFields(prev => {
                const newCheckedFields = [...prev, value];
                formikObj.setFieldValue("template_type", newCheckedFields.join());
                return newCheckedFields;
            });
        } else {
            setCheckedFields(prev => {
                const newCheckedFields = prev.filter(lang => lang !== value);
                formikObj.setFieldValue("template_type", newCheckedFields.join());
                return newCheckedFields;
            });
        }
    }


    useEffect(() => {
        if (checkBoxFields.length > 0 && countryList.length > 0) {
            getTemplateData();
        }
    }, [checkBoxFields, countryList]);

    const getTemplateData = (id = null) => {
        getTamplateService({ id }).then(res => {
            if (res.success) {
                if (id == null) {
                    const updatedRes = res.data.map(item => {
                        const templateIds = item.template_type.split(',').map(Number);
                        const templateTypes = templateIds
                            .map(id => checkBoxFields.find(c => c.id == id)?.fieldName)
                            .filter(Boolean); // Filter out undefined values (if any ID doesn't match)

                        const countryIds = item.template_country.split(',').map(Number);
                        const countryNames = countryIds
                            .map(id => countryList.find(c => c.value == id)?.label)
                            .filter(Boolean); // Filter out undefined values (if any ID doesn't match)

                        return {
                            ...item,
                            template_country: countryNames.join(', '), // Join names with a comma
                            template_type: templateTypes.join(',')
                        };
                    });
                    setTemplateList(updatedRes);

                }
                else {
                    setCheckedFields([]);
                    setSelectedCountry([]);
                    setTemplateData(res.data);
                    setInitialFieldValues(res.data);
                    // Preselect checkboxes based on template data
                    const checkedFieldIds = res.data.template_type.split(',');
                    setCheckedFields(checkedFieldIds);
                    const countryArray = res.data.template_country.split(',');
                    countryArray.map((c, i) => {
                        const countryObj = countryList.filter((country) => country.value == c);
                        setSelectedCountry((prev) => [...prev, countryObj[0]]);
                    });
                }
            }
        })
            .catch(err => console.log(err))
    }

    return (
        <Fragment>
            <Card className="mb-3">
                <h4>Add/Update Template</h4>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <Select
                            className="w-300 me-3"
                            classNamePrefix="select"
                            isMulti
                            name="countryList"
                            options={countryList}
                            onChange={onCountryChange}
                            placeholder='Select Country'
                            value={selectedCountry}
                        />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="template_name" value={formikObj.values.template_name} onChange={formikObj.handleChange} className="form-control" placeholder="Enter template name" />
                    </div>
                </div>
                <div className="row mt-3">
                    {(checkBoxFields.length > 0) &&
                        <Fragment>
                            <div className="row">
                                {checkBoxFields.map((field) =>
                                    <div key={field.id} className="form-check form-check-inline col-md-2">
                                        <input
                                            className="form-check-input"
                                            name="templateType"
                                            type="checkbox"
                                            value={field.id}
                                            checked={checkedFields.includes(String(field.id))} // Check if the field ID is in checkedFields
                                            onChange={handleCheckedFields}
                                        />
                                        <label className="form-check-label">{field.fieldName}</label>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Button type="submit" onClick={formikObj.handleSubmit}>{templateData?.id ? 'Update' : 'Submit'}</Button>
                            </div>
                        </Fragment>
                    }
                </div>
            </Card>
            <Card>
                <div className="row">
                    <div className="col-md-12">
                        {templateList.length > 0 &&
                            <Fragment>
                                <table cellPadding={3} cellSpacing={5}>
                                    <thead>
                                        <th>Template Name</th>
                                        <th>Template Type</th>
                                        <th>Template Country</th>
                                        <th>Action</th>
                                    </thead>
                                    <tbody>
                                        {templateList.map((data, index) =>
                                            <tr key={index}>
                                                <td>{data.template_name}</td>
                                                <td>{data.template_type}</td>
                                                <td>{data.template_country}</td>
                                                <td>
                                                    <Button variant="success" className="me-2" onClick={() => getTemplateData(data.id)}><EditNoteIcon /></Button>
                                                    <Button variant="danger" onClick={() => deleteTemplate(data.id)}><DeleteForeverIcon /></Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Fragment>
                        }
                    </div>
                </div>
            </Card>
        </Fragment>
    );
}
export default Template;
