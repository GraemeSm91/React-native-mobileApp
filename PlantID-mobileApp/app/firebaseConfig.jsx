
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';




const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app, {experimentalAutoDetectLongPolling: true, experimentalForceLongPolling: true});


export { auth, db};