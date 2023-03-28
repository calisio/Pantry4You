import { Alert } from "react-native";
import { db } from "../firebase";


export async function getFoodUnit(item){

    const unitRef = db.collection('foodUnits').doc(item)

    let unit = await unitRef.get();
    // console.log(Object.keys(unitList.data()));
    if(unit.exists){
        console.log("unit exists");
        //console.log(unit.get("Unit"));
        // console.log(unitList.data()[item]);
        return unit.get("Unit");
    }
    else{
        console.log("unit DNE");
        Alert.alert("This item is not supported by our database");
        //New unit is inserted in AddManully by calling setFoodUnit
        // return "insertNewUnit"; 
        return null;
    }
}