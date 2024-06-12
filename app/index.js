import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuizScreen from './screens/QuizScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  );
}
