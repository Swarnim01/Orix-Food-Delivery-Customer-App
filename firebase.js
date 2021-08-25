import * as firebase from 'firebase';

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBKun4Pf5hXjoc8HQzT_XfRbCwZYAyN2gg',
  authDomain: 'orix-fa245.firebaseapp.com',
  projectId: 'orix-fa245',
  storageBucket: 'orix-fa245.appspot.com',
  messagingSenderId: '118156454181',
  appId: '1:118156454181:web:14bfa1f3062ce6583592cc',
  measurementId: 'G-2W4M56NW4H',
};

let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else{
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db , auth , firebase};
