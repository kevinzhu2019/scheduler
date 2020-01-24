import React, { useState, useEffect } from "react";

import "components/Application.scss";

import DayList from './DayList.js';

import Appointment from "components/Appointment/index.js";

import axios from "axios";

import { getAppointmentsForDay, getInterview } from "helpers/selectors.js";

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState(prev => ({ ...prev, day }));
  // const setDays = days => setState(prev => ({ ...prev, days }))

  useEffect(() => {

    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ])
    .then((all) => {
      // console.log(all);
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2] }));
    })
  }, [])

  const apiArray = getAppointmentsForDay(state, state.day);
  const apiAppointments = apiArray.map((item) => {
    const interview = getInterview(state, item.interview);
    return (
      <Appointment 
        key={item.id}
        id={item.id}
        time={item.time}
        interview={interview}
      />
    );
  })

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
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */apiAppointments}
      </section>
    </main>
  );
}
