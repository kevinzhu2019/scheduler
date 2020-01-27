import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form
        interviewers={interviewers}
      />);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form
        interviewers={interviewers}
        name="Kai" 
      />
    )
    expect(getByTestId("student-name-input")).toHaveValue("Kai");
  });

  it("validates that the student name is not blank", () => {
    /* 1. Create the mock onSave function */

    /* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the name prop should be blank or undefined */

    /* 3. Click the save button */
    const fn = jest.fn();
    const { getByText } = render(
      <Form
        interviewers={interviewers}
        onSave={fn}
      />
    )
    fireEvent.click(getByText("Save"));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();  
    expect(fn).not.toHaveBeenCalled();
  });

  it("calls onSave function when the name is defined", () => {
    
    /* 1. Create the mock onSave function */

    /* 2. Render the Form with interviewers, name and the onSave mock function passed as an onSave prop */

    /* 3. Click the save button */
    const fn = jest.fn();
    const { getByText, queryByText } = render(
      <Form
        interviewers={interviewers}
        onSave={fn}
        name="Lydia Miller-Jones"
      />
    );
    fireEvent.click(getByText("Save"));
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("Lydia Miller-Jones", null);
  });
});