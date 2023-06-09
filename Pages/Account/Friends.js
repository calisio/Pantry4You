// import { StyleSheet, Text, View, FlatList, Image, Linking, SafeAreaView, StatusBar } from 'react-native';
// import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
// import { initializeApp } from "firebase/app";
// import React, { useState, useEffect } from 'react';
// import { Pressable, Box, AspectRatio, Center, Heading, VStack, Button } from 'native-base';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Alert } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { db } from '../../firebase';


// const firebaseConfig = {
//   apiKey: "AIzaSyCjsh6Mj0fxTwcd5rwbk11ow3UATgpwrw8",
//   authDomain: "pantry4you-bf048.firebaseapp.com",
//   projectId: "pantry4you-bf048",
//   storageBucket: "pantry4you-bf048.appspot.com",
//   messagingSenderId: "951653716590",
//   appId: "1:951653716590:web:a5c9df4baaf8b9fef2cc7f",
//   measurementId: "G-MV5KGDBTTJ"
// };
// const app = initializeApp(firebaseConfig);

// const Friends = ({ navigation, route }) => {
//   const handleLogout = route.params.handleLogout;
//   const uid = route.params.uid;
//   const email = route.params.email;
//   const [friends, setFriends] = useState([]);

//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const friendsDoc = await getDoc(doc(db, 'users', uid));
//         if (friendsDoc.data().friends) {
//           const friendsData = friendsDoc.data().friends;
//           const friendsArray = []
//           if (friendsData.length > 0) {
//             friendsData.forEach(element => {
//               console.log(element);
//               friendsArray.push(element);
//             });
//             setFriends(friendsArray);
//           }
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchFriends();
//   }, [navigation, route]);


//   const handleUnfriend = async (friendObject, currentUserUid) => {
//     try {
//       const currentUserRef = doc(db, 'users', currentUserUid);
//       const currentUserDoc = await getDoc(currentUserRef);
//       const currentUserData = currentUserDoc.data();

//       const friendsArray = currentUserData.friends;

//       // Find the index of the friend to be removed
//       const index = friendsArray.findIndex(friend => friend.friendEmail === friendObject.friendEmail);

//       if (index !== -1) {
//         // // Remove the friend from the array
//         currentUserData.friends.splice(index, 1);

//         // Update the friends array in Firestore database
//         await updateDoc(currentUserRef, { friends: currentUserData.friends });

//         console.log('Friend removed successfully!');
//         setFriends(friends.filter(friend => friend !== friendObject.friendUid));

//         // Retrieve the friend's data
//         const friendRef = doc(db, 'users', friendObject.friendUID);
//         const friendDoc = await getDoc(friendRef);
//         const friendData = friendDoc.data();

//         if (friendData) {
//           // Remove the current user from the friend's friends array
//           const friendIndex = friendData.friends.findIndex(friend => friend.friendEmail === currentUserData.email);
//           if (friendIndex !== -1) {
//             friendData.friends.splice(friendIndex, 1);
//             await updateDoc(friendRef, { friends: friendData.friends });
//           }
//         }
//       } else {
//         console.log('No friend found');
//       }
//     } catch (error) {
//       console.error('Error removing friend:', error);
//     }
//   }



//   return (
//     <View style={styles.container}>
//       <Text style={styles.subtitle}> Friends:</Text>
//       <FlatList
//         data={friends}
//         keyExtractor={(friend) => friend.friendEmail}
//         renderItem={({ item: friend }) => (
//           <View key={friend.friendEmail} style={styles.listItem}>
//             <Text style={styles.listText}>{friend.friendEmail}</Text>
//             <Button
//               onPress={() => handleUnfriend(friend, uid)}
//               style={styles.friendButton}
//               variant='outline'
//               size='xs'
//               color="#e57507"
//             >
//               Unfriend
//             </Button>
//           </View>
//         )}
//         ListEmptyComponent={<Text style={styles.noItems}>You are not friends with anyone.</Text>}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 50,
//     paddingHorizontal: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   listContainer: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//   },
//   logoutContainer: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
//   list: {
//     marginVertical: 10,
//   },
//   listItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   listText: {
//     fontSize: 16,
//   },
//   noItems: {
//     color: '#ccc',
//     fontStyle: 'italic',
//     textAlign: 'center',
//   },
//   recipeContainer: {
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginHorizontal: 16,
//   },
//   recipeTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   recipeImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   recipeInstructions: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
// });

// export { Account };
