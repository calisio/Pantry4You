import { StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';
import { EditQuantity } from './PantryComponents/EditQuantity';

const Pantry = ({navigation, route}) => {
  const uid = route.params.uid;
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
      <TouchableWithoutFeedback onPress={dismissKeyboard} style={styles.outerCont}>
        <View style={styles.container}>

          <View style={styles.addItemsCont}>
            <Text style={styles.header}>Add Items</Text>
            <AddManually style={styles.addManually} updateFunction={getPantryList}></AddManually>
          </View>

          <View style={styles.listContainer}>
              {pantryList.map((item) => (
                <Text key={item} style={styles.text}>{item[0]}: {item[1]} {item[2]} {"\n"} <EditQuantity item={item} updateFunction={getPantryList} style={styles.edit}></EditQuantity></Text>
              ))}
          </View>

        </View>
      </TouchableWithoutFeedback>

    );
};

const styles = StyleSheet.create({
  outerCont:{
    zIndex: 0
  },
  addItemsCont: {
    borderColor: '#000000',
    borderWidth: '2px',
    padding:'5%'
  },
  header: {
    fontSize: '20px',
    textAlign: 'center'
  },
  edit:{
    zIndex: 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    zIndex: 0
  },
  listContainer: {
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop: '10%',
    zIndex: 0
  },
  button: {
    backgroundColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    width: '40%',
    marginBottom: '10%',
    zIndex: 0
  },
  text: {
    alignSelf: 'center',
    zIndex: 0
  },
  addManually:{
    zIndex: 1
  }

});

export {Pantry};