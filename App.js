import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabStack from './navigation/TabNavigation';
import AuthStack from './navigation/AuthStack';
import { createStackNavigator } from '@react-navigation/stack';


const AppStack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>

      <AppStack.Navigator headerMode='none'>
        <AppStack.Screen name="AuthStack" component={AuthStack} />
        <AppStack.Screen name="TabStack" component={TabStack} />
      </AppStack.Navigator>

    </NavigationContainer>
  )
}





// const Tab = createBottomTabNavigator();
// class App extends React.Component {

//   constructor(props) {
//     super(props)
//     this.userid = '1'
//     state = { loggedIn: false }
//     firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         this.setState({ loggedIn: true })
//       }
//       else {
//         this.setState({ loggedIn: false })
//       }
//     })
//   }

//   renderContent() {
//     if (!this.state.loggedIn) {
//       return (
//           <View>
//               <LoginForm />
//           </View>
//       )
//   }
//   else return <ChatRoom />
//   }

//   render() {
//     return (
//       this.renderContent()
//     )
//   }
// };
