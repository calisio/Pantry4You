import {Text, FlatList, SafeAreaView, View, Image, Linking, StyleSheet, StatusBar,} from 'react-native';
import GetRecipesIds from './GetRecipesIds';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { addDoc, deleteDoc, doc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Alert } from 'react-native';

const Home = ({navigation, route}) => {
  console.log("HOME RENDERED");
  const uid = route.params.uid;
  const [recipeList, setRecipeList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);


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
      <View style={styles.favoriteButton}>
        <MaterialCommunityIcons
          name="heart-outline"
          color="#f44336"
          size={24}
          onPress={() => handleFavorite(item.recipeId)}
        />
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recipeList}
        renderItem={RecipeView}
        keyExtractor={(item) => item.recipeId}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
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
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export {Home};