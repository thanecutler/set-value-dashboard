import React, { useState } from "react";
import { Button, Input, InputGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";

const SearchSets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const goToSearch = (val) => {
    val && navigate(`/search/name=${val}`);
  };

  return (
    <InputGroup>
      <Input
        color="dark"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            goToSearch(searchTerm);
          }
        }}
        placeholder="Search cards..."
        spellCheck="false"
      />
      <Button
        // color="primary"
        disabled={!searchTerm}
        onClick={() => goToSearch(searchTerm)}
      >
        Search
      </Button>
    </InputGroup>
  );
};

export default SearchSets;
