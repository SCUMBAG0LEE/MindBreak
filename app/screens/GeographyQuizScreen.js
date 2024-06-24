import React from "react";
import QuizScreen from "./QuizScreen";
import withApiUrl from "./withApiUrl";

const API_URL = "https://opentdb.com/api.php?amount=10&category=22";

const GeographyQuizScreen = (props) => {
  return <QuizScreen {...props} subjectName="Geography"/>;
};

export default withApiUrl(GeographyQuizScreen, API_URL);
