import { db } from "../firebase";


export async function setFoodUnit(item, unit){

    const unitListRef = db.collection('foodUnits').doc('units')

    unitListRef.update({
        [item]: unit
    }, {merge: true});

    return 0; 
}