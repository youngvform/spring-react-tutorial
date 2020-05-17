import React, { useRef } from "react";

function CreateDialog({ attributes, onCreate }) {
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const descriptionRef = useRef("");

  const onSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {};
    attributes.forEach((attribute) => {
      let targetRef;
      if (attribute === "firstName") {
        targetRef = firstNameRef;
      } else if (attribute === 'lastName') {
        targetRef = lastNameRef;
      } else {
        targetRef = descriptionRef;
      }

      newEmployee[attribute] = targetRef.current.value.trim();
    });
    onCreate(newEmployee);

    firstNameRef.current = '';
    lastNameRef.current = '';
    descriptionRef.current = '';

    window.location = "#";
  };

  const inputs = attributes.map((attribute) => (
    <p key={attribute}>
      <input
        type="text"
        placeholder={attribute}
        ref={
          attribute === "firstName"
            ? firstNameRef
            : attribute === "lastName"
            ? lastNameRef
            : descriptionRef
        }
        className="field"
      />
    </p>
  ));

  return (
    <div>
      <a href="#createEmployee">Create</a>
      <div id="createEmployee" className="modalDialog">
        <div>
          <a href="#" title="Close" className="close">
            X
          </a>
          <h2>Create New Employee</h2>
          <form>
            {inputs}
            <button onClick={onSubmit}>Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateDialog;
