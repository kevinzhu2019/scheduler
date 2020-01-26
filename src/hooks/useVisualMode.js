import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace) {
    if (replace) {
      setHistory((previousState) => [...previousState.slice(0, previousState.length - 1), newMode])
    }
    setHistory((previousState) => [...previousState, newMode]);
    setMode(newMode);
    // setHistory(previousStatus => replace ? [...previousStatus.slice(0, previousStatus.length - 1), newMode] : [...previousStatus, newMode]);
    // setMode(newMode);
  }

  function back() {
    if (history.length < 2) {
      return;
    }
    setHistory(prev => [...prev.slice(0, history.length - 1)]);
    setMode(history[history.length - 2]);
  }

  return { mode: mode, transition, back };
}