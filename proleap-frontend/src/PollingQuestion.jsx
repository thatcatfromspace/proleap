import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

/**
 * Return a card with current poll question.
 * @param {"checkbox" | "radio"} questionType - specifies the type of question: radio for singular choices and otherwise.
 * @param {{questions}} questionOptions - JSON of question with its respective choices
 */

export function PollingQuestion({ questionType, questionOptions }) {
  // eslint-disable-next-line react/prop-types
  const [option, setOption] = useState(questionOptions.options[0].option);

  const handleSubmit = () => {
    alert(option);
		// API calls go here 
  };
  return (
    <div className="bg-slate-200 flex w-1/3 rounded-md items-center p-5">
      <form onSubmit={() => handleSubmit()}>
        <label htmlFor="question" className="text-3xl">
          {questionOptions.question}
        </label>
        <RadioGroup
          defaultValue={questionOptions.options[0].option}
          className="mt-10"
        >
          {questionOptions.options.map((value, index) => (
            <div
              className="flex items-center space-x-2"
              onChange={() => {
                setOption(value.option);
              }}
              key={`div_${value.key}`}
            >
              <RadioGroupItem value={value.option} key={value.key} />
              <label htmlFor={value.option}>{value.option}</label>
            </div>
          ))}
        </RadioGroup>
        <button
          type="submit"
          className="bg-logingreen hover:opacity-60 mt-10 px-3 py-2 rounded-lg"
        >
          Hi there
        </button>
      </form>
    </div>
  );
}

/**
 * JSON requirements:
 * {
 * 		question: string,
 * 		question_type: string,
 * 		questions: [
 * 				option1: string
 * 	]
 * }
 */
