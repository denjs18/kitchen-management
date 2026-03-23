import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, query, orderBy, Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { InventoryItem, FoodLocation } from '@/lib/types';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'updatedAt'>) => {
    const existing = inventory.find(
      i => i.foodId === item.foodId && i.location === item.location
    );
    if (existing?.id) {
      await updateDoc(doc(db, 'inventory', existing.id), {
        quantity: existing.quantity + item.quantity,
        updatedAt: Timestamp.now(),
      });
    } else {
      await addDoc(collection(db, 'inventory'), {
        ...item,
        updatedAt: Timestamp.now(),
      });
    }
  };

  const updateQuantity = async (id: string, delta: number, currentQty: number) => {
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === 0) {
      await deleteDoc(doc(db, 'inventory', id));
    } else {
      await updateDoc(doc(db, 'inventory', id), {
        quantity: newQty,
        updatedAt: Timestamp.now(),
      });
    }
  };

  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, 'inventory', id));
  };

  const getByLocation = (location: FoodLocation) =>
    inventory.filter(i => i.location === location);

  return { inventory, loading, addItem, updateQuantity, removeItem, getByLocation };
}
