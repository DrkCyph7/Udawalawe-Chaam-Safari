import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: undefined,
  authDomain: undefined,
  projectId: undefined,
  storageBucket: undefined,
  messagingSenderId: undefined,
  appId: undefined,
};

console.log('Initializing app...');
try {
  const app = initializeApp(firebaseConfig);
  console.log('App initialized.');
  const db = getFirestore(app);
  console.log('Firestore initialized.');

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
      console.error('Error in addDoc:', err);
    }
    process.exit(0);
  }
  test();
} catch (err) {
  console.error('Error during init:', err);
  process.exit(1);
}
