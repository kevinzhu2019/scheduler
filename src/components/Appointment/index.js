import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
// import validate from "./Form";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const { mode, transition, back } = useVisualMode (
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    // validate(name, interviewer);

    transition(SAVING);

    props
    .bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  }

  function deleteOrNot() {
    transition(CONFIRM);
  }

  function doConfirmDeletion() {
    transition(DELETING, true);
    transition(SAVING);
    //before using .then, we MUST return the Promise from Axios first, *****
    props
    .cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true))
    // .then(() => transition(SHOW));
  }

  function onEdit() {
    transition(EDIT);
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() =>  { transition(CREATE) }} />}
        {mode === SHOW && (
          <Show
            id={props.id}
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={deleteOrNot}
            onEdit={onEdit}
          />
        )}
        {mode === SAVING && (<Status message={"SAVING"} />)}
        {mode === CONFIRM && (
          <Confirm
            message={"Are you sure you want to delete?"}
            onConfirm={doConfirmDeletion}
            onCancel={() => back()}
          />
        )}
        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onCancel={() => {back(EMPTY)}}
            onSave={save}
          />)}
        {mode === EDIT && (
          <Form
            name={props.interview && props.interview.student}
            interviewer={props.interview && props.interview.interviewer.id}
            interviewers={props.interviewers}
            onCancel={() => back()}
            onSave={save}
          />)}
        {mode === ERROR_SAVE && (
          <Error
            message={"Could not save message, Please try again."}
            onClose={() => back()} 
          />
        )}
        {mode === ERROR_DELETE && (
          <Error
            message={"Could not delete the message, please try again."}
            onClose={() => back(true)} 
          />
        )}
    </article>
  );
}