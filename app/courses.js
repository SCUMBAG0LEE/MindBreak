import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
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

const RecommendedSection = styled.View`
  margin-bottom: 20px;
`;

const RecommendedTitle = styled.Text`
  color: white;
  font-size: 18px;
  margin-bottom: 10px;
`;

const CoursesList = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const CourseCard = styled.View`
  background-color: #5a4ca7;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const CourseImage = styled.Image`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const CourseText = styled.Text`
  color: white;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #3a2873;
`;

const FooterButton = styled.TouchableOpacity`
  align-items: center;
`;

const FooterIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

export default function Courses() {
  return (
    <Container>
      <Header>
        <Title>Courses</Title>
        <ProfileImage source={require("../assets/images/profile.png")} />
      </Header>
      <SearchContainer>
        <SearchInput placeholder="Find Course" placeholderTextColor="#bbb" />
        <SearchIcon source={require("../assets/images/search.png")} />
      </SearchContainer>
      <RecommendedSection>
        <RecommendedTitle>Recommended</RecommendedTitle>
        <CoursesList>
          <CourseCard>
            <CourseImage source={require("../assets/images/language.png")} />
            <CourseText>Language</CourseText>
          </CourseCard>
          <CourseCard>
            <CourseImage source={require("../assets/images/painting.png")} />
            <CourseText>Painting</CourseText>
          </CourseCard>
        </CoursesList>
      </RecommendedSection>
      <Footer>
        <FooterButton>
          <FooterIcon source={require("../assets/images/home.png")} />
        </FooterButton>
        <FooterButton>
          <FooterIcon source={require("../assets/images/course.png")} />
        </FooterButton>
        <FooterButton>
          <FooterIcon source={require("../assets/images/other.png")} />
        </FooterButton>
      </Footer>
    </Container>
  );
}
