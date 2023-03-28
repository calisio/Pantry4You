import { StyleSheet, Text, View, Button, FlatList, Image, Linking, SafeAreaView, StatusBar } from 'react-native';
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
    const email = route.params.email;
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
      
    useEffect(() => {
        console.log('fetch followers');
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
                if (friendsDoc.data().friends) {
                    const followingData = await Promise.all(friendsData.map(async friend => {
                        const friendDoc = await getDoc(doc(db, 'users', friend.friendUID));
                        return friendDoc.data().email;
                    }));
                    setFollowing(followingData);
                }
                console.log('Following useState:' + following);
            } catch (error) {
                console.error(error);
            }
        };        
        fetchFollowers();
        fetchFollowing();
    },[navigation, route]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesRef = collection(db, `users/${uid}/favorites`);
        const favoritesSnapshot = await getDocs(favoritesRef);
        const favoritesList = [];
        favoritesSnapshot.forEach((doc) => {
          favoritesList.push(doc.data());
        });
        setFavorites(favoritesList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavorites();
  }, []);

  const RecipeView = ({item}) => (
    <View style={styles.recipeContainer}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Image
        source={{ uri: item.imgUrl }}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeInstructions}
        onPress={() => Linking.openURL(item.recipeUrl)}>
        Instructions
      </Text>
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
          const index = friendsArray.findIndex(friend => friend.friendEmail === friendUid);
          console.log('index of friend:' + index)
      
          if (index != -1) {
            // remove the friend from the array
            currentUserData.friends.splice(index, 1);
                
            // update the friends array in Firestore database
            await updateDoc(currentUserRef, { friends: currentUserData.friends });
            console.log('Friend removed successfully!');
            setFollowing(following.filter(friend => friend !== friendUid));
          }
          else {
            console.log('no friend found')
          }
        } catch (error) {
          console.error('Error removing friend:', error);
        }
      }

  return (
    <View style={styles.container}>
        <Button title="Log Out" onPress={() => handleSubmit()} />
        <Text style={styles.header}> Hello, {email} </Text>
        <Text style={styles.subtitle}> Followers:</Text>
        <View style={styles.list}>
            {followers.length > 0 ? (
            followers.map((follower) => (
                <View key={follower.id} style={styles.listItem}>
                <Text style={styles.listText}>{follower.name}</Text>
                </View>
            ))
            ) : (
            <Text style={styles.noItems}>You do not have any followers.</Text>
            )}
        </View>
        <Text style={styles.subtitle}> Following:</Text>
        <View style={styles.list}>
            {following.length > 0 ? (
            following.map((follow) => (
                <View key={follow} style={styles.listItem}>
                <Text style={styles.listText}>{follow}</Text>
                <Button title="Unfollow" onPress={() => handleUnfollow(follow, uid)} style={styles.followButton} />
                </View>
            ))
            ) : (
            <Text style={styles.noItems}>You are not following anyone.</Text>
            )}
        </View>
        <SafeAreaView style={styles.listContainer}>
            <FlatList
            data={favorites}
            renderItem={RecipeView}
            keyExtractor={(item) => item.recipeId}
            ListHeaderComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 10 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
        </SafeAreaView>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    listContainer: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    list: {
      marginVertical: 10,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    listText: {
      fontSize: 16,
    },
    followButton: {
      paddingHorizontal: 10,
    },
    noItems: {
      color: '#ccc',
      fontStyle: 'italic',
      textAlign: 'center',
    },
    recipeContainer: {
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginHorizontal: 16,
    },
    recipeTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    recipeImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
    },
    recipeInstructions: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
  });  

export {Account};
