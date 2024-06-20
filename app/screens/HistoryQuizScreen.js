import React from "react";
import QuizScreen from "./QuizScreen";
import withApiUrl from "./withApiUrl";

const API_URL = "https://opentdb.com/api.php?amount=10&category=23";

const HistoryQuizScreen = (props) => {
  return <QuizScreen {...props} subjectName="History"/>;
};

export default withApiUrl(HistoryQuizScreen, API_URL);
