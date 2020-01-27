import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    // if (replace) {
    //   setHistory((previousState) => [...previousState.slice(0, previousState.length - 1), newMode])
    // }
    // setHistory((previousState) => [...previousState, newMode]);
    // setMode(newMode);
    setHistory(previousState => replace ? [...previousState.slice(0, previousState.length - 1), newMode] : [...previousState, newMode]);
    setMode(newMode);
  }

  function back(first) {
    if (first) {
      setHistory(prev => {
        setMode(prev[0]);
        return [prev[0]]
      })
    }


    if (history.length < 2) {
      return;
    }
    setHistory(prev => [...prev.slice(0, history.length - 1)]);
    setMode(history[history.length - 2]);
  }

  return { mode: mode, transition, back };
}