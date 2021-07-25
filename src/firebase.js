import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

//cvrrchatrooms, first //chatrooms used because of oauth in this app problem using that just for chatapp-mern1 oauth usecase
const firebaseConfig = {
  apiKey: "AIzaSyB5OVZSCxu-1uOaaCJwuROR6wG0-KOSUIE",
  authDomain: "chatrooms-52089.firebaseapp.com",
  databaseURL: "https://chatrooms-52089.firebaseio.com",
  projectId: "chatrooms-52089",
  storageBucket: "chatrooms-52089.appspot.com",
  messagingSenderId: "667472268797",
  appId: "1:667472268797:web:1809dc3c7d970a08445d94",
  measurementId: "G-61X2808DHC"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider };
export default firebase;
