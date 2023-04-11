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
      email: friend.friendEmail,
      phoneNumber: friend.friendPhoneNumber
    }));
  }

  //Add friend's pantry to list
  for (let i = 0; i < friendsList.length; ++i) {
    let friendRef = db.collection('users').doc(friendsList[i]['uid']).collection('pantry');
    let friendPantryColl = await friendRef.get();
    const friendPantryList = friendPantryColl.docs.map(doc => doc.id);
    friendsList[i].pantry = friendPantryList;
  }

  //get pantry items from db
  await pantryRef.get().then((querySnapshot) => {
    tempDoc = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }
    })
  })

  //create list of pantry item names
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

    let apiUrl = ''
    let random = false
    if (query == "") {
      apiUrl = 'https://api.spoonacular.com/recipes/random?number=5'
      random = true
    }
    else {
      apiUrl = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + query + '&number=5&ranking=2'
    }

    //Get get is recipes and ingredeints (NOT INCLUDING URLS)
    try {
      const recipes = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '2b747b3902c148758955f81fcac5bb4f'
        }
      });
      console.log("API CALL: GETTING RECIPES FOR: ", uid)
      const data = await recipes.json();

      let iterLength = 0
      if (random) {
        iterLength = data.recipes.length
      }
      else {
        iterLength = data.length
      }

      for (let i = 0; i < iterLength; i++) {
        if (!random) {
          if (i == 0) {
            recipeIdString += data[i]['id'];
          }
          else {
            recipeIdString += ("," + data[i]['id']);
          }
        }

        let missed = []
        let tempRecipe = {}
        if (random) {
          tempRecipe = {
            title: data['recipes'][i]['title'],
            imgUrl: data['recipes'][i]['image'],
            recipeId: data['recipes'][i]['id'],
            missedCount: data['recipes'][i]['extendedIngredients'].length,
            missed: data['recipes'][i]['extendedIngredients'].map(ingredient => ingredient.name),
            used: [],
            recipeUrl: data['recipes'][i]['sourceUrl']
          }
        }
        else {
          tempRecipe = {
            title: data[i]['title'],
            imgUrl: data[i]['image'],
            recipeId: data[i]['id'],
            missedCount: data[i]['missedIngredientCount'],
            missed: data[i]['missedIngredients'].map(ingredient => ingredient.name),
            used: data[i]['usedIngredients'],
            recipeUrl: ""
          }
        }

        //get friends with missing ingredients, for each ingredient
        for (let j = 0; j < tempRecipe.missed.length; ++j) {
          let friendsWithIngredient = []
          for (let k = 0; k < friendsList.length; ++k) {
            if (friendsList[k]['pantry'].includes(tempRecipe.missed[j])) {
              let tempFriendObj = {
                uid: friendsList[k]['uid'],
                email: friendsList[k]['email'],
              }
              friendsWithIngredient.push(tempFriendObj)
            }
          }
          missed.push({
            name: String(tempRecipe.missed[j]),
            friendsWithIngredient: friendsWithIngredient
          });
        }
        tempRecipe.missed = missed
        recipeList.push(tempRecipe)
      }
    } catch (error) {
      console.log(error);
    }

    //Bulk get urls from id list
    if (!random) {
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
      } catch (error) {
        console.log(error);
      }
    }
    return recipeList;
  }
  return fetchRecipes(pantryList);
}

export default GetRecipes;
