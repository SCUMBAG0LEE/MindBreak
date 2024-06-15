import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons'; // Importing AntDesign icons

const QuizScreen = () => {
  const [question, setQuestion] = useState("What is the capital of France?");
  const [answers, setAnswers] = useState(["London", "Paris", "Berlin", "Madrid"]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const [progress, setProgress] = useState(0.5);

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

  // Helper function to format time to mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    // Check if the selected answer is correct
    // Handle next question or end of quiz
  };

  const handleConfirm = () => {
    if (selectedAnswer) {
      // Handle confirmation of the selected answer
    }
  };

  const handleSkip = () => {
    // Handle skipping the question
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.5} color="#8543D9" style={styles.progressBar} />
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
              onPress={() => handleAnswerSelection(answer)}
            >
              <View style={[
                styles.answer,
                selectedAnswer === answer ? styles.selectedAnswer : null,
              ]}>
                <Text style={styles.answerText}>{answer}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.skipButtonContainer}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, !selectedAnswer ? styles.disabledButton : null]}
            onPress={handleConfirm}
            disabled={!selectedAnswer}
          >
            <Text style={[styles.confirmButtonText, !selectedAnswer ? styles.disabledButtonText : null]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231646', // Dark theme background color
  },
  progressBar: {
    height: 10,
    margin: 20,
    borderRadius: 5,
  },
  questionContainer: {
    flex: 1, // Take up half of the screen
    backgroundColor: '#2D165B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
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
    width: 350, // Set the width of the answer buttons container
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  answerContainer: {
    width: 350, // Set the width of the answer buttons container
    marginBottom: 10,
  },
  answer: {
    backgroundColor: '#422B83',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedAnswer: {
    backgroundColor: '#8543D9', // Color for selected answer
  },
  answerText: {
    color: '#FFFFFF', // White text color
    fontSize: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    columnGap: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  timerText: {
    fontSize: 16,
    color: '#422B83',
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
    flex: 1.5, // Confirm button takes twice as much space as the skip button
  },
  skipText: {
    color: '#FDB94B',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  confirmButton: {
    backgroundColor: '#FDB94B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#361757',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#2A1C51',
  },
  disabledButtonText: {
    color: '#B69156',
  },
});

export default QuizScreen;
