import { Grid, Button, TextField } from '@material-ui/core';
import { Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { actions } from '../slice';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string(),
});

const LoginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const emailLogin = async (email: String) => {
    dispatch(actions.loginRequest({ email: email }));
    history.push('/');
  };

  return (
    <Formik
      validateOnBlur={false}
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values, { setSubmitting }) => {
        await emailLogin(values.email);
        setSubmitting(false);
      }}
      validationSchema={validationSchema}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        return (
          <form onSubmit={handleSubmit}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="stretch"
              id="SignInForm"
              spacing={2}
            >
              <Grid item>
                <TextField
                  fullWidth
                  required
                  id="email"
                  error={touched.email && !!errors.email}
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="outlined"
                />
              </Grid>

              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Log In
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
