import { StyleSheet, Text, View, Button } from 'react-native';
import React, {useState} from 'react';


const Account = ({navigation, route}) => {
    const handleLogout = route.params.handleLogout;

    const handleSubmit = () => {
        console.log(handleLogout)
        handleLogout();
    };

    return (
        <View>
            <Button title="Log Out" onPress={() => handleSubmit()} />
        </View>
    );
};

export {Account};