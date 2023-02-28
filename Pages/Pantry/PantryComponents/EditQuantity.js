import { Alert, TextInput, View, Button, Text, Keyboard, TouchableWithoutFeedback} from "react-native";
import React, {useState} from 'react';
import { db } from '../../../firebase';
import { getAuth } from "firebase/auth";



const EditQuantity = (props) => {
    const [quantity, setQuantity] = useState('');

    const submitHandler = async() => {
        if(quantity != '') //TODO: || is not a number
        {
            let quantityInt = parseInt(quantity);
            if(quantityInt < 0){
                Alert.alert("New quantity cannot be less than 0");
                return;
            }
            else{
                const auth = getAuth();
                const user = auth.currentUser.uid;
                let collectionString = "users/" + user + "/pantry";
                let pantryRef = db.collection(collectionString).doc("pantry");
                let editedItem = props.item[0];
                console.log("EDITED");
                console.log(editedItem);

                await pantryRef.update({
                    [editedItem]: quantityInt
                }, {merge: true})
                .then(console.log("edited quantity"))
                .then(() => {
                    props.updateFunction();
                });

            }
        }
        else{
            Alert.alert("Please enter a number")
        }
    }

    return(
        <View>
            <TextInput
                clearButtonMode='always'
                style={{height: 30}}
                placeholder="Input new quantity"
                onChangeText={newQuantity => setQuantity(newQuantity)}
                defaultValue={""}
                id="quantity"
            />
            <Text style={{padding: 10, fontSize: 42}}>
            </Text>
            <Button
                title="Submit"
                onPress={submitHandler}
            />
        </View>
    );
};

export {EditQuantity};