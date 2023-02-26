import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';
import { db } from '../../../firebase';
import { doc, setDoc, updateDoc } from "firebase/compat/firestore"; 


// https://reactnative.dev/docs/handling-text-input

const AddManually = () => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');

    //TODO: change to active user
    let pantryRef = db.collection("pantries").doc("ppp0bWqpMhBH2lPSzVQsc1R");
    

    const submitHandler = async() => {
        //TODO: make sure quantity is a number
        if(item != '' && quantity != ''){
            console.log("------------input-------------------");
            console.log(item);
            console.log(quantity);

            //TODO: clear TextInput
            //setItem('');
            //setQuantity('');

            //TODO: check if item exists, increment quantity in that case
            await pantryRef.update({
                [item]: quantity
            }, {merge: true})
            .then(console.log("updated"));

        }
        else{
            Alert.alert("Fill out both fields");
        }
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