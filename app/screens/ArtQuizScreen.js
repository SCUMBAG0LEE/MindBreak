import React from "react";
import QuizScreen from "./QuizScreen";
import withApiUrl from "./withApiUrl";

const API_URL = "https://opentdb.com/api.php?amount=10&category=25";

const ArtQuizScreen = (props) => {
  return <QuizScreen {...props} subjectName="Art"/>;
};

export default withApiUrl(ArtQuizScreen, API_URL);
