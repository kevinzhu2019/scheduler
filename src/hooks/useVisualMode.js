import { React, useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setHistory(previousStatus => replace ? [...previousStatus.slice(0, previousStatus.length - 1), newMode] : [...previousStatus, newMode]);
    setMode(newMode);
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