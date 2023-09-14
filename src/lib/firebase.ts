import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyATsprFEMM_3vd9_m6D0krbqsMRd1k3FnI",
  authDomain: "upload-ai-8382c.firebaseapp.com",
  projectId: "upload-ai-8382c",
  storageBucket: "upload-ai-8382c.appspot.com",
  messagingSenderId: "768089992909",
  appId: "1:768089992909:web:7fccf0f05be9a275150384",
  measurementId: "G-RCGQPLEF2N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseStorage = getStorage(app);
