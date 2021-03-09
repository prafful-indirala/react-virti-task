import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBvbilgK1b3f3oYxq7GBwbgo7KR68I3eE4",
  authDomain: "praffullog-b6ae5.firebaseapp.com",
  databaseURL: "https://praffullog-b6ae5.firebaseio.com",
  projectId: "praffullog-b6ae5",
  storageBucket: "praffullog-b6ae5.appspot.com",
  messagingSenderId: "792648091730",
  appId: "1:792648091730:web:ed7e8b59f8c18799bfb78b",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
