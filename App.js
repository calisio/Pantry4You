// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, RecaptchaVerifier } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Login } from './Pages/SignIn/Login/Login';
import { CreateAccount } from './Pages/SignIn/CreateAccount/CreateAccount';
import { Account } from './Pages/Account/Account';
import { Home } from './Pages/Home/Home';
import { Pantry } from './Pages/Pantry/Pantry';
import { Search } from './Pages/Search/Search';
import { Notifications } from './Pages/Notifications/Notifications';
import { Add } from './Pages/Add/Add';
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import { Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme } from "native-base";
// import * as Location from "expo-location"
import { setLocation } from "./utils/setLocation";
import { db } from './firebase';

console.disableYellowBox = true;
console.error = () => { };


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

//theme for app

const theme = extendTheme({
  colors: {
    primary: {
      50: '#fff1dd',
      100: '#ffd9b0',
      200: '#ffc080',
      300: '#fea64e',
      400: '#fe8e1f',
      500: '#e57507',
      600: '#b25a02',
      700: '#804000',
      800: '#4e2600',
      900: '#1e0b00',
    },
    secondary: {
      50: '#def3ff',
      100: '#b0d9ff',
      200: '#80c0ff',
      300: '#50a6fe',
      400: '#268dfc',
      500: '#1374e4',
      600: '#085ab2',
      700: '#004080',
      800: '#00274f',
      900: '#000e1f',
    },
  },
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
//   'size': 'invisible',
//   'callback': (response) => {
//     // reCAPTCHA solved, allow signInWithPhoneNumber.
//     onSignInSubmit();
//   }
// }, auth);
// export const appVerifier = window.recaptchaVerifier;


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Pages({ isAuthenticated, setIsAuthenticated }) {
  console.log("PAGES RENDERED");
  const theme = useTheme();
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  //callbacks for child components
  function handleUidChange(uid, email, password) {
    setUid(uid);
    setEmail(email);
    AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));
  };

  //check if uid is stored on pages load
  useEffect(() => {
    AsyncStorage.getItem('userCredentials').then(credentials => {
      //if user credentials are stored, use them to sign in
      if (credentials) {
        // Sign in the user with the stored credentials
        const { email, password } = JSON.parse(credentials);
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log('User signed in automatically');
            setUid(userCredential.user.uid);
            setEmail(email);
            setIsAuthenticated(true)
          })
          .catch(error => console.log('Error signing in:', error));
      }
    });

    // (async () => {
    //   let {status} = await Location.requestForegroundPermissionsAsync()
    //   .catch((error) => {
    //     console.log("Error getting location");
    //   });
    //   // console.log("status: ",status);

    //   if(status == 'granted'){
    //     console.log("location permission granted");
    //     const loc = await Location.getCurrentPositionAsync();
    //     setLatitude(loc.coords.latitude);
    //     setLongitude(loc.coords.longitude);
    //     console.log("location: \n",loc.coords);
    //   }
    //   else{
    //     console.log("location permission not granted");
    //   }
    // })();
  });

  // call getPhoneNumber every time uid or phoneNumber changes
  useEffect(() => {
    if (uid) {
      console.log('getting phone number');
      getPhoneNumber(uid);
    }
  }, [uid]);

  //login handler
  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(userCredential)
        const { email } = user;
        setUid(user.uid);
        setEmail(email);
        setIsAuthenticated(true);
        console.log("user signed in manually");
        setLocation()
          .then(() => console.log("location set in handleLogin"))
          .catch(error => console.log("error setting location in handleLogin: \n", error));
        //Store user credentials in storage for reload
        AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }))
          .then(() => console.log('User credentials stored'))
          .catch(error => console.log('Error storing credentials:', error));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Invalid Login', 'The username or password you have entered is incorrect. Please try again.', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      });
  };


  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      AsyncStorage.clear();
      setUid('');
      setEmail('');
      setIsAuthenticated(false);
    }).catch((error) => {
      // An error happened.
    });
  }

  // attach phoneNumber to pass to children
  function getPhoneNumber(uid) {
    console.log('called')
    const currentUserRef = db.collection('users').doc(uid);
    currentUserRef.get().then((doc) => {
      if (doc.exists) {
        const phoneNumb = doc.data().phoneNumber;
        setPhoneNumber(phoneNumb)
      } else {
        console.log('User document not found');
      }
    }).catch((error) => {
      console.log('Error getting user document:', error);
    });
  }

  if (!isAuthenticated) {
    return (

      //<View>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
          initialParams={{ handleLogin: handleLogin }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{ title: 'Create Account' }}
          initialParams={{ onUidChange: handleUidChange }}
        />
      </Stack.Navigator>
      //</View>

    )
  }
  else {
    return (
      <Tab.Navigator
        activeTintColor="red"
      >
        <Tab.Screen
          name="Home"
          component={Home}
          initialParams={{ uid: uid }}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} color="#e57507" size={size} />
            ),
          }}
          uid={uid}
        />
        <Tab.Screen
          name="Pantry"
          component={Pantry}
          initialParams={{ uid: uid }}
          options={{
            tabBarLabel: 'Pantry',
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons name={focused ? 'food-apple' : 'food-apple-outline'} color="#e57507" size={size} />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Add"
          component={Add}
          initialParams={{uid:uid}}
          options={{
            //tabBarLabel: 'Add',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="hamburger-plus" color={color} size={size} />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Search"
          component={Search}
          initialParams={{ uid: uid, email: email, phoneNumber: phoneNumber }}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ theme, size, focused }) => (
              <MaterialCommunityIcons name={focused ? 'account-search' : 'account-search-outline'} color="#e57507" size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          initialParams={{ uid: uid, email: email, phoneNumber: phoneNumber }}
          options={{
            tabBarLabel: 'Notifications',
            tabBarIcon: ({ theme, size, focused }) => (
              <MaterialCommunityIcons name={focused ? 'bell' : 'bell-outline'} color="#e57507" size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ theme, size, focused }) => (
              <MaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} color="#e57507" size={size} />
            ),
          }}
          initialParams={{
            handleLogout: handleLogout,
            uid: uid,
            email: email,
            // pass the function here
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default function App() {
  console.log("APP LOAD");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Pages
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
