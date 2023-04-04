import * as Location from "expo-location"
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';


export async function setLocation(){

    const auth = getAuth();
    const user = auth.currentUser.uid;

    const userRef = doc(db, 'users', user);

    let {status} = await Location.requestForegroundPermissionsAsync()
    .catch((error) => {
        console.log("Error getting location");
    });
    // console.log("status: ",status);

    if(status == 'granted'){
        console.log("location permission granted");
        const loc = await Location.getCurrentPositionAsync();
        await setDoc(userRef, {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
        }, {merge: true});
        // setLatitude(loc.coords.latitude);
        // setLongitude(loc.coords.longitude);
        console.log("location: \n",loc.coords);
    }
    else{
        console.log("location permission not granted");
    }


}