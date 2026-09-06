import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIEb2X_LXkqg-fgvE2jFPlg6J75ZFmSsI",
  authDomain: "chaam-safari-udawalawe.firebaseapp.com",
  projectId: "chaam-safari-udawalawe",
  storageBucket: "chaam-safari-udawalawe.firebasestorage.app",
  messagingSenderId: "534106356310",
  appId: "1:534106356310:web:af6a246690b034298799f7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  console.log('Testing addDoc...');
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      name: 'Test',
      contact: 'test@example.com',
      message: 'Test message',
      status: 'new',
      createdAt: serverTimestamp(),
    });
    console.log('Success!', docRef.id);
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}

test();
