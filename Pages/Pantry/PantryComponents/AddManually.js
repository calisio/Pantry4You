import { StyleSheet, Text, View, Button, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, {useState} from 'react';
import { db } from '../../../firebase';
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";

// https://reactnative.dev/docs/handling-text-input

const AddManually = (props) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');

    const auth = getAuth();
    const user = auth.currentUser.uid;

    const createPantryIfItDoesntExist = async(itemInput, quantityInput) => {
        db.collection('users').doc(user).get()
        .then(doc => {
          if(doc.exists){
            console.log("doc exists");
            db.collection('users').doc(user).collection('pantry').get()
            .then(sub => {
              if(sub.docs.length == 0){
                console.log("0 subcoll");
                db.collection('users').doc(user).collection('pantry').doc('pantry').set({
                  [itemInput]: quantityInput
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
        if(item != '' && quantity != ''){
            let quantityInt = parseInt(quantity);
            //TODO: clear TextInput
            //setItem('');
            //setQuantity('');

            await createPantryIfItDoesntExist(item, quantityInt);
            console.log("check");
            let currentItems = await getCurrentPantry();
            let itemExists = false;

            for(let i = 0; i < currentItems.length; i++){
                if(currentItems[i][0] == item){
                    itemExists = true;
                    break;
                }
            }

            let collectionString = "users/" + user + "/pantry";
            let pantryRef = db.collection(collectionString).doc("pantry");

            if(itemExists){
                await pantryRef.update({
                    [item]: firebase.firestore.FieldValue.increment(quantityInt)
                }, {merge: true})
                .then(console.log("incremented current field"));
            }
            else{
                await pantryRef.update({
                    [item]: quantityInt
                }, {merge: true})
                .then(console.log("added new field"));
            }

            props.updateFunction();
            setItem('');
            setQuantity('');
        }
        else{
            Alert.alert("Fill out both fields");
        }
    }


    const getCurrentPantry = async() => {

        let collectionString = "users/" + user + "/pantry";
        let pantryRef = db.collection(collectionString).doc("pantry");

        let pantryObj = await pantryRef.get();
        let curPantryList = [];

        for(let i = 0; i < Object.keys(pantryObj.data()).length; i++){
            let key = Object.keys(pantryObj.data())[i];
            let val = Object.values(pantryObj.data())[i];
            let listEntry = [key, val];
            curPantryList.push(listEntry)
        }

        return curPantryList;
    }


    const dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    return (
            <View style={styles.container}>
               
                    <TextInput 
                        value={item}
                        clearButtonMode='always'
                        style={styles.input}
                        placeholder="Enter item here"
                        onChangeText={newItem => setItem(newItem)}
                        defaultValue={""}
                        id="item"
                    />
                    <TextInput
                        value={quantity}
                        clearButtonMode='always' //this doesn't work - how to clear text input?
                        style={styles.input}
                        placeholder="Enter quantity here"
                        onChangeText={newQuantity => setQuantity(newQuantity)}
                        defaultValue={""}
                        id="quantity"
                    />
                    <Button
                        title="Add Item"
                        onPress={submitHandler}
                    />
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
      }
});

export {AddManually};