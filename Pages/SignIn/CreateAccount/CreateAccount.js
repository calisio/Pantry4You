import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import firebase from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Button } from 'native-base';
import { auth } from '../../../App';
import { setLocation } from '../../../utils/setLocation';


function CreateAccount({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onUidChange = route.params.onUidChange;

  async function handleCreateAccount() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      //add user to db
      const emailLower = email.toLowerCase()
      console.log(emailLower);
      await setDoc(userRef, {
        email: emailLower,
        password: password
      });
      setLocation()
      .then(() => console.log("location set in create account"))
      .catch(error => console.log("error setting location in create account: \n", error));

      //create empty pantry subcollection for user
      // const pantryRef = collection(userRef, 'pantry');
      // setDoc(doc(pantryRef, 'pantry'), {})
      // .then(() => {
      //   console.log('Empty subcollection created');
      // })
      // .catch((error) => {
      //   console.error('Error creating empty subcollection: ', error);
      // });
      //create empty notifications subcollection for user
      const notificationsRef = collection(userRef, 'notifications');
      const friendRequestsDoc = doc(notificationsRef, 'friendRequests');
      const pantryRequestsDoc = doc(notificationsRef, 'pantryRequests');

      // Create documents for friend requests and pantry requests
      setDoc(friendRequestsDoc, {})
        .then(() => {
          console.log('Empty friend requests document created');
        })
        .catch((error) => {
          console.error('Error creating empty friend requests document: ', error);
        });

      setDoc(pantryRequestsDoc, {})
        .then(() => {
          console.log('Empty pantry requests document created');
        })
        .catch((error) => {
          console.error('Error creating empty pantry requests document: ', error);
        });

      onUidChange(user.uid, email, password);
      console.log("User added to authentication and users collection");
      Alert.alert('Account created', 'Your account has been created successfully', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(error);
      console.log(errorMessage)
      if (errorMessage == 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
        Alert.alert('Unsuccessful Creation of Account', 'Your passord must be at least 6 characters long. Please try again.', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
      else {
        Alert.alert('Unsuccessful Creation of Account', 'Your attempt to create an account was unsuccessful. Please try again.', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.text}> You must have a password longer than 6 characters.</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <Button csize='xs'color="#e57507" onPress={handleCreateAccount}>Create Account</Button>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
  },
  input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
  },
  text: {
      fontSize: 15,
      marginBottom: 15,
  },
});

export { CreateAccount };
