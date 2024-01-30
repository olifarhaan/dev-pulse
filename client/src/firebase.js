// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDklZzZTHkEXDTFY0Ecs5C6KvCRxb4V4vg",
  authDomain: "dev-pulse-blog.firebaseapp.com",
  projectId: "dev-pulse-blog",
  storageBucket: "dev-pulse-blog.appspot.com",
  messagingSenderId: "659917079596",
  appId: "1:659917079596:web:ebd666069a3b61c8fefd89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
