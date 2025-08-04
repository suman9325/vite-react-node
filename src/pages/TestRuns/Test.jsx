import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, FormLabel, OverlayTrigger, Popover } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { Fragment } from 'react';

const loginFormFields = {
  userName: '',
  password: ''
};

// Simulated login API call
const loginApi = async ({ userName, password }) => {
  const response = await axios.post('https://reqres.in/api/login', {
    email: userName,
    password
  });
  return response.data; // token will be in response.data.token
};

export default function LoginForm() {
  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      console.log('Login success, token:', data.token);
      localStorage.setItem('token', data.token); // Store token
      alert('Logged in successfully!');
      formikObj.resetForm();
    },
    onError: (error) => {
      alert(error?.response?.data?.error || 'Login failed');
    }
  });

  const formikObj = useFormik({
    enableReinitialize: true,
    initialValues: loginFormFields,
    validationSchema: Yup.object({
      userName: Yup.string()
        .email('Invalid email address')
        .required('Email required'),
      password: Yup.string().required('Password required')
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    }
  });

  const popoverHoverFocus = (
    <Popover id="popover-trigger-hover-focus" title="Popover bottom">
      <strong>Holy guacamole!</strong> Check this info.
    </Popover>
  );

  return (
    <Fragment>

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={popoverHoverFocus}
      >
        <Button>Hover + Focus</Button>
      </OverlayTrigger>


      {/* <form onSubmit={formikObj.handleSubmit} className="p-4">
        <div className="mb-3">
          <FormLabel>Email</FormLabel>
          <input
            type="email"
            name="userName"
            className="form-control"
            onChange={formikObj.handleChange}
            onBlur={formikObj.handleBlur}
            value={formikObj.values.userName}
          />
          {formikObj.touched.userName && formikObj.errors.userName && (
            <div className="text-danger">{formikObj.errors.userName}</div>
          )}
        </div>

        <div className="mb-3">
          <FormLabel>Password</FormLabel>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={formikObj.handleChange}
            onBlur={formikObj.handleBlur}
            value={formikObj.values.password}
          />
          {formikObj.touched.password && formikObj.errors.password && (
            <div className="text-danger">{formikObj.errors.password}</div>
          )}
        </div>

        <Button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form> */}
    </Fragment>
  );
}
