import { Redirect } from 'expo-router';
import routes from '../routes'; // Update the import path

export default function Index() {
  return <Redirect href="/landing" />;
}