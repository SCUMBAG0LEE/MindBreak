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
import { router, Link, ExpoRoot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Icon} from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import report from "./report";

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

    closeBtnContainer: {
      // marginTop: 400,
      marginLeft: 30,
      alignItems: "center",
      position: "static",
    },
  
    closeBtn:{
      backgroundColor: "#00c897",
      width: 30,
      height: 30,
      borderRadius: 70,
      alignItems: "center",
      justifyContent: 'center'
    },

    quizReportsContainer: {
      // flex: 1,
      // backfaceVisibility: "visible",
      padding: 25,
      backgroundColor: "#0a0a0a",
      width: 350,
      height: "30%",
      borderRadius: 20,
      // justifyContent: "space-between",
      // alignItems: "flex-start",
      // alignSelf: "center",
    },

    reportSubject: {
      color: "#fff",
      fontSize: 20,
      letterSpacing: 2,
      fontWeight: "200"

    },

    reportScoreContainer: {
      // backgroundColor: "#fff",
      padding: "auto",
      margin: "auto",
      alignItems: "center",
      justifyContent: "flex-start",

    },

    reportScore: {
      color: "#1a8d71",
      fontSize: 60,
      fontWeight: "bold"

    },

}
);

const reportDetails = () => {

  function handleCloseBtn(){
    router.push("/report");
}

  // state to store data from DB
  const [username, setUsername] = useState("");
  const [quizReports, setQuizReports] = useState([]);

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

  //store username and it's quiz report
  const addQuizReport = (subject, score) => {
    setQuizReports([...quizReports, { subject, score }]);
  };


    
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
            <Text style={styles.contentText}> {username}'s Report  </Text>
            <View style={styles.closeBtnContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleCloseBtn}>
              <Icon style={styles.arrow}name="arrow-left"> </Icon>
            </TouchableOpacity>
            </View>
            </View>
          
          {quizReports.map((report, index) => 
            <View key={index} style={styles.quizReportsContainer}>
              <Text style={styles.reportSubject}> Subject {report.subject} </Text>
              <View style={styles.reportScoreContainer}>
              <Text style={styles.reportScore}> Score {report.score} </Text>
              </View>
            </View>
          )}

              {/* THIS IS ONLY FOR AN EXAMPLE, DELETE THIS BEFORE FINISHING */}
              <View style={styles.quizReportsContainer}>
                <Text style={styles.reportSubject}> Math</Text>
              <View style={styles.reportScoreContainer}>
                <Text style={styles.reportScore}> 85 </Text>
              </View>
            </View>
      </View>

    </SafeAreaView>
  )
}

export default reportDetails;
