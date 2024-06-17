import axios from 'axios';

export const fetchQuestions = async () => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=10&category=31&difficulty=medium&type=multiple');
    const questions = response.data.results.map((question) => {
      const all_answer = [...question.incorrect_answers, question.correct_answer];
      const shuffledAnswers = all_answer.sort(() => Math.random() - 0.5);
      const correctAnswerIndex = shuffledAnswers.findIndex((answer) => answer === question.correct_answer);
      return {
        question: question.question,
        correctAnswerIndex: correctAnswerIndex,
        answers: shuffledAnswers,
      };
    });
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};