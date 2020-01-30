import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_SPOTS
} from "reducers/application";

export function useApplicationData() {

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
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    })
  }, []);

  //Below function is to calculate the remaining spots when an appointment is added or deleted
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
    //The variable "judger" is to store the status of current interview object based on the appointmentID passed in before state changed, if it is null, means the appointment is newly created and we have to minors 1 of the daily spots, if it is NOT null, means this is an editing operation and no need to change the daily spots amount.
    const judger = state.appointments[id].interview;
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

    return axios.put(`/api/appointments/${id}`, {
      interview,
      student: id
     })
     .then(() => {
       //if "judger" is null, we need to call "updateDaysSpots" function to update the daily spots amount
       if (!judger) {
        const days = updateDaysSpots(state.days, id, -1);
        dispatch({ type: SET_SPOTS, days: days })
       }
     });
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