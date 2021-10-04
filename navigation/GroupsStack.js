import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from "react-native-vector-icons/Feather";
import groupsList from '../screens/Groups';
import chat from '../screens/Chat';
import CreateSubgroupForm from '../screens/CreateSubgroupForm'
import GroupInfo from '../screens/GroupInfo'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import AllGroups from '../screens/AllGroups';
import firebase from "../config/Firebase"
import AddUsers from '../screens/AddUsersToGroup'
import AddNewLocGroup from '../screens/CreateLocGroupForm'

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();


class ChatApp extends React.Component {

  constructor(props) {
    super(props)
    this.userid = firebase.auth().currentUser.uid  // get from user auth here or in app.js
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  render() {
    return (
      <ChatAppStack.Navigator initialRouteName="groupsList">
        <ChatAppStack.Screen name="groupsList" component={groupsList}
          options={({ route }) => ({
            title: "Groups",
            headerRight: () => (
              <Icons
                name="list"
                size={32}
                onPress={() => navigation.navigate("allGroups", { userid: this.userid })}
              />
            ),
          })}
        />
        <ChatAppStack.Screen name="chatScreen" component={chat}
          options={({ route }) => ({
            title: (route.params.group.name),
            headerRight: () => (
              route.params.sub ?

                <Menu
                  ref={this.setMenuRef}
                  button={<Icons
                    name="more-vertical"
                    size={30}
                    onPress={this.showMenu}
                  />}
                >

                  <MenuItem onPress={() => {
                    // console.log('params in groupStack', route.params)
                    this.hideMenu()
                    navigation.navigate("GroupInfo",
                      {
                        group: route.params.group, //subgroup
                        parentGroupKey: route.params.parentGroupKey, //parent group key
                        userid: route.params.userid,
                        sub: route.params.sub
                      }
                    )
                  }}>Group Info</MenuItem>
                  <MenuDivider />
                </Menu>

                : <Menu
                  ref={this.setMenuRef}
                  button={<Icons
                    name="more-vertical"
                    size={30}
                    onPress={this.showMenu}
                  />}
                >

                  <MenuItem onPress={() => {
                    this.hideMenu()
                    navigation.navigate("GroupInfo",
                      {
                        group: route.params.group, //subgroup
                        parentGroupKey: route.params.parentGroupKey, //parent group key
                        userid: route.params.userid,
                        sub: route.params.sub
                      }
                    )
                  }}>Group Info</MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={() => {
                    this.hideMenu()
                    navigation.navigate("addGroup",
                      {
                        group: route.params.group,
                        userid: route.params.userid,
                        sub: route.params.sub
                      }
                    )
                  }}>Create Subgroup</MenuItem>
                </Menu>

            ),
          })}
        />
        <ChatAppStack.Screen name='allGroups' component={AllGroups}
          options={{
            title: "All Groups",
          }}
        />
        <ChatAppStack.Screen name='AddNewLocGroup' component={AddNewLocGroup}/>
      </ChatAppStack.Navigator>
    );
  }
}

export default function GroupsStack({ route, navigation }) {
  return (
    <ModalStack.Navigator mode='modal' headerMode='none'>
      <ModalStack.Screen name='chatApp' component={ChatApp} />
      <ModalStack.Screen name='addGroup' component={CreateSubgroupForm} />
      <ModalStack.Screen name='GroupInfo' component={GroupInfo} />
      <ModalStack.Screen name='AddUsers' component={AddUsers} />
    </ModalStack.Navigator>
  );
}