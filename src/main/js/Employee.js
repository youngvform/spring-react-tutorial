import React from "react";

function Employee({ employee, onDelete }) {
  const handleDelete = (employee) => {
    onDelete(employee);
  };
  return (
    <tr>
      <td>{employee.firstName}</td>
      <td>{employee.lastName}</td>
      <td>{employee.description}</td>
      <td>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
}

export default Employee;
