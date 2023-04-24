import { Alert, TextInput, View, Text, StyleSheet, Pressable} from "react-native";
import React, {useState, useEffect} from 'react';
import { db } from '../../../firebase';
import { getAuth } from "firebase/auth";
import { getFoodUnit } from "../../../utils/getFoodUnit";
import { Button, Input, VStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const EditQuantity = (props) => {
    const [quantity, setQuantity] = useState(props.qty);
    const unit = props.unit;
    console.log(props);

    useEffect(() => {
      setQuantity(props.qty);
    }, [props])
    
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
                });
                let alertString = props.item + " deleted";
                Alert.alert(alertString);
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
                    setQuantity(quantity);
                    props.updateFunction();
                });
                let alertString = "quantity of " + props.item + " updated";
                Alert.alert(alertString);
            }
        }
        else{
            Alert.alert("Please enter a positive numeric value");
        }
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

      const deleteItem = async () => {
        try {
          console.log('hello');
          const auth = getAuth();
          const user = auth.currentUser.uid;
          let editedItem = props.item;
          await db
            .collection('users')
            .doc(user)
            .collection('pantry')
            .doc(editedItem)
            .delete();
          console.log(editedItem, ' deleted');
          props.updateFunction();
          let alertString = props.item + ' deleted';
          Alert.alert(alertString);
        } catch (error) {
          console.log('error deleting ', editedItem);
          console.log(error);
        }
      };
      

    return(
        <View style={styles.quantityRow}>
                <Button size='xs' h={10} borderRadius={30} onPress={decreaseQuantity} variant="subtle">
                    <MaterialCommunityIcons name="minus" color="black"/>
                </Button>
                <Input
                w={12}
                h={12}
                style={styles.quantityInput}
                value={quantity}
                placeholder={"" + quantity}
                defaultValue={"" + quantity}
                id="quantity"
                rounded='none'
                keyboardType="numeric"
            />
            <Button size='xs' h={10} borderRadius={30} onPress={increaseQuantity} variant="subtle">
                <MaterialCommunityIcons name="plus" color="black"/>
            </Button> 
            <Text style={styles.unit}>{unit}</Text>
            <Button size='xs' h={10} style={{ marginRight: 5 }} onPress={submitHandler}> <MaterialCommunityIcons name="check" color="white"/> </Button>
            <Button size='xs' h={10} onPress={deleteItem}> <MaterialCommunityIcons name="trash-can-outline" color="white"/> </Button>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    input: {
        backgroundColor: 'white',
        width: '30%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: '5%',
        marginLeft: 0
    },
    text: {
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    quantityRow: {
        flexDirection: 'row',
        position: 'relative',
        bottom: 0,
        alignItems: 'center',
    },
    quantityInput: {
        textAlign:"center",
        backgroundColor: 'white'
    },
    unit: {
        flex:1,
        textAlign: 'center'
    }
});


export {EditQuantity};