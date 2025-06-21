import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GridScreen from '../screens/GridScreen'; // Import the new screen
import CustomHeader from '../components/CustomHeader';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: ({ navigation, route, options, back }) => {
          const title = options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
            ? options.title
            : route.name;
          return (
            <CustomHeader
              title={title}
              navigation={navigation}
              canGoBack={back !== undefined}
            />
          );
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Component Showcase' }} // Updated title
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'App Settings' }}
      />
      <Stack.Screen
        name="GridDemo"
        component={GridScreen}
        options={{ title: 'Grid Layout Demo' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
