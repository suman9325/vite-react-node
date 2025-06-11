import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TOAST_TYPE, toastAlert } from '../../components/Toaster/toastify';

const steps = ['Basic Info', 'Create Username/Password', 'Feedback'];

const stepValidationSchemas = [
  Yup.object({
    fullname: Yup.string().required('Full name is required'),
    contact: Yup.string().required('Contact number is required'),
  }),
  Yup.object({
    address: Yup.string().required('Address is required'),
    mailId: Yup.string().email('Invalid email address').required('Email is required'),
  }),
  Yup.object({
    feedback: Yup.string().required('Feedback is required'),
  }),
];

const formFields = {
  fullname: '',
  address: '',
  contact: '',
  mailId: '',
  feedback: '',
};

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [formValues, setFormValues] = React.useState({ ...formFields });

  const formikObj = useFormik({
    enableReinitialize: true,
    initialValues: formValues,
    onSubmit: (values) => {
      console.log('formValues', values);
      formikObj.resetForm();
      setActiveStep(1);
      toastAlert(TOAST_TYPE.SUCCESS, 'Form submitted successfully');
    },
  });

  const handleNext = () => {
    console.log(activeStep);
    
    const schema = stepValidationSchemas[activeStep - 1];
    schema
      .validate(formikObj.values, { abortEarly: false })
      .then(() => {
        // If validation passes, increment the step
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })
      .catch((err) => {
        // If validation fails, show errors
        const errors = {};
        err.inner.forEach((validationError) => {
          errors[validationError.path] = validationError.message;
        });
        formikObj.setErrors(errors);
      });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  React.useEffect(()=>{
    if (activeStep == 2){
      console.log('api call');
      
    }
  },[activeStep])

  return (
    <Box sx={{ width: 1000 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <React.Fragment>
        {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep}</Typography> */}
        <Box sx={{ flex: '1 1 auto', mt: 2, mb: 1 }}>
          {activeStep === 1 && (
            <Stack gap={3}>
              <Row>
                <Col md={6}>
                  <input
                    type="text"
                    name="fullname"
                    value={formikObj.values.fullname}
                    onChange={formikObj.handleChange}
                    className="form-control"
                    placeholder="Enter your name"
                  />
                  {formikObj.errors.fullname && (
                    <Typography color="error">{formikObj.errors.fullname}</Typography>
                  )}
                </Col>
                <Col md={6}>
                  <input
                    type="text"
                    name="contact"
                    value={formikObj.values.contact}
                    onChange={formikObj.handleChange}
                    className="form-control"
                    placeholder="Enter your contact"
                  />
                  {formikObj.errors.contact && (
                    <Typography color="error">{formikObj.errors.contact}</Typography>
                  )}
                </Col>
              </Row>
            </Stack>
          )}
          {activeStep === 2 && (
            <Stack gap={3}>
              <Row>
                <Col md={6}>
                  <input
                    type="text"
                    name="address"
                    value={formikObj.values.address}
                    onChange={formikObj.handleChange}
                    className="form-control"
                    placeholder="Enter Address"
                  />
                  {formikObj.errors.address && (
                    <Typography color="error">{formikObj.errors.address}</Typography>
                  )}
                </Col>
                <Col md={6}>
                  <input
                    type="email"
                    name="mailId"
                    value={formikObj.values.mailId}
                    onChange={formikObj.handleChange}
                    className="form-control"
                    placeholder="Enter Email Id"
                  />
                  {formikObj.errors.mailId && (
                    <Typography color="error">{formikObj.errors.mailId}</Typography>
                  )}
                </Col>
              </Row>
            </Stack>
          )}
          {activeStep === 3 && (
            <Stack gap={3}>
              <Row>
                <Col md={12}>
                  <input
                    type="text"
                    name="feedback"
                    value={formikObj.values.feedback}
                    onChange={formikObj.handleChange}
                    className="form-control"
                    placeholder="Enter Feedback"
                  />
                  {formikObj.errors.feedback && (
                    <Typography color="error">{formikObj.errors.feedback}</Typography>
                  )}
                </Col>
              </Row>
            </Stack>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, width: 1000 }}>
          <Button
            color="inherit"
            disabled={activeStep === 1}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={
              activeStep === steps.length
                ? () => formikObj.handleSubmit()
                : handleNext
            }
          >
            {activeStep === steps.length ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </React.Fragment>
    </Box>
  );
}
