import {Text, FlatList, SafeAreaView, View, Image, Linking, StyleSheet, StatusBar,} from 'react-native';
import GetRecipesIds from './GetRecipesIds';
import React, {useState, useEffect} from 'react';

const Home = ({navigation, route}) => {
  console.log("HOME RENDERED");
  const uid = route.params.uid;
  const [recipeList, setRecipeList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //function used to get recipes
  async function fetchRecipes() {
    const recipesIds = await GetRecipesIds(uid);
    let recipeListTemp = []
    for (let i = 0; i<recipesIds.length; i++){
      try{
        const recipe = await fetch('https://api.spoonacular.com/recipes/'+recipesIds[i]+'/information?includeNutrition=false', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '2b747b3902c148758955f81fcac5bb4f'
          }
          });
          const data = await recipe.json();
          const recipeObj = {
            title: data['title'],
            imgUrl: data['image'],
            recipeUrl: data['sourceUrl'],
            recipeId: data['id']
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
    <View>
      <Text>{item.title}</Text>
      <Image
        source={{ uri: item.imgUrl }}
        style={{ width: 200, height: 200 }}
      />
      <Text style={{color: 'blue'}}
        onPress={() => Linking.openURL(item.recipeUrl)}>
        Instructions
      </Text>
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
        ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
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
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export {Home};