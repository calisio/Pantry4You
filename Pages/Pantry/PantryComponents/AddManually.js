import { StyleSheet, Text, View, Button, Alert, TextInput, Keyboard, TouchableWithoutFeedback, Pressable } from 'react-native';
import React, {useState} from 'react';
import { db } from '../../../firebase';
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { SelectList } from 'react-native-dropdown-select-list';
import { getFoodUnit } from '../../../utils/getFoodUnit';
import { setFoodUnit } from '../../../utils/setFoodUnit';


const dismissKeyboard = () => {
    Keyboard.dismiss();
}

// https://reactnative.dev/docs/handling-text-input

const AddManually = (props) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');

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
        //TODO: make sure quantity is a number
        let reg = /^\d+$/;
        if(!reg.test(quantity)){
            Alert.alert("Please enter a numeric quantity");
            return;
        }
        if(item != '' && quantity != '' && selectedUnit != ''){
            let quantityInt = parseInt(quantity);

            let foodUnit = await getFoodUnit(item);

            if(foodUnit == selectedUnit || foodUnit == "insertNewUnit"){
                
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


    

    return (
            <View style={styles.container}>
               
                    <TextInput 
                        value={item}
                        style={styles.input}
                        placeholder="Enter item here"
                        onChangeText={newItem => setItem(newItem.toLowerCase())}
                        defaultValue={""}
                        id="item"
                    />
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