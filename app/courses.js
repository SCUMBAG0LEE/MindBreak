import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import styled from "styled-components/native";
import Navbar from "./navbar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Courses() {
  return (
    <SafeAreaContainer>
      <StatusBar barStyle="light-content" />
      <Header>
        <Title>Courses</Title>
        <ProfileImage source={require("../assets/images/profile.png")} />
      </Header>
      <SearchContainer>
        <SearchInput placeholder="Find Course" placeholderTextColor="#bbb" />
        <SearchIcon source={require("../assets/images/search.png")} />
      </SearchContainer>
      <ScrollView>
        <Section>
          <SectionTitle>Recommended</SectionTitle>
          <CoursesList>
            <CourseCard>
              <CourseImage source={require("../assets/images/language.png")} />
              <CourseText>Language Quiz</CourseText>
            </CourseCard>
            <CourseCard>
              <CourseImage source={require("../assets/images/painting.png")} />
              <CourseText>Art Quiz</CourseText>
            </CourseCard>
          </CoursesList>
        </Section>
        <Section>
          <SectionTitle>Popular</SectionTitle>
          <CoursesList>
            <CourseCard>
              <CourseImage source={require("../assets/images/science.png")} />
              <CourseText>Science Quiz</CourseText>
            </CourseCard>
            <CourseCard>
              <CourseImage source={require("../assets/images/math.png")} />
              <CourseText>Math Quiz</CourseText>
            </CourseCard>
          </CoursesList>
        </Section>
        <Section>
          <SectionTitle>New</SectionTitle>
          <CoursesList>
            <CourseCard>
              <CourseImage source={require("../assets/images/history.png")} />
              <CourseText>History Quiz</CourseText>
            </CourseCard>
            <CourseCard>
              <CourseImage source={require("../assets/images/geography.png")} />
              <CourseText>Geography Quiz</CourseText>
            </CourseCard>
          </CoursesList>
        </Section>
      </ScrollView>
      <Navbar />
    </SafeAreaContainer>
  );
}

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #2d046e;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const SearchContainer = styled.View`
  background-color: #4c3c90;
  padding: 10px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.TextInput`
  color: white;
  flex: 1;
`;

const SearchIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  color: white;
  font-size: 18px;
  margin-bottom: 10px;
`;

const CoursesList = styled.View`
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const CourseCard = styled.View`
  background-color: #5a4ca7;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  width: 45%;
  margin-bottom: 20px;
`;

const CourseImage = styled.Image`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const CourseText = styled.Text`
  color: white;
  text-align: center;
`;
