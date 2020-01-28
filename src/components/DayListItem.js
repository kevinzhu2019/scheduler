import React from "react";
import './DayListItem.scss';
// const classNames = require('classnames');

export default function DayListItem(props) {

  const formatSpots = function() {
    if (props.spots === 1) {
      return `${props.spots} spot remaining`
    } else if (props.spots > 1) {
      return `${props.spots} spots remaining`
    } else {
      return `no spots remaining`
    }
  } 

  const dayClass = "day-list__item" + (
    props.selected ? "--selected" :
    props.spots <= 0 ? "--full" :
    ''
  );

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)} getAllByTestId="day">
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}