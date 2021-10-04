import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GroupsStack from './GroupsStack';
import Calendar from '../navigation/CalendarStack';
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileStack from './ProfileStack'
import Emergency from '../screens/EmergencyNumbers'
import firebase from "../config/Firebase";

const Tab = createBottomTabNavigator();

class TabNavigator extends React.Component {

  constructor(props){
    super(props)
    this.userid=firebase.auth().currentUser.uid
  }

  renderContent() {
    return (
        <Tab.Navigator
          initialRouteName= "Groups"
          options={{ userid: 'Home!' }}
          screenOptions={({ route }) => ({
            userid: this.userid,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Profile') {
                iconName = focused
                  ? 'face'
                  : 'face-outline';
              } else if (route.name === 'Groups') {
                iconName = focused
                  ? 'account-group'
                  : 'account-group';
              } else if (route.name === 'Calendar') {
                iconName = focused
                  ? 'calendar-month'
                  : 'calendar-month-outline';
              }
              else if (route.name === 'Emergency') {
                iconName = focused
                  ? 'alarm-light'
                  : 'alarm-light-outline';
              }
              return <Icons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            keyboardHidesTabBar: 'true',
          }}>
          <Tab.Screen name="Profile" component={ProfileStack} />
          <Tab.Screen name="Groups" component={GroupsStack}/>
          <Tab.Screen name="Calendar" component={Calendar} />
          <Tab.Screen name='Emergency' component={Emergency}/>
        </Tab.Navigator>
    );
  }

  render() {
    return (
      this.renderContent()
    )
  }
};


export default TabNavigator;
