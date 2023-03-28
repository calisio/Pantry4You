import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCjsh6Mj0fxTwcd5rwbk11ow3UATgpwrw8",
  authDomain: "pantry4you-bf048.firebaseapp.com",
  projectId: "pantry4you-bf048",
  storageBucket: "pantry4you-bf048.appspot.com",
  messagingSenderId: "951653716590",
  appId: "1:951653716590:web:a5c9df4baaf8b9fef2cc7f",
  measurementId: "G-MV5KGDBTTJ"
};

// const app = initializeApp(firebaseConfig);


const Search = ({navigation, route}) => {
  const currentUserUID = route.params.uid;
  const currentUserEmail = route.params.email;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const [isHandlingRequest, setIsHandlingRequest] = useState(false);

  function handleSearch() {
    console.log(searchQuery)
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
              uid: doc.id,
              email: userData.email
            });
          });
          console.log(matchingUsers);
          setSearchResults(matchingUsers);
        } else {
          setSearchResults([]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // function handleAddFriend(friendEmail) {
  //   const userRef = doc(db, 'users', uid);
  //   const friendRef = collection(db, 'users');
  //   const q = query(friendRef, where('email', '==', friendEmail.toLowerCase()));
  //   getDocs(q)
  //     .then(querySnapshot => {
  //       if (!querySnapshot.empty) {
  //         const friendDoc = querySnapshot.docs[0];
  //         const friendUID = friendDoc.id;
  
  //         // Retrieve the existing friends array, add the new friend UID, and update the document
  //         getDoc(userRef)
  //           .then((userDoc) => {
  //             const userData = userDoc.data();
  //             const friends = userData.friends || [];
  //             const friendData = { friendUID: friendUID, friendEmail: friendEmail };
  //             if (!friends.some(f => f.friendUID === friendUID)) {
  //               friends.push(friendData);
  //               updateDoc(userRef, { friends });
  //             } else {
  //               console.log('Friend is already added.');
  //             }
  //           });
  //       } else {
  //         console.log('No matching user found.');
  //       }
  //     })
  //     .then(() => {
  //       console.log('Friend added successfully.');
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }

  function handleRequestFriend(friendEmail, friendUID) {
    console.log(requestSent)

    let documentString = "users/" + friendUID + "/notifications";
    console.log(documentString)
    let friendRequestsRef = db.collection(documentString);
  
    friendRequestsRef.add({
      requestType: 'friend',
      userUID: currentUserUID,
      userEmail: currentUserEmail
    }).then(function() {
      console.log("Frank food updated");
      setRequestSent(true);
    });
  }
  

  function handleRemoveRequest(friendEmail, friendUID) {
    // const userRef = doc(db, 'users', uid);
    // const friendUID = friendRequests[friendEmail];

    let notificationsCollection = "users/" + friendUID + "/notifications";
    const q = query(
      collection(db, notificationsCollection),
      where('requestType', '==', 'friend'),
      where('userUID', '==', currentUserUID)
    );

    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref)
            .then(() => {
              console.log("Document deleted");
              setRequestSent(false);
            })
            .catch((error) => {
              console.error("Error deleting document: ", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });

    // // Retrieve the existing friend requests object, remove the friend request, and update the document
    // getDoc(userRef)
    //   .then((userDoc) => {
    //     const userData = userDoc.data();
    //     const friendRequests = userData.friendRequests || {};
    //     if (friendRequests[friendEmail]) {
    //       delete friendRequests[friendEmail];
    //       updateDoc(userRef, { friendRequests });
    //       setRequestSent(false);
    //     } else {
    //       console.log('No matching friend request found.');
    //     }
    //   })
    //   .then(() => {
    //     console.log('Friend request removed successfully.');
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  }
  

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      <Text style={styles.title}>Search for Friends</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter friend's email"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <TouchableOpacity onPress={() => {handleSearch()}}>
        <Text style={styles.searchButton}>Search</Text>
      </TouchableOpacity>
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          {searchResults.map((user, index) => (
            <View key={index} style={styles.result}>
              <View style={styles.resultEmailContainer}>
                <Text style={styles.resultEmail}>{user.email}</Text>
              </View>
              <TouchableOpacity onPress={() => {requestSent ? handleRemoveRequest(user.email, user.uid) : handleRequestFriend(user.email, user.uid)}}>
                <Text style={styles.resultButtonText}>{requestSent ? 'Request Sent' : 'Request'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noResults}>{!searchQuery ? 'Please provide a valid email' : 'Sorry, there are no users with that email'}</Text>
      )}
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





