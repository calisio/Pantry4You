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
          <Text key={item.item} style={styles.textItem}>{item.item}: </Text>
          <View style={styles.editQuantity}>
          <EditQuantity item={item.item} updateFunction={getPantryList} qty={item.qty} unit={item.unit}></EditQuantity>
          </View>
      </View>
    );

  };
  //Add to AddManually component : showAC={showAutocomplete} setShowAC={setShowAutocomplete}

    return (
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={dismissKeyboard} style={styles.outerCont}>
          <View style={styles.addItemsCont}>
            <AddManually style={styles.addManually} updateFunction={getPantryList} ></AddManually>
          </View >
          </TouchableWithoutFeedback>
          {(listLoaded && pantryList.length > 0) ? (
            <View style={styles.listCont}>
              <FlatList contentContainerStyle={styles.list}
                data={pantryList}
                renderItem={PantryListComp}
                keyExtractor={(item) => item.item}
                ListHeaderComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (<View></View>)}

        </View>
    );
};

const styles = StyleSheet.create({
  outerCont:{
    zIndex: 0
  },
  listCont:{
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 500,
  },
  list:{
    paddingBottom: 400,
  },
  container: {
    alignContent: 'center',
  },
  addItemsCont: {
    padding:'3%',
    zIndex: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: '20px',
    textAlign: 'center'
  },
  edit:{
    zIndex: 1,
  },
  textItem: {
    marginRight: 5,
    flex:1, 
    textAlign:'center',
  },
  addManually:{
    zIndex: 1
  },
  listItemCont: {
    width: 345,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#ffffff',
    borderWidth: '3px',
  },
  editQuantity: {
    alignItems: 'center',
    flex:3,
  }
});

export {Pantry};