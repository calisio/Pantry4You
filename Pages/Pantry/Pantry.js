import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';
import { getAuth } from "firebase/auth";

const Pantry = ({navigation, route}) => {
  const uid = route.params.uid;
  const [isVisible, setFormVisibility] = useState(false);
  const [pantryList, setPantryList] = useState([]);

  let collectionString = "users/" + uid + "/pantry";
  let pantryRef = db.collection(collectionString).doc("pantry");
  //https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
  const getPantryList = async() => {

    let pantryObj = await pantryRef.get();
    let newPantryList = [];
    console.log(pantryObj.data());
      for(let i = 0; i < Object.keys(pantryObj.data()).length; i++){
        let key = Object.keys(pantryObj.data())[i];
        let val = Object.values(pantryObj.data())[i];
        let newListEntry = [key, val];
        newPantryList.push(newListEntry)
      }
    setPantryList(newPantryList);
  }

  useEffect(() => {
    getPantryList()
  }, []);

    return (
      <View>
        <Button
          title="Scan Receipt"
          onPress={openScanner}
        />
        <Button
          title="Add Items Manually"
          onPress={() => setFormVisibility(!isVisible)}
        />
        {isVisible ? <AddManually updateFunction={getPantryList}></AddManually>: null}
        <Text>
          {pantryList.map((item) => (
            <Text key={item}>{item[0]}: {item[1]} {"\n"}</Text>
          ))}
        </Text>
      </View>

    );
};

const openScanner = () =>
    Alert.alert('Scan Receipt', 'implement later', [
      {
        text: 'Scan',
        onPress: () => console.log('Scan Pressed'),
        style: 'cancel',
      },
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
    ]);



export {Pantry};