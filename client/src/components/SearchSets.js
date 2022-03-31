import React, { useState } from "react";
import { Input } from "reactstrap";
import { useNavigate } from "react-router-dom";

const SearchSets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const goToSearch = (val) => {
    navigate(`/search/name=${val}`);
  };

  return (
    <div>
      <Input
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            goToSearch(searchTerm);
          }
        }}
        className="mb-3"
        placeholder="Search cards..."
        spellCheck="false"
      />
    </div>
  );
};

export default SearchSets;
