import {Button} from 'react-native';

const Home = ({navigation}) => {
    return (
      <Button
        title="Update Pantry"
        onPress={() =>
          navigation.navigate('Pantry')
        }
      />
    );
};

export {Home};