import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCKu2CkKPyQ8x-dko7zMv2Sd0M2GSrlVhs",
  authDomain: "next-chat-c171e.firebaseapp.com",
  projectId: "next-chat-c171e",
  storageBucket: "next-chat-c171e.appspot.com",
  messagingSenderId: "668785147093",
  appId: "1:668785147093:web:e3860de54830d2620c765c"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()

export { auth, db }