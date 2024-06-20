import React from "react";
import QuizScreen from "./QuizScreen";
import withApiUrl from "./withApiUrl";

const API_URL = "https://opentdb.com/api.php?amount=10&category=17";

const ScienceQuizScreen = (props) => {
  return <QuizScreen {...props} />;
};

export default withApiUrl(ScienceQuizScreen, API_URL);
