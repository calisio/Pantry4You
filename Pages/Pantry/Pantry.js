import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';


const Pantry = ({navigation}) => {
  
  const [isVisible, setFormVisibility] = useState(false);

  const [pantryList, setPantryList] = useState([]);

  //https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
  const getPantryList = async() => {
    
    //TODO: replace hardcoded userId w/ currently logged in user
    let pantriesRef = db.collection("pantries").where('userId', '==', '0bWqpMhBH2lPSzVQsc1R');

    //---------------this works also-----------------
    // pantriesRef.where('userId', '==', '0bWqpMhBH2lPSzVQsc1R').get()
    // .then((querySnapshot) => {
    //   const data = querySnapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   console.log(data);
    // })

    let pantryObj = await pantriesRef.get();
    //console.log("-------------");
    //console.log((pantryObj.empty ? "empty" : "false"));

    let newPantryList = [];

    //TODO: outer loop only runs once - how to remove?
    for(const doc of pantryObj.docs){
      for(let i = 0; i < Object.keys(doc.data()['pantry']).length; i++){
        let key = Object.keys(doc.data()['pantry'])[i];
        let val = Object.values(doc.data()['pantry'])[i];
        let newListEntry = [key, val];
        newPantryList.push(newListEntry)
      }
    }

    setPantryList(newPantryList);
    //console.log(pantryList);
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
        {isVisible ? <AddManually></AddManually>: null}
        <Text>
          {pantryList.map((item) => (
            <Text>{item[0]}: {item[1]} {"\n"}</Text>
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