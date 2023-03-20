import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjsh6Mj0fxTwcd5rwbk11ow3UATgpwrw8",
  authDomain: "pantry4you-bf048.firebaseapp.com",
  projectId: "pantry4you-bf048",
  storageBucket: "pantry4you-bf048.appspot.com",
  messagingSenderId: "951653716590",
  appId: "1:951653716590:web:a5c9df4baaf8b9fef2cc7f",
  measurementId: "G-MV5KGDBTTJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const Search = ({navigation, route}) => {
  const uid = route.params.uid;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  function handleSearch() {
    // Make sure search query is not empty or invalid
    if (!searchQuery || !/\S+@\S+\.\S+/.test(searchQuery)) {
      setSearchResults([]);
      return;
    }

    // Query Firestore for users with matching emails
    const q = query(collection(db, 'users'), where('email', '==', searchQuery.toLowerCase()));
    getDocs(q)
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const matchingUsers = [];
          querySnapshot.forEach(doc => {
            const userData = doc.data();
            matchingUsers.push({
              id: doc.id,
              email: userData.email
            });
          });
          setSearchResults(matchingUsers);
        } else {
          setSearchResults([]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleAddFriend(friendEmail) {
    const userRef = doc(db, 'users', uid);
    const friendRef = collection(db, 'users');
    const q = query(friendRef, where('email', '==', friendEmail.toLowerCase()));
    getDocs(q)
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const friendDoc = querySnapshot.docs[0];
          const friendUID = friendDoc.id;
  
          // Retrieve the existing friends array, add the new friend UID, and update the document
          getDoc(userRef)
            .then((userDoc) => {
              const userData = userDoc.data();
              const friends = userData.friends || [];
              if (!friends.includes(friendUID)) {
                friends.push(friendUID);
                updateDoc(userRef, { friends });
              } else {
                console.log('Friend is already added.');
              }
            });
        } else {
          console.log('No matching user found.');
        }
      })
      .then(() => {
        console.log('Friend added successfully.');
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  
  
  
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for Friends</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter friend's email"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Text style={styles.searchButton}>Search</Text>
      </TouchableOpacity>
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          {searchResults.map((user, index) => (
            <View key={index} style={styles.result}>
              <View style={styles.resultEmailContainer}>
                <Text style={styles.resultEmail}>{user.email}</Text>
              </View>
              <TouchableOpacity onPress={() => handleAddFriend(user.email)} style={styles.resultButton}>
                <Text style={styles.resultButtonText}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noResults}>{!searchQuery ? 'Please provide a valid email' : 'Sorry, there are no users with that email'}</Text>
      )}
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
  resultsContainer: {
    marginTop: 24,
    width: '80%',
  },
  result: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  resultText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noResults: {
    marginTop: 24,
    color: 'gray',
  },
});


export { Search };





