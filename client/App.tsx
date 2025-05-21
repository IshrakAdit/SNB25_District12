import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView, StatusBar} from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ContentScreen from './src/screens/components/ContentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Contents" component={HomeScreen} />
      <Stack.Screen name="Projects" component={DetailsScreen} />
      <Stack.Screen name="ContentScreen" component={ContentScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{headerShown: false, title: 'Home'}}
      />
      <Tab.Screen
        name="Projects"
        component={DetailsScreen}
        options={{headerShown: false, title: 'Projects'}}
      />
    </Tab.Navigator>
  );
}

function AuthStack({onLogin}: {onLogin: () => void}) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login">
        {() => <LoginScreen onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Registration">
        {() => <RegistrationScreen onRegister={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#6b41a5" barStyle="light-content" />
        {isLoggedIn ? (
          <MainTabs />
        ) : (
          <AuthStack onLogin={() => setIsLoggedIn(true)} />
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
}
