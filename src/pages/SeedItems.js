import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ITEMS = [
  { id: 1, name: "Veg Puff", price: 15, image: "https://images.unsplash.com/photo-1604908177522-0408f8f8e8f4?w=400&h=400&fit=crop", inStock: true, stock: 40 },
  { id: 2, name: "Chicken Roll", price: 35, image: "https://images.unsplash.com/photo-1606756790138-261d2b21cd65?w=400&h=400&fit=crop", inStock: true, stock: 25 },
  { id: 3, name: "Cold Coffee", price: 30, image: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=400&fit=crop", inStock: false, stock: 0 },
  { id: 4, name: "Samosa", price: 12, image: "https://images.unsplash.com/photo-1601050690117-6a8f9c6a2d7d?w=400&h=400&fit=crop", inStock: true, stock: 60 },
  { id: 5, name: "Masala Maggi", price: 25, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop", inStock: true, stock: 20 },
  { id: 6, name: "Veg Sandwich", price: 28, image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=400&fit=crop", inStock: true, stock: 18 },
  { id: 7, name: "Lime Juice", price: 10, image: "https://images.unsplash.com/photo-1558640479-8240a6a5cda1?w=400&h=400&fit=crop", inStock: true, stock: 50 },
  { id: 8, name: "Chocolate Brownie", price: 20, image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=400&fit=crop", inStock: true, stock: 12 }
];

const SeedItems = () => {
  const [status, setStatus] = useState('');
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    setStatus('Seeding...');
    try {
      const itemsRef = collection(db, 'items');
      for (const item of ITEMS) {
        const { id, ...rest } = item; // don't save the local numeric id
        await addDoc(itemsRef, { ...rest, deleted: false, createdAt: serverTimestamp() });
      }
      setStatus('✅ All 8 items added to Firestore!');
      setDone(true);
    } catch (err) {
      console.error(err);
      setStatus('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Seed Store Items</h2>
      <p>Click once to add all 8 items to Firestore. Remove this page after.</p>
      <button
        onClick={handleSeed}
        disabled={done}
        style={{ padding: '10px 24px', fontSize: '1rem', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', cursor: done ? 'not-allowed' : 'pointer' }}
      >
        {done ? 'Done!' : 'Seed Items'}
      </button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default SeedItems;