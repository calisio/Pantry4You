import { StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';
import { EditQuantity } from './PantryComponents/EditQuantity';
import { FlatList} from 'react-native-gesture-handler';


const Pantry = ({navigation, route}) => {
  const uid = route.params.uid;
  const [pantryList, setPantryList] = useState([]);
  const [listLoaded, setListLoaded] = useState(false);
  // const [showAutocomplete, setShowAutocomplete] = useState(true);

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
      let newListEntry = {"item": item, "qty": qty, "unit":unit};
      newPantryList.push(newListEntry);
    }
    console.log("pantryList set");
    setPantryList(newPantryList);
    setListLoaded(true);
  }

  useEffect(() => {
    getPantryList()
  }, []);
  

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    // setShowAutocomplete(false);
  };


  const PantryListComp = ({ item }) => {
    return(
      <View style={styles.listItemCont}>
        <Text key={item.item}  style={styles.text}>{item.item}: {item.qty} {item.unit} {"\n"}<EditQuantity item={item.item} updateFunction={getPantryList} qty={item.qty} unit={item.unit}></EditQuantity></Text>
      </View>
    );

  };
  //Add to AddManually component : showAC={showAutocomplete} setShowAC={setShowAutocomplete}

    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard} style={styles.outerCont}>
        <View style={styles.container}>

          <View style={styles.addItemsCont}>
            <Text style={styles.header}>Add Items</Text>
            <AddManually style={styles.addManually} updateFunction={getPantryList} ></AddManually>
          </View >

          {(listLoaded && pantryList.length > 0) ? (
            <View style={styles.listCont}>
              <FlatList contentContainerStyle={styles.list}
                data={pantryList}
                renderItem={PantryListComp}
                keyExtractor={(item) => item.item}
                ListHeaderComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (<View></View>)}

        </View>
      </TouchableWithoutFeedback>

    );
};

const styles = StyleSheet.create({
  outerCont:{
    zIndex: 0
  },
  listCont:{
    borderWidth: 2,
  },
  list:{
    paddingBottom: 400
  },
  addItemsCont: {
    padding:'5%',
    zIndex: 1,
    backgroundColor: '#cccccc'
  },
  header: {
    fontSize: '20px',
    textAlign: 'center'
  },
  edit:{
    zIndex: 1,
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
    height: 80,
    zIndex: 0,
    borderColor: '#ffffff',
    borderWidth: '3px',
    textAlign: 'center',
    backgroundColor: '#e57507',
    fontSize: 16
  },
  addManually:{
    zIndex: 1
  },
  listItemCont: {
    height: 100
  }

});

export {Pantry};