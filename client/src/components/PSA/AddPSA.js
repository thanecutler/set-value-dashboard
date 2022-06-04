import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
const axios = require("axios");

const PSA = () => {
  const [success, setSuccess] = useState(false);
  const [cardParams, setCardParams] = useState({ card_grade: 10 });

  const updateParams = (val, key) => {
    setCardParams({ ...cardParams, [key]: val });
  };
  const [updated, setUpdated] = useState("");
  const handleSubmit = () => {
    setSuccess(false);
    axios.post("/api/psa/add", cardParams).then((res) => {
      if (res.status === 200) {
        setSuccess(true);
        setUpdated(cardParams.card_name);
        return;
      }
    });
  };

  return (
    <div>
      {success && (
        <Alert color="success">
          Card <strong>{updated}</strong> successfully added!
        </Alert>
      )}
      <Form>
        <FormGroup>
          <Label for="card_name">Card name</Label>
          <Input
            id="card_name"
            name="card_name"
            onChange={(e) => {
              updateParams(e.target.value, "card_name");
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="card_number">Card number</Label>
          <Input
            id="card_number"
            name="card_number"
            onChange={(e) => {
              updateParams(e.target.value, "card_number");
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="set_name">Card set</Label>
          <Input
            id="set_name"
            name="set_name"
            onChange={(e) => {
              updateParams(e.target.value, "set_name");
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="grade">Grade</Label>
          <Input
            id="grade"
            name="grade"
            type="select"
            onChange={(e) => {
              updateParams(e.target.value, "card_grade");
            }}
          >
            <option>10</option>
            <option>9</option>
            <option>8</option>
            <option>7</option>
            <option>6</option>
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </Input>
        </FormGroup>
        <Button color="primary" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default PSA;
