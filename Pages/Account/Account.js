import { StyleSheet, Text, View, Button } from 'react-native';
import React, {useState} from 'react';


const Account = ({navigation, route}) => {
    const handleLogout = route.params.handleLogout;
    const uid = route.params.uid;

    const handleSubmit = () => {
        console.log(handleLogout)
        handleLogout();
    };

    return (
        <View>
            <Button title="Log Out" onPress={() => handleSubmit()} />
            <Text> Hello, {uid} </Text>
        </View>
    );
};

export {Account};