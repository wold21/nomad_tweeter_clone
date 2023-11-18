import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmLa17uYcdVemslMdAoS7xcIYvqg5Yl9M",
  authDomain: "twitter-clone-for-react.firebaseapp.com",
  projectId: "twitter-clone-for-react",
  storageBucket: "twitter-clone-for-react.appspot.com",
  messagingSenderId: "350128919759",
  appId: "1:350128919759:web:9d8228fec5f621b2b853ba"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);