import axios from "axios";
import he from "he";

const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY = 3000; // Delay in milliseconds before retrying

export const fetchQuestions = async (apiUrl) => {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const response = await axios.get(apiUrl);
      const questions = response.data.results.map((question) => {
        const all_answers = [
          ...question.incorrect_answers,
          question.correct_answer,
        ];
        const shuffledAnswers = all_answers.sort(() => Math.random() - 0.5);
        const correctAnswerIndex = shuffledAnswers.findIndex(
          (answer) => answer === question.correct_answer
        );
        return {
          question: he.decode(question.question),
          correctAnswerIndex: correctAnswerIndex,
          answers: shuffledAnswers.map((answer) => he.decode(answer)),
        };
      });
      return questions;
    } catch (error) {
      console.error(
        `Error fetching questions (attempt ${attempt + 1}/${MAX_RETRIES}):`,
        error
      );
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
  console.error("Max retry attempts reached. Unable to fetch questions.");
  return []; // Return an empty array if all retry attempts fail
};
