import * as React from 'react';
import { Button, View, Text, YellowBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Calendar from '../screens/Calendar';
import CreateEvent from '../screens/CreateEventForm';
import firebase from "../config/Firebase"



//ignore cycle warning
YellowBox.ignoreWarnings([
  'Require cycle:',
  'Setting a timer'  //disable timer warning (there is a workaround)
]);

const Stack = createStackNavigator();

export default function CalendarStack() {
  return (
      <Stack.Navigator initialRouteName="Calendar" headerMode='none'>
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="CreateEvent" component={CreateEvent} />
      </Stack.Navigator>
  );
}
