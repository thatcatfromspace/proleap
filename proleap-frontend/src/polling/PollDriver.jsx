import { ActiveCard } from "../ActiveCard.jsx";
import { PollingQuestion } from "../PollingQuestion.jsx";
import { TimerCard } from "../TimerCard.jsx";
import { PollingCharts } from "../PollingCharts.jsx";

const questionsJson = {
  question: "Favorite icecream flavor?",
  options: [
    { option: "vanilla", key: 1 },
    { option: "strawberry", key: 2 },
    { option: "chocolate", key: 3 },
    { option: "pistachio", key: 4 },
  ],
};
// eslint-disable-next-line react/prop-types
export function PollDriver({ whichToShow, pollActive, pollId, pollDuration }) {
  return (
    <div className="flex justify-center w-full">
      {whichToShow === "active-poll" && pollActive ? (
        <ActiveCard />
      ) : whichToShow === "poll-question" ? (
        <PollingQuestion questionOptions={questionsJson} questionType="radio" />
      ) : whichToShow === "poll-timer" ? (
        <TimerCard pollId={pollId} timeoutDuration={pollDuration} />
      ) : (
        <PollingCharts questionOptions={questionsJson} />
      )}
      {/* might be the worst piece of code I've written */}
    </div>
  );
}
