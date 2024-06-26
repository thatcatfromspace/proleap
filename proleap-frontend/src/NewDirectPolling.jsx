import { Navbar } from "./polling/Navbar.jsx";
import { PollDriver } from "./polling/PollDriver.jsx";

export function NewDirectPolling({ whichToShow }) {
  //using default export breaks the app for some reason

  return (
    <div className="[height:100%] [min-height:100vh] [background-image:url(./assets/background.png)] flex justify-center items-center py-10">
      <div className="bg-primary justify-end w-3/4 flex rounded-xl">
        <Navbar messages="true" />
        <div id="inner" className="flex w-3/4 bg-gray-300 rounded-xl">
          <PollDriver
            whichToShow="poll-timer"
            pollDuration="10"
            pollId="prem"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Documentation for the backend engineers:
 * <ActiveCard> shows if a polling session in live, need an endpoint with the following params:
 * poll_is_active: boolean
 * pollId: string (unique)
 * timeout_duration: number
 *
 */
