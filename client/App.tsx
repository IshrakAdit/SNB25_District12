import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView, StatusBar} from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ContentScreen from './src/screens/components/ContentScreen';
import ProjectScreen from './src/screens/components/ProjectScreen';
import PreferencesScreen from './src/screens/PreferencesScreen';
import LeaderboardScreen from './src/screens/components/LeaderboardScreen';
import LessonServerScreenWrapper from './src/screens/LessonServerScreenWrapper';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ContentScreen" component={ContentScreen} />
      <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
      <Stack.Screen name="LessonServerScreenWrapper" component={LessonServerScreenWrapper} />
    </Stack.Navigator>
  );
}

function AuthStack({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login">
        {() => <LoginScreen onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Registration">
        {() => <RegistrationScreen onRegister={onRegister} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsNewUser(false);
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    setIsNewUser(true);
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#6b41a5" barStyle="light-content" />
        {!isLoggedIn ? (
          <AuthStack onLogin={handleLogin} onRegister={handleRegister} />
        ) : isNewUser ? (
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Preferences" component={PreferencesScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ContentScreen" component={ContentScreen} />
            <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
            <Stack.Screen
              name="LeaderboardScreen"
              component={LeaderboardScreen}
            />
            <Stack.Screen
              name="LessonServerScreenWrapper"
              component={LessonServerScreenWrapper}
            />
          </Stack.Navigator>
        ) : (
          <MainStack />
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
}
