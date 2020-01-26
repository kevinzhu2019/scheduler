import React, { useState, useEffect } from "react";

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



  // const { mode, transition, back } = useVisualMode ("SHOW");

  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });

  // const setDay = (day) => setState(prev => ({ ...prev, day }));
  // // const setDays = days => setState(prev => ({ ...prev, days }))

  // useEffect(() => {

  //   Promise.all([
  //     axios.get(`http://localhost:8001/api/days`),
  //     axios.get(`http://localhost:8001/api/appointments`),
  //     axios.get(`http://localhost:8001/api/interviewers`),
  //   ])
  //   .then((all) => {
  //     // console.log(all);
  //     setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
  //   })
  // }, [])

  // function bookInterview(id, interview) {
  //   console.log(id, interview);
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: { ...interview }
  //   };
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };
  //   setState({
  //     ...state,
  //     appointments
  //   });

  //   axios.put(`http://localhost:8001/api/appointments/${id}`, {
  //     interview,
  //     student: id
  //    }
  //   )
  //   ;
  //   // setState(previousState => ({ ...previousState, appointments: result.data }));
  //   transition("SHOW");
  // }

  // function cancelInterview(id) {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: null
  //   };
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };

  //   axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment);

  // }

  const apiArray = getAppointmentsForDay(state, state.day);
  // console.log(apiArray);
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
  })
  // console.log(apiAppointments);

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
