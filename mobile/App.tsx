import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'zustand';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from './src/screens/HomeScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import LessonDetailScreen from './src/screens/LessonDetailScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import VillageScreen from './src/screens/VillageScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { ThemeProvider } from 'react-native-paper';
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider {...{}}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <ThemeProvider theme={theme}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#FF9933',
                tabBarInactiveTintColor: '#gray',
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Lessons" component={LessonsScreen} />
              <Tab.Screen name="Practice" component={PracticeScreen} />
              <Tab.Screen name="Village" component={VillageScreen} />
              <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </ThemeProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </Provider>
  );
}