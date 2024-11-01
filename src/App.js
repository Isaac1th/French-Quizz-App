import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import flashcards from "./components/Flashcards";

function FlashcardGame() {
  const getRandomIndex = () => Math.floor(Math.random() * flashcards.length);

  const [currentIndex, setCurrentIndex] = useState(getRandomIndex());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showContinue, setShowContinue] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [quizOver, setQuizOver] = useState(false);

  const currentFlashcard = flashcards[currentIndex];

  const handleNextFlashcard = useCallback(() => {
    if (questionsAnswered >= 29) {
      setQuizOver(true);
      return;
    }

    setCurrentIndex(getRandomIndex());
    setSelectedOption(null);
    setShowContinue(false);
    setTimeLeft(10);
    setQuestionsAnswered((prev) => prev + 1);
  }, [questionsAnswered]);

  useEffect(() => {
    if (showContinue || quizOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer);
          handleNextFlashcard();
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showContinue, handleNextFlashcard, quizOver]);

  const checkAnswer = (option) => {
    setSelectedOption(option);
    const correctAnswer = currentFlashcard.preposition;

    if (option === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    setShowContinue(true);
  };

  const resetQuiz = () => {
    setScore(0);
    setTimeLeft(10);
    setShowContinue(false);
    setSelectedOption(null);
    setQuestionsAnswered(0);
    setQuizOver(false);
    setCurrentIndex(getRandomIndex());
  };

  if (quizOver) {
    return (
      <div id="flashcard">
        <h2>Quiz Over</h2>
        <p>Your final score is: {score} / 30</p>
        <button id="try-again-button" onClick={resetQuiz}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div id="flashcard">
      <div id="score">Score: {score}</div>
      <div id="timer">Time: {timeLeft}</div>
      <div id="question-counter">Question: {questionsAnswered + 1} / 30</div>
      <h2 id="verb">{currentFlashcard.verb}</h2>
      <div id="options">
        <button
          className={`option-button ${
            selectedOption === "à"
              ? currentFlashcard.preposition === "à"
                ? "correct"
                : "incorrect"
              : ""
          }`}
          onClick={() => checkAnswer("à")}
          disabled={showContinue}
        >
          à
        </button>
        <button
          className={`option-button ${
            selectedOption === "de"
              ? currentFlashcard.preposition === "de"
                ? "correct"
                : "incorrect"
              : ""
          }`}
          onClick={() => checkAnswer("de")}
          disabled={showContinue}
        >
          de
        </button>
        <button
          className={`option-button ${
            selectedOption === "neither"
              ? currentFlashcard.preposition === "neither"
                ? "correct"
                : "incorrect"
              : ""
          }`}
          onClick={() => checkAnswer("neither")}
          disabled={showContinue}
        >
          neither
        </button>
      </div>
      {showContinue && (
        <div id="caption">
          <span className="feedback">
            {selectedOption === currentFlashcard.preposition
              ? "Right answer:"
              : "Wrong answer:"}
          </span>{" "}
          <span className="sentence">{currentFlashcard.sentence}</span>
          <br />
          <span className="translation">{currentFlashcard.translation}</span>
        </div>
      )}
      {showContinue && (
        <button id="continue-button" onClick={handleNextFlashcard}>
          Continue
        </button>
      )}
    </div>
  );
}

export default FlashcardGame;
