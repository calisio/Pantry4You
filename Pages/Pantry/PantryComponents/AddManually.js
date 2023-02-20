import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';

// https://reactnative.dev/docs/handling-text-input

const AddManually = () => {
    const [text, setText] = useState('');
    


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
        </View>
    );
};

export {AddManually};