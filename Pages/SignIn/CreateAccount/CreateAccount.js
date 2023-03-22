import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import firebase from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { auth } from '../../../App';

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://www.example.com/finishSignUp?cartId=1234',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'example.page.link'
};

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
      await setDoc(userRef, {
        email: email,
        password: password
      });

      //create empty pantry subcollection for user
      // const pantryRef = collection(userRef, 'pantry');
      // setDoc(doc(pantryRef, 'pantry'), {})
      // .then(() => {
      //   console.log('Empty subcollection created');
      // })
      // .catch((error) => {
      //   console.error('Error creating empty subcollection: ', error);
      // });

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
        <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
          <Text>Create Account</Text>
        </TouchableOpacity>
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
  button: {
      backgroundColor: '#CCCCCC',
      borderRadius: 8,
      padding: 10,
  },
});

export { CreateAccount };
