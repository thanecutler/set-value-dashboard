import React from "react";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";

const PaginationContainer = ({
  pageCount,
  setCurrentPage,
  currentPage,
  allSets,
}) => {
  const handleClick = (page) => {
    setCurrentPage(page);
  };
  return (
    <Pagination>
      <PaginationItem disabled={currentPage <= 0}>
        <PaginationLink first onClick={() => handleClick(0)} />
      </PaginationItem>
      <PaginationItem disabled={currentPage <= 0}>
        <PaginationLink previous onClick={() => handleClick(currentPage - 1)} />
      </PaginationItem>
      {[...Array(pageCount)].map((page, i) => (
        <PaginationItem active={i === currentPage} key={i}>
          <PaginationLink onClick={() => handleClick(i)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={currentPage + 1 >= pageCount}>
        <PaginationLink next onClick={() => handleClick(currentPage + 1)} />
      </PaginationItem>
      <PaginationItem disabled={currentPage + 1 >= pageCount}>
        <PaginationLink last onClick={() => handleClick(pageCount - 1)} />
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationContainer;
