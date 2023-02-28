import {Text} from 'react-native';
import GetRecipes from './GetRecipes';

const Home = ({navigation, route}) => {
  const uid = route.params.uid;
  GetRecipes(uid);
    return (
      <Text>Hello, {uid}</Text>
    );
};

export {Home};