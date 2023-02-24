import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';

// https://reactnative.dev/docs/handling-text-input

const AddManually = () => {
    const [text, setText] = useState('');
    

    //for MVP assume quantity is always 1


    return (
        <View style={{padding: 10}}>
        <TextInput
            style={{height: 40}}
            placeholder="Enter item here"
            onChangeText={newText => setText(newText)}
            defaultValue={text}
        />
        <Text style={{padding: 10, fontSize: 42}}>
        </Text>
        <Button
            title="SUBMIT"
            onPress={() => {
                    if(this.text != ''){
                        console.log("input not blank");
                        //send item to db with quantity = 1
                    }

                }
            }
        />
        </View>
    );
};

export {AddManually};