import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  BackHandler
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { fetchQuestions } from "../api";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addScore } from "../addScore";

const QuizScreen = ({ questions, loading, error, subjectName }) => {
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [progress, setProgress] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [answerButtonsDisabled, setAnswerButtonsDisabled] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [score, setScore] = useState(0); // Score state
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeUp, setTimeUp] = useState(false); // Add this line
  const navigation = useNavigation();
  const percentScore = (score / questions.length) * 100;

  // useEffect(() => {
  //   const initialQuestions = [
  //     {
  //       question: "What is the capital of France?",
  //       answers: ["London", "Paris", "Berlin", "Madrid"],
  //       correctAnswerIndex: 1,
  //     },
  //     {
  //       question: "What is the capital of Germany?",
  //       answers: ["Vienna", "Berlin", "Zurich", "Munich"],
  //       correctAnswerIndex: 1,
  //     },
  //     {
  //       question: "What is the capital of Spain?",
  //       answers: ["Barcelona", "Valencia", "Madrid", "Seville"],
  //       correctAnswerIndex: 2,
  //     }
  //   ];
  //   setQuestions(initialQuestions);
  // }, []);

  useEffect(() => {
    apiUrl =
      "";
    fetchQuestions(apiUrl)
      .then((fetchedQuestions) => {
        setQuestions(fetchedQuestions);
      })
      .catch((err) => {
        // setError(err);
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      setAnswers(
        currentQuestion.answers.map((answer) => ({
          text: answer,
          bgColor: colors.answerBackground,
          textColor: "#FFFFFF",
        }))
      );
    }
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    if (!isTimerPaused && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      if (timeLeft === 0) {
        clearInterval(timer);
        setTimeUp(true);
        setQuizCompleted(true);
        // Handle time out
      }

      return () => clearInterval(timer);
    }
  }, [timeLeft, isTimerPaused]);

  useEffect(() => {
    // Calculate progress based on currentQuestionIndex and total number of questions
    const totalQuestions = questions.length;
    if (
      !isNaN(currentQuestionIndex) &&
      !isNaN(totalQuestions) &&
      totalQuestions > 0
    ) {
      const calculatedProgress = currentQuestionIndex / totalQuestions;
      setProgress(calculatedProgress);
    }
  }, [currentQuestionIndex, questions]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleAnswerSelection = (index) => {
    if (!answerButtonsDisabled) {
      setSelectedAnswerIndex(index);
    }
    const updatedAnswers = answers.map((answer, idx) => ({
      ...answer,
      bgColor: colors.answerBackground,
      textColor: "#FFFFFF",
    }));

    updatedAnswers[index] = {
      ...updatedAnswers[index],
      bgColor: colors.highlightedAnswerBackground,
      textColor: colors.highlightedAnswerText,
    };

    setAnswers(updatedAnswers);
  };

  const handleConfirm = () => {
    if (!answerButtonsDisabled && selectedAnswerIndex !== null) {
      const isCorrect =
        selectedAnswerIndex ===
        questions[currentQuestionIndex].correctAnswerIndex;

      if (isCorrect) {
        setScore((prevScore) => (prevScore += 1));
      }

      const colorsCorrectAnswer = answers.map((answer, index) => {
        if (index === questions[currentQuestionIndex].correctAnswerIndex) {
          return {
            ...answer,
            bgColor: isCorrect ? "#FFFFFF" : "#4CAF50",
            textColor: isCorrect ? "000000" : "#FFFFFF",
          };
        } else if (index === selectedAnswerIndex && !isCorrect) {
          return { ...answer, bgColor: "#D9534F", textColor: "#FFFFFF" };
        } else {
          return answer;
        }
      });
      setAnswers(colorsCorrectAnswer);
      setShowNextButton(true);
      setConfirmClicked(true);
      setAnswerButtonsDisabled(true);
      setAnswered(true);
      setShowSkipButton(false);
      setIsTimerPaused(true);
    }
  };

  const handleSkip = () => {
    // TODO
    handleNext();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswerIndex(null);
      setAnswered(false);
      setShowSkipButton(true);
      setShowNextButton(false);
      setConfirmClicked(false);
      setAnswerButtonsDisabled(false);
      setIsTimerPaused(false);

      const nextQuestion = questions[nextQuestionIndex];
      setAnswers(
        nextQuestion.answers.map((answer) => ({
          text: answer,
          bgColor: colors.answerBackground,
          textColor: "#FFFFFF",
        }))
      );
    } else {
      // Handle end of quiz
      setQuizCompleted(true);
    }
  };

  const handleFinish = () => {
    // Handle quiz finish, e.g., redirect to another screen
    addScore(subjectName, percentScore);
    navigation.navigate("courses");
  };

  const handleExitQuiz = () => {
    Alert.alert(
      "Exit Quiz",
      "Are you sure you want to exit the quiz?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Exit",
          onPress: () => {
            // Handle exiting the quiz
            navigation.navigate("courses"); // Redirect to courses screen
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const backAction = () => {
      if (!quizCompleted) {
        handleExitQuiz();
        return true; // Prevent default behavior (exit app)
      }
      return false; // Default behavior (back to previous screen)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [quizCompleted]);

  if (quizCompleted) {
    return (
      <View style={styles.completionContainer}>
        <Text style={styles.completionText}>
          {timeUp ? "Time's up!" : "Quiz Completed!"}
        </Text>
        <Text style={styles.scoreText}>
          Your Score: {score} / {questions.length}
        </Text>
        <Text style={styles.percentScoreText}>{percentScore}%</Text>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleExitQuiz}>
              <Text style={styles.backButtonText}>Exit</Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={progress}
                color={colors.highlightedAnswerBackground}
                style={styles.progressBar}
              />
            </View>
          </View>

          {questions.length > 0 && (
            <View style={styles.questionContainer}>
              <Text style={styles.question}>
                {questions[currentQuestionIndex].question}
              </Text>
            </View>
          )}
          <View style={styles.answersWithTimerContainer}>
            <View style={styles.timerContainer}>
              <AntDesign name="clockcircleo" size={24} color="#422B83" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
            <View style={styles.answersContainer}>
              {answers.map((answer, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.answerContainer}
                  onPress={() => handleAnswerSelection(index)}
                  disabled={answerButtonsDisabled}
                >
                  <View
                    style={[
                      styles.answer,
                      selectedAnswerIndex === index
                        ? styles.selectedAnswer
                        : null,
                      { backgroundColor: answer.bgColor },
                    ]}
                  >
                    <Text
                      style={[styles.answerText, { color: answer.textColor }]}
                    >
                      {answer.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {confirmClicked ? null : ( // Render only if confirm button is not clicked
              <View style={styles.skipButtonContainer}>
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.confirmButtonContainer}>
              {!showNextButton ? (
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    selectedAnswerIndex === null ? styles.disabledButton : null,
                  ]}
                  onPress={handleConfirm}
                  disabled={
                    selectedAnswerIndex === null || answerButtonsDisabled
                  }
                >
                  <Text
                    style={[
                      styles.confirmButtonText,
                      selectedAnswerIndex === null
                        ? styles.disabledButtonText
                        : null,
                    ]}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const colors = {
  primaryBackground: "#000000",
  secondaryBackground: "#14213D",
  accentColor: "#FCA311",
  correctAnswerBackground: "#4CAF50",
  incorrectAnswerBackground: "#D9534F",
  answerBackground: "#14213D",
  highlightedAnswerBackground: "#FCA311",
  highlightedAnswerText: "#000000",
  answerText: "#FFFFFF",
  timerBackground: "#FFFFFF",
  timerText: "#000000",
  skipText: "#FDB94B",
  confirmButtonBackground: "#FCA311",
  confirmButtonText: "#000000",
  disabledButtonBackground: "#14213D",
  disabledButtonText: "#445d94",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
  },
  progressContainer: {
    flex: 1,
    justifyContent: "center",
  },
  progressBar: {
    backgroundColor: colors.secondaryBackground,
    height: 10,
    margin: 20,
    borderRadius: 5,
  },
  backButton: {
    flex: 0.2,
    backgroundColor: colors.confirmButtonBackground,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  backButtonText: {
    color: colors.confirmButtonText,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },

  questionContainer: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.answerText,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  answersWithTimerContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  answersContainer: {
    flex: 1,
    width: 350,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  answerContainer: {
    width: 350,
    marginBottom: 10,
  },
  answer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.answerBackground,
  },
  selectedAnswer: {
    backgroundColor: colors.accentColor,
  },
  answerText: {
    fontSize: 16,
    color: colors.answerText,
  },
  timerContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    columnGap: 10,
    backgroundColor: colors.timerBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  timerText: {
    fontSize: 16,
    color: colors.timerText,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  skipButtonContainer: {
    flex: 1,
    alignItems: "center",
  },
  confirmButtonContainer: {
    flex: 1.5,
  },
  skipText: {
    color: colors.skipText,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  confirmButton: {
    backgroundColor: colors.confirmButtonBackground,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: colors.confirmButtonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: colors.disabledButtonBackground,
  },
  disabledButtonText: {
    color: colors.disabledButtonText,
  },
  nextButton: {
    backgroundColor: colors.confirmButtonBackground,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: colors.confirmButtonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  completionContainer: {
    backgroundColor: colors.primaryBackground,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  completionText: {
    color: colors.answerText,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scoreText: {
    color: colors.answerText,
    fontSize: 18,
    marginBottom: 16,
  },
  percentScoreText: {
    color: colors.answerText,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  finishButton: {
    backgroundColor: colors.confirmButtonBackground,
    padding: 16,
    borderRadius: 8,
  },
  finishButtonText: {
    color: colors.confirmButtonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default QuizScreen;
