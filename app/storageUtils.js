// storageUtils.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const clearQuizScores = async () => {
  try {
    await AsyncStorage.removeItem('quizScores');
    console.log('Quiz scores cleared');
  } catch (error) {
    console.error('Error clearing quiz scores:', error);
  }
};
