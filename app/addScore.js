// addScore.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addScore = async (subjectName, score, questionAmount) => {
  try {
    const storedScores = await AsyncStorage.getItem('quizScores');
    const scores = storedScores ? JSON.parse(storedScores) : [];
    scores.push({ subjectName, score, questionAmount});
    await AsyncStorage.setItem('quizScores', JSON.stringify(scores));
    return scores;
  } catch (error) {
    console.error("Error saving score", error);
    return [];
  }
};
