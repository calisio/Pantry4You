// Import the functions you need from the SDKs you need
//import { firebase } from '@react-native-firebase/database';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { getAnalytics } from "firebase/analytics";
//import { initializeApp } from "firebase/app";
//import 'firebase/auth';
//import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Account } from './Pages/Account/Account';
import { Home } from './Pages/Home/Home';
import { Pantry } from './Pages/Pantry/Pantry';
import { Search } from './Pages/Search/Search';
//import firebase from "firebase/app";
//import "firebase/firestore";
import * as React from 'react';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCjsh6Mj0fxTwcd5rwbk11ow3UATgpwrw8",
//   authDomain: "pantry4you-bf048.firebaseapp.com",
//   projectId: "pantry4you-bf048",
//   storageBucket: "pantry4you-bf048.appspot.com",
//   messagingSenderId: "951653716590",
//   appId: "1:951653716590:web:a5c9df4baaf8b9fef2cc7f",
//   measurementId: "G-MV5KGDBTTJ"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

//export const db = firebase.firestore();

function Pages() {
  return (
    //If not logged in, show login screen
    /*
    *
    * TO DO
    *
    */


    //If logged in, show app
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
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

