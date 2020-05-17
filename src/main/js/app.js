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
  const [pageSize, setPagesize] = useState(2);
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
          console.log({ schema });
          schemaRef.current = schema.entity;
          return employeeCollection;
        })
      )
      .done((employeeCollection) => {
        console.log({ employeeCollection });
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
      console.log({ employeeCollection });
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

/*
class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const newEmployee = {};
		this.props.attributes.forEach(attribute => {
			newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newEmployee);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		const inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="field"/>
			</p>
		);

		return (
			<div>
				<a href="#createEmployee">Create</a>

				<div id="createEmployee" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new employee</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}
* */

ReactDOM.render(<App />, document.getElementById("root"));
