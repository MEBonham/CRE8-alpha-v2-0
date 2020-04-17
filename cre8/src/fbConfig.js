import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDvRDd63nO1bbWo_iOVyHY4LWRhC9Q9bPY",
    authDomain: "cre8-alpha.firebaseapp.com",
    databaseURL: "https://cre8-alpha.firebaseio.com",
    projectId: "cre8-alpha",
    storageBucket: "cre8-alpha.appspot.com",
    messagingSenderId: "1029610238711",
    appId: "1:1029610238711:web:d2b8920d1528d2eed199f2"
};

// Export an instance of a firebase object, so that auth() and database() don't have to run every time components load
class Firebase {
    constructor() {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
    }
}

export default new Firebase();