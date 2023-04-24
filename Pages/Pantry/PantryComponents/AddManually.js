import { StyleSheet, Text, View, Alert, TextInput, Keyboard, Pressable } from 'react-native';
import React, {useState, useEffect} from 'react';
import { db } from '../../../firebase';
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { getFoodUnit } from '../../../utils/getFoodUnit';
import { setFoodUnit } from '../../../utils/setFoodUnit';
import { MyAutocomplete } from './Autocomplete';
import { Input , Button} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// https://reactnative.dev/docs/handling-text-input

const AddManually = (props) => {
    // console.log("rendered");
    const allFoodUnits = {
        "milk": "cup",
        "buttermilk": "cup",
        "powdered milk": "cup",
        "goats' milk": "cup",
        "vanilla ice cream": "cup",
        "cocoa powder": "cup",
        "skim milk": "cup",
        "cornstarch": "cup",
        "custard": "cup",
        "chocolate ice cream": "cup",
        "cream or half-and-half": "cup",
        "cheddar": "oz",
        "cream cheese": "oz",
        "swiss cheese": "oz",
        "eggs": "item",
        "egg whites": "cup",
        "butter": "lb",
        "hydrogenated cooking fat": "cup",
        "lard": "cup",
        "margarine": "cup",
        "mayonnaise": "tbsp",
        "corn oil": "tbsp",
        "olive oil": "tbsp",
        "safflower seed oil": "tbsp",
        "french dressing": "tbsp",
        "thousand island sauce": "tbsp",
        "salt pork": "oz",
        "bacon": "oz",
        "beef": "oz",
        "hamburger": "oz",
        "ground beef": "oz",
        "roast beef": "oz",
        "steak": "oz",
        "corned beef": "oz",
        "corned beef hash canned": "oz",
        "corned beef hash dried": "oz",
        "corned beef hash stew": "cup",
        "chicken breast": "oz",
        "chicken thigh": "oz",
        "chicken leg": "oz",
        "chicken liver": "oz",
        "duck": "oz",
        "lamb chop": "oz",
        "lamb leg": "oz",
        "lamb shoulder": "oz",
        "pork chop": "oz",
        "ham": "oz",
        "pork sausage": "oz",
        "turkey": "oz",
        "veal": "oz",
        "clams": "oz",
        "cod": "oz",
        "crab meat": "oz",
        "fish sticks": "item",
        "flounder": "oz",
        "haddock": "oz",
        "halibut": "oz",
        "herring": "oz",
        "lobster": "oz",
        "mackerel": "oz",
        "oysters": "oz",
        "oyster stew": "cup",
        "salmon": "oz",
        "sardines": "oz",
        "scallops": "oz",
        "shrimp": "oz",
        "swordfish": "oz",
        "tuna": "oz",
        "artichoke": "item",
        "asparagus": "oz",
        "beans": "cup",
        "lima beans": "cup",
        "kidney beans": "cup",
        "bean sprouts": "cup",
        "beet greens": "cup",
        "beetroots": "cup",
        "broccoli": "cup",
        "brussels sprouts": "cup",
        "sauerkraut": "cup",
        "steamed cabbage": "cup",
        "carrots": "cup",
        "cauliflower": "cup",
        "celery": "oz",
        "collard greens": "cup",
        "corn": "item",
        "canned corn": "cup",
        "cucumbers": "item",
        "dandelion greens": "cup",
        "eggplant": "cup",
        "endive": "oz",
        "kale": "cup",
        "kohlrabi": "cup",
        "lentils": "cup",
        "lettuce": "oz",
        "mushrooms": "oz",
        "mustard greens": "oz",
        "okra": "cup",
        "onions": "item",
        "green onions": "oz",
        "parsley": "tbsp",
        "parsnips": "cup",
        "peas": "cup",
        "fresh steamed peas": "cup",
        "frozen peas": "cup",
        "split cooked peas": "cup",
        "heated peas": "cup",
        "peppers canned": "item",
        "red peppers": "item",
        "green peppers": "item",
        "potatoes baked": "cup",
        "potatoes pan-fried": "cup",
        "scalloped with cheese potatoes": "oz",
        "potato chips": "item",
        "radishes": "cup",
        "rutabagas": "cup",
        "soybeans": "cup",
        "spinach": "cup",
        "squash": "item",
        "sweet potatoes": "item",
        "tomatoes": "cup",
        "tomato juice": "tbsp",
        "tomato catsup": "cup",
        "turnip greens": "cup",
        "turnips steamed": "cup",
        "watercress stems": "cup",
        "apple juice canned": "cup",
        "apple vinegar": "cup",
        "apples": "item",
        "apricots": "item",
        "avocado": "item",
        "banana": "item",
        "blackberries": "cup",
        "blueberries": "item",
        "cantaloupe": "cup",
        "cherries": "cup",
        "cranberry sauce": "cup",
        "dates": "item",
        "figs": "cup",
        "fruit cocktail": "item",
        "grapefruit juice": "cup",
        "grapes": "cup",
        "grape juice": "cup",
        "lemon juice": "cup",
        "lemonade": "cup",
        "limeade": "cup",
        "olives": "item",
        "oranges": "cup",
        "orange juice": "item",
        "papaya": "item",
        "peaches": "item",
        "pears": "item",
        "persimmons": "item",
        "pineapple": "cup",
        "pineapple crushed": "cup",
        "pineapple juice": "item",
        "plums": "cup",
        "prunes": "cup",
        "prune juice": "cup",
        "raisins": "cup",
        "raspberries": "cup",
        "rhubarb sweetened": "cup",
        "strawberries": "item",
        "tangerines": "item",
        "watermelon": "cup",
        "bran flakes": "item",
        "wheat bread (slices)": "item",
        "rye bread (slices)": "item",
        "white bread (slices)": "cup",
        "cornflakes": "cup",
        "corn meal": "item",
        "crackers": "cup",
        "flour": "cup",
        "wheat (all purpose)": "cup",
        "wheat (whole)": "cup",
        "macaroni": "item",
        "muffins": "cup",
        "noodles": "cup",
        "oatmeal": "cup",
        "popcorn salted": "cup",
        "puffed rice": "cup",
        "puffed wheat": "cup",
        "brown rice": "cup",
        "white rice": "cup",
        "rice flakes": "cup",
        "rice polish": "item",
        "rolls": "cup",
        "meat sauce": "cup",
        "spanish rice": "item",
        "waffles": "cup",
        "wheat germ": "cup",
        "wheat-germ cereal ": "cup",
        "wheat cooked": "cup",
        "bean soups": "cup",
        "beef soup": "cup",
        "bouillon": "cup",
        "chicken soup": "cup",
        "clam chowder": "cup",
        "cream soups": "cup",
        "chicken noodle soup": "cup",
        "split-pea soup": "cup",
        "tomato soup": "cup",
        "marshmallows": "oz",
        "milk chocolate": "tbsp",
        "chocolate syrup": "item",
        "doughnuts": "cup",
        "gelatin": "tbsp",
        "honey": "cup",
        "ice cream": "tbsp",
        "grape jelly": "tbsp",
        "strawberry jelly": "tbsp",
        "cane syrup": "tbsp",
        "white sugar": "tbsp",
        "brown sugar": "tbsp",
        "syrup": "cup",
        "almonds": "cup",
        "brazil nuts": "cup",
        "cashews": "cup",
        "peanut butter": "cup",
        "peanuts": "cup",
        "pecans": "cup",
        "sesame seeds": "cup",
        "sunflower seeds": "cup",
        "walnuts": "cup",
        "beer": "cup",
        "gin": "cup",
        "wines": "cup",
        "club soda": "cup",
        "coffee": "cup",
        "tea": "oz",
        "lemons": "item",
        "salt": "tbsp",
        "limes": "item"
    }
    const allFoods = Object.keys(allFoodUnits);

    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('0');
    const [selectedUnit, setSelectedUnit] = useState('');

    const auth = getAuth();
    const user = auth.currentUser.uid;

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


    const dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    const submitHandler = async() => {
        let reg = /^\d+$/;
        if(!reg.test(quantity)){
            Alert.alert("Please enter a numeric quantity greater than 0");
            return;
        }
        if(item != '' && quantity != '' && selectedUnit != ''){
            let quantityInt = parseInt(quantity);

            if(quantityInt <= 0){
                Alert.alert("Please enter a numeric quantity greater than 0");
                dismissKeyboard();
                setQuantity('0');
                return;
            }
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
                let alertString = item + " added!";
                Alert.alert(alertString);
                dismissKeyboard();
                setQuantity('0');
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

        let curPantryList = [];
        let tempDoc;

        await pantryRef.get().then((querySnapshot) => {
            tempDoc = querySnapshot.docs.map((doc) => {
                return { id: doc.id }
            })
        })

        for(let i=0; i < tempDoc.length; i++){
            curPantryList.push(tempDoc[i]);
        }

        return curPantryList;
    }

    const decreaseQuantity = () => {
        let value = parseInt(quantity);
        value = value - 1;
        const stringValue = value.toString();
        setQuantity(stringValue);
      };
    
      const increaseQuantity = () => {
        let value = parseInt(quantity);
        value = value + 1;
        const stringValue = value.toString();
        setQuantity(stringValue);
      };
    
      const handleInputChange = (newQuantity) => {
        console.log(quantity);
        setQuantity(newQuantity);
        console.log(quantity);
      };

    return (
            <View  style={styles.outerCont}>
                <View style={styles.rowAddItems}>
                    <Text style={styles.addItemText}> Add Item: </Text>
                    <View style={styles.autocompleteCont} >
                        <MyAutocomplete
                            updateItemFunction = {setItem}
                            foods={allFoods}
                            foodUnits={allFoodUnits}
                            style={styles.autocomplete}
                            updateUnitFunction = {setSelectedUnit}
                            // showAutocomplete = {props.showAC}
                            // setShowAutocomplete = {props.setShowAC}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.amountAndUnit}>
                        <View style={styles.quantityRow}>
                            <Button size='xs' roundedRight='none' h={12} variant="subtle" onPress={() => decreaseQuantity()}>
                                <MaterialCommunityIcons name="minus" color="black"/>
                            </Button>
                            <Input
                                w={12}
                                h={12}
                                style={styles.quantityInput}
                                value={quantity.toString()}
                                placeholder='0'
                                defaultValue='0'
                                onChangeText={handleInputChange}
                                id="quantity"
                                rounded='none'
                                keyboardType="numeric"
                            />
                            <Button size='xs' h={12} roundedLeft='none' variant="subtle" onPress={() => increaseQuantity()}>
                                <MaterialCommunityIcons name="plus" color="black"/>
                            </Button> 
                        </View>
                        <Text style={styles.unit}>{selectedUnit}</Text>
                    </View>
                    <View style={styles.buttonContainer}>          
                        <Button
                            style={styles.button}
                            onPress={submitHandler}
                        > Add Item </Button>
                    </View>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    rowAddItems: {
        flexDirection: 'row',
        padding: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor:'white',
        borderRadius:8,
        borderWidth:3,
        zIndex:5,
    },
    addItemText: {
        flex: 2,
        position: 'relative',
        zIndex: 1,
    },
    autocompleteCont: {
        flex: 6,
        position: 'relative',
        zIndex: 999,
    },
    unit:{
        textAlign: 'center',
        paddingLeft: 10,
        position: 'relative',
        zIndex: 1,
    },
    outerCont: {
        width: '100%',
        alignItems: 'center',
    },
    row: {
        flexDirection: "row",
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        position: 'relative',
        zIndex: 1,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
    },
    quantityInput: {
        textAlign:"center",
        backgroundColor:'white',
        position: 'relative',
        zIndex: 1,
    },
    selectList: {
        marginLeft: '10%',
        width: '70%',
        height: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: '10%',
        position: 'relative',
        zIndex: 1,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex:2,
        position: 'relative',
        zIndex: 1,
    },
    button: {
        position: 'relative',
        zIndex: 1,
    },
    text: {
        alignSelf: 'center',
        position: 'relative',
        zIndex: 1,
    },
    autocomplete: {
        width: '30%',
    },
    amountAndUnit: {
        flexDirection: 'row',
        flex:3,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: 8,
        position: 'relative',
        zIndex: 1,
    }
});

export {AddManually};