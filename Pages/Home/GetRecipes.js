import { db } from '../../firebase';
let convert = require('convert-units')

const GetRecipes = async function(uid, recipeCount) {
  //get list of current ingredients
  const userDoc = await db.collection('users').doc(uid).get();
  let collectionString = "users/" + uid + "/pantry";
  let pantryRef = db.collection(collectionString);
  let pantryList = [];
  let friendsList = [];
  let tempDoc;
  const unitCleaned = {
    'cups': 'cup',
    'lbs': 'lb',
    'teaspoons': 'tsp',
    'teaspoon': 'tsp',
    'tablespoons': 'Tbs',
    'tablespoon': 'Tbs',
  }

  function cleanUnit(unit) {
    if (unit in unitCleaned) {
      return unitCleaned[unit];
    }
    return unit;
  }

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
    const friendPantryList = friendPantryColl.docs.map(doc => ({
      id: doc.id,
      amount: doc.data()
    }));
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
    pantryList.push(tempDoc[i]);
  }

  //create query with list of ingredients
  async function fetchRecipes(ingredients) {
    let ingredientNames = ingredients.map(ingredient => ingredient.id)
    let recipeList = [];
    let recipeIdString = ""
    let query = ""
    for (let i = 0; i < ingredientNames.length; i++) {
      if (i == 0) {
        query += ingredientNames[i];
      }
      else {
        query += (",+" + ingredientNames[i]);
      }
    }

    let apiUrl = ''
    let random = false
    if (query == "") {
      apiUrl = 'https://api.spoonacular.com/recipes/random?number=5'
      random = true
    }
    else {
      apiUrl = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + query + '&number=' + recipeCount + '&ranking=2'
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
            //missed: data['recipes'][i]['extendedIngredients'].map(ingredient => ingredient.name),
            missed: data['recipes'][i]['extendedIngredients'],
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
            //missed: data[i]['missedIngredients'].map(ingredient => ingredient.name),
            missed: data[i]['missedIngredients'],
            used: data[i]['usedIngredients'],
            recipeUrl: ""
          }
        }

        //see if you have enouugh of used ingredients
        for (let j = 0; j < tempRecipe.used.length; ++j) {
          const myIngredient = ingredients.find(ingredient => ingredient.id === tempRecipe.used[j].name);
          if (myIngredient) {
            const myIngredientUnit = Object.keys(myIngredient).filter(key => key != "id")[0];
            const recipeIngredientConverted = convert(tempRecipe.used[j].amount).from(cleanUnit(tempRecipe.used[j].unit)).to(cleanUnit(myIngredientUnit))
            if (!recipeIngredientConverted || recipeIngredientConverted > myIngredient[myIngredientUnit]) {
              let diff = recipeIngredientConverted - myIngredient[myIngredientUnit];
              let tempMissed = {
                name: myIngredient.id,
                unit: myIngredientUnit,
                amount: diff
              }
              //add to missed list
              tempRecipe.missed.push(tempMissed)
              tempRecipe.missedCount++;
              //remove from used list
              tempRecipe.used.splice(j, 1);
            }
          }
        }
        //get friends with missing ingredients, for each ingredient
        for (let j = 0; j < tempRecipe.missed.length; ++j) {
          let friendsWithIngredient = []
          for (let k = 0; k < friendsList.length; ++k) {
            const friendPantryIds = friendsList[k]['pantry'].map(ingredient => ingredient.id);
            if (friendPantryIds.includes(tempRecipe.missed[j].name)) {
              const matchedIngredient = friendsList[k]['pantry'].find(ingredient => ingredient.id === tempRecipe.missed[j].name);
              const matchedIngredientUnit = Object.keys(matchedIngredient.amount)[0]
              let tempFriendObj = {
                uid: friendsList[k]['uid'],
                email: friendsList[k]['email'],
                amount: convert(matchedIngredient.amount[matchedIngredientUnit]).from(cleanUnit(matchedIngredientUnit)).to(cleanUnit(tempRecipe.missed[j].unit)),
                unit: tempRecipe.missed[j].unit
              }
              friendsWithIngredient.push(tempFriendObj)
            }
          }
          missed.push({
            ingredient: tempRecipe.missed[j],
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
