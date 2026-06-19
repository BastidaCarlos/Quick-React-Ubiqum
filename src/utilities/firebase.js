import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAetaV5Domca0_CiUoNB29Rgz7_fcvMoqo",
  authDomain: "quick-react-scheduler-3b1ab.firebaseapp.com",
  databaseURL: "https://quick-react-scheduler-3b1ab-default-rtdb.firebaseio.com",
  projectId: "quick-react-scheduler-3b1ab",
  storageBucket: "quick-react-scheduler-3b1ab.firebasestorage.app",
  messagingSenderId: "1023076579041",
  appId: "1:1023076579041:web:3e7a9aea488575f4ee69a0"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => useAuthState(getAuth(firebase));

export const useData = (path, transform) => {
  const [snapshot, loading, error] = useObject(ref(database, path));
  let data;

  if (snapshot) {
    const value = snapshot.val();
    data = !loading && !error && transform ? transform(value) : value;

  }

  return [data, loading, error];
};

export const setData = (path, value) => (
  set(ref(database, path), value)
);