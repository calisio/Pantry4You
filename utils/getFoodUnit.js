import { db } from "../firebase";


export async function getFoodUnit(item){
    let unitList = await db.collection('foodUnits').doc('units').get();
    console.log(Object.keys(unitList.data()));
    if(unitList.data().hasOwnProperty(item)){
        console.log("unit exists");
        // console.log(unitList.data()[item]);
        return unitList.data()[item];
    }
    else{
        console.log("unit DNE");
        //TODO: insert new unit
        return "item";
    }
}