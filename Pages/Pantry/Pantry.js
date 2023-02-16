import {Button, Alert} from 'react-native';

const Pantry = ({navigation}) => {
    return (
      <Button
        title="Add Items"
        onPress={openScanner}
      />
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

export {Pantry};