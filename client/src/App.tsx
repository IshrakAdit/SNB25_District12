import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ContentScreen from './screens/components/ContentScreen';
import ProjectScreen from './screens/components/ProjectScreen';
import LeaderboardScreen from './screens/components/LeaderboardScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ContentScreen" component={ContentScreen} />
        <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
