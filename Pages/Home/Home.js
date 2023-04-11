import { FlatList, View, Image, PanResponder } from 'react-native';
import GetRecipes from './GetRecipes';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, HStack, Center, AspectRatio, Skeleton, VStack, Pressable, Modal, Flex, Divider, Button, Text, Link } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { addDoc, deleteDoc, doc, getDocs, query, where, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


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

  const [favoriteRecipesIds, setFavoriteRecipesIds] = useState(new Set());
  const lastFavoriteRecipes = useRef([]);


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
      const favoritesCollection = collection(db, "favorites");
      const q = query(favoritesCollection, where("userId", "==", uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const favorites = [];
        querySnapshot.forEach((doc) => {
          favorites.push({ ...doc.data(), id: doc.id });
        });
        setFavoriteRecipes(favorites);
      });

      // Clean up the listener when the component is unmounted
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching favorite recipes: ", error);
    }
  };




  //function used to get recipes
  async function fetchRecipes() {
    let recipesObjs = await GetRecipes(uid, recipeCount);
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
      // Only fetch favorite recipes if the favoriteRecipes array has changed
      if (lastFavoriteRecipes.current !== favoriteRecipes) {
        fetchFavoriteRecipes();
        lastFavoriteRecipes.current = favoriteRecipes;
      }
      fetchRecipes();
      return () => { };
    }, []) // Remove favoriteRecipes from the dependency array
  );


  //on refresh, get recieps
  const handleRefresh = async () => {
    console.log("REFRESH");
    setIsRefreshing(true);
    //setIsLoading(true);
    await fetchRecipes();
    fetchFavoriteRecipes();
    //setIsLoading(false);
    setIsRefreshing(false);
  };

  const RecipeView = ({ item }) => {
    // Check if the current recipe (item) is in the user's favorite recipes
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
        >
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image source={{
                uri: item.imgUrl
              }} alt="image" />
            </AspectRatio>
            {item.missedCount > 0 && (
              <Center bg="rgba(255, 255, 255, 0.4)"
                _text={{
                  color: "red.600",
                  fontWeight: "700",
                  fontSize: "xs"
                }}
                position="absolute"
                bottom="0"
                right="0"
                px="3"
                py="1.5">
                {item.missedCount} missing
              </Center>
            )}
            {/* Show filled heart if the recipe is in the user's favorites, otherwise show heart outline */}
            <Center
              position="absolute"
              top="0"
              right="0"
              px="3"
              py="1.5">
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                color="#f44336"
                size={24}
                onPress={() => handleFavorite(item)}
              />
            </Center>
          </Box>
          <Heading>{item.title}</Heading>
        </Box>
      </Pressable >
    );
  };



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
                                    <Text key={i} fontSize="sm" ml={4} color={color}>{friend.email} ({friend.amount} {friend.unit})</Text>
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
