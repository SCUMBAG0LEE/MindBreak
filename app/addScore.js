// addScore.js
import { doc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "./firebase";

export const addScore = async (subjectName, score, questionAmount) => {
  try {
    const quizScoreData = {
      uid: auth.currentUser.uid,
      timestamp: new Date(),
      scores: {
        questionAmount: questionAmount,
        score: score,
        subjectName: subjectName,
      },
    };
    const quizScoresRef = collection(db, "quizScores");
    await addDoc(quizScoresRef, quizScoreData);
    console.log(quizScoreData, quizScoresRef);

    console.log("Score added to Firestore successfully");

    return true;
  } catch (error) {
    console.error("Error adding score to Firestore:", error);
    return false;
  }
};
