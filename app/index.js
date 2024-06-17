import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");

      if (username && password) {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  return isLoggedIn ? <Redirect href="/home" /> : <Redirect href="/report" />;
}
