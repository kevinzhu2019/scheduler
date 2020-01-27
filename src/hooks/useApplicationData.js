import { useEffect, useReducer } from "react";
import axios from "axios";
import useVisualMode from "hooks/useVisualMode";

export function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW: 
        return {
          ...state,
          appointments: action.appointments,
          days: action.days
        }
      
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const { mode, transition, back } = useVisualMode ("SHOW");

  //dispatch is rqual to setState
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ])
    .then((all) => {
      // console.log(all);
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
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
    dispatch({
      type: SET_INTERVIEW,
      ...state,
      appointments
    });
    // transition("SHOW");
    return axios.put(`http://localhost:8001/api/appointments/${id}`, {
      interview,
      student: id
     }
    );
    // setState(previousState => ({ ...previousState, appointments: result.data }));
    
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment);

  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}