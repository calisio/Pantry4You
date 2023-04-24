import { StyleSheet, Text, View, Keyboard, TouchableOpacity, SafeAreaView } from 'react-native';
import React, {useCallback, useState} from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import { Input } from 'native-base';

const MyAutocomplete = (props) => {
    const [query, setQuery] = useState('');
    const [possibleFoods, setPossibleFoods] = useState([]);

    const filterFoods = useCallback((query) => {
        query = query.toLowerCase();
        setQuery(query);
        console.log("filter foods");
        if(query){
            console.log("if");
            console.log(query);
            setPossibleFoods(
                props.foods.filter((food) => food.includes(query))
            );
            props.updateItemFunction(query);
        }
        else{
            console.log("else");
            setPossibleFoods([]);
        }
    }, []);

    const handlePress = (item) => {
        console.log("press");
        setQuery(item);
        props.updateItemFunction(item);
        props.updateUnitFunction(props.foodUnits[item]);
        setPossibleFoods([]);
        dismissKeyboard();
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    return(
        <SafeAreaView style={styles.autocompleteContainer}>
                <Autocomplete
                    value={query}
                    data={ possibleFoods }
                    onChangeText={filterFoods}
                    placeholder="Enter food here"
                    style={styles.addItemsInput}
                    flatListProps={{
                        keyboardShouldPersistTaps: 'always',
                        renderItem: ({item}) => (
                            // <View> 
                                // /* {props.showAutocomplete && ( */}
                                    <TouchableOpacity onPress={() => handlePress(item)} >
                                        <Text style={styles.itemText}>{item}</Text>
                                    </TouchableOpacity>
                                // /* )} */}
                            // /* </View> */
                          ),
                    }}
                />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    itemText: {
      fontSize: 15,
      margin: 2,
      zIndex: 1,
      backgroundColor: '#c2c2c2',
      paddingVertical: 10,
    },
    saveView: {
        flex: 1,
    },
    autocompleteContainer: {
        // Hack required to make the autocomplete
        // work on Andrdoid
        padding: 5,
        backgroundColor: '#ffffff',
    },
    });

export { MyAutocomplete };

