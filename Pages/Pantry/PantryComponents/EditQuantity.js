import { Alert, TextInput, View, Text, StyleSheet, Pressable} from "react-native";
import React, {useState} from 'react';
import { db } from '../../../firebase';
import { getAuth } from "firebase/auth";
import { getFoodUnit } from "../../../utils/getFoodUnit";



const EditQuantity = (props) => {
    const [quantity, setQuantity] = useState(props.qty);
    console.log(props.item);

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
                let editedItem = props.item;
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
                let editedItem = props.item;
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
                    setQuantity('');
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
            <Pressable
                title="Submit"
                onPress={submitHandler}
                style={styles.button}
            >
                <Text style={styles.text}>Change Quantity</Text>
            </Pressable>
            <Text> {props.unit} </Text>
            <TextInput
                clearButtonMode='always'
                style={styles.input}
                placeholder={""+ quantity}
                textAlign= 'right'
                onChangeText={newQuantity => setQuantity(newQuantity)}
                defaultValue={""}
                id="quantity"
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        marginTop:'5%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        zIndex: 0,
    },
    input: {
        backgroundColor: 'white',
        width: '30%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: '5%',
        zIndex: 0,
        marginLeft: 0
    },
    button: {
        backgroundColor: '#CCCCCC',
        borderRadius: 8,
        padding: 5,
        zIndex: 0,
        width: '50%',
        marginHorizontal: '2%'
    },
    text: {
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'center'
    }

});


export {EditQuantity};