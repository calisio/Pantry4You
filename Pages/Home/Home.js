import { FlatList, View, Image, PanResponder } from 'react-native';
import GetRecipes from './GetRecipes';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, HStack, Center, AspectRatio, Skeleton, VStack, Pressable, Modal, Flex, Divider, Button, Text, Link, Input } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { addDoc, deleteDoc, doc, getDocs, query, where, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from "expo-location"
import Communications from 'react-native-communications';
import { TextInput } from 'react-native-gesture-handler';


const Home = ({ navigation, route }) => {
  console.log("HOME RENDERED");
  //const theme = useTheme();
  const uid = route.params.uid;
  const [recipeList, setRecipeList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(10);
  const [recipeQuery, setRecipeQuery] = useState("");

  const [favoriteRecipesIds, setFavoriteRecipesIds] = useState(new Set());
  const lastFavoriteRecipes = useRef([]);

  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);


  const updateFavoriteRecipesIds = (recipeId, isFavorited) => {
    setFavoriteRecipesIds(prevState => {
      const newSet = new Set(prevState);
      if (isFavorited) {
        newSet.add(recipeId);
      } else {
        newSet.delete(recipeId);
      }
      return newSet;
    });
  };

  const handleFavorite = async (recipe) => {
    try {
      // Check if the "favorites" subcollection exists
      const favoritesRef = collection(db, `users/${uid}/favorites`);
      const favoritesSnapshot = await getDocs(favoritesRef);
      const existingDoc = favoritesSnapshot.docs.find(doc => doc.data().recipeId === recipe.recipeId);

      // If the recipe is not already in the "favorites" subcollection, add it
      if (!existingDoc) {
        // Add the recipe to the "favorites" subcollection
        await addDoc(favoritesRef, recipe);
        Alert.alert("Recipe added to favorites")
        console.log('Recipe added to favorites');
        fetchFavoriteRecipes();
        setFavoriteRecipes([...favoriteRecipes, recipe]); // Update the state to include the new favorite
        updateFavoriteRecipesIds(recipe.recipeId, true); // Update the favoriteRecipesIds state
      } else {
        // If the recipe is already in the "favorites" subcollection, remove it
        await deleteDoc(doc(db, `users/${uid}/favorites`, existingDoc.id));
        Alert.alert("Recipe removed from favorites")
        console.log('Recipe removed from favorites');
        setFavoriteRecipes(favoriteRecipes.filter(fav => fav.recipeId !== recipe.recipeId)); // Update the state to exclude the removed favorite
        updateFavoriteRecipesIds(recipe.recipeId, false); // Update the favoriteRecipesIds state
      }
    } catch (error) {
      console.log(error);
    }
  };



  // Create a new function to fetch favorite recipes
  const fetchFavoriteRecipes = async () => {
    try {
      const favoritesRef = collection(db, `users/${uid}/favorites`);
      const favoritesSnapshot = await getDocs(favoritesRef);
      const favorites = favoritesSnapshot.docs.map(doc => doc.data().recipeId);
      // Clear previous favorite recipes ids
      setFavoriteRecipesIds(new Set());
      // Add fetched favorite recipes ids
      favorites.forEach(recipeId => updateFavoriteRecipesIds(recipeId, true));
    } catch (error) {
      console.error("Error fetching favorite recipes: ", error);
    }
  };

  //function used to get recipes
  async function fetchRecipes() {
    let recipesObjs = await GetRecipes(uid, recipeCount, recipeQuery);
    setRecipeList(recipesObjs);
    setIsLoading(false);
  }

  async function handlePress(recipeObj) {
    setSelectedRecipe(recipeObj);
    setShowModal(true);
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const { dy } = gestureState;
      const step = 1;
      const newValue = recipeCount + (dy > 0 ? step : -step);
      setRecipeCount(Math.max(0, Math.min(newValue, 100)));
    },
  });

  //on load, get recipes
  useFocusEffect(
    React.useCallback(() => {
      fetchFavoriteRecipes();
      fetchRecipes();
      return () => { };
    }, [])
  );

  //on refresh, get recieps
  const handleRefresh = async () => {
    console.log("REFRESH");
    setIsRefreshing(true);
    await fetchRecipes();
    fetchFavoriteRecipes();
    setIsRefreshing(false);
  };

  const RecipeView = ({ item }) => {
    const isFavorite = favoriteRecipesIds.has(item.recipeId);

    return (
      <Pressable onPress={() => handlePress(item)}>
        <Box
          justifyContent='center'
          alignItems='center'
          maxW="80"
          rounded="lg"
          borderColor="coolGray.200"
          borderWidth="1"
          backgroundColor="white"
          shadow={2}
          p={2}
        >
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image source={{
                uri: item.imgUrl
              }} alt="image" />
            </AspectRatio>
            {item.missedCount > 0 && (
              <Center bg="rgba(255, 255, 255, 1)"
                _text={{
                  color: "red.600",
                  fontWeight: "700",
                  fontSize: "xs"
                }}
                position="absolute"
                bottom="1"
                right="1"
                px="3"
                py="1.5">
                {item.missedCount} missing
              </Center>
            )}
            <Center
              position="absolute"
              top="0"
              right="0"
              px="3"
              py="1.5">
              <MaterialCommunityIcons
                name="heart"
                color={isFavorite ? "#f44336" : "white"}
                size={35}
                onPress={() => handleFavorite(item)}
                style={{ position: 'absolute' }}
              />
              <MaterialCommunityIcons
                name="heart-outline"
                color="#f44336"
                size={35}
                onPress={() => handleFavorite(item)}
              />
            </Center>
          </Box>
          <Heading>{item.title}</Heading>
        </Box>
      </Pressable >
    );
  };


  //send a text to request an item
  function sendText(friend, itemName) {
    Communications.text(friend.phoneNumber, 'Hi! I was wondering if I could borrow ' + itemName + ' from you for a recipe I am making?')
  }


  return (
    <HStack justifyContent="center" alignItems="center" h="full">
      {isLoading ? (
        <Center w="100%">
          <VStack w="90%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
            borderColor: "coolGray.500"
          }} _light={{
            borderColor: "coolGray.200"
          }}>
            <Skeleton h="40" />
            <Skeleton.Text px="4" />
            <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
          </VStack>
        </Center>
      ) : (
        <Center>
          <View {...panResponder.panHandlers}>
            <Flex direction="row" alignItems="center">
              <Text fontSize="lg"># Recipes: {recipeCount}</Text>
              <Image source={require('../../assets/drag.png')} style={{ width: 24, height: 24, marginRight: 5, marginLeft: 5 }} />
            </Flex>
          </View>
          <View>
          <Flex direction="row" alignItems="center">
              <Input size='lg' w="95%" py="0" InputRightElement={<Button size="lg" rounded="none" w="1/6" h="full" onPress={() => {fetchRecipes()}}>
                <MaterialCommunityIcons name="magnify" color="white"/>
              </Button>} placeholder="Search for recipes by keyword" value={recipeQuery} onChangeText={text => setRecipeQuery(text)}/>
            </Flex>
          </View>
          <FlatList
            data={recipeList}
            renderItem={RecipeView}
            keyExtractor={(item) => item.recipeId}
            ListHeaderComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 10 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            showsVerticalScrollIndicator={false}
          />
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} size='full'>
            <Modal.Content>
              <Modal.CloseButton />
              {selectedRecipe && (
                <>
                  <Modal.Header>
                    <Heading size="md">{selectedRecipe.title}</Heading>
                    <Link href={selectedRecipe.recipeUrl}>Instructions</Link>
                  </Modal.Header>
                  <Modal.Body>
                    <VStack space={4}>
                      <Flex mx="3" direction="row" justify="space-evenly">
                        <Box flex={1}>
                          <Center>
                            <Heading size='xs' color='green.500'>Used</Heading>
                          </Center>
                          <View>
                            {selectedRecipe.used.map((item, index) => (
                              <Text key={index} fontSize="md">{'\u2022'} {item.name} ({item.amount} {item.unit})</Text>
                            ))}
                          </View>
                        </Box>
                        <Divider orientation="vertical" mx="3" _light={{
                          bg: "muted.800"
                        }} _dark={{
                          bg: "muted.50"
                        }} />
                        <Box flex={1}>
                          <Center>
                            <Heading size='xs' color='red.500'>Missing</Heading>
                          </Center>
                          <View>
                            {selectedRecipe.missed.map((item, index) => (
                              <React.Fragment key={index}>
                                <Text fontSize="md">{'\u2022'} {item.ingredient.name} ({item.ingredient.amount} {item.ingredient.unit})</Text>
                                {item.friendsWithIngredient.map((friend, i) => {
                                  const color = friend.amount >= item.ingredient.amount ? 'green.500' : 'black.500';
                                  return (
                                    <>
                                      <Text key={i} fontSize="sm" ml={4} color={color}>{friend.email} ({friend.amount} {friend.unit})</Text>
                                      <Button onPress={() => { sendText(friend, item.name) }}>Request</Button>
                                    </>
                                  )
                                }
                                )}
                              </React.Fragment>
                            ))}
                          </View>
                        </Box>
                      </Flex>
                    </VStack>
                  </Modal.Body>
                </>
              )}
            </Modal.Content>
          </Modal>
        </Center>
      )}
    </HStack>
  );
};

export { Home };
