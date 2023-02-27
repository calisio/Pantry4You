import {Button} from 'react-native';
import GetRecipes from './GetRecipes';

GetRecipes();

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