import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { input } from "@material-tailwind/react";
import { elements } from "chart.js";
export const Cards = ({ uid, Activity, setShowActivity, setShowCard }) => {
  const navigate = useNavigate();
  const activity = Activity;
  const [currentCardId, setCurrentCardId] = useState();
  const [currentCard, setCurrentCard] = useState()
  const total_cards = activity.total_cards;
  const userId = uid;
  const [cards, setCards] = useState([]);
  const [tempFlag, setTempFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState([
    {
      id: null,
      message: null,
      is_true: false,
    },
  ]);
  const [answers, setAnswers] = useState([]);
  // const [questionsId, setQuestionId] = useState([]);
  const [requiredFlag, setRequiredFlag] = useState([]);
  useEffect(() => {
    if (activity != null && userId != null) {
      axios
        .get(
          `http://${import.meta.env.VITE_API_URL
          }/apis/user/${uid}/activity/${activity.id}/`,
        ).then((res) => {
          setCards(res.data.cards);
          setCurrentCardId(res.data.recent_card_id);
          console.log(res.data);
        })
    }
  }, []);

  useEffect(() => {
    if (currentCardId != null) {
      const tempArray = [];
      setCurrentCard(cards.find((element) => element.id == currentCardId));
      const current_card = cards.find((element) => element.id == currentCardId);
      for (let i = 0; i < current_card.questions.length; i++) {
        let errorObj = {
          id: current_card.questions[i].id,
          message: "",
          is_true: false,
        };
        if (
          current_card.questions[i].is_required === true &&
          current_card.questions[i].answers.length === 0
        ) {
          let obj = {
            id: current_card.questions[i].id,
          };
          setRequiredFlag((prev) => [...prev, obj]);
        }
        setErrorMessage((prev) => [...prev, errorObj]);
      }
    }
  }, [currentCardId]);


  const previousCard = (e) => {
    e.preventDefault();
    if (currentCard.sequence_no != 1) {
      let card = cards.find((ele) => ele.sequence_no == currentCard.sequence_no - 1).id;
      setCurrentCardId(card);
    }
    // const isFirstSlide = currentIndex === 0;
    // const required = requiredFlag.length === 0;
    // const newIndex = isFirstSlide ? currentIndex : currentIndex - 1;
    // setCurrentIndex(newIndex);
  };
  const nextCard = (e) => {
    e.preventDefault();
    const isLastSlide = currentCard.sequence_no === total_cards;
    const required = requiredFlag.length === 0;
    console.log(required)
    if (!required) {
      let temp = errorMessage;
      for (let i = 0; i < requiredFlag.length; i++) {
        for (let j = 0; j < temp.length; j++) {
          if (requiredFlag[i].id === temp[j].id) {
            temp[j].message = "Fill out this field";
            setTempFlag(true);
          }
        }
      }
      console.log(temp);
      setErrorMessage(temp);
    }
    else {
      for (let i = 0; i < currentCard.questions.length; i++) {
        let answer = answers.find((element) => element.qid === currentCard.questions[i].id);
        if(answer==undefined){
          ;
        }
        else{
        if (currentCard.questions[i].answers.length === 0) {
          if (currentCard.questions[i].type === "RADIO" 
          ) {
            let obj = {
              question: currentCard.questions[i].id,
              answer: "",
              user: userId,
              options:answer.oid ? [answer.oid] : [],
              option:null
            };
            //       console.log("RADIO BUTTON");
            //       console.log(obj);
            //       // TODO: remove activity and card
            axios
              .post(`http://${import.meta.env.VITE_API_URL}/apis/answers/`, obj)
              .then((res) => {
                console.log(res.data);
              });
          }
          else if (
            currentCard.questions[i].type === "PARAGRAPH" ||
            currentCard.questions[i].type === "SHORT_ANSWER" ||
            currentCard.questions[i].type === "DATE"||
            currentCard.questions[i].type === "EMAIL"||
            currentCard.questions[i].type === "NUMBER"


          ) {
            let obj = {
              question: currentCard.questions[i].id,
              answer: answer.answer ? answer.answer : "",
              user: userId,
              option:null,
              options:[]
            };
            axios
              .post(`http://${import.meta.env.VITE_API_URL}/apis/answers/`, obj)
              .then((res) => {
                console.log(res.data);
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
          else if(currentCard.questions[i].type === "CHECKBOXES"){
            let obj = {
              question: currentCard.questions[i].id,
              answer: "",
              user: userId,
              options:answer.oid ? answer.oid : null,
              option:null
            };
            //       console.log("RADIO BUTTON");
            //       console.log(obj);
            //       // TODO: remove activity and card
            axios
              .post(`http://${import.meta.env.VITE_API_URL}/apis/answers/`, obj)
              .then((res) => {
                console.log(res.data);
              });
          } 
          else {
            let obj = {
              question: currentCard.questions[i].id,
              user: userId,
            };
            console.log(obj);
            axios
              .post(`http://${import.meta.env.VITE_API_URL}/apis/answers/`, obj)
              .then((res) => {
                // console.log(res.data);
              });
          }
        }
      }

      }
      if (isLastSlide === true) {
        setShowActivity(true);
        setShowCard(false);
      }
      else{
        setAnswers([]);
        const newId = isLastSlide ? currentCardId : cards.find((ele) => ele.sequence_no == currentCard.sequence_no + 1).id
        setCurrentCardId(newId);
      }
      // setCurrentCard(cards.find((element) => element.id == newId))
      // console.log(cards.find((ele) => ele.sequence_no == currentCard.sequence_no + 1).id);
    };
  }
  // const getCardDetails = (aid, cid) => {
  //   setCard(null);
  //   setRequiredFlag([]);
  //   setErrorMessage([]);
  //   axios
  //     .get(
  //       `http://${import.meta.env.VITE_API_URL
  //       }/apis/user/${uid}/activity/${activity.id}/`,
  //     )
  //     .then((res) => {
  //       const response = res.data;
  //       console.log(response);
  //       setCard(response);
  //       setQuestionId(response.question);
  //       const respons = res.data.questions;
  //       const tempArray = [];
  //       for (let i = 0; i < respons.length; i++) {
  //         let errorObj = {
  //           id: respons[i].question.id,
  //           message: "",
  //           is_true: false,
  //         };
  //         if (
  //           respons[i].question.is_required === true &&
  //           respons[i].answer.length === 0
  //         ) {
  //           let obj = {
  //             id: respons[i].question.id,
  //           };
  //           setRequiredFlag((prev) => [...prev, obj]);
  //         }
  //         setErrorMessage((prev) => [...prev, errorObj]);
  //       }
  //     });
  // };

  // const nextCard = (e) => {
  //   console.log("HE::P");
  //   console.log(card);
  //   e.preventDefault();
  //   let len = activity.card_ids.length;
  //   const isLastSlide = currentIndex === len - 1;
  //   const required = requiredFlag.length === 0;
  //   if (!required) {
  //     let temp = errorMessage;
  //     for (let i = 0; i < requiredFlag.length; i++) {
  //       for (let j = 0; j < temp.length; j++) {
  //         if (requiredFlag[i].id === temp[j].id) {
  //           temp[j].message = "Fill out this field";
  //           setTempFlag(true);
  //         }
  //       }
  //     }
  //     console.log(temp);
  //     setErrorMessage(temp);
  //   } else {
  //     for (let i = 0; i < questionsId.length; i++) {
  //       console.log(card.questions[i]);
  //       if (
  //         "answer" in card.questions[i].question ||
  //         "answer" in card.questions[i]
  //       ) {
  //         if (card.questions[i].question.type === "RADIO") {
  //           let obj = {
  //             question: card.questions[i].question.id,
  //             answer: "",
  //             user: userId,
  //             option: card.questions[i].answer[0].id,
  //             activity: activity.id,
  //             card: card.id,
  //           };
  //           console.log("RADIO BUTTON");
  //           console.log(obj);
  //           // TODO: remove activity and card
  //           axios
  //             .post(`http://${import.meta.env.VITE_API_URL}/api/answer/`, obj)
  //             .then((res) => {
  //               console.log(res.data);
  //             });
  //         } else if (
  //           card.questions[i].question.type === "TEXT" ||
  //           card.questions[i].question.type === "SHORT_ANSWER" ||
  //           card.questions[i].question.type === "DATE"
  //         ) {
  //           let obj = {
  //             question: card.questions[i].question.id,
  //             answer: card.questions[i].question.answer,
  //             user: userId,
  //             option: "",
  //             activity: activity.id,
  //             card: card.id,
  //           };
  //           console.log("TEXTANSWER");
  //           console.log(obj);
  //           axios
  //             .post(`http://${import.meta.env.VITE_API_URL}/api/answer/`, obj)
  //             .then((res) => {
  //               console.log(res.data);
  //             })
  //             .catch((err) => {
  //               console.log(err.message);
  //             });
  //         } else {
  //           let obj = {
  //             question: card.questions[i].question.id,
  //             answer: null,
  //             user: userId,
  //             option: null,
  //             activity: activity.id,
  //             card: card.id,
  //           };
  //           console.log(obj);
  //           axios
  //             .post(`http://${import.meta.env.VITE_API_URL}/api/answer/`, obj)
  //             .then((res) => {
  //               // console.log(res.data);
  //             });
  //         }
  //       }
  //     }
  //     // console.log("HELLO" + required);
  //   }
  //   if (isLastSlide === true) {
  //     setShowActivity(true);
  //     setShowCard(false);
  //   }
  //   const newIndex = isLastSlide
  //     ? currentIndex
  //     : required
  //       ? currentIndex + 1
  //       : currentIndex;
  //   setCurrentIndex(newIndex);
  // };

  // useEffect(() => {
  //   if (activity != null) {
  //     if (currentIndex < activity.total_cards) {
  //       getCardDetails(activity.id, activity.card_ids[currentIndex]);
  //     }
  //   }
  // }, [currentIndex]);
  return (
    <main className="w-[100%] flex gap-[5%]">
      <div className="cards w-1/2 flex py-3">
        <ul className="flex flex-col overflow-auto scrollbar-hidea border-2  h-[80vh] min-w-full gap-4">
          <div className="relative h-fit flex flex-col">
            <div className="relative left-[70%] w-[30%] h-[4vh] bg-[#408F64] rounded-bl-lg flex justify-start">
              <span className=" text-xl px-3">
                Section {currentCard.sequence_no} of {total_cards}
              </span>
            </div>
            <span className="uppercase truncate px-4">
              {activity != null ? activity.name : null}
            </span>
            <div className="text-lg text-gray-600 px-4 ">
              <span className="">
                {activity.desc}
              </span>
            </div>
          </div>
          {
            currentCard != null &&
            cards.find((element) => element.id == currentCardId).questions.map((val, index) => (
              <li
                className="none  px-4 h-full w-[100%] text-lg border-t-2 border-primary"
                key={val.id}
              >
                {val.type == "PARAGRAPH" ||
                val.type == "NUMBER" ||
                  val.type == "SHORT_ANSWER" ? (
                  <div className="w-full flex flex-col flex-grow flex-shrink-0 basis-full mb-2 p-2   [transiton:border-bottom-radius_0.3s_ease-in-out] ">
                    <label className="mb-2" htmlFor={val.desc}>
                      {" "}
                      {val.text}{" "}
                      <span className="text-red-600">
                        {val.is_required ? " *" : " "}
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`box-border  break-words outline-none ${val.type === "SHORT_ANSWER" ? "w-full" : "w-1/2"
                        } py-2 text-sm bg-transparent rounded-sm border-b-2 border-dotted border-b-gray-600 focus:border-b-[2.5px] focus:border-b-blue-500 ease-in overflow-scroll`}
                      // onBlur={() => monitorEmptyText(required)}
                      defaultValue={
                        val.answers.length != 0 ? val.answers[0].answer : ""
                      }
                      disabled={val.answers.length != 0 ? true : false}
                      onChange={(e) => {
                        let c = currentCard;
                        let qid = c.questions[index].id;
                        let answer = {
                          qid: qid,
                          answer: e.target.value
                        };
                        console.log(answer);
                        setAnswers(prev => {
                          const index = prev.findIndex((element) => element.qid == qid);
                          if (index !== -1) {
                            let updatedList = [...prev];
                            updatedList[index] = answer;
                            return updatedList;
                          }
                          return [...prev, answer];
                        })
                        const new_state = requiredFlag.filter(
                          (obj) => obj.id != val.id,
                        );
                        setRequiredFlag(new_state);
                      }}
                    ></input>
                    {tempFlag && errorMessage[index].message ? (
                      <span className="text-secondary">
                        {errorMessage[index].message}
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                ) : val.type === "RADIO" ?
                  <div
                    className="w-full flex flex-col flex-grow flex-shrink-0 basis-full mb-2 p-2  rounded-lg  [transiton:border-bottom-radius_0.3s_ease-in-out] "
                    id={`radio${index}`}>
                    <label htmlFor={val.desc}>
                      {" "}
                      {val.text}{" "}
                      <span className="text-red-600">
                        {val.is_required ? " *" : " "}
                      </span>
                    </label>
                    {val.answers.length == 0 ? (
                      // activity.status==="NOT_ATTEMPTED"?
                      val.options.map((value, ind) => (
                        <div className="" key={ind}>
                          <input
                            className="before:content[''] peer relative w-3 h-3 mr-2 cursor-pointer appearance-none rounded-full border border-blue-200 border-5 hover:bg-gray1/70 focus:bg-tertiary checked:bg-tertiary checked:border-0 active:bg-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4  before:transition-opacity  hover:before:opacity-5"
                            type="radio"
                            name={val.desc}
                            // value={value}
                            // onChange={(e) =>
                            //   handleRenderRadioButtonCLick(val, value)
                            // }
                            // checked
                            checked={
                              cards.find((element) => element.id == currentCardId).questions[index].answers.length != 0
                                ? value.id ===
                                  cards.find((element) => element.id == currentCardId).questions[index].answers[0].id
                                  ? true
                                  : false
                                : false
                            }
                            // disabled={val.answer.length != 0 ? true : false}
                            onChange={(e) => {
                              e.preventDefault();
                              // val.question.answer = value;
                              let c = currentCard;
                              let qid = c.questions[index].id;
                              let answer = {
                                qid: qid,
                                oid: value.id
                              };
                              setAnswers(prev => {
                                const index = prev.findIndex((element) => element.qid == qid);
                                if (index !== -1) {
                                  let updatedList = [...prev];
                                  updatedList[index] = answer;
                                  return updatedList;
                                }
                                return [...prev, answer];
                              })
                              const new_state = requiredFlag.filter(
                                (obj) => obj.id != val.id,
                              );
                              setRequiredFlag(new_state);
                            }}
                            id={`radio-${ind}`}
                          ></input>
                          <label htmlFor={`radio-${ind}`}>
                            {" "}
                            {value.value}{" "}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="">
                        <input
                          className="before:content[''] peer relative w-3 h-3 mr-2 cursor-pointer appearance-none rounded-full border border-blue-200 border-5 hover:bg-gray1/70 focus:bg-tertiary checked:bg-tertiary checked:border-0 active:bg-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4  before:transition-opacity  hover:before:opacity-5"
                          type="radio"
                          name={val.desc}
                          checked
                          disabled
                          id={`radio-${index}`}
                        ></input>
                        {val.options.map((value, index) => (
                          <label htmlFor={`radio-${index}`} key={index}>
                            {value.id === val.answers[0].option
                              ? value.value
                              : null}
                          </label>
                        ))}
                      </div>
                    )}
                    {tempFlag && errorMessage[index].message ? (
                      <span className="text-secondary">
                        {errorMessage[index].message}
                      </span>
                    ) : (
                      <span> </span>
                    )}

                  </div> :
                  val.type === "EMAIL" ?
                    <div className="w-full flex flex-col flex-grow flex-shrink-0 basis-full mb-2 p-2   [transiton:border-bottom-radius_0.3s_ease-in-out] ">
                      <label className="mb-2" htmlFor={val.desc}>
                        {" "}
                        {val.text}{" "}
                        <span className="text-red-600">
                          {val.is_required ? " *" : " "}
                        </span>
                      </label>
                      <input
                        type="email"
                        className={`box-border break-words outline-none ${"w-1/2"} py-2 text-sm bg-transparent rounded-sm border-b-2 border-b-tertiary/70 focus:border-b-[2.5px] focus:border-b-blue-500 ease-in overflow-scroll`}
                        onChange={(e) => {
                          let c = currentCard;
                          let qid = c.questions[index].id;
                          let answer = {
                            qid: qid,
                            answer: e.target.value
                          };
                          setAnswers(prev => {
                            const index = prev.findIndex((element) => element.qid == qid);
                            if (index !== -1) {
                              let updatedList = [...prev];
                              updatedList[index] = answer;
                              return updatedList;
                            }
                            return [...prev, answer];
                          })
                          const new_state = requiredFlag.filter(
                            (obj) => obj.id != val.id,
                          );
                          setRequiredFlag(new_state);
                        }}
                        defaultValue={
                          val.answers.length != 0 ? val.answers[0].answer : ""
                        }
                        disabled={val.answers.length != 0 ? true : false}
                      // required
                      ></input>
                      {tempFlag && errorMessage[index].message ? (
                        <span className="text-secondary">
                          {errorMessage[index].message}
                        </span>
                      ) : (
                        <span></span>
                      )}
                    </div> :
                    val.type === "DATE" ?
                      <div className="w-full flex flex-col flex-grow flex-shrink-0 bg-transparent basis-full mb-2 p-2 rounded-lg [transiton:border-bottom-radius_0.3s_ease-in-out] ">
                        <label className="mb-2" htmlFor={val.desc}>
                          {" "}
                          {val.text}{" "}
                          <span className="text-red-600">
                            {val.is_required ? " *" : " "}
                          </span>
                        </label>
                        <input
                          type="date"
                          className={`box-border break-words outline-none py-2 text-sm bg-transparent rounded-sm  `}
                          onChange={(e) => {
                            let c = currentCard;
                            let qid = c.questions[index].id;
                            let answer = {
                              qid: qid,
                              answer: e.target.value
                            };
                            setAnswers(prev => {
                              const index = prev.findIndex((element) => element.qid == qid);
                              if (index !== -1) {
                                let updatedList = [...prev];
                                updatedList[index] = answer;
                                return updatedList;
                              }
                              return [...prev, answer];
                            })
                            const new_state = requiredFlag.filter(
                              (obj) => obj.id != val.id,
                            );
                            setRequiredFlag(new_state);
                          }}
                          defaultValue={
                            val.answers.length != 0 ? val.answers[0].answer : ""
                          }
                          disabled={val.answers.length != 0 ? true : false}
                        ></input>
                        {tempFlag && errorMessage[index].message ? (
                          <span className="text-secondary">
                            {errorMessage[index].message}
                          </span>
                        ) : (
                          <span></span>
                        )}
                      </div>
                      : val.type === "CHECKBOXES" ?
                      <div
                      className="w-full flex flex-col flex-grow flex-shrink-0 basis-full mb-2 p-2  rounded-lg  [transiton:border-bottom-radius_0.3s_ease-in-out] "
                      id={`radio${index}`}>
                      <label htmlFor={val.desc}>
                        {" "}
                        {val.text}{" "}
                        <span className="text-red-600">
                          {val.is_required ? " *" : " "}
                        </span>
                      </label>
                      {val.answers.length == 0 ? (
                        // activity.status==="NOT_ATTEMPTED"?
                        val.options.map((value, ind) => (
                          <div className="" key={ind}>
                            <input
                              className="before:content[''] peer relative w-3 h-3 mr-2 cursor-pointer appearance-none rounded-full border border-blue-200 border-5 hover:bg-gray1/70 focus:bg-tertiary checked:bg-tertiary checked:border-0 active:bg-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4  before:transition-opacity  hover:before:opacity-5"
                              type="checkbox"
                              name={val.desc}
                              onChange={(e) => {
                                // val.question.answer = value;
                                let c = currentCard;
                                let qid = c.questions[index].id;
                                let answer = {
                                  qid: qid,
                                  oid: [value.id]
                                };
                                setAnswers(prev => {
                                  const index = prev.findIndex((element) => element.qid == qid);
                                  const element = prev.find((element)=>element.qid==qid);
                                  if (index !== -1) {
                                    const id = element.oid.findIndex((element)=>element==value.id);
                                    if(id==-1){
                                      let updatedList = [...prev];
                                      element.oid.push(value.id)
                                      updatedList[index] = element;
                                      return updatedList;
                                    }
                                  }
                                  return [...prev, answer];
                                })
                                const new_state = requiredFlag.filter(
                                  (obj) => obj.id != val.id,
                                );
                                setRequiredFlag(new_state);
                              }}
                              id={`checkBox-${ind}`}
                            ></input>
                            <label htmlFor={`checkBox-${ind}`}>
                              {" "}
                              {value.value}{" "}
                            </label>
                          </div>
                        ))
                      ) : (
                        <div className="">
                          <input
                            className="before:content[''] peer relative w-3 h-3 mr-2 cursor-pointer appearance-none rounded-full border border-blue-200 border-5 hover:bg-gray1/70 focus:bg-tertiary checked:bg-tertiary checked:border-0 active:bg-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4  before:transition-opacity  hover:before:opacity-5"
                            type="radio"
                            name={val.desc}
                            checked
                            disabled
                            id={`radio-${index}`}
                          ></input>
  
                          {val.options.map((value, index) => (
                            <label htmlFor={`radio-${index}`} key={index}>
                              {value.id === val.answers[0].option
                                ? value.value
                                : null}
                            </label>
                          ))}
                        </div>
                      )}
                      {tempFlag && errorMessage[index].message ? (
                        <span className="text-secondary">
                          {errorMessage[index].message}
                        </span>
                      ) : (
                        <span> </span>
                      )}
  
                    </div>
                        : null}{" "}
              </li>
            ))
          }
          < div className="flex text-lg justify-between px-8 mb-4">
            <button
              onClick={(e) => previousCard(e)}
              className={`${currentCardId === 0 ? "bg-gray2" : "bg-logingreen"} p-4 w-fit`}
            >
              <span>Previous</span>
            </button>
            <button
              onClick={(e) => nextCard(e)}
            // className={`${currentIndex === activity && activity.card_ids.length - 1 ? "bg-gray2" : requiredFlag.length === 0 ? "bg-logingreen" : "bg-gray2"} p-4 w-fit`}
            >
              <span>
                {currentCardId === activity.total_cards - 1
                  ? "Finish"
                  : "Next"}
              </span>
            </button>
          </div>
        </ul>
      </div >
      <ul className="w-1/2 gap-y-4">
        <li className="Tip of the dayflex w-[95%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden rounded-xl bg-logingreen px-8 py-4">
          <div className="w-full flex justify-between items-center border-dotted border-b-2">
            <span className="text-[30px] w-[90%] justify-start  flex">
              Tip of the Day
            </span>
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 33C13.2366 33 10.0465 32.0323 7.3331 30.2193C4.61969 28.4062 2.50484 25.8293 1.256 22.8143C0.00714922 19.7993 -0.319606 16.4817 0.31705 13.281C0.953707 10.0803 2.52518 7.14031 4.83275 4.83275C7.14031 2.52518 10.0803 0.953707 13.281 0.31705C16.4817 -0.319606 19.7993 0.00714922 22.8143 1.256C25.8293 2.50484 28.4062 4.61969 30.2193 7.3331C32.0323 10.0465 33 13.2366 33 16.5C32.995 20.8745 31.255 25.0685 28.1617 28.1617C25.0685 31.255 20.8745 32.995 16.5 33ZM16.5 21.45C16.1734 21.4498 15.854 21.5465 15.5824 21.7278C15.3107 21.9092 15.099 22.167 14.9739 22.4687C14.8488 22.7705 14.816 23.1025 14.8797 23.4229C14.9434 23.7432 15.1006 24.0375 15.3316 24.2684C15.5625 24.4994 15.8568 24.6567 16.1772 24.7203C16.4975 24.784 16.8296 24.7512 17.1313 24.6261C17.433 24.5011 17.6908 24.2893 17.8722 24.0176C18.0535 23.746 18.1502 23.4266 18.15 23.1C18.1495 22.6626 17.9755 22.2432 17.6661 21.9339C17.3568 21.6245 16.9375 21.4505 16.5 21.45ZM16.5 8.25001C16.0626 8.25054 15.6432 8.42455 15.3339 8.73387C15.0245 9.04319 14.8505 9.46256 14.85 9.90001V16.5C14.85 16.9376 15.0238 17.3573 15.3333 17.6667C15.6427 17.9762 16.0624 18.15 16.5 18.15C16.9376 18.15 17.3573 17.9762 17.6667 17.6667C17.9762 17.3573 18.15 16.9376 18.15 16.5V9.90001C18.1492 9.46274 17.9751 9.04362 17.6658 8.73451C17.3565 8.42541 16.9373 8.25154 16.5 8.25101V8.25001Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-[18.54px] max-h-[25vh] justify-start flex mb-1 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
            dolore voluptates, a nulla tempora debitis explicabo perferendis?
            Consectetur aut voluptatibus, error omnis placeat atque dolore amet
            architecto dolor voluptates alias.
          </span>
        </li>

        <li className="Status flex w-[95%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden border-b-[12px] rounded-xl  px-8 py-4 border-[#FFC943]">
          <div className="w-full flex justify-between items-center border-dotted border-b-2  border-black ">
            <span className="text-[30px] w-[90%] justify-start flex">
              Status
            </span>
            <svg
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M31 20H4V1C4 0.734784 3.89464 0.480429 3.70711 0.292892C3.51957 0.105356 3.26522 0 3 0H1C0.734784 0 0.48043 0.105356 0.292893 0.292892C0.105357 0.480429 0 0.734784 0 1L0 22C0 22.5304 0.210714 23.0391 0.585786 23.4142C0.960859 23.7893 1.46957 24 2 24H31C31.2652 24 31.5196 23.8946 31.7071 23.7071C31.8946 23.5196 32 23.2652 32 23V21C32 20.7348 31.8946 20.4804 31.7071 20.2929C31.5196 20.1054 31.2652 20 31 20ZM29 2H21.621C21.3242 1.99987 21.0341 2.08777 20.7873 2.25258C20.5405 2.41739 20.3481 2.65171 20.2345 2.92588C20.121 3.20005 20.0912 3.50176 20.1492 3.79282C20.2071 4.08388 20.3501 4.35122 20.56 4.561L22.585 6.586L18 11.172L13.414 6.586C13.0389 6.21106 12.5303 6.00043 12 6.00043C11.4697 6.00043 10.9611 6.21106 10.586 6.586L6.293 10.879C6.10553 11.0665 6.00021 11.3208 6.00021 11.586C6.00021 11.8512 6.10553 12.1055 6.293 12.293L7.707 13.707C7.89453 13.8945 8.14884 13.9998 8.414 13.9998C8.67916 13.9998 8.93347 13.8945 9.121 13.707L12 10.828L16.586 15.414C16.9611 15.7889 17.4697 15.9996 18 15.9996C18.5303 15.9996 19.0389 15.7889 19.414 15.414L25.414 9.414L27.439 11.439C27.6488 11.6489 27.9161 11.7919 28.2072 11.8498C28.4982 11.9078 28.7999 11.878 29.0741 11.7645C29.3483 11.6509 29.5826 11.4585 29.7474 11.2117C29.9122 10.9649 30.0001 10.6748 30 10.378V3C30 2.73478 29.8946 2.48043 29.7071 2.29289C29.5196 2.10536 29.2652 2 29 2Z"
                fill="#FFC943"
              />
            </svg>
          </div>
          <span className="text-[18.54px] max-h-[25vh] justify-start flex ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
            dolore voluptates, a nulla tempora debitis explicabo perferendis?
            Consectetur aut voluptatibus, error omnis placeat atque dolore amet
            architecto dolor voluptates alias.
          </span>
        </li>
        <li className="Deadlines flex w-[95%] my-2 flex-wrap h-[25vh] shadow-2xl overflow-y-hidden border-b-[12px] rounded-xl border-[#FF8900] px-8 py-4">
          <div className="w-full flex justify-between items-center border-dotted border-b-2  border-black">
            <span className="text-[30px] w-[90%] justify-start flex">
              Deadlines
            </span>
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.979 23.872C32.9795 26.9314 32.1028 29.9269 30.4528 32.5032C28.8029 35.0796 26.4489 37.1289 23.6698 38.4083C20.8907 39.6877 17.8031 40.1435 14.7729 39.7216C11.7427 39.2998 8.89699 38.018 6.57301 36.0283C4.24903 34.0385 2.54425 31.4242 1.66072 28.4951C0.777193 25.566 0.751963 22.4451 1.58802 19.5021C2.42408 16.5591 4.08637 13.9175 6.37788 11.8905C8.66938 9.86338 11.494 8.53578 14.517 8.06501V5.41201H12.363C12.1185 5.41122 11.8841 5.31372 11.7112 5.1408C11.5383 4.96787 11.4408 4.73357 11.44 4.48901V1.41201C11.4408 1.16746 11.5383 0.933153 11.7112 0.760228C11.8841 0.587303 12.1185 0.489805 12.363 0.489014H21.593C21.8376 0.489805 22.0719 0.587303 22.2448 0.760228C22.4177 0.933153 22.5152 1.16746 22.516 1.41201V4.48901C22.5152 4.73357 22.4177 4.96787 22.2448 5.1408C22.0719 5.31372 21.8376 5.41122 21.593 5.41201H19.439V8.06501C22.2567 8.5004 24.9055 9.68544 27.108 11.496L29.223 9.38101C29.3088 9.29502 29.4108 9.2268 29.523 9.18025C29.6352 9.13371 29.7555 9.10975 29.877 9.10975C29.9985 9.10975 30.1188 9.13371 30.231 9.18025C30.3432 9.2268 30.4452 9.29502 30.531 9.38101L32.708 11.558C32.794 11.6438 32.8622 11.7458 32.9088 11.858C32.9553 11.9702 32.9793 12.0905 32.9793 12.212C32.9793 12.3335 32.9553 12.4538 32.9088 12.566C32.8622 12.6782 32.794 12.7802 32.708 12.866L30.447 15.127L30.401 15.173C32.0902 17.7593 32.9863 20.783 32.979 23.872ZM19.439 26.641V14.989C19.4382 14.7445 19.3407 14.5102 19.1678 14.3372C18.9949 14.1643 18.7606 14.0668 18.516 14.066H15.44C15.1955 14.0668 14.9611 14.1643 14.7882 14.3372C14.6153 14.5102 14.5178 14.7445 14.517 14.989V26.641C14.5178 26.8856 14.6153 27.1199 14.7882 27.2928C14.9611 27.4657 15.1955 27.5632 15.44 27.564H18.517C18.7614 27.563 18.9954 27.4653 19.1681 27.2924C19.3409 27.1196 19.4382 26.8854 19.439 26.641Z"
                fill="#FF8900"
              />
            </svg>
          </div>
          <span className="text-[18.54px] max-h-[25vh] justify-start flex ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            doloremque exercitationem ea eum perferendis placeat aliquam sed
            laboriosam obcaecati sit hic cupiditate ipsum voluptatum unde
            sapiente at, nulla consectetur quaerat?
          </span>
        </li>
      </ul>
    </main >
  );
};