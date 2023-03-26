import { db } from '../../firebase';

const GetRecipes = async function(uid) {
  //get list of current ingredients
  const userDoc = await db.collection('users').doc(uid).get();
  let collectionString = "users/" + uid + "/pantry";
  let pantryRef = db.collection(collectionString);
  let pantryList = [];
  let friendsList = [];
  let tempDoc;

  //Create list of friend UIDs
  if (userDoc.data().hasOwnProperty('friends')) {
    const friends = userDoc.data().friends;
    friendsList = friends.map(friend => ({
      uid: friend.friendUID,
      email: friend.friendEmail
    }));
  }

  //Add friend's pantry to list
  for (let i = 0; i < friendsList.length; ++i) {
    let friendRef = db.collection('users').doc(friendsList[i]['uid']).collection('pantry');
    let friendPantryColl = await friendRef.get();
    const friendPantryList = friendPantryColl.docs.map(doc => doc.id);
    friendsList[i].pantry = friendPantryList;
  }

  await pantryRef.get().then((querySnapshot) => {
    tempDoc = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }
    })
  })

  for (let i = 0; i < tempDoc.length; i++) {
    let item = Object.values(tempDoc[i])[0];
    pantryList.push(item);
  }


  //create query with list of ingredients
  async function fetchRecipes(ingredients) {
    let recipeList = [];
    let recipeIdString = ""
    let query = ""
    for (let i = 0; i < ingredients.length; i++) {
      if (i == 0) {
        query += ingredients[i];
      }
      else {
        query += (",+" + ingredients[i]);
      }
    }

    //Get get is recipes and ingredeints (NOT INCLUDING URLS)
    try {
      const recipes = await fetch('https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + query + '&number=5&ranking=2', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '2b747b3902c148758955f81fcac5bb4f'
        }
      });
      console.log("API CALL: GETTING RECIPES FOR: ", uid)
      const data = await recipes.json();
      for (let i = 0; i < data.length; i++) {

        if (i == 0) {
          recipeIdString += data[i]['id'];
        }
        else {
          recipeIdString += ("," + data[i]['id']);
        }

        let missed = []

        let tempRecipe = {
          title: data[i]['title'],
          imgUrl: data[i]['image'],
          recipeId: data[i]['id'],
          missedCount: data[i]['missedIngredientCount'],
          missed: data[i]['missedIngredients'],
          used: data[i]['usedIngredients'],
          recipeUrl: ""
        }

        //get friends with missing ingredients, for each ingredient
        for (let j = 0; j < data[i]['missedIngredientCount']; ++j) {
          let friendsWithIngredient = []
          for (let k = 0; k < friendsList.length; ++k) {
            if (friendsList[k]['pantry'].includes(data[i]['missedIngredients'][j].name)) {
              let tempFriendObj = {
                uid: friendsList[k]['uid'],
                email: friendsList[k]['email'],
              }
              friendsWithIngredient.push(tempFriendObj)
            }
          }
          missed.push({
            name: String(data[i]['missedIngredients'][j].name),
            friendsWithIngredient: friendsWithIngredient
          });
        }
        tempRecipe['missed'] = missed
        recipeList.push(tempRecipe)
      }
    } catch (error) {
      console.log(error);
    }

    //Bulk get urls from id list
    try {
      const recipes = await fetch('https://api.spoonacular.com/recipes/informationBulk?ids=' + recipeIdString, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '2b747b3902c148758955f81fcac5bb4f'
        }
      });
      console.log("API CALL: GETTING RECIPE URLS FOR: ", recipeIdString)
      const data = await recipes.json();
      for (let i = 0; i < data.length; i++) {
        recipeList[i].recipeUrl = data[i]['sourceUrl']
      }
      return recipeList;
    } catch (error) {
      console.log(error);
    }

  }
  return fetchRecipes(pantryList);
}

export default GetRecipes;
