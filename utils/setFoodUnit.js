import { db } from "../firebase";


export async function setFoodUnit(item, unit){

    const unitListRef = db.collection('foodUnits')

    // unitListRef.update({
    //     [item]: unit
    // }, {merge: true});

    unitListRef.doc(item).set({
        Food: [item],
        Unit: [unit]
    })

    return 0; 
}