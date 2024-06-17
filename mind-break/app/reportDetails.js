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

}
);

const reportDetails = () => {
    return (
        
        <SafeAreView style={styles.container}>
            <Text>reportDetails</Text>
        </SafeAreView>
    )
}
