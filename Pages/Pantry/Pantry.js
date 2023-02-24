import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState, useEffect} from 'react';
//import { getTest2, insertItemIntoPantry, deleteItemFromPantry, getPantry } from '../../App';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from "firebase/compat/firestore";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Pantry = ({navigation}) => {
  const [isVisible, setFormVisibility] = useState(false);

  const [data1, setData] = useState([]);
  const [data2, setData2] = useState([]);
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
    //let pantryMap = new Map([]);
    console.log("-------------");
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
    console.log(pantryList);

    // for(const doc of allPantries.docs){
    //   let objectList = Object.values(doc.data());
    //   //console.log(objectList);
    //   for(const o of objectList){
    //     console.log(o);
    //   }
    //   // for(let i = 0; i < (objectList.length / 2); i++){
    //   //   console.log(objectList[i]);
    //   // }
    //   //pantryList.push(Object.values(doc.data()));
    // }
        // .onSnapshot((querySnapshot) => {
        //   const data = [];
        //   querySnapshot.forEach((doc) => {
        //     data.push({ userId: doc.userId, ...doc.data() });
        //   });

          //TODO: manipulate data into a list

          //setPantryList(data);
        //});
  }


  useEffect(() => {
    // const testData = async() => {
      
    //   console.log("data here-------------");
      
    //   let data11 = await data1;

    //   //console.log(data11);

    //   console.log(Object.keys((Object.values(Object.values(data11[1])))[1])[0]);
    //   await setData2(Object.keys((Object.values(Object.values(data11[1])))[1])[0]);
    // }
    // return () => testData();
    return(() => {
      getPantryList(); 
    })

    // return pantryList.map(({item, quantity}) => {
    //   return(
    //     <Text>
    //       {item} : {quantity}
    //     </Text>
    //   )
    // })

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



// function getPantryTest(db2) {
//   console.log("display pantry:");
//   console.log(getTest(db2));
// }

// async function getTest(db1){
//   const usersCol = collection(db1, 'users');
//   const userSnapshot = await getDocs(usersCol);
//   const userList = userSnapshot.docs.map(doc => doc.data());
//   return userList;
// }



export {Pantry};