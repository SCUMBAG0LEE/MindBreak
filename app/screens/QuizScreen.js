import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

const QuizScreen = () => {  
  const [question, setQuestion] = useState("What is the capital of France?");
  const [answers, setAnswers] = useState(() => {
    // Initialize answers array with default values
    const defaultAnswers = ["London", "Paris", "Berlin", "Madrid"];
    return defaultAnswers.map(answer => ({
      text: answer,
      bgColor: '#422B83',
      textColor: '#FFFFFF'
    }));
  });
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(1); // Index of the correct answer
  const [timeLeft, setTimeLeft] = useState(60);
  const [progress, setProgress] = useState(0.5);
  const [showNextButton, setShowNextButton] = useState(false); // State to show Next button
  const [confirmClicked, setConfirmClicked] = useState(false); // State to track if Confirm button clicked

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(timer);
      // Handle time out
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAnswerSelection = (index) => {
    setSelectedAnswerIndex(index);

    // Reset styles for all answers
    const updatedAnswers = answers.map((answer, idx) => ({
      ...answer,
      bgColor: '#422B83',
      textColor: '#FFFFFF'
    }));

    // Apply selected style
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      bgColor: '#8543D9', // Selected answer background color
      textColor: '#FFFFFF', // Selected answer text color
    };

    setAnswers(updatedAnswers);
  };

  const handleConfirm = () => {
    if (selectedAnswerIndex !== null) {
      // Determine if the selected answer is correct
      const isCorrect = selectedAnswerIndex === correctAnswerIndex;

      // Map through answers to update styles based on correctness
      const updatedAnswers = answers.map((answer, index) => {
        if (index === correctAnswerIndex) {
          return { ...answer, bgColor: isCorrect ? '#FFFFFF' : '#4CAF50', textColor: isCorrect ? '#8543D9' : '#FFFFFF' };
        } else if (index === selectedAnswerIndex && !isCorrect) {
          return { ...answer, bgColor: '#D9534F', textColor: '#FFFFFF' };
        } else {
          return answer;
        }
      });

      // Update state with new answers array and show Next button
      setAnswers(updatedAnswers);
      setShowNextButton(true);
      setConfirmClicked(true); // Set confirm button clicked
    }
  };

  const handleSkip = () => {
    // Handle skipping the question
  };

  const handleNext = () => {
    // Reset answers to default styles
    const defaultAnswers = ["London", "Paris", "Berlin", "Madrid"];
    const resetAnswers = defaultAnswers.map(answer => ({
      text: answer,
      bgColor: '#422B83',
      textColor: '#FFFFFF'
    }));

    setAnswers(resetAnswers);

    // Logic to move to the next question
    // For demonstration, reset states or fetch next question
    setQuestion("Next question?");
    setSelectedAnswerIndex(null);
    setShowNextButton(false);
    setConfirmClicked(false); // Reset confirm button clicked
    // Reset other relevant states as needed
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} color="#FFFFFF" style={styles.progressBar} />
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question}</Text>
      </View>
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
            >
              <View style={[
                styles.answer,
                selectedAnswerIndex === index ? styles.selectedAnswer : null,
                { backgroundColor: answer.bgColor },
              ]}>
                <Text style={[styles.answerText, { color: answer.textColor }]}>{answer.text}</Text>
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
              style={[styles.confirmButton, selectedAnswerIndex === null ? styles.disabledButton : null]}
              onPress={handleConfirm}
              disabled={selectedAnswerIndex === null}
            >
              <Text style={[styles.confirmButtonText, selectedAnswerIndex === null ? styles.disabledButtonText : null]}>Confirm</Text>
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
  );
};

const colors = {
  primaryBackground: '#231646',
  secondaryBackground: '#2D165B',
  accentColor: '#8543D9',
  correctAnswerBackground: '#4CAF50',
  incorrectAnswerBackground: '#D9534F',
  answerBackground: '#422B83',
  answerText: '#FFFFFF',
  timerBackground: '#FFFFFF',
  timerText: '#422B83',
  skipText: '#FDB94B',
  confirmButtonBackground: '#FDB94B',
  confirmButtonText: '#361757',
  disabledButtonBackground: '#2A1C51',
  disabledButtonText: '#B69156',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  progressBar: {
    backgroundColor: colors.secondaryBackground,
    height: 10,
    margin: 20,
    borderRadius: 5,
  },
  questionContainer: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.answerText,
    marginBottom: 20,
  },
  answersWithTimerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  answersContainer: {
    flex: 1,
    width: 350,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  answerContainer: {
    width: 350,
    marginBottom: 10,
  },
  answer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
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
    flexDirection: 'row',
    alignSelf: 'flex-end',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  skipButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonContainer: {
    flex: 1.5,
  },
  skipText: {
    color: colors.skipText,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  confirmButton: {
    backgroundColor: colors.confirmButtonBackground,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.confirmButtonText,
    fontSize: 16,
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.confirmButtonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
