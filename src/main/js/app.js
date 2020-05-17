import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { follow } from "./follow";
import client from "./client";
import EmployeeList from "./EmployeeList";
import CreateDialog from "./CreateDialog";

const root = "/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [links, setLinks] = useState([]);
  const [pageSize, setPagesize] = useState('2');
  const schemaRef = useRef("");

  useEffect(() => {
    loadFromServer(pageSize);
  }, []);

  const loadFromServer = (pageSize) => {
    follow(client, root, [{ rel: "employees", params: { size: pageSize } }])
      .then((employeeCollection) =>
        client({
          method: "GET",
          path: employeeCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          schemaRef.current = schema.entity;
          return employeeCollection;
        })
      )
      .done((employeeCollection) => {
        setEmployees(employeeCollection.entity._embedded.employees);
        setAttributes(Object.keys(schemaRef.current.properties));
        setPagesize(pageSize);
        setLinks(employeeCollection.entity._links);
      });
  };

  const onCreate = (newEmployee) => {
    follow(client, root, ["employees"])
      .then((employeeCollection) => {
        return client({
          method: "POST",
          path: employeeCollection.entity._links.self.href,
          entity: newEmployee,
          headers: { "Content-Type": "application/json" },
        });
      })
      .then((response) => {
        return follow(client, root, [
          { rel: "employees", params: { size: pageSize } },
        ]);
      })
      .done((response) => {
        if (typeof response.entity._links.last !== "undefined") {
          onNavigate(response.entity._links.last.href);
        } else {
          onNavigate(response.entity._links.self.href);
        }
      });
  };

  const onNavigate = (navUri) => {
    client({
      method: "GET",
      path: navUri,
    }).done((employeeCollection) => {
      setEmployees(employeeCollection.entity._embedded.employees);
      setAttributes(Object.keys(schemaRef.current.properties));
      setPagesize(pageSize);
      setLinks(employeeCollection.entity._links);
    });
  };

  const onDelete = (employee) => {
    client({
      method: "DELETE",
      path: employee.entity._links.self.href,
    }).done((res) => loadFromServer(pageSize));
  };

  const onUpdatePageSize = (size) => {
    if (pageSize !== size) {
      loadFromServer(size);
    }
  };
  return (
    <div>
      <CreateDialog attributes={attributes} onCreate={onCreate} />
      <EmployeeList
        employees={employees}
        links={links}
        pageSize={pageSize}
        onNavigate={onNavigate}
        onUpdatePageSize={onUpdatePageSize}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
