// import Application from "components/helpers/selector";

export function getAppointmentsForDay(state, day) {
  const appointmentDay = state.days.filter(item => item.name === day);
  if (!appointmentDay.length) {
    return [];
  } 
  // console.log(appointmentDay);
  const appointmentDayNotEmpty = appointmentDay[0];
  const appointments = appointmentDayNotEmpty.appointments;
  if (!appointments) {
    return [];
  }
  const temp = appointments.map((item) => {
    return state.appointments[String(item)];
  })
  // console.log(temp);
  return temp;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  let resultInterviewer = state.interviewers[String(interview.interviewer)]
  let result = {};
  result = {
    "student": interview.student,
    "interviewer": resultInterviewer
  }
  return result;
}


export function getInterviewersForDay(state, day) {
  const appointmentDay = state.days.filter(item => item.name === day);
  if (!appointmentDay.length) {
    return [];
  } 
  // console.log(appointmentDay);
  const interviewersNotEmpty = appointmentDay[0];
  const interviewers = interviewersNotEmpty.interviewers;
  if (!interviewers) {
    return [];
  }
  const resultInterviewers = interviewers.map((item) => {
    // console.log(item);
    return state.interviewers[item];
  })
  // console.log(resultInterviewers);
  return resultInterviewers;     
}