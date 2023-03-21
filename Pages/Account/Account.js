import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import React, {useState, useEffect} from 'react';

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

const Account = ({navigation, route}) => {
    console.log("account page rendered");
    const handleLogout = route.params.handleLogout;
    const uid = route.params.uid;
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
      
    useEffect(() => {
        console.log('fetch followers');
        console.log(uid);
        const fetchFollowers = async () => {
        try {
            const q = query(collection(db, 'users'), where('friends', 'array-contains', uid));
            const querySnapshot = await getDocs(q);
            const matchingUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFollowers(matchingUsers);
            console.log(matchingUsers);
        } catch (error) {
            console.error(error);
        }
        };
        const fetchFollowing = async () => {
            try {
                const friendsDoc = await getDoc(doc(db, 'users', uid));
                const friendsData = friendsDoc.data().friends;
                setFollowing(friendsData);
                console.log('Following useState:' + following);
            } catch (error) {
                console.error(error);
            }
        };        
    
        fetchFollowers();
        fetchFollowing();
    },[navigation, route]);

    const renderFollower = ({ item }) => (
        <View>
          <Text>{item.name}</Text>
        </View>
      );
      
      const renderFollowing = ({ item }) => (
        <View>
          <Text>{item.name}</Text>
        </View>
      );

    const handleSubmit = () => {
        console.log(handleLogout)
        handleLogout();
    };
    
    const handleUnfollow = async (friendUid, currentUserUid) => {
        try {
          const currentUserRef = doc(db, 'users', currentUserUid);
          const currentUserDoc = await getDoc(currentUserRef);
          const currentUserData = currentUserDoc.data();
      
          const friendsArray = currentUserData.friends;
          console.log('friend wanted to be removed: ' + friendUid)
          // find the index of the friend to be removed
          const index = friendsArray.findIndex(friend => friend === friendUid);
          console.log('index of friend:' + index)
      
          if (index != -1) {
            // remove the friend from the array
            currentUserData.friends.splice(index, 1);
                
            // update the friends array in Firestore database
            await updateDoc(currentUserRef, { friends: currentUserData.friends });
            console.log('Friend removed successfully!');
          }
          else {
            console.log('no friend found')
          }
        } catch (error) {
          console.error('Error removing friend:', error);
        }
      }

    return (
        <View>
            <Button title="Log Out" onPress={() => handleSubmit()} />
            <Text> Hello, {uid} </Text>
            <Text> Followers:</Text>
            {followers.map((follower) => (
                <View key={follower.id}>
                <Text>{follower.name}</Text>
                </View>
            ))}
            <Text> Following:</Text>
            {following.map((follow) => (
                <View key={follow}>
                <Text>{follow}</Text>
                <Button title="Unfollow" onPress={() => handleUnfollow(follow, uid)}></Button>
                </View>
            ))}
        </View>
    );

    // const styles = StyleSheet.create({
    //     container: {
    //       flex: 1,
    //       marginTop: 20,
    //       marginHorizontal: 16,
    //     },
    //     // header: {
    //     //   fontSize: 20,
    //     //   fontWeight: 'bold',
    //     //   marginBottom: 10,
    //     // },
    //     item: {
    //       backgroundColor: '#f9c2ff',
    //       padding: 20,
    //       marginVertical: 8,
    //       marginHorizontal: 16,
    //     },
    //     title: {
    //       fontSize: 16,
    //       fontWeight: 'bold',
    //     },
    //   });
};

export {Account};