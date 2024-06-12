import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native-web";
export { styles };

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d046e',
  },
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
 logo: {
  width: 250,
  height: 170,
  marginTop: -100
},

  cardsImage: {
    maxWidth: 280,
    width: '100%',
    height: 220,
  },
  textContainer: {
    position: 'relative',
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  mindBreakText: {
    color: '#1c1c84', 
  },
  pathImage: {
    width: 136,
    height: 15,
    position: 'absolute',
    bottom: -2,
    right: 50,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    padding: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c84', // Add a background color to the button
    borderRadius: 8, // Add a border radius to the button
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  },
);