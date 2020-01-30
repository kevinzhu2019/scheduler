import React from "react";

import "components/Application.scss";

import DayList from './DayList.js';

import Appointment from "components/Appointment/index.js";

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors.js";

import { useApplicationData } from "hooks/useApplicationData";


export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const apiArray = getAppointmentsForDay(state, state.day);
  
  const apiAppointments = apiArray.map((item) => {
    const interview = getInterview(state, item.interview);
    return (
      <Appointment 
        key={item.id}
        id={item.id}
        time={item.time}
        interview={interview}
        interviewers={getInterviewersForDay(state, state.day)}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
            className="sidebar--centered"
            src="images/logo.png"
            alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
            className="sidebar__lhl sidebar--centered"
            src="images/lhl.png"
            alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { apiAppointments }
        <Appointment id="last" time="5pm" />
      </section>
    </main>
  );
}
