import { useState, useEffect } from "react";
import axios from "axios";
import useVisualMode from "hooks/useVisualMode";

export function useApplicationData() {

  const { mode, transition, back } = useVisualMode ("SHOW");

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => setState(prev => ({ ...prev, day }));
  // const setDays = days => setState(prev => ({ ...prev, days }))

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ])
    .then((all) => {
      // console.log(all);
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);

  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });

    axios.put(`http://localhost:8001/api/appointments/${id}`, {
      interview,
      student: id
     }
    )
    ;
    // setState(previousState => ({ ...previousState, appointments: result.data }));
    transition("SHOW");
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment);

  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}