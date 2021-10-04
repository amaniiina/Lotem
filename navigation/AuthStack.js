import { createStackNavigator } from '@react-navigation/stack';
import Home_page from '../screens/login/home_page'
import React from 'react';
import LogIn from '../screens/login/Login_form';
import SignUp from '../screens/login/Signup_form';
import Verify from '../screens/login/Verify';
import Forgot from '../screens/login/Forgot_password'
import Info from '../screens/login/Info'

const Main_Stack = createStackNavigator();

export default function Auth_stack() {
  return (
    <Main_Stack.Navigator headerMode='none' initialRouteName='Home'>
      <Main_Stack.Screen name="Home" component={Home_page} />
      <Main_Stack.Screen name="Login" component={LogIn} />
      <Main_Stack.Screen name="Signup" component={SignUp} />
      <Main_Stack.Screen name="Verify" component={Verify} />
      <Main_Stack.Screen name="Info" component={Info} />
      <Main_Stack.Screen name="Forgot" component={Forgot} />
    </Main_Stack.Navigator>
  )
}



















// function nav() {

//   const [loggedIn, setLoggedIn] = useState(false);


//   useEffect(() => {

//     console.log('before if user, user:', )
    
//     firebase.auth().onIdTokenChanged((user) => { // checkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
//       if (user) {
//         if (firebase.auth().currentUser.emailVerified) {
//           setLoggedIn(true)
//         }
//       }
//       else {
//         setLoggedIn(false)
//       }

//     })
//     console.log('state: ', loggedIn)

    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     setLoggedIn(true)
    //   }
    //   else {
    //     setLoggedIn(false)
    //   }
    // })

  // }, []);

  //   if (loading) {
  //     return <Loading />;
  //   }

  // return (
  //   <NavigationContainer>
  //     {loggedIn ? <TabNavigator /> : <Auth_stack />}
  //   </NavigationContainer>
  // );


// }
// export default nav;