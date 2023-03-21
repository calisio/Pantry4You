import { StyleSheet, Text, View, Button, FlatList, Image, Linking, SafeAreaView, StatusBar } from 'react-native';
import React, {useState, useEffect} from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase';

const Account = ({navigation, route}) => {
  const handleLogout = route.params.handleLogout;
  const uid = route.params.uid;
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

  return (
    <View style={styles.container}>
      <Button title="Log Out" onPress={() => handleSubmit()} />
      <Text style={styles.header}> Hello, {uid} </Text>
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
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
});

export {Account};
