import { useEffect, useReducer } from "react";
import axios from "axios";
// import useVisualMode from "hooks/useVisualMode";

export function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS";

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
      case SET_SPOTS:
        return {
          ...state,
          days: action.days
        }
      
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  // const { mode, transition, back } = useVisualMode ("SHOW");

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
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
    ])
    .then((all) => {
      // console.log(all);
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    })
  }, []);

  function updateDaysSpots(days, appointmentID, incrementer) {
    return days.map((day) => {
      if (!day.appointments.includes(appointmentID)) {
        return day;
      } 
      return {
        ...day,
        spots: day.spots + incrementer
      }
    })
  }

  function bookInterview(id, interview) {
    // console.log(id, interview);
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
    return axios.put(`/api/appointments/${id}`, {
      interview,
      student: id
     })
     .then(() => {
       const days = updateDaysSpots(state.days, id, -1);
       dispatch({ type: SET_SPOTS, days: days })
     });
    // setState(previousState => ({ ...previousState, appointments: result.data }));
    
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

    dispatch({
      type: SET_INTERVIEW,
      ...state,
      appointments,
    });

    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(() => {
      const days = updateDaysSpots(state.days, id, 1);
      dispatch({ type: SET_SPOTS, days: days })
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}