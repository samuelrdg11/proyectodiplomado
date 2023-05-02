import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDyXZhQEkXGiKHh1x0Jz_oGUCD6_JFGaT0",
  authDomain: "proyectodiplomado-42cd5.firebaseapp.com",
  projectId: "proyectodiplomado-42cd5",
  storageBucket: "proyectodiplomado-42cd5.appspot.com",
  messagingSenderId: "1083600129997",
  appId: "1:1083600129997:web:6430bd156c15ab8b96fe84"
};

app.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = app.auth()

export { db, auth }