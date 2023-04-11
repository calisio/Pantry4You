import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import { Button, Icon, Colors } from 'native-base';
import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, getDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../firebase';


const Notifications = ({navigation, route}) => {
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const currentUserUID = route.params.uid;
  const currentUserEmail = route.params.email;
  const currentUserPhoneNumber = route.params.phoneNumber;

  useEffect(() => {
    const q = query(collection(db, `users/${currentUserUID}/notifications`), where("requestType", "==", "friend"));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedNotifications = [];
      const updatedFriendRequests = [];
  
      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        console.log(doc.data())
        const notification = {
          requestType: notificationData.requestType,
          requesterEmail: notificationData.userEmail,
          requesterUID: notificationData.userUID,
        };

        if (notificationData.requestType === "friend") {
          console.log('here')
          updatedFriendRequests.push(notification);
        } else {
          updatedNotifications.push(notification);
        }
      });
  
      setNotifications(updatedNotifications);
      setFriendRequests(updatedFriendRequests);
    });
    return unsubscribe; 
  }, []);

  useEffect(() => {
    console.log(friendRequests)
  }, [friendRequests])
  
  function handleAcceptFriendRequest(userRequestFrom) {
    // adding it to your own friend list
    const userRef = doc(db, 'users', currentUserUID);
    const friendRef = collection(db, 'users');
  
    // Update friends array for the current user
    const currentUserRef = db.collection('users').doc(currentUserUID);
  
    console.log(route.params)
    console.log(userRequestFrom)

    // const currentUserData = { friendUID: currentUserUID, friendEmail: currentUserEmail, friendPhoneNumber: currentUserPhoneNumber}
    // const friendData = { friendUID: userRequestFrom.requesterUID, friendEmail: userRequestFrom.requesterEmail, friendPhoneNumber: userRequestFrom.requesterPhoneNumber }
    
    // // Update friends array for the current user
    // const currentUserUpdate = currentUserRef.update({
    //   friends: arrayUnion(friendData)
    // });
    
    // // Update friends array for the friend user
    // const friendUserRef = db.collection('users').doc(userRequestFrom.requesterUID);
    // const friendUserUpdate = friendUserRef.update({
    //   friends: arrayUnion(currentUserData)
    // });
  
    // Promise.all([currentUserUpdate, friendUserUpdate])
    //   .then(() => {
    //     console.log("Both friend arrays updated successfully");
    //     // remove from notifications
    //     let notificationsCollection = "users/" + currentUserUID + "/notifications";
    //     const q = query(
    //       collection(db, notificationsCollection),
    //       where('requestType', '==', 'friend'),
    //       where('userUID', '==', userRequestFrom.requesterUID)
    //     );
  
    //     getDocs(q)
    //       .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //           deleteDoc(doc.ref)
    //             .then(() => {
    //               console.log("Notification document deleted");
    //             })
    //             .catch((error) => {
    //               console.error("Error deleting notification document: ", error);
    //             });
    //         });
    //       })
    //       .catch((error) => {
    //         console.error("Error getting notification documents: ", error);
    //       });
    //   })
    //   .catch((error) => {
    //     console.error("Error updating friend arrays: ", error);
    //   });
  }  

  return (
    <View style={styles.container}>
      {friendRequests.length > 0 && (
        <FlatList
          data={friendRequests}
          keyExtractor={(notification) => notification.notificationId}
          renderItem={({ item }) => (
            <View style={styles.notification} key={item.notificationId}>
              <Text fontSize="xs">{item.requesterEmail} sent you a friend request</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button.Group isAttached colorScheme="orange" mx={{
                  base: "auto",
                  md: 0
                }} size="sm">
                    <Button onPress={() => handleAcceptFriendRequest(item)}><MaterialCommunityIcons name="check-outline" color="white"/></Button>
                    <Button onPress={() => handleRejectFriendRequest(item)} variant="outline"><MaterialCommunityIcons name="close-thick" color="#e57507"/></Button>
                </Button.Group>
              </View>
            </View>
          )}
        />
      )}  
      {/* this should be used to update the requested items */}
      {/* {notifications.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={(notification) => notification.notificationId}
          renderItem={({ item }) => (
            <View style={styles.notification}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.body}</Text>
            </View>
          )}
        />
      )} */}
  
      {friendRequests.length === 0 && notifications.length === 0 && (
        <Text style={styles.noNotifications}>No notifications yet</Text>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  notification: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
  },
  noNotifications: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export { Notifications };
