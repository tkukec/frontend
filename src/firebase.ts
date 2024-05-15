import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyA_cGiB8jWKxgT_t-hX1UqdfcQgAzI9HuY',
  authDomain: 'plus2gratis-8fc51.firebaseapp.com',
  projectId: 'plus2gratis-8fc51',
  storageBucket: 'plus2gratis-8fc51.appspot.com',
  messagingSenderId: '136566667904',
  appId: '1:136566667904:web:d7109927f4379483424465'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const firebaseApp = app
