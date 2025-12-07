import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//screens
import QuestPost from './src/screens/questPost';
import Main from './src/screens/home';
import FetchQuest from './src/screens/fetchPost'

//nav list
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

//RootStackParamList의 name을 통해 어떤 화면을 띄울지 지정
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Main} />
        <Stack.Screen name="CreateQuest" component={QuestPost} />
        <Stack.Screen name="FetchQuest" component={FetchQuest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}