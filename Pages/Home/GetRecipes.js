import { db } from '../../firebase';

const GetRecipes = async function(uid){
    //get list of current ingredients
    let collectionString = "users/" + uid + "/pantry";
    let pantryRef = db.collection(collectionString).doc("pantry");
    let pantryObj = await pantryRef.get();
    let pantryList = [];
    for(let i = 0; i < Object.keys(pantryObj.data()).length; i++){
        if (Object.values(pantryObj.data())[i]<1){
            continue;
        }
        let key = Object.keys(pantryObj.data())[i];
        pantryList.push(key)
    }
    //create query with list of ingredients
    async function fetchRecipes(ingredients){
        let recipeList = [];
        let query = ""
        for (let i=0; i<ingredients.length; i++){
            if (i==0){
                query+=ingredients[i];
            }
            else{
                query+=(",+" + ingredients[i]);
            }
        }
        try {
            const recipes = await fetch('https://api.spoonacular.com/recipes/findByIngredients?ingredients='+query+'&number=5&ranking=2', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': '2b747b3902c148758955f81fcac5bb4f'
                }
            });
            const data = await recipes.json();
            for (let i = 0; i<data.length; i++){
                let tempRecipe = {
                    title: data[i]['title'],
                    imgUrl: data[i]['image'],
                    recipeId: data[i]['id'],
                    missedCount: data[i]['missedIngredientCount'],
                    missed: data[i]['missedIngredients'],
                    used: data[i]['usedIngredients'],
                    recipeUrl: ""
                  };
                recipeList.push(tempRecipe)
            }
            //console.log(recipeList);
            return recipeList;
          } catch (error) {
            console.log(error);
          }
        }
    return fetchRecipes(pantryList);
}

export default GetRecipes;