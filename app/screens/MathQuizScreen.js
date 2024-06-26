import React from "react";
import QuizScreen from "./QuizScreen";
import withApiUrl from "./withApiUrl";

const API_URL = "https://opentdb.com/api.php?amount=10&category=19";

const MathQuizScreen = (props) => {
  return <QuizScreen {...props} subjectName="Math"/>;
};

export default withApiUrl(MathQuizScreen, API_URL);
