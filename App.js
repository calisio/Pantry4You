// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Login} from './Pages/SignIn/Login/Login';
import {CreateAccount} from './Pages/SignIn/CreateAccount/CreateAccount';
import {Account} from './Pages/Account/Account';
import { Home } from './Pages/Home/Home';
import { Pantry } from './Pages/Pantry/Pantry';
import { Search } from './Pages/Search/Search';
import {Add} from './Pages/Add/Add';
import React, {useState} from 'react';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import {Alert} from 'react-native';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
  apiKey: "AIzaSyCjsh6Mj0fxTwcd5rwbk11ow3UATgpwrw8",
  authDomain: "pantry4you-bf048.firebaseapp.com",
  projectId: "pantry4you-bf048",
  storageBucket: "pantry4you-bf048.appspot.com",
  messagingSenderId: "951653716590",
  appId: "1:951653716590:web:a5c9df4baaf8b9fef2cc7f",
  measurementId: "G-MV5KGDBTTJ"
};

// Initialize Firebase

 const app = initializeApp(firebaseConfig);
 let uid;
 const auth = getAuth();
 export const user = auth.currentUser;


//  onAuthStateChanged(auth, (user) => {
//   if(user){
//     uid = user.currentUser.uid
//     console.log(uid);
//   }
//   else{
//     uid = null;
//   }
//  })

// export const currUser = uid;

 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//const auth = getAuth();
//const user = auth.currentUser.uid;
console.log(auth.currentUser);
//console.log(user);


function Pages() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uid, setUid] = useState('');

  //check if uid is stored
  AsyncStorage.getItem('userCredentials').then(credentials => {
    //if user credentials are stored, use them to sign in
    if (credentials) {
      // Sign in the user with the stored credentials
      const { email, password } = JSON.parse(credentials);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('User signed in automatically');
          setUid(userCredential.user.uid);
          setIsAuthenticated(true);
        })
        .then()
        .catch(error => console.log('Error signing in:', error));
    }
  });

  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setIsAuthenticated(true);
      setUid(user.uid);
      console.log('user signed in');
      //Store user credentials in storage for reload
      const { email, password } = user;
      AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }))
      //AsyncStorage.setItem('uid', user.uid)
      .then(() => console.log('User credentials stored'))
      .catch(error => console.log('Error storing credentials:', error));
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('error');
      Alert.alert('Invalid Login', 'The username or password you have entered is incorrect. Please try again.', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    });
  };

  const handleLogout = () => {
    console.log('inside handle log out')
    signOut(auth).then(() => {
      // Sign-out successful.
      AsyncStorage.clear();
      setUid('');
      setIsAuthenticated(false);
    }).catch((error) => {
      // An error happened.
    });
  }

  if(!isAuthenticated){
    return (
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            // {...(props) => <Login {...props} handleLogin={handleLogin} />}
            options={{ title: 'Login' }}
            initialParams={{handleLogin: handleLogin}}
          />
          <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ title: 'Create Account' }} />
          <Stack.Screen name="Dashboard" component={CreateAccount} options={{ title: 'Create Account' }} />
        </Stack.Navigator>
    </View>
    )
  }
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        uid = {uid}
      />
      <Tab.Screen
        name="Pantry"
        component={Pantry}
        options={{
          tabBarLabel: 'Pantry',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food-apple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          //tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hamburger-plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        // {...(props) => <Account {...props} handleLogout={handleLogout} />}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
        initialParams={{handleLogout: handleLogout}}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    //<View style={styles.container}>
      <NavigationContainer>
        <Pages/>
      </NavigationContainer>
    //</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'center',
  },
});

