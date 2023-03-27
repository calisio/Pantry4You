import { StyleSheet, Text, View, Button, Alert, TextInput, Keyboard, TouchableWithoutFeedback, Pressable } from 'react-native';
import React, {useState} from 'react';
import { db } from '../../../firebase';
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { SelectList } from 'react-native-dropdown-select-list';
import { getFoodUnit } from '../../../utils/getFoodUnit';
import { setFoodUnit } from '../../../utils/setFoodUnit';
import Autocomplete from 'react-native-autocomplete-input';


const dismissKeyboard = () => {
    Keyboard.dismiss();
}

// https://reactnative.dev/docs/handling-text-input

const AddManually = (props) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');

    

    // const getList = async() => {
    //     return await getAllFoodUnits();
    // }

    // const allFoodUnits = getList();
    // console.log("00000000000000000000000000000");
    // console.log(allFoodUnits);

    const allFoodUnits = [
        {label: 'milk', Unit: 'cup'}, 
        {label: 'buttermilk', Unit: 'cup'}, 
        {label: 'powdered milk', Unit: 'cup'}, 
        {label: 'goats milk', Unit: 'cup'}, 
        {label: 'vanilla ice cream', Unit: 'cup'}, 
        {label: 'cocoa powder', Unit: 'cup'}, 
        {label: 'skim milk', Unit: 'cup'}, 
        {label: 'cornstarch', Unit: 'cup'}, 
        {label: 'custard', Unit: 'cup'}, 
        {label: 'chocolate ice cream', Unit: 'cup'}, 
        {label: 'cream or half-and-half', Unit: 'cup'}, 
        {label: 'cheddar', Unit: 'oz'}, 
        {label: 'cream cheese', Unit: 'oz'}, 
        {label: 'swiss cheese', Unit: 'oz'}, 
        {label: 'eggs', Unit: 'item'}, 
        {label: 'egg whites', Unit: 'cup'}, 
        {label: 'butter', Unit: 'lb'}, 
        {label: 'hydrogenated cooking fat', Unit: 'cup'}, 
        {label: 'lard', Unit: 'cup'}, 
        {label: 'margarine', Unit: 'cup'}, 
        {label: 'mayonnaise', Unit: 'tbsp'}, 
        {label: 'corn oil', Unit: 'tbsp'}, 
        {label: 'olive oil', Unit: 'tbsp'}, 
        {label: 'safflower seed oil', Unit: 'tbsp'}, 
        {label: 'french dressing', Unit: 'tbsp'}, 
        {label: 'thousand island sauce', Unit: 'tbsp'}, 
        {label: 'salt pork', Unit: 'oz'}, 
        {label: 'bacon', Unit: 'oz'}, 
        {label: 'beef', Unit: 'oz'}, 
        {label: 'hamburger', Unit: 'oz'}, 
        {label: 'ground beef', Unit: 'oz'}, 
        {label: 'roast beef', Unit: 'oz'}, 
        {label: 'steak', Unit: 'oz'}, 
        {label: 'corned beef', Unit: 'oz'}, 
        {label: 'corned beef hash canned', Unit: 'oz'}, 
        {label: 'corned beef hash dried', Unit: 'oz'}, 
        {label: 'corned beef hash stew', Unit: 'cup'}, 
        {label: 'chicken breast', Unit: 'oz'}, 
        {label: 'chicken thigh', Unit: 'oz'}, 
        {label: 'chicken leg', Unit: 'oz'}, 
        {label: 'chicken liver', Unit: 'oz'}, 
        {label: 'duck', Unit: 'oz'}, 
        {label: 'lamb chop', Unit: 'oz'}, 
        {label: 'lamb leg', Unit: 'oz'}, 
        {label: 'lamb shoulder', Unit: 'oz'}, 
        {label: 'pork chop', Unit: 'oz'}, 
        {label: 'ham', Unit: 'oz'}, 
        {label: 'pork sausage', Unit: 'oz'}, 
        {label: 'turkey', Unit: 'oz'}, 
        {label: 'veal', Unit: 'oz'}, 
        {label: 'clams', Unit: 'oz'}, 
        {label: 'cod', Unit: 'oz'}, 
        {label: 'crab meat', Unit: 'oz'}, 
        {label: 'fish sticks', Unit: 'item'}, 
        {label: 'flounder', Unit: 'oz'}, 
        {label: 'haddock', Unit: 'oz'}, 
        {label: 'halibut', Unit: 'oz'}, 
        {label: 'herring', Unit: 'oz'}, 
        {label: 'lobster', Unit: 'oz'}, 
        {label: 'mackerel', Unit: 'oz'}, 
        {label: 'oysters', Unit: 'oz'}, 
        {label: 'oyster stew', Unit: 'cup'}, 
        {label: 'salmon', Unit: 'oz'}, 
        {label: 'sardines', Unit: 'oz'}, 
        {label: 'scallops', Unit: 'oz'}, 
        {label: 'shrimp', Unit: 'oz'}, 
        {label: 'swordfish', Unit: 'oz'}, 
        {label: 'tuna', Unit: 'oz'}, 
        {label: 'artichoke', Unit: 'item'}, 
        {label: 'asparagus', Unit: 'oz'}, 
        {label: 'beans', Unit: 'cup'}, 
        {label: 'lima beans', Unit: 'cup'}, 
        {label: 'kidney beans', Unit: 'cup'}, 
        {label: 'bean sprouts', Unit: 'cup'}, 
        {label: 'beet greens', Unit: 'cup'}, 
        {label: 'beetroots', Unit: 'cup'}, 
        {label: 'broccoli', Unit: 'cup'}, 
        {label: 'brussels sprouts', Unit: 'cup'}, 
        {label: 'sauerkraut', Unit: 'cup'}, 
        {label: 'steamed cabbage', Unit: 'cup'}, 
        {label: 'carrots', Unit: 'cup'}, 
        {label: 'cauliflower', Unit: 'cup'}, 
        {label: 'celery', Unit: 'oz'}, 
        {label: 'collard greens', Unit: 'cup'}, 
        {label: 'corn', Unit: 'item'}, 
        {label: 'canned corn', Unit: 'cup'}, 
        {label: 'cucumbers', Unit: 'item'}, 
        {label: 'dandelion greens', Unit: 'cup'}, 
        {label: 'eggplant', Unit: 'cup'}, 
        {label: 'endive', Unit: 'oz'}, 
        {label: 'kale', Unit: 'cup'}, 
        {label: 'kohlrabi', Unit: 'cup'}, 
        {label: 'lentils', Unit: 'cup'}, 
        {label: 'lettuce', Unit: 'oz'}, 
        {label: 'mushrooms', Unit: 'oz'}, 
        {label: 'mustard greens', Unit: 'oz'}, 
        {label: 'okra', Unit: 'cup'}, 
        {label: 'onions', Unit: 'item'}, 
        {label: 'green onions', Unit: 'oz'}, 
        {label: 'parsley', Unit: 'tbsp'}, 
        {label: 'parsnips', Unit: 'cup'}, 
        {label: 'peas', Unit: 'cup'}, 
        {label: 'fresh steamed peas', Unit: 'cup'}, 
        {label: 'frozen peas', Unit: 'cup'}, 
        {label: 'split cooked peas', Unit: 'cup'}, 
        {label: 'heated peas', Unit: 'cup'}, 
        {label: 'peppers canned', Unit: 'item'}, 
        {label: 'red peppers', Unit: 'item'}, 
        {label: 'green peppers', Unit: 'item'}, 
        {label: 'potatoes baked', Unit: 'cup'}, 
        {label: 'potatoes pan-fried', Unit: 'cup'}, 
        {label: 'scalloped with cheese potatoes', Unit: 'oz'}, 
        {label: 'potato chips', Unit: 'item'}, 
        {label: 'radishes', Unit: 'cup'}, 
        {label: 'rutabagas', Unit: 'cup'}, 
        {label: 'soybeans', Unit: 'cup'}, 
        {label: 'spinach', Unit: 'cup'}, 
        {label: 'squash', Unit: 'item'}, 
        {label: 'sweet potatoes', Unit: 'item'}, 
        {label: 'tomatoes', Unit: 'cup'}, 
        {label: 'tomato juice', Unit: 'tbsp'}, 
        {label: 'tomato catsup', Unit: 'cup'}, 
        {label: 'turnip greens', Unit: 'cup'}, 
        {label: 'turnips steamed', Unit: 'cup'}, 
        {label: 'watercress stems', Unit: 'cup'}, 
        {label: 'apple juice canned', Unit: 'cup'}, 
        {label: 'apple vinegar', Unit: 'cup'}, 
        {label: 'apples', Unit: 'item'}, 
        {label: 'apricots', Unit: 'item'}, 
        {label: 'avocado', Unit: 'item'}, 
        {label: 'banana', Unit: 'item'}, 
        {label: 'blackberries', Unit: 'cup'}, 
        {label: 'blueberries', Unit: 'item'}, 
        {label: 'cantaloupe', Unit: 'cup'}, 
        {label: 'cherries', Unit: 'cup'}, 
        {label: 'cranberry sauce', Unit: 'cup'}, 
        {label: 'dates', Unit: 'item'}, 
        {label: 'figs', Unit: 'cup'}, 
        {label: 'fruit cocktail', Unit: 'item'}, 
        {label: 'grapefruit juice', Unit: 'cup'}, 
        {label: 'grapes', Unit: 'cup'}, 
        {label: 'grape juice', Unit: 'cup'}, 
        {label: 'lemon juice', Unit: 'cup'}, 
        {label: 'lemonade', Unit: 'cup'}, 
        {label: 'limeade', Unit: 'cup'}, 
        {label: 'olives', Unit: 'item'}, 
        {label: 'oranges', Unit: 'cup'}, 
        {label: 'orange juice', Unit: 'item'}, 
        {label: 'papaya', Unit: 'item'}, 
        {label: 'peaches', Unit: 'item'}, 
        {label: 'pears', Unit: 'item'}, 
        {label: 'persimmons', Unit: 'item'}, 
        {label: 'pineapple', Unit: 'cup'}, 
        {label: 'pineapple crushed', Unit: 'cup'}, 
        {label: 'pineapple juice', Unit: 'item'}, 
        {label: 'plums', Unit: 'cup'}, 
        {label: 'prunes', Unit: 'cup'}, 
        {label: 'prune juice', Unit: 'cup'}, 
        {label: 'raisins', Unit: 'cup'}, 
        {label: 'raspberries', Unit: 'cup'}, 
        {label: 'rhubarb sweetened', Unit: 'cup'}, 
        {label: 'strawberries', Unit: 'item'}, 
        {label: 'tangerines', Unit: 'item'}, 
        {label: 'watermelon', Unit: 'cup'}, 
        {label: 'bran flakes', Unit: 'item'}, 
        {label: 'wheat bread (slices)', Unit: 'item'}, 
        {label: 'rye bread (slices)', Unit: 'item'}, 
        {label: 'white bread (slices)', Unit: 'cup'}, 
        {label: 'cornflakes', Unit: 'cup'}, 
        {label: 'corn meal', Unit: 'item'}, 
        {label: 'crackers', Unit: 'cup'}, 
        {label: 'flour', Unit: 'cup'}, 
        {label: 'wheat (all purpose)', Unit: 'cup'}, 
        {label: 'wheat (whole)', Unit: 'cup'}, 
        {label: 'macaroni', Unit: 'item'}, 
        {label: 'muffins', Unit: 'cup'}, 
        {label: 'noodles', Unit: 'cup'}, 
        {label: 'oatmeal', Unit: 'cup'}, 
        {label: 'popcorn salted', Unit: 'cup'}, 
        {label: 'puffed rice', Unit: 'cup'}, 
        {label: 'puffed wheat', Unit: 'cup'}, 
        {label: 'brown rice', Unit: 'cup'}, 
        {label: 'white rice', Unit: 'cup'}, 
        {label: 'rice flakes', Unit: 'cup'}, 
        {label: 'rice polish', Unit: 'item'}, 
        {label: 'rolls', Unit: 'cup'}, 
        {label: 'meat sauce', Unit: 'cup'}, 
        {label: 'spanish rice', Unit: 'item'}, 
        {label: 'waffles', Unit: 'cup'}, 
        {label: 'wheat germ', Unit: 'cup'}, 
        {label: 'wheat-germ cereal ', Unit: 'cup'}, 
        {label: 'wheat cooked', Unit: 'cup'}, 
        {label: 'bean soups', Unit: 'cup'}, 
        {label: 'beef soup', Unit: 'cup'}, 
        {label: 'bouillon', Unit: 'cup'}, 
        {label: 'chicken soup', Unit: 'cup'}, 
        {label: 'clam chowder', Unit: 'cup'}, 
        {label: 'cream soups', Unit: 'cup'}, 
        {label: 'chicken noodle soup', Unit: 'cup'}, 
        {label: 'split-pea soup', Unit: 'cup'}, 
        {label: 'tomato soup', Unit: 'cup'}, 
        {label: 'marshmallows', Unit: 'oz'}, 
        {label: 'milk chocolate', Unit: 'tbsp'}, 
        {label: 'chocolate syrup', Unit: 'item'}, 
        {label: 'doughnuts', Unit: 'cup'}, 
        {label: 'gelatin', Unit: 'tbsp'}, 
        {label: 'honey', Unit: 'cup'}, 
        {label: 'ice cream', Unit: 'tbsp'}, 
        {label: 'grape jelly', Unit: 'tbsp'}, 
        {label: 'strawberry jelly', Unit: 'tbsp'}, 
        {label: 'cane syrup', Unit: 'tbsp'}, 
        {label: 'white sugar', Unit: 'tbsp'}, 
        {label: 'brown sugar', Unit: 'tbsp'}, 
        {label: 'syrup', Unit: 'cup'}, 
        {label: 'almonds', Unit: 'cup'}, 
        {label: 'brazil nuts', Unit: 'cup'}, 
        {label: 'cashews', Unit: 'cup'}, 
        {label: 'peanut butter', Unit: 'cup'}, 
        {label: 'peanuts', Unit: 'cup'}, 
        {label: 'pecans', Unit: 'cup'}, 
        {label: 'sesame seeds', Unit: 'cup'}, 
        {label: 'sunflower seeds', Unit: 'cup'}, 
        {label: 'walnuts', Unit: 'cup'}, 
        {label: 'beer', Unit: 'cup'}, 
        {label: 'gin', Unit: 'cup'}, 
        {label: 'wines', Unit: 'cup'}, 
        {label: 'club soda', Unit: 'cup'}, 
        {label: 'coffee', Unit: 'cup'}, 
        {label: 'tea', Unit: 'oz'}
    ]

    //https://www.npmjs.com/package/react-native-dropdown-select-list
    const units = [
        {key:'1', value:'cup'},
        {key:'2', value:'tbsp'},
        {key:'3', value:'lb'},
        {key:'4', value:'g'},
        {key:'5', value:'item'}
    ]

    const auth = getAuth();
    const user = auth.currentUser.uid;



    // async function getUnit(item){
    //     return db.collection('foodUnits').doc('pantry').get()
    //     .then((doc) => doc.get({item}));
    // }

    const createPantryIfItDoesntExist = async(itemInput, quantityInput) => {
        db.collection('users').doc(user).get()
        .then(doc => {
          if(doc.exists){
            console.log("user exists");
            db.collection('users').doc(user).collection('pantry').get()
            .then(sub => {
              if(sub.docs.length == 0){
                console.log("pantry empty");
                db.collection('users').doc(user).collection('pantry').doc(item).set({
                  [selectedUnit]: quantityInput
                })

              }
              else{
                return;
              }
            });
          }
        });
      }


    const submitHandler = async() => {
        let reg = /^\d+$/;
        if(!reg.test(quantity)){
            Alert.alert("Please enter a numeric quantity");
            return;
        }
        if(item != '' && quantity != '' && selectedUnit != ''){
            let quantityInt = parseInt(quantity);

            let foodUnit = await getFoodUnit(item);

            if(foodUnit == null){
                return;
            }
            else if(foodUnit == selectedUnit){
                
                if(foodUnit == "insertNewUnit"){
                    setFoodUnit(item, selectedUnit);
                }

                await createPantryIfItDoesntExist(item, quantityInt);
                console.log("check");
                let currentItems = await getCurrentPantry();
                let itemExists = false;

                for(let i = 0; i < currentItems.length; i++){
                    if(Object.values(currentItems[i])[0] == item){
                        itemExists = true;
                        break;
                    }
                }

                let collectionString = "users/" + user + "/pantry";
                let itemRef = db.collection(collectionString).doc(item);

                if(itemExists){
                    await itemRef.update({
                        [selectedUnit]: firebase.firestore.FieldValue.increment(quantityInt)
                    }, {merge: true})
                    .then(console.log("incremented current field"));
                }
                else{
                    await itemRef.set({
                        [selectedUnit]: quantityInt
                    }, {merge: true})
                    .then(console.log("added new field"));
                }

                props.updateFunction();
                setItem('');
                setQuantity('');
                //TODO: how to reset dropdown?  this clears the var, but dropdown display doesn't change
                //setSelectedUnit('');
            }
            else{
                console.log("units bad");
                let alertString = "Please enter the quantity in " + foodUnit;
                Alert.alert(alertString);
            }
        }
        else{
            Alert.alert("Fill out all fields");
        }
    }


    const getCurrentPantry = async() => {

        let collectionString = "users/" + user + "/pantry";
        let pantryRef = db.collection(collectionString);

        // let pantryObj = await pantryRef.get();
        let curPantryList = [];

        // for(let i = 0; i < Object.keys(pantryObj.data()).length; i++){
        //     let key = Object.keys(pantryObj.data())[i];
        //     let val = Object.values(pantryObj.data())[i];
        //     let listEntry = [key, val];
        //     curPantryList.push(listEntry)
        // }

        let tempDoc;

        await pantryRef.get().then((querySnapshot) => {
            tempDoc = querySnapshot.docs.map((doc) => {
                return { id: doc.id }
            })
        })

        console.log("cur pantry start-------------");
        for(let i=0; i < tempDoc.length; i++){
            curPantryList.push(tempDoc[i]);
            // console.log(tempDoc[i]);
        }
        // console.log("cur pantry end-------------");

        return curPantryList;
    }


    // const data = filterData(allFoodUnits);
    const data = allFoodUnits.map(i )
    return (
            <View style={styles.container}>

                <Autocomplete
                    data={data}
                    value={item}
                    onChangeText={(text) => setItem(text)}
                    flatListProps={{
                        keyExtractor: (_, idx) => idx,
                        renderItem: ({ item }) => <Text>{item}</Text>,
                    }}
                />
                
                {/* <TextInput 
                    value={item}
                    style={styles.input}
                    placeholder="Enter item here"
                    onChangeText={newItem => setItem(newItem.toLowerCase())}
                    defaultValue={""}
                    id="item"
                /> */}
                <TextInput
                    value={quantity}
                    style={styles.input}
                    placeholder="Enter quantity here"
                    onChangeText={newQuantity => setQuantity(newQuantity)}
                    defaultValue={""}
                    id="quantity"
                />
                <SelectList
                    setSelected={(val) => setSelectedUnit(val)}
                    data={units}
                    save="value"
                    
                />
                <Pressable
                    style={styles.button}
                    title="Add Item"
                    onPress={submitHandler}
                >
                    <Text style={styles.text}>Add Item</Text>
                </Pressable>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    input: {
        width: '70%',
        height: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: '10%',
    },
    button: {
        backgroundColor: '#CCCCCC',
        borderRadius: 8,
        padding: 10,
    },
    text: {
        alignSelf: 'center',
    }
});

export {AddManually};