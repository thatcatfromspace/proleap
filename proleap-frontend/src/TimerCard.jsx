import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookie = new Cookies();
/**
 * Given a timeout duration, start counting down seconds until the function times out,
 * and set a cookie with the respective poll ID to avoid revotes by reloading webpage.
 * @param {string} pollId - unique ID for the poll
 * @param {number} timeoutDuration - time until poll times out
 */
export function TimerCard({ pollId, timeoutDuration }) {
  const [timer, setTimer] = useState(timeoutDuration);
  const [pollHasTimedOut, setHasTimedOut] = useState(cookie.get(pollId));

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      cookie.set(pollId, true, { sameSite: true, path: "/" });
      setHasTimedOut(true);
    }
  }, [timer]);

  return (
    <div className="bg-inherit rounded-md min-h-[23rem] flex justify-center items-center text-xl">
      {!pollHasTimedOut ? (
        <label>Polling ends in: {timer}</label>
      ) : (
        <label> Polling has timed out! </label>
      )}
    </div>
  );
}
