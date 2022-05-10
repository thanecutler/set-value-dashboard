import axios from "axios";
import React, { useState } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";

const SignUp = () => {
  const [signUpParams, setSignUpParams] = useState({});
  const handleSetsignUpParams = (key, value) => {
    setSignUpParams({ ...signUpParams, [key]: value });
  };
  const submitSignUpParams = () => {
    axios
      .post(`/api/register`, signUpParams)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
  };
  return (
    <div>
      <h5>Sign up</h5>
      <FormGroup>
        <Label for='username'>Username</Label>
        <Input
          name='username'
          id='username'
          onChange={(e) => handleSetsignUpParams("username", e.target.value)}
        />
        <Label for='password'>Password</Label>
        <Input
          type='password'
          id='password'
          onChange={(e) => handleSetsignUpParams("password", e.target.value)}
        />
        <Label for='email'>Email</Label>
        <Input
          type='email'
          id='email'
          onChange={(e) => handleSetsignUpParams("email", e.target.value)}
        />
      </FormGroup>
      <Button
        disabled={
          !signUpParams.username ||
          !signUpParams.password ||
          !signUpParams.email
        }
        onClick={() => submitSignUpParams()}
      >
        Submit
      </Button>
    </div>
  );
};

export default SignUp;
