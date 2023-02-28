import { StyleSheet, Text, View, Button, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';
import { EditQuantity } from './PantryComponents/EditQuantity';

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {/* <Button
            title="Scan Receipt"
            onPress={openScanner}
          /> */}
          <Button
            title="Add Items Manually"
            onPress={() => setFormVisibility(!isVisible)}
          />
          {isVisible ? <AddManually style={styles.addManually} updateFunction={getPantryList}></AddManually>: null}

          <View style={styles.listContainer}>
              {pantryList.map((item) => (
                <Text key={item}>{item[0]}: {item[1]} {"\n"} <EditQuantity item={item} updateFunction={getPantryList}></EditQuantity></Text>
              ))}
          </View>
        </View>
      </TouchableWithoutFeedback>

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



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  listContainer: {
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop: '10%',
  }

});

export {Pantry};