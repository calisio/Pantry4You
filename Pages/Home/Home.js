import {Text, FlatList, SafeAreaView, View, Image, Linking, StyleSheet, StatusBar,} from 'react-native';
import GetRecipesIds from './GetRecipesIds';
import React, {useState, useEffect} from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

const Home = ({navigation, route}) => {
  console.log("HOME RENDERED");
  const theme = useTheme();
  const uid = route.params.uid;
  const [recipeList, setRecipeList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //function used to get recipes
  async function fetchRecipes() {
    setIsLoading(true);
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
          console.log(data);
          const recipeObj = {
            title: data['title'],
            imgUrl: data['image'],
            recipeUrl: data['sourceUrl'],
            recipeId: data['id'],
            soureName: data['sourceName']
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
  );


  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Box sx = {{
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          height:"100vh"
        }}
      >
        <CircularProgress color="primary" />
      </Box>
      ) : (
        <Box sx={{
          padding:5
        }}>
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