import { StyleSheet, Text, View, Button, FlatList, Image, Linking, SafeAreaView, StatusBar } from 'react-native';
import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import React, {useState, useEffect} from 'react';
import { Pressable, Box, AspectRatio, Center, Heading, VStack } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


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
    const handleLogout = route.params.handleLogout;
    const uid = route.params.uid;
    const email = route.params.email;
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    // Create a new function to fetch favorite recipes
    async function fetchFavoriteRecipes() {
      try {
        const favoritesRef = collection(db, `users/${uid}/favorites`);
        const favoritesSnapshot = await getDocs(favoritesRef);
        const favorites = favoritesSnapshot.docs.map(doc => doc.data());
        setFavoriteRecipes(favorites);
        return favorites;
      } catch (error) {
        console.log(error);
      }
    }
    

  const handleFavorite = async (recipe) => {
    try {
      const favoritesRef = collection(db, `users/${uid}/favorites`);
      const favoritesSnapshot = await getDocs(favoritesRef);
      const existingDoc = favoritesSnapshot.docs.find(doc => doc.data().recipeId === recipe.recipeId);

      if (existingDoc) {
        await deleteDoc(doc(db, `users/${uid}/favorites`, existingDoc.id));
        Alert.alert("Recipe removed from favorites");
        console.log('Recipe removed from favorites');
        setFavoriteRecipes(favoriteRecipes.filter(fav => fav.recipeId !== recipe.recipeId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoriteRecipes();
      return () => {};
    }, [favoriteRecipes])
  );
  
      
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
                // const friendsData = friendsDoc.data().friends;
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
  

  const RecipeView = ({ item }) => {
    return (
      <Pressable>
        <Box
          justifyContent='center'
          alignItems='center'
          maxW="80"
          rounded="lg"
          borderColor="coolGray.200"
          borderWidth="1"
        >
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image source={{
                uri: item.imgUrl
              }} alt="image" />
            </AspectRatio>
            <Center
              position="absolute"
              top="0"
              right="0"
              px="3"
              py="1.5">
              <MaterialCommunityIcons
  name='heart'
  color="#f44336"
  size={24}
  onPress={async () => {
    await handleFavorite(item);
    fetchFavoriteRecipes();
  }}
/>

            </Center>
          </Box>
          <Heading>{item.title}</Heading>
        </Box>
      </Pressable>
    );
  };

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
        <VStack justifyContent="center" alignItems="center" h="full">
    <Heading>Favorite Recipes</Heading>
    {favoriteRecipes.length === 0 ? (
      <Center>
        <Text mt="4">No favorite recipes found.</Text>
      </Center>
    ) : (
      <FlatList
        data={favoriteRecipes}
        renderItem={RecipeView}
        keyExtractor={(item) => item.recipeId}
        contentContainerStyle={{ padding: 10 }}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
        showsVerticalScrollIndicator={false}
      />
    )}
  </VStack>
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
