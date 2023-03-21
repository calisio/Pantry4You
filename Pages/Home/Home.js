import {Text, FlatList, SafeAreaView, View, Image, Linking, StyleSheet, StatusBar,} from 'react-native';
import GetRecipesIds from './GetRecipesIds';
import React, {useState, useEffect} from 'react';
//import { useTheme } from '@mui/material/styles';
//import Box from '@mui/material/Box';
import { Box, Spinner, Heading, HStack, Center, AspectRatio } from 'native-base';
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
    const recipesIds = await GetRecipesIds(uid);
    let recipeListTemp = [];
    for (let i = 0; i < recipesIds.length; i++) {
      try {
        // Ensure recipeId is a string
        const recipeIdString = String(recipesIds[i]);
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
        recipeListTemp.push(recipeObj);
      } catch (error) {
        console.log(error);
      }
    }
    setRecipeList(recipeListTemp);
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
    await fetchRecipes();
    setIsRefreshing(false);
  };

  const RecipeView = ({item}) => (
    <>
    <Box
      justifyContent= 'center'
      alignItems= 'center'
      maxW="80" 
      rounded="lg"
      borderColor="coolGray.200" 
      borderWidth="1"
    >
      <AspectRatio w="100%" ratio={16 / 9}>
        <Image source={{
          uri: item.imgUrl
        }} alt="image" />
      </AspectRatio>
      <Heading>{item.title}</Heading>
    </Box>
    {/*
    <Box
    sx={{
      //paddingLeft: 2,
      //paddingRight: 2,
      //width: '70%',
      //display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      //flexWrap: 'wrap'
    }}
    >
      <Paper elevation={2}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Image
            source={{ uri: item.imgUrl }}
            style={{ width: 'auto', height: 100 }}
          />
        </Grid>
        <Grid item xs={8}>
          <Stack spacing={2}>
            <Text>
              {item.title}
            </Text>
            <Text
              onPress={() => Linking.openURL(item.recipeUrl)}>
              {item.soureName}
            </Text>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Text>INGREDIENT LIST</Text>
        </Grid>
      </Grid>
      </Paper>
    </Box>


    <View style={styles.favoriteButton}>
        <MaterialCommunityIcons
          name="heart-outline"
          color="#f44336"
          size={24}
          onPress={() => handleFavorite(item.recipeId)}
        />
      </View>
  */}
  </>
  );


  return (
      <HStack justifyContent="center" alignItems="center" h="full">
      {isLoading ? (
        <Center>
          <Spinner size="lg" />
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