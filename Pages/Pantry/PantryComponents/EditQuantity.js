import { Alert, TextInput, View, Button, Text, StyleSheet, Pressable} from "react-native";
import React, {useState} from 'react';
import { db } from '../../../firebase';
import { getAuth } from "firebase/auth";
import { getFoodUnit } from "../../../utils/getFoodUnit";



const EditQuantity = (props) => {
    const [quantity, setQuantity] = useState('');

    const submitHandler = async() => {
        let reg = /^\d+$/;
        console.log("------------------", reg.test(quantity), "------------");
        if(quantity != '' && reg.test(quantity)) //TODO: || is not a number
        {
            let quantityInt = parseInt(quantity);
            if(quantityInt < 0){
                Alert.alert("New quantity cannot be less than 0");
                return;
            }
            else if(quantityInt == 0){
                const auth = getAuth();
                const user = auth.currentUser.uid;
                let editedItem = props.item[0];
                db.collection('users').doc(user).collection('pantry').doc(editedItem).delete().then(() => {
                    console.log(editedItem, " deleted");
                    props.updateFunction();
                })
                .catch((error) => {
                    console.log("error deleting ", editedItem);
                    console.log(error);
                })
            }
            else{
                let editedItem = props.item[0];
                const unit = await getFoodUnit(editedItem);
                const auth = getAuth();
                const user = auth.currentUser.uid;
                let collectionString = "users/" + user + "/pantry";
                let itemRef = db.collection(collectionString).doc(editedItem);
                console.log("EDITED ", editedItem);
                console.log(unit);
                await itemRef.update({
                    [unit]: quantityInt
                }, {merge: true})
                .then(console.log("edited quantity"))
                .then(() => {
                    props.updateFunction();
                });

            }
        }
        else{
            Alert.alert("Please enter a numeric value");
        }
    }

    return(
        <View style={styles.container}>
            <TextInput
                clearButtonMode='always'
                style={styles.input}
                placeholder="Input new quantity"
                onChangeText={newQuantity => setQuantity(newQuantity)}
                defaultValue={""}
                id="quantity"
            />
            <Pressable
                title="Submit"
                onPress={submitHandler}
                style={styles.button}
            >
                <Text style={styles.text}>Submit</Text>
            </Pressable>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: '5%',
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


export {EditQuantity};