import { db } from "../firebase";


export async function getFoodUnit(item){

    const unitListRef = db.collection('foodUnits').doc('units')

    let unitList = await unitListRef.get();
    // console.log(Object.keys(unitList.data()));
    if(unitList.data().hasOwnProperty(item)){
        console.log("unit exists");
        // console.log(unitList.data()[item]);
        return unitList.data()[item];
    }
    else{
        console.log("unit DNE");
        //New unit is inserted in AddManully by calling setFoodUnit
        return "insertNewUnit"; 
    }
}