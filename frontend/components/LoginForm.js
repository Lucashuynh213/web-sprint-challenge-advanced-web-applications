import React, { useState } from 'react';
import PT from 'prop-types';

const initialFormValues = {
  username: '',
  password: '',
};

const LoginForm = ({ login }) => {
  const [values, setValues] = useState(initialFormValues);

  const onChange = evt => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = evt => {
    evt.preventDefault();
    login(values); // Trigger the login function with form values
  };

  const isDisabled = () => {
    return values.username.trim().length < 3 || values.password.trim().length < 8;
  };

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
        autoComplete="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
        autoComplete="current-password"
      />
      <button disabled={isDisabled()} id="submitCredentials">
        Submit credentials
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  login: PT.func.isRequired,
};

export default LoginForm;
