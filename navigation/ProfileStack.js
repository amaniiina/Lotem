import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/MyProfile'
import ChangeInfo from '../screens/Change_info'

const profileStack = createStackNavigator();

export default function ProfileStack({ route, navigation }) {
    return (
      <profileStack.Navigator initialRouteName= "ProfilePage" headerMode='none'>
        <profileStack.Screen name="ProfilePage" component={Profile} />
        <profileStack.Screen name='changeInfo' component={ChangeInfo} />
      </profileStack.Navigator>
    );
  }