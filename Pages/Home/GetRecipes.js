import { db } from '../../firebase';

const GetRecipes = async function(uid){
    //get list of current ingredients
    let collectionString = "users/" + uid + "/pantry";
    let pantryRef = db.collection(collectionString).doc("pantry");
    let pantryObj = await pantryRef.get();
    let pantryList = [];
    for(let i = 0; i < Object.keys(pantryObj.data()).length; i++){
       let key = Object.keys(pantryObj.data())[i];
        pantryList.push(key)
    }

    //create query with list of ingredients
    async function fetchRecipes(ingredients){
        let query = ""
        for (let i=0; i<pantryList.length; i++){
            if (i==0){
                query+=pantryList[i];
            }
            else{
                query+=(",+" + pantryList[i]);
            }
        }
        console.log(query);
        try {
            const recipes = await fetch('https://api.spoonacular.com/recipes/findByIngredients?ingredients='+query+'&number=10', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': '2b747b3902c148758955f81fcac5bb4f'
                }
            });
            const data = await recipes.json();
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        }
    fetchRecipes(pantryList);
}

export default GetRecipes;