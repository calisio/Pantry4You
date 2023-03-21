import { StyleSheet, Text, View, Button, Alert, TextInput, Keyboard, TouchableWithoutFeedback, Pressable } from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';
import { EditQuantity } from './PantryComponents/EditQuantity';
import { setDefaultEventParameters } from 'firebase/analytics';

const Pantry = ({navigation, route}) => {
  const uid = route.params.uid;
  const [isVisible, setFormVisibility] = useState(false);
  const [pantryList, setPantryList] = useState([]);

  let collectionString = "users/" + uid + "/pantry";
  let pantryRef = db.collection(collectionString);
  
  //https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
  const getPantryList = async() => {

    let newPantryList = [];
    let tempDoc;

    await pantryRef.get().then((querySnapshot) => {
      tempDoc = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data()}
      })
    })

    for(let i=0; i < tempDoc.length; i++){
      let item = Object.values(tempDoc[i])[0];
      let qty = Object.values(tempDoc[i])[1];
      let unit = Object.keys(tempDoc[i])[1];
      let newListEntry = [item, qty, unit];
      newPantryList.push(newListEntry);
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
          <Pressable
            style={styles.button}
            onPress={() => setFormVisibility(!isVisible)}
          >
            <Text style={styles.text}>Add Items Manually</Text>
          </Pressable>
          {isVisible ? <AddManually style={styles.addManually} updateFunction={getPantryList}></AddManually>: null}

          <View style={styles.listContainer}>
              {pantryList.map((item) => (
                <Text key={item}>{item[0]}: {item[1]} {item[2]} {"\n"} <EditQuantity item={item} updateFunction={getPantryList}></EditQuantity></Text>
              ))}
          </View>
        </View>
      </TouchableWithoutFeedback>

    );
};
/*
const openScanner = () =>
    Alert.alert('Scan Receipt', 'implement later', [
      {
        text: 'Scan',
        onPress: () => console.log('Scan Pressed'),
        style: 'cancel',
      },
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
    ]);

*/

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
  },
  button: {
    backgroundColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    width: '40%',
    marginBottom: '10%'
  },
  text: {
    alignSelf: 'center',
  }

});

export {Pantry};