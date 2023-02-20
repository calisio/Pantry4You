import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { AddManually } from './PantryComponents/AddManually';
import React, {useState} from 'react';

const Pantry = ({navigation}) => {
  const [isVisible, setVisibility] = useState(false);

    return (
      <View>
        <Button
          title="Scan Receipt"
          onPress={openScanner}
        />
        <Button
          title="Add Items Manually"
          onPress={() => setVisibility(!isVisible)}
        />
        {isVisible ? <AddManually></AddManually>: null}
      </View>

    );
};

const openScanner = () =>
    Alert.alert('Scan Receipt', 'implement later', [
      {
        text: 'Scan',
        onPress: () => console.log('Scan Pressed'),
        style: 'cancel',
      },
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
    ]);

// const displayAddManually = () => {
//     setVisibility(true);
    
// };

export {Pantry};