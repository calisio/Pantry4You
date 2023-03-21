import {Text, FlatList, SafeAreaView, View, Image, Linking, StyleSheet, StatusBar,} from 'react-native';
import GetRecipes from './GetRecipes';
import React, {useState, useEffect} from 'react';
//import { useTheme } from '@mui/material/styles';
//import Box from '@mui/material/Box';
import { Box, Spinner, Heading, HStack, Center, AspectRatio, Skeleton, VStack, Pressable } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { addDoc, deleteDoc, doc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Alert } from 'react-native';

const Home = ({navigation, route}) => {
  console.log("HOME RENDERED");
  //const theme = useTheme();
  const uid = route.params.uid;
  const [recipeList, setRecipeList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const handleFavorite = async (recipeId) => {
    try {
      // Ensure recipeId is a string
      const recipeIdString = String(recipeId);
  
      // Check if the "favorites" subcollection exists
      const favoritesRef = collection(db, `users/${uid}/favorites`);
      const favoritesSnapshot = await getDocs(favoritesRef);
      const recipeExists = favoritesSnapshot.docs.some(doc => String(doc.data().recipeId) === recipeIdString);
  
      // If the recipe is not already in the "favorites" subcollection, add it
      if (!recipeExists) {
        // Get the recipe details
        const recipe = await fetch('https://api.spoonacular.com/recipes/' + recipeIdString + '/information?includeNutrition=false', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '2b747b3902c148758955f81fcac5bb4f',
          },
        });
        const data = await recipe.json();
        const recipeObj = {
          title: data['title'],
          imgUrl: data['image'],
          recipeUrl: data['sourceUrl'],
          recipeId: data['id'],
        };
  
        // Add the recipe to the "favorites" subcollection
        await addDoc(favoritesRef, recipeObj);
        console.log('Recipe added to favorites');
      } else {
        console.log('Recipe already in favorites');
        Alert.alert('Error', 'This recipe is already in your favorites.');
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  //function used to get recipes
  async function fetchRecipes() {
    let recipesObjs = await GetRecipes(uid);
    for (let i = 0; i < recipesObjs.length; i++) {
      try {
        // Ensure recipeId is a string
        const recipeIdString = String(recipesObjs[i]['recipeId']);
        const recipe = await fetch('https://api.spoonacular.com/recipes/' + recipeIdString + '/information?includeNutrition=false', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '2b747b3902c148758955f81fcac5bb4f',
          },
        });
        const data = await recipe.json();
        recipesObjs[i]['recipeUrl']=data['sourceUrl'];
      } catch (error) {
        console.log(error);
      }
    }
    setRecipeList(recipesObjs);
    setIsLoading(false);
  }
  

  //on load, get recipes
  useEffect(() => {
    fetchRecipes();
  }, []);

  //on refresh, get recieps
  const handleRefresh = async () => {
    console.log("REFRESH");
    setIsRefreshing(true);
    //setIsLoading(true);
    await fetchRecipes();
    //setIsLoading(false);
    setIsRefreshing(false);
  };

  const RecipeView = ({item}) => (
    <Pressable onPress={() => console.log("I'm Pressed")}>
    <Box
      justifyContent= 'center'
      alignItems= 'center'
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
        <Center 
        position="absolute" 
        top="0" 
        right="0"
        px="3" 
        py="1.5">
          <MaterialCommunityIcons
            name="heart-outline"
            color="#f44336"
            size={24}
            onPress={() => handleFavorite(item.recipeId)}
          />
        </Center>
      </Box>
      <Heading>{item.title}</Heading>
    </Box>
    </Pressable>
  );


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
        <Box padding="5" >
          <FlatList
            data={recipeList}
            renderItem={RecipeView}
            keyExtractor={(item) => item.recipeId}
            ListHeaderComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 10 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
          />
        </Box>
      )}
      </HStack>
  );
};

export {Home};