import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//https://stackoverflow.com/questions/66879378/typeerror-undefined-is-not-an-object-evaluating-app-firestore

const firebaseConfig = {
    apiKey: "AIzaSyCjsh6Mj0fxTwcd5rwbk11ow3UATgpwrw8",
    authDomain: "pantry4you-bf048.firebaseapp.com",
    projectId: "pantry4you-bf048",
    storageBucket: "pantry4you-bf048.appspot.com",
    messagingSenderId: "951653716590",
    appId: "1:951653716590:web:a5c9df4baaf8b9fef2cc7f",
    measurementId: "G-MV5KGDBTTJ"
  };

let app;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}
else{
  app = firebase.app();
}


//console.log(firebase);
const auth = firebase.auth();
const db = firebase.firestore();

export { db, auth };
