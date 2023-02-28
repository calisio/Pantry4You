import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
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

    

    let collectionString = "users/" + user + "/pantry";
    let pantryRef = db.collection(collectionString).doc("pantry");

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
        }
        else{
            Alert.alert("Fill out both fields");
        }
    }


    const getCurrentPantry = async() => {
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



    return (
        <View style={{padding: 10}}>
        <TextInput 
            clearButtonMode='always'
            style={{height: 40}}
            placeholder="Enter item here"
            onChangeText={newItem => setItem(newItem)}
            defaultValue={""}
            id="item"
        />
        <Text style={{padding: 10, fontSize: 42}}>
        </Text>
        <TextInput
            clearButtonMode='always' //this doesn't work - how to clear text input?
            style={{height: 40}}
            placeholder="Enter quantity here"
            onChangeText={newQuantity => setQuantity(newQuantity)}
            defaultValue={""}
            id="quantity"
        />
        <Text style={{padding: 10, fontSize: 42}}>
        </Text>
        <Button
            title="SUBMIT"
            onPress={submitHandler}
        />
        </View>
    );
};

export {AddManually};