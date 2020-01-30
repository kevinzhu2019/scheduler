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

  xit("calls onSave function when the name is defined", () => {
    
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

  xit("submits the name entered by the user", () => {
    const fn = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <Form interviewers={interviewers} onSave={fn} />
    );

    const input = getByPlaceholderText("Enter Student Name");

    fireEvent.change(input, { target: {value: "Kai"} });
    fireEvent.click(getByText("Save"));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("Kai", null);
  });

  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
  
    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "kai" }
    });
    fireEvent.click(getByText("Save"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("kai", null);
  });

  it("calls onCancel and resets the input field", () => {
    const cancelButton = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name={"K"}
        onSave={jest.fn()}
        onCancel={cancelButton} 
      />
    );
    fireEvent.click(getByText("Save"));

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "K" }
    });
    fireEvent.click(getByText("Cancel"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
    expect(cancelButton).toHaveBeenCalledTimes(1);
  })
});