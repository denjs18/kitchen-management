import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, query, orderBy, Timestamp, writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ShoppingItem } from '@/lib/types';

export function useShoppingList() {
  const [list, setList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'shoppingList'), orderBy('addedAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setList(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        addedAt: d.data().addedAt?.toDate?.() ?? new Date(),
      } as ShoppingItem)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const addItem = async (item: Omit<ShoppingItem, 'id' | 'addedAt' | 'checked'>) => {
    const existing = list.find(
      i => !i.checked && (i.foodId ? i.foodId === item.foodId : i.foodName.toLowerCase() === item.foodName.toLowerCase())
    );
    if (existing?.id) {
      await updateDoc(doc(db, 'shoppingList', existing.id), {
        quantity: existing.quantity + item.quantity,
      });
    } else {
      await addDoc(collection(db, 'shoppingList'), {
        ...item,
        checked: false,
        addedAt: Timestamp.now(),
      });
    }
  };

  const addItems = async (items: Omit<ShoppingItem, 'id' | 'addedAt' | 'checked'>[]) => {
    await Promise.all(items.map(item => addItem(item)));
  };

  const toggleChecked = async (id: string, checked: boolean) => {
    await updateDoc(doc(db, 'shoppingList', id), { checked });
  };

  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, 'shoppingList', id));
  };

  const clearChecked = async () => {
    const batch = writeBatch(db);
    list.filter(i => i.checked).forEach(i => batch.delete(doc(db, 'shoppingList', i.id!)));
    await batch.commit();
  };

  const clearAll = async () => {
    const batch = writeBatch(db);
    list.forEach(i => batch.delete(doc(db, 'shoppingList', i.id!)));
    await batch.commit();
  };

  const uncheckedCount = list.filter(i => !i.checked).length;

  return { list, loading, addItem, addItems, toggleChecked, removeItem, clearChecked, clearAll, uncheckedCount };
}
