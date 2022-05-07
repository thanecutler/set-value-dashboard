import axios from "axios";
import React, { useState } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";

const Login = () => {
  const [loginParams, setLoginParams] = useState({});
  const handleSetLoginParams = (key, value) => {
    setLoginParams({ ...loginParams, [key]: value });
  };
  const submitLoginParams = () => {
    console.log(loginParams);
    axios.post(`/api/login`, loginParams).then((res) => {
      if (res.status < 400) {
        console.log("success");
      }
    });
  };
  return (
    <div>
      <FormGroup>
        <Label for='username'>Username</Label>
        <Input
          name='username'
          id='username'
          placeholder='with a placeholder'
          onChange={(e) => handleSetLoginParams("username", e.target.value)}
        />
        <Label for='password'>Password</Label>
        <Input
          type='password'
          id='password'
          onChange={(e) => handleSetLoginParams("password", e.target.value)}
        />
      </FormGroup>
      <Button onClick={() => submitLoginParams()}>Submit</Button>
    </div>
  );
};

export default Login;
