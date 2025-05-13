import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";

const Quiz = () => {
  const navigate = useNavigate(); // 👈 used to redirect

  const questions = [
    {
      id: 1,
      question: "What’s your optimal housing price range?",
      options: [
        "Under $500",
          "$500 to $650",
          "$650 to $800",
          "$800 and above"
      ],
    },
    {
      id: 2,
      question: "How many bedrooms do you prefer?",
      options: ["Studio", "1 Bedroom", "2 Bedrooms", "3+ Bedrooms"],
    },
    {
      id: 3,
      question: "Which part of Davis do you prefer to live in?",
      options: ["North", "East", "South", "West"],
    },
      /* {
        id: 4,
        question: "another question?",
        options: ["option", "option", "option"],
      }, */ 
    ];
  
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [message, setMessage] = useState("");
  
    const handleOptionChange = (e) => {
      setAnswers({
        ...answers,
        [currentQuestion]: e.target.value,
      });
    };
  
    const handleNext = (e) => {
      e.preventDefault();
      if (!answers[currentQuestion]) {
        setMessage("Please select an option.");
        return;
      }
      setMessage("");
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        console.log("Quiz completed", answers);
        navigate("/profile"); 
      }
    };
  
    const handlePrevious = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        setMessage("");
      }
    };
  
    return (
      <div className="Quiz-page">
        <div className="frame">
          {message && <span className="message">{message}</span>}
          <form className="quiz-form" onSubmit={handleNext}>
            <h2 className="step">Question {currentQuestion + 1}/{questions.length}</h2>
            <h1 className="question">{questions[currentQuestion].question}</h1>
            <p className="subtext">Select one answer</p>
  
            <div className="options">
              {questions[currentQuestion].options.map((label) => (
                <label
                  key={label}
                  className={`option ${answers[currentQuestion] === label ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="option"
                    value={label}
                    checked={answers[currentQuestion] === label}
                    onChange={handleOptionChange}
                    className="radio"
                  />
                  {label}
                </label>
              ))}
            </div>
  
            <div className="button-group">
              <button
                type="button"
                className="previousButton"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button className="continueButton" type="submit">
                {currentQuestion === questions.length - 1 ? "Continue to Profile" : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Quiz;