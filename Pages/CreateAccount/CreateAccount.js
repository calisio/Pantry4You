import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../App'

function CreateAccount({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleCreateAccount() {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} >Create Account</Text>
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
      <TouchableOpacity onPress={handleCreateAccount}>
        <Text>Create Account</Text>
      </TouchableOpacity>
    </View>
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
  });

export { CreateAccount };