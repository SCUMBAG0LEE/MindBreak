import { Stack } from 'expo-router';
import Landing from './app/landing'; // Update the import path

const routes = (
  <Stack>
    <Stack.Screen name="landing" component={Landing} />
    <Stack.Screen name="login" component={Login} />
  </Stack>
);

export default routes;