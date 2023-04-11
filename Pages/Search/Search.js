import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { Button, Input } from 'native-base';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDistance } from '../../utils/getDistance';

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
  const currentUserPhoneNumber = route.params.phoneNumber;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const [isHandlingRequest, setIsHandlingRequest] = useState(false);

  console.log(route.params)

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
              email: userData.email,
              phoneNumber: userData.phoneNumber
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

  useEffect(() => {
    console.log('inside use effect')
    // check if you've already requested that friend
    searchResults.forEach(user => {
      let notificationsCollection = "users/" + user.uid + "/notifications";
      const q = query(
        collection(db, notificationsCollection),
        where('requestType', '==', 'friend'),
        where('userUID', '==', currentUserUID)
      );
      getDocs(q)
        .then((querySnapshot) => {
          if (querySnapshot.size != 0) {
            querySnapshot.forEach((doc) => {
              console.log("doc")
              if (doc.exists) {
                setRequestSent(true);
              }
            });
          } else {
            setRequestSent(false);
          }
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    });
  }, [searchResults])


  function handleRequestFriend(friendEmail, friendUID) {
    console.log(requestSent)

    let documentString = "users/" + friendUID + "/notifications";
    console.log(documentString)
    let friendRequestsRef = db.collection(documentString);
  
    friendRequestsRef.add({
      requestType: 'friend',
      userUID: currentUserUID,
      userEmail: currentUserEmail,
      userPhoneNumber: currentUserPhoneNumber
    }).then(async function() {
      console.log("Frank food updated");
      setRequestSent(true);


      let userLat;
      let userLong;
      let friendLat;
      let friendLong;

      await db.collection('users').doc(currentUserUID).get()
      .then((doc) => {
          if(doc.exists){
            userLat = doc.data()['latitude'];
            userLong = doc.data()['longitude'];
            // console.log("long  " + doc);
          }
          else{
            console.log(" lat/long DNE");
          }
        }
      );

      await db.collection('users').doc(friendUID).get()
      .then((doc) => {
          if(doc.exists){
            friendLat = doc.data()['latitude'];
            friendLong = doc.data()['longitude'];
            // console.log("long  " + doc);
          }
          else{
            console.log(" lat/long DNE");
          }
        }
      );

      let distance = await getDistance(userLat, userLong, friendLat, friendLong);
      distance = distance.toFixed(5);

      let alertString = friendEmail + " is approximately " + distance + " km away from you";
      Alert.alert(alertString);
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
  }
  

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      <Text style={styles.title}>Search for Friends</Text>
      <Input size='md' w="80%" py="0" InputRightElement={<Button size="lg" rounded="none" w="1/6" h="full" onPress={() => {handleSearch()}}>
          <MaterialCommunityIcons name="magnify" color="white"/>
          </Button>} placeholder="Enter friend's email" value={searchQuery} onChangeText={text => setSearchQuery(text)}/>
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          {searchResults.map((user, index) => (
            <View key={index} style={styles.result}>
              <View style={styles.resultEmailContainer}>
                <Text style={styles.resultEmail}>{user.email}</Text>
              </View>
              <Button onPress={() => {requestSent ? handleRemoveRequest(user.email, user.uid) : handleRequestFriend(user.email, user.uid)}}>
                {requestSent ? 'Request Sent' : 'Request'}
              </Button>
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
  resultsContainer: {
    marginTop: 24,
    width: '80%',
  },
  result: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 7,
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





