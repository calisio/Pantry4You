import { StyleSheet, Text, View, FlatList, Image, Linking, SafeAreaView, StatusBar } from 'react-native';
import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from 'native-base';
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
    const [friends, setFriends] = useState([]);
      
    useEffect(() => {     
        const fetchFriends = async () => {
            try {
                const friendsDoc = await getDoc(doc(db, 'users', uid));
                const friendsData = friendsDoc.data().friends;
                console.log(friendsData)
                const friendsArray = []
                if (friendsData.length > 0) {
                  friendsData.forEach(element => {
                    console.log(element.friendEmail);
                    friendsArray.push(element.friendEmail);
                  });
                  setFriends(friendsArray);
                }
            } catch (error) {
                console.error(error);
            }
        };        
        fetchFriends();
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
    
    const handleUnfriend = async (friendUid, currentUserUid) => {
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
            setFriends(friends.filter(friend => friend !== friendUid));
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
        <View style={styles.logoutContainer}>
          <Button size='xs' onPress={() => handleSubmit()}>Log Out</Button>
        </View>
        <Text style={styles.header}> Hello, {email} </Text>
        <Text style={styles.subtitle}> Friends:</Text>
        <FlatList
          data={friends}
          keyExtractor={(friend) => friend}
          renderItem={({ item: friend }) => (
            <View key={friend} style={styles.listItem}>
              <Text style={styles.listText}>{friend}</Text>
              <Button
                onPress={() => handleUnfriend(friend, uid)}
                style={styles.friendButton}
                variant='outline'
                size='xs'
                color="#e57507"
              >
                Unfriend
              </Button>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noItems}>You are not friends with anyone.</Text>}
        />
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
    logoutContainer: {
      position: 'absolute',
      top: 10 ,
      right: 10,
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
