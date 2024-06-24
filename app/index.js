import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const email = await AsyncStorage.getItem("email");
      if (email) {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const startSession = async () => {
      const startTime = new Date().getTime();
      setSessionStartTime(startTime);
      await AsyncStorage.setItem("sessionStartTime", startTime.toString());
    };

    startSession();
  }, []);

  useEffect(() => {
    const calculateSessionDuration = async () => {
      const storedStartTime = await AsyncStorage.getItem("sessionStartTime");
      if (storedStartTime) {
        const startTime = parseInt(storedStartTime, 10);
        const currentTime = new Date().getTime();
        const duration = currentTime - startTime;
        setSessionDuration(duration);
        await AsyncStorage.setItem("sessionDuration", duration.toString());
      }
    };

    calculateSessionDuration();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!isLoggedIn) {
          router.push("/landing");
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isLoggedIn])
  );

  return isLoggedIn ? (
    <Redirect href="/home" sessionDuration={sessionDuration} />
  ) : (
    <Redirect href="/landing" />
  );
}
