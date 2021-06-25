const firebase = require('firebase')

const firebaseConfig = {
    apiKey: "AIzaSyCffiHLkMRE-1hyFk6_jtTc3YQOX0nXgp4",
    authDomain: "nabung-7be33.firebaseapp.com",
    projectId: "nabung-7be33",
    storageBucket: "nabung-7be33.appspot.com",
    messagingSenderId: "848083070466",
    appId: "1:848083070466:web:7c324497600d946a01011b"
};
  
const fire = firebase.initializeApp(firebaseConfig);
module.exports = fire;