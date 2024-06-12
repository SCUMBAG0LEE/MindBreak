import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

const Home = () => {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <ProfileImage source={require("../assets/images/profile.png")} />
      </Header>
      <ScrollView>
        <Content>
          <Greeting>Hello, Name</Greeting>
          <Subtitle>Let's start learning</Subtitle>
          <Card>
            <CardContent>
              <Text>Time Spent</Text>
              <Text>0 min / 60 min</Text>
            </CardContent>
            <MyCoursesButton onPress={() => router.push("/courses")}>
              <MyCoursesText>My courses</MyCoursesText>
            </MyCoursesButton>
          </Card>
          <GetStartedCard>
            <GetStartedText>What do you want to learn today?</GetStartedText>
            <GetStartedButton>
              <ButtonText>Get Started</ButtonText>
            </GetStartedButton>
          </GetStartedCard>
          <Section>
            <SectionTitle>Learning Plan</SectionTitle>
            <SectionContent>There is nothing here</SectionContent>
          </Section>
          <Section>
            <SectionTitle>Upcoming Quiz</SectionTitle>
            <SectionContent>
              <Text>12/12 10:00 AM</Text>
              <Text>Math Test | Grade 12</Text>
            </SectionContent>
          </Section>
        </Content>
      </ScrollView>
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
};

const Container = styled.View`
  flex: 1;
  background-color: #2d046e;
`;

const Header = styled.View`
  padding: 20px;
  align-items: flex-end;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const Content = styled.View`
  padding: 20px;
`;

const Greeting = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  color: #bbbbbb;
  font-size: 16px;
  margin-bottom: 20px;
`;

const Card = styled.View`
  background-color: #4c3c90;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const CardContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const MyCoursesButton = styled.TouchableOpacity`
  margin-top: 10px;
  background-color: #6a52ae;
  padding: 10px;
  border-radius: 5px;
`;

const MyCoursesText = styled.Text`
  color: white;
  text-align: center;
`;

const GetStartedCard = styled.View`
  background-color: #5a4ca7;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const GetStartedText = styled.Text`
  color: white;
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
`;

const GetStartedButton = styled.TouchableOpacity`
  background-color: #f15a29;
  padding: 10px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  color: white;
  font-size: 18px;
  margin-bottom: 10px;
`;

const SectionContent = styled.View`
  background-color: #4c3c90;
  padding: 20px;
  border-radius: 10px;
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

export default Home;
