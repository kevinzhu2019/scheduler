import React from "react";
import './InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem.js';

import PropTypes from 'prop-types';

export default function InterviewerList(props) {

  //below "propTypes" is for testing only, make sure the type is correct otherwise warning pops up in console.
  InterviewerList.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

  const temp = props.interviewers.map((item) => {
    return (
      <InterviewerListItem
        key={item.id}
        name={item.name}
        avatar={item.avatar}
        selected={item.id === props.value}
        setInterviewer={event => props.onChange(item.id)}
      />
    );
  });
  
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{temp}</ul>
    </section>
  );
}