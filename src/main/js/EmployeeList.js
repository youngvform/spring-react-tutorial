import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Employee from "./Employee";

function EmployeeList({
  employees,
  links,
  pageSize,
  onNavigate,
  onUpdatePageSize,
}) {
  const pageSizeRef = useRef(undefined);

  const employeeList = employees.map((employee) => (
    <Employee key={employee._links.self.href} employee={employee} />
  ));

  const onNavFirst = (e) => {
    e.preventDefault();
    onNavigate(links.first.href);
  };
  const onNavPrev = (e) => {
    e.preventDefault();
    onNavigate(links.prev.href);
  };
  const onNavNext = (e) => {
    e.preventDefault();
    onNavigate(links.next.href);
  };
  const onNavLast = (e) => {
    e.preventDefault();
    onNavigate(links.last.href);
  };

  const onInput = (e) => {
    e.preventDefault();
    const pageSize = ReactDOM.findDOMNode(pageSizeRef.current).value;
    if (/^[0-9]+$/.test(pageSize)) {
      onUpdatePageSize(pageSize);
    } else {
      ReactDOM.findDOMNode(pageSizeRef.current).value = pageSize.substring(
        0,
        pageSize.length - 1
      );
    }
  };

  const navLinks = [];
  if ("first" in links) {
    navLinks.push(
      <button key="first" onClick={onNavFirst}>
        &lt;&lt;
      </button>
    );
  }
  if ("prev" in links) {
    navLinks.push(
      <button key="prev" onClick={onNavPrev}>
        &lt;
      </button>
    );
  }
  if ("next" in links) {
    navLinks.push(
      <button key="next" onClick={onNavNext}>
        &gt;
      </button>
    );
  }
  if ("last" in links) {
    navLinks.push(
      <button key="last" onClick={onNavLast}>
        &gt;&gt;
      </button>
    );
  }

  return (
    <div>
      <input ref={pageSizeRef} defaultValue={pageSize} onInput={onInput} />
      <table>
        <tbody>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Description</th>
            <th></th>
          </tr>
          {employeeList}
        </tbody>
      </table>
      <div>{navLinks}</div>
    </div>
  );
}

export default EmployeeList;
