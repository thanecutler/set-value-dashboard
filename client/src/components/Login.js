import axios from "axios";
import React, { useState } from "react";
import { Label, Input, FormGroup, Button, Alert } from "reactstrap";
import { Link, useParams } from "react-router-dom";

const Login = () => {
  const [loginParams, setLoginParams] = useState({});
  const [error, setError] = useState("");
  const handleSetLoginParams = (key, value) => {
    setLoginParams({ ...loginParams, [key]: value });
  };
  const submitLoginParams = () => {
    axios.post(`/api/login`, loginParams).then((res) => {
      if (res.data.msg) {
        setError(res.data.msg);
      } else {
        setError("");
        console.log(res.data);
      }
    });
  };
  return (
    <div>
      <div>{error && <Alert color='warning'>{error}</Alert>}</div>
      <FormGroup>
        <Label for='username'>Username</Label>
        <Input
          name='username'
          id='username'
          autoComplete='false'
          autoCapitalize='false'
          onChange={(e) => handleSetLoginParams("username", e.target.value)}
        />
        <Label for='password'>Password</Label>
        <Input
          type='password'
          id='password'
          onChange={(e) => handleSetLoginParams("password", e.target.value)}
        />
      </FormGroup>
      <Button
        disabled={!loginParams.username || !loginParams.password}
        onClick={() => submitLoginParams()}
      >
        Submit
      </Button>

      <div>
        <Link to={`/signup`}>Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
