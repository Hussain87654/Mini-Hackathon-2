const firebaseConfig = {
    apiKey: "AIzaSyAnJphQLLn1d2psk4NIh_WyTbcbJ3AWSsQ",
    authDomain: "mini-hackathon-54f46.firebaseapp.com",
    projectId: "mini-hackathon-54f46",
    storageBucket: "mini-hackathon-54f46.firebasestorage.app",
    messagingSenderId: "195031839942",
    appId: "1:195031839942:web:e46ed171ecb34505ea93c7",
    measurementId: "G-31E66X91RZ"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
