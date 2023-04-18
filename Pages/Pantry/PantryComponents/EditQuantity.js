import { Alert, TextInput, View, Text, StyleSheet, Pressable} from "react-native";
import React, {useState} from 'react';
import { db } from '../../../firebase';
import { getAuth } from "firebase/auth";
import { getFoodUnit } from "../../../utils/getFoodUnit";
import { Button, Input, VStack} from 'native-base';



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
                    setQuantity('');
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

    const decrementQuantity = () => {
        if (quantity > 0) {
          setQuantity(quantity - 1);
        }
      }
    
      const incrementQuantity = () => {
        setQuantity(quantity + 1);
      }

      const handleChangeText = (text) => {
        // You can add validation or custom logic here if needed
        setQuantity(parseInt(text));
      }

    return(
        // <View style={styles.container}>
        //     {/* <Text> {props.unit} </Text>
        //     <Input
        //         placeholder={""+ quantity}
        //         onChangeText={(newQuantity) => setQuantity(newQuantity)}
        //         defaultValue={"" + quantity}
        //         id="quantity"
        //         InputLeftElement= {<Button size='xs' rounded='none' w="1/6" h="full" onPress={()=> setQuantity(quantity-1)}>Minus </Button>}
        //         InputRightElement={<Button size='xs' rounded='none' w="1/6" h="full" onPress={()=> setQuantity(quantity-1)}> Plus </Button>}
        //     />
        //     <Button title="Submit" onClick={() => submitHandler()}> </Button> */}
        //     <Input w="100%" py="0" InputLeftAddon= {<Button size='xs' rounded='none' w="1/6" h="full" onPress={()=> setQuantity(quantity-1)}>Minus</Button>}
        //     InputRightAddon={<Button size='xs' rounded='none' w="1/6" h="full" onPress={()=> setQuantity(quantity-1)}>Plus</Button>}
        //     placeholder={""+ quantity}/>
        // </View>
        <View style={styles.container} alignItems="center">
        <Input
            w="50%"
            py={0}
            InputLeftAddon={
            <Button size='xs' roundedLeft='none' onPress={decrementQuantity}>
                Minus
            </Button>
            }
            InputRightAddon={
            <Button size='xs' roundedRight='none' onPress={incrementQuantity}>
                Plus
            </Button>
            }
            placeholder={`Quantity: ${quantity}`}
            value={quantity.toString()}
            keyboardType="numeric"
            textAlign="center"
            onChangeText={handleChangeText}
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