import * as firebase from "firebase"
import "firebase/firestore" 


// const firebaseConfig = {
//     apiKey: "AIzaSyCj8O50E82pecrkw6ipPe3-6uTUCwBuAqs",
//     authDomain: "lotem-14d3a.firebaseapp.com",
//     databaseURL: "https://lotem-14d3a.firebaseio.com",
//     projectId: "lotem-14d3a",
//     storageBucket: "lotem-14d3a.appspot.com",
//     messagingSenderId: "678632379824",
//     appId: "1:678632379824:web:a010e849fb25e7e89e3275"
//   };


//jameel's

const firebaseConfig = {
  apiKey: "AIzaSyAMHSq7v_ILOrui7BQN6aNO4QdZSQNBWpk",
  authDomain: "lotem-43a5a.firebaseapp.com",
  databaseURL: "https://lotem-43a5a.firebaseio.com",
  projectId: "lotem-43a5a",
  storageBucket: "lotem-43a5a.appspot.com",
  messagingSenderId: "106368346893",
  appId: "1:106368346893:web:aff99357e333bf71ad5e44"
};

  firebase.initializeApp(firebaseConfig)

  export default firebase