import { StyleSheet, Text, View, Keyboard, TouchableOpacity, SafeAreaView } from 'react-native';
import React, {useCallback, useState} from 'react';
import Autocomplete from 'react-native-autocomplete-input';

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
        setPossibleFoods([]);
        dismissKeyboard();
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    return(
        <SafeAreaView>
            <View style={styles.autocompleteContainer}>
                <Autocomplete
                    value={query}
                    data={ possibleFoods }
                    onChangeText={filterFoods}
                    placeholder="Enter food here"
                    flatListProps={{
                        keyboardShouldPersistTaps: 'always',
                        renderItem: ({item}) => (
                            <TouchableOpacity onPress={() => handlePress(item)} >
                              <Text style={styles.itemText}>{item}</Text>
                            </TouchableOpacity>
                          ),
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    itemText: {
      fontSize: 15,
      margin: 2,
      zIndex: 1,
      backgroundColor: '#c2c2c2'
    },
    saveView: {
        flex: 1,
    },
    autocompleteContainer: {
        // Hack required to make the autocomplete
        // work on Andrdoid
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        padding: 5,
        backgroundColor: '#ffffff',
    }
    });

export { MyAutocomplete };

