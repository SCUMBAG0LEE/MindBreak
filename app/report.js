import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  handlePress,
} from "react-native";
import { router, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Icon, colors } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useTable }from "react-table";

// make a function for styles with const
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#2d046e",
  },

  containerHeader: {
    backgroundColor: "#1a0831",
    width: "100%",
    height: "25%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    position: "static",
  },

  textWelcome: {
    fontSize: 35,
    fontWeight: "bold",
    // fontFamily:=> pls help change this to poppins
    color: "#fff", // Add this if your text is not visible due to the same color as the background
  },

  subText:{
    fontSize: 15,
    // fontFamily:=> pls help change this to poppins
    color: '#fff',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  contentHeader: {
    // flex: 1,
    // width: "100%",
    // height: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "row",

  },

  contentText: {
    fontSize: 18,
    letterSpacing: 2,
    // fontFamily:=> pls help change this to poppins
    color: '#fff',
    marginRight: "50%",
    
  },

  intervalButton: {
    backgroundColor: "#00c897",
    padding: 15,
    borderRadius: 10,
    marginLeft: "auto",
  },

  roundedButton: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },

  intervalButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  userStats: {
    marginTop: 30,
    color: "#fff",
  },

  detailsContainer: {
    marginTop: 400,
    alignItems: "center",
  },

  detailsButton:{
    backgroundColor: "#00c897",
    width: 30,
    height: 30,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: 'center'
  },

  detailsButtonText: {
    marginTop: 15,
    color: "#fff",
  },

}
);

const report = () => {

  // state to store the username
  const [username, setUsername] = useState("")

  // fetch the user's username
  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  function handleIntervalButton(){

  }
  function handleDetailsButton(){
      router.push("/reportDetails");
  }

  return (
    
      <SafeAreaView style={styles.container}>

        {/* for header stuff */}
        <View style={styles.containerHeader}> 
          <View>
              <Text style={styles.textWelcome}>Welcome, {username}!</Text> 
              <Text style={styles.subText}> Let's see your progress today </Text>
            </View>
            <Image
              source={require("../assets/images/profile.png")}
              style={styles.avatar}
              />
        </View>
        
        {/* for content stuff */}
        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentText}> {username}'s Statistics  </Text>
            <TouchableOpacity
            style={[styles.intervalButton, styles.roundedButton]}
            onPress={handleIntervalButton}
            >
              <Text style={styles.intervalButtonText}>WEEKLY</Text>
              </TouchableOpacity>
              </View>
          
          <Text style={styles.userStats}> Your bar graph should be here! </Text>

          <View style={styles.detailsContainer}>
            <TouchableOpacity style={styles.detailsButton} onPress={handleDetailsButton}>
              <Icon style={styles.arrow}name="arrow-right"> </Icon>
            </TouchableOpacity>

            <Text style={styles.detailsButtonText}> Click to see more details </Text>
          </View>


        </View>

        
      </SafeAreaView>
  );
};

export default report;